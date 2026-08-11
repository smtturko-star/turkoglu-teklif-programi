/* Türkoğlu: F5 sonrası son açık menüyü ve Ürünler filtrelerini tek sefer koru. */
(function(){
  'use strict';

  // Dosya yanlışlıkla birden fazla kez yüklenirse ikinci kopya hiçbir şey yapmasın.
  if(window.__turkogluPreservePageInstalled)return;
  window.__turkogluPreservePageInstalled=true;

  const KEY='turkoglu_last_page';
  const FILTER_KEY='turkoglu_product_filters';
  const valid=new Set(['dashboard','customers','products','quotes','jobs','payments','settings','printPage']);
  const filterIds=['productSearch','productBrandFilter','productCategoryFilter','productUnitFilter','stockFilter'];
  let restoringPage=false;
  let restoringFilters=false;

  const savePage=id=>{
    const value=String(id);
    if(valid.has(value)&&!restoringPage) localStorage.setItem(KEY,value);
  };

  function readFilters(){
    const state={};
    let found=false;
    filterIds.forEach(id=>{
      const el=document.getElementById(id);
      if(el){
        state[id]=el.value||'';
        found=true;
      }
    });
    return found?state:null;
  }

  function saveFilters(){
    if(restoringFilters)return;
    try{
      const state=readFilters();
      if(state)localStorage.setItem(FILTER_KEY,JSON.stringify(state));
    }catch(e){}
  }

  // Filtre geri yükleme yalnızca çağıran tek akış tarafından bir kez yapılır.
  function restoreFiltersOnce(){
    if(restoringFilters)return;
    restoringFilters=true;
    try{
      const raw=localStorage.getItem(FILTER_KEY);
      if(!raw)return;

      const state=JSON.parse(raw);
      if(!state||typeof state!=='object')return;

      let changed=false;
      filterIds.forEach(id=>{
        const el=document.getElementById(id);
        if(!el||!Object.prototype.hasOwnProperty.call(state,id))return;
        const value=String(state[id]??'');
        if(el.value!==value){
          el.value=value;
          changed=true;
        }
      });

      // Değer gerçekten değiştiyse listeyi tam olarak bir kez yeniden çiz.
      if(changed){
        if(typeof window.renderProducts==='function'){
          window.renderProducts();
        }else if(typeof window.applyProductFilters==='function'){
          window.applyProductFilters();
        }else{
          document.getElementById('productSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
        }
      }
    }catch(e){}
    finally{
      restoringFilters=false;
    }
  }

  // page() sadece son açık sayfayı kaydeder. Filtre geri yükleme burada YAPILMAZ.
  const original=window.page;
  if(typeof original==='function'){
    window.page=function(id){
      const result=original.apply(this,arguments);
      savePage(id);
      return result;
    };
  }

  // Filtreleri DOM yeniden oluşturulsa bile tek event delegation ile kaydet.
  document.addEventListener('change',e=>{
    if(filterIds.includes(e.target?.id))saveFilters();
  },true);
  document.addEventListener('input',e=>{
    if(filterIds.includes(e.target?.id))saveFilters();
  },true);

  function restoreLastPageOnce(){
    const wanted=localStorage.getItem(KEY);
    if(!wanted||!valid.has(wanted)||typeof window.page!=='function')return;

    restoringPage=true;
    try{
      window.page(wanted);
    }catch(e){}
    finally{
      restoringPage=false;
    }

    // page() ile ekran açıldıktan sonra ürün filtrelerini tam bir kez uygula.
    if(wanted==='products')setTimeout(restoreFiltersOnce,0);
  }

  // F5 başlangıç geri yüklemesi de yalnızca bir kez çalışır.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',restoreLastPageOnce,{once:true});
  }else{
    restoreLastPageOnce();
  }
})();
