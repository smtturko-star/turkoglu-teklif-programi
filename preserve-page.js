/* Türkoğlu: F5 sonrası son açık menüyü ve Ürünler filtrelerini koru. */
(function(){
  'use strict';
  const KEY='turkoglu_last_page';
  const FILTER_KEY='turkoglu_product_filters';
  const valid=new Set(['dashboard','customers','products','quotes','jobs','payments','settings','printPage']);
  const filterIds=['productSearch','productBrandFilter','productCategoryFilter','productUnitFilter','stockFilter'];
  let restoringPage=false;
  let restoringFilters=false;

  const savePage=id=>{
    if(valid.has(String(id))&&!restoringPage) localStorage.setItem(KEY,String(id));
  };

  function readFilters(){
    const state={};
    let found=false;
    filterIds.forEach(id=>{
      const el=document.getElementById(id);
      if(el){state[id]=el.value||'';found=true;}
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

  function restoreFilters(){
    if(restoringFilters)return;
    try{
      const state=JSON.parse(localStorage.getItem(FILTER_KEY)||'null');
      if(!state)return;
      restoringFilters=true;
      filterIds.forEach(id=>{
        const el=document.getElementById(id);
        if(el&&Object.prototype.hasOwnProperty.call(state,id)){
          const value=String(state[id]??'');
          if(el.value!==value)el.value=value;
        }
      });
      if(typeof window.applyProductFilters==='function')window.applyProductFilters();
      else document.getElementById('productSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
    }catch(e){}
    finally{setTimeout(()=>{restoringFilters=false;},0);}
  }

  const original=window.page;
  if(typeof original==='function'&&!window.__turkogluPagePersistence){
    window.__turkogluPagePersistence=true;
    window.page=function(id){
      const result=original.apply(this,arguments);
      savePage(id);
      if(String(id)==='products')setTimeout(restoreFilters,150);
      return result;
    };
  }

  // Filtreleri DOM yeniden oluşturulsa bile tek bir event delegation ile kaydet.
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
    try{window.page(wanted);}catch(e){}
    finally{restoringPage=false;}
    if(wanted==='products')setTimeout(restoreFilters,300);
  }

  // Sadece bir kez çalışır. Interval/MutationObserver yok; böylece sayfa geçiş döngüsü oluşmaz.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(restoreLastPageOnce,700),{once:true});
  }else{
    setTimeout(restoreLastPageOnce,700);
  }
})();
