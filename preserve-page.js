/* Türkoğlu: F5 sonrası son açık menüyü ve Ürünler filtrelerini koru. */
(function(){
  'use strict';
  const KEY='turkoglu_last_page';
  const FILTER_KEY='turkoglu_product_filters';
  const valid=new Set(['dashboard','customers','products','quotes','jobs','payments','settings','printPage']);
  const filterIds=['productSearch','productBrandFilter','productCategoryFilter','productUnitFilter','stockFilter'];
  const save=id=>{if(valid.has(String(id)))localStorage.setItem(KEY,String(id));};
  const original=window.page;
  if(typeof original==='function'&&!window.__turkogluPagePersistence){
    window.__turkogluPagePersistence=true;
    window.page=function(id){save(id);return original.apply(this,arguments)};
  }
  function restore(){
    const app=document.getElementById('app');
    if(!app||app.classList.contains('hidden')||typeof window.page!=='function')return;
    const wanted=localStorage.getItem(KEY);
    if(wanted&&valid.has(wanted))window.page(wanted);else save('dashboard');
  }
  function readFilters(){
    const state={}; let found=false;
    filterIds.forEach(id=>{const el=document.getElementById(id);if(el){state[id]=el.value||'';found=true}});
    return found?state:null;
  }
  function saveFilters(){
    try{const state=readFilters();if(state)localStorage.setItem(FILTER_KEY,JSON.stringify(state));}catch(e){}
  }
  function restoreFilters(){
    try{
      const state=JSON.parse(localStorage.getItem(FILTER_KEY)||'null');
      if(!state)return;
      let changed=false;
      filterIds.forEach(id=>{const el=document.getElementById(id);if(el&&Object.prototype.hasOwnProperty.call(state,id)){const value=String(state[id]??'');if(el.value!==value){el.value=value;changed=true}}});
      if(changed){
        if(typeof window.applyProductFilters==='function')window.applyProductFilters();
        else document.getElementById('productSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
      }
    }catch(e){}
  }
  function bindFilters(){
    const products=document.getElementById('products');
    if(!products||!products.classList.contains('active'))return;
    filterIds.forEach(id=>{
      const el=document.getElementById(id);
      if(!el||el.dataset.filterPersist==='1')return;
      el.dataset.filterPersist='1';
      el.addEventListener('change',saveFilters);
      el.addEventListener('input',saveFilters);
    });
    restoreFilters();
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(restore).observe(app,{attributes:true,attributeFilter:['class']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(restore,50),{once:true});
  else setTimeout(restore,50);
  setInterval(bindFilters,250);
  window.addEventListener('beforeunload',saveFilters);
})();
// attachment workflow trigger
