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
  const hydratedControls=new WeakSet();
  const restoreControls=()=>{
    const state=read(),controls=state.controls&&typeof state.controls==='object'?state.controls:{},changed=[];
    Object.entries(controls).forEach(([id,saved])=>{
      const element=document.getElementById(id);
      if(!element||hydratedControls.has(element)||!isViewControl(element)||saved?.page!==element.closest('.page').id)return;
      const value=String(saved.value??'');
      if(element.type==='checkbox'){
        if(element.checked!==Boolean(saved.value)){element.checked=Boolean(saved.value);changed.push(element)}
        hydratedControls.add(element);
        return;
      }
      if(element.tagName==='SELECT'&&!Array.from(element.options).some(option=>option.value===value)){
        if(element.options.length>1)hydratedControls.add(element);
        return;
      }
      if(element.value!==value){element.value=value;changed.push(element)}
      hydratedControls.add(element);
    });
    changed.forEach(element=>element.dispatchEvent(new Event(element.tagName==='INPUT'?'input':'change',{bubbles:true})));
  };

  const originalPage=window.page;
  if(typeof originalPage==='function'){
    window.page=function(id){
      const result=originalPage.apply(this,arguments);
      savePage(id);
      return result;
    };
  }

  const originalRenderProducts=window.renderProducts;
  if(typeof originalRenderProducts==='function'&&!window.__turkogluProductViewStateRender){
    window.__turkogluProductViewStateRender=true;
    window.renderProducts=function(){
      const result=originalRenderProducts.apply(this,arguments);
      if(typeof window.productPage==='function')window.productPage();
      restoreControls();
      return result;
    };
  }

  document.addEventListener('input',event=>saveControl(event.target),true);
  document.addEventListener('change',event=>saveControl(event.target),true);

  const restore=()=>{
    const state=read();
    restoreControls();
    if(pageIds.has(state.page)&&typeof window.page==='function')window.page(state.page);
  };

  new MutationObserver(restoreControls).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});
  else restore();
})();

/* Modern kurumsal tema — yalnızca CSS katmanıdır; veri, filtre ve uygulama mantığına dokunmaz. */
(function(){
  'use strict';
  if(document.getElementById('turkoglu-modern-theme'))return;
  const style=document.createElement('style');
  style.id='turkoglu-modern-theme';
  style.textContent=`
    :root{
      --bg:#f4f7fb;--panel:#ffffff;--text:#172033;--muted:#6b7280;--line:#e6eaf0;
      --primary:#14213d;--accent:#2563eb;--accent2:#0ea5e9;--danger:#dc2626;--warn:#d97706;
      --shadow:0 10px 30px rgba(15,23,42,.07);--r:18px
    }
    body{background:linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%);color:var(--text)}
    .top{height:72px;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid rgba(226,232,240,.9);box-shadow:0 4px 18px rgba(15,23,42,.04);padding:0 24px}
    .brand{font-size:16px;letter-spacing:.01em}.brand small{color:#64748b}
    .layout{min-height:calc(100vh - 72px)}
    .side{width:248px;background:linear-gradient(180deg,#111c35 0%,#0b1326 100%);border-right:1px solid rgba(255,255,255,.06);padding:20px 13px;box-shadow:8px 0 28px rgba(15,23,42,.08)}
    .side button{position:relative;border-radius:12px;padding:12px 14px;color:#aebbd0;transition:.18s ease;background:transparent}
    .side button:hover{background:rgba(255,255,255,.08);color:#fff;transform:translateX(2px)}
    .side button.active{background:linear-gradient(90deg,rgba(37,99,235,.95),rgba(14,165,233,.78));color:#fff;box-shadow:0 7px 18px rgba(37,99,235,.24)}
    .group{color:#64748b;font-weight:800}
    .main{padding:30px;max-width:1600px}
    .pagehead h1{font-size:28px;letter-spacing:-.02em}.pagehead{margin-bottom:20px}
    .card{border:1px solid rgba(226,232,240,.9);border-radius:18px;background:rgba(255,255,255,.96);box-shadow:var(--shadow);padding:20px;transition:box-shadow .18s ease,border-color .18s ease}
    .card:hover{border-color:#d9e2ee}
    .kpi-card{position:relative;overflow:hidden;min-height:125px;padding:20px 21px;box-shadow:0 8px 24px rgba(15,23,42,.055)}
    .kpi-card:before{content:"";position:absolute;left:0;top:0;width:5px;height:100%;background:linear-gradient(180deg,var(--accent),var(--accent2))}
    .kpi{font-size:30px;letter-spacing:-.03em;color:#0f172a}.kpi-label{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.06em}
    button{border-radius:11px;padding:10px 15px;box-shadow:0 3px 10px rgba(15,23,42,.08);transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}
    button:hover{transform:translateY(-1px);filter:brightness(1.02);box-shadow:0 6px 14px rgba(15,23,42,.12)}
    button.green{background:linear-gradient(135deg,#2563eb,#0ea5e9)}
    button.red{background:#dc2626}.light{border:1px solid #e2e8f0!important;background:#f8fafc!important;color:#334155!important;box-shadow:none}
    input,select,textarea{border:1px solid #dbe2ea;border-radius:11px;background:#fff;padding:11px 12px;outline:none;transition:border-color .15s,box-shadow .15s}
    input:focus,select:focus,textarea:focus{border-color:#60a5fa;box-shadow:0 0 0 4px rgba(59,130,246,.11)}
    .searchbar{background:#f8fafc;border:1px solid #e8edf3;border-radius:14px;padding:10px;margin-bottom:16px}
    .tablewrap{border:1px solid #e5eaf0;border-radius:14px;box-shadow:0 4px 14px rgba(15,23,42,.03)}
    th{background:#f8fafc;color:#64748b;font-size:10px;letter-spacing:.08em}th,td{padding:13px 12px}tbody tr:hover{background:#f8fbff}
    .badge{border:1px solid rgba(148,163,184,.18);padding:5px 10px}.badge.green{background:#dcfce7;color:#166534}.badge.warn{background:#fff7d6;color:#a16207}.badge.red{background:#fee2e2;color:#b91c1c}
    .p{border:1px solid #e5eaf0;border-radius:15px;padding:11px;box-shadow:0 4px 12px rgba(15,23,42,.035);transition:.18s ease}.p:hover{border-color:#60a5fa;box-shadow:0 10px 22px rgba(37,99,235,.12);transform:translateY(-2px)}
    .p img{height:115px}.thumb{border-radius:10px;border-color:#e2e8f0}
    .modal{background:rgba(15,23,42,.62);backdrop-filter:blur(4px)}.modalbox{border:1px solid #e2e8f0;border-radius:20px;box-shadow:0 24px 70px rgba(15,23,42,.25)}
    .close{border:1px solid #e2e8f0!important}
    .toast{background:#14213d;border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 30px rgba(15,23,42,.2)}
    .login{border-radius:22px;box-shadow:0 20px 60px rgba(15,23,42,.1);margin:10vh auto;padding:28px}
    .print{border-radius:0}
    @media(max-width:900px){.side{width:78px}.main{padding:20px}.kpi-card{min-height:112px}}
    @media(max-width:650px){.top{padding:10px 13px}.side{height:66px;padding:7px;background:#0b1326;box-shadow:0 -8px 24px rgba(15,23,42,.12)}.main{padding:15px 12px 86px}.pagehead h1{font-size:23px}.card{padding:16px;border-radius:16px}.kpi{font-size:27px}.products{gap:9px}.p{border-radius:13px}}
    @media print{body{background:#fff}.card{box-shadow:none}}
  `;
  document.head.appendChild(style);
})();
