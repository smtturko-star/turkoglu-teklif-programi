/* F5 sonrası görünüm durumunu ana page()/render akışını değiştirmeden korur. */
(function(){
  'use strict';

  if(window.__turkogluViewStateInstalled)return;
  window.__turkogluViewStateInstalled=true;

  const KEY='turkoglu_view_state_v1';
  const pageIds=new Set(Array.from(document.querySelectorAll('.page')).map(page=>page.id).filter(id=>id&&id!=='printPage'));
  const isViewControl=element=>Boolean(
    element?.id&&element.closest('.page')&&
    (/(?:search|filter|sort)/i.test(element.id)||element.dataset.persistState!==undefined)
  );
  const read=()=>{
    try{
      const state=JSON.parse(localStorage.getItem(KEY)||'{}');
      return state&&typeof state==='object'?state:{};
    }catch{return {}}
  };
  const write=state=>{
    try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}
  };
  const saveControl=element=>{
    if(!isViewControl(element))return;
    const state=read(),page=element.closest('.page').id;
    state.controls=state.controls&&typeof state.controls==='object'?state.controls:{};
    state.controls[element.id]={page,value:element.type==='checkbox'?element.checked:element.value};
    write(state);
  };
  const savePage=id=>{
    if(!pageIds.has(id))return;
    const state=read();
    state.page=id;
    write(state);
  };
  const restoreControls=state=>{
    const controls=state.controls&&typeof state.controls==='object'?state.controls:{};
    Object.entries(controls).forEach(([id,saved])=>{
      const element=document.getElementById(id);
      if(!element||!isViewControl(element)||saved?.page!==element.closest('.page').id)return;
      if(element.type==='checkbox'){
        element.checked=Boolean(saved.value);
      }else if(element.tagName!=='SELECT'||Array.from(element.options).some(option=>option.value===String(saved.value))){
        element.value=String(saved.value??'');
      }
    });
  };

  const originalPage=window.page;
  if(typeof originalPage==='function'){
    window.page=function(id){
      const result=originalPage.apply(this,arguments);
      savePage(id);
      return result;
    };
  }

  document.addEventListener('input',event=>saveControl(event.target),true);
  document.addEventListener('change',event=>saveControl(event.target),true);

  const restore=()=>{
    const state=read();
    restoreControls(state);
    if(pageIds.has(state.page)&&typeof window.page==='function')window.page(state.page);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});
  else restore();
})();
