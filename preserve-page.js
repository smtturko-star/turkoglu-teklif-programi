/* Türkoğlu: F5 sonrası son açık menüyü koru. */
(function(){
  'use strict';
  const KEY='turkoglu_last_page';
  const valid=new Set(['dashboard','customers','products','quotes','jobs','payments','settings','printPage']);
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
  const app=document.getElementById('app');
  if(app)new MutationObserver(restore).observe(app,{attributes:true,attributeFilter:['class']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(restore,50),{once:true});
  else setTimeout(restore,50);
})();
// attachment workflow trigger
