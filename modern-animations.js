/* Türkoğlu Elektrik Elektronik — performanslı modern mikro animasyonlar */
(function(){
  'use strict';
  if(window.__turkogluMotionInstalled)return;
  window.__turkogluMotionInstalled=true;

  const s=document.createElement('style');
  s.id='turkoglu-motion';
  s.textContent=`
    @keyframes tkFadeUp{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:none}}
    @keyframes tkFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes tkScale{from{opacity:0;transform:translate3d(0,6px,0) scale(.985)}to{opacity:1;transform:none}}
    @keyframes tkShimmer{0%{background-position:-300px 0}100%{background-position:300px 0}}
    @keyframes tkPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.16)}50%{box-shadow:0 0 0 7px rgba(37,99,235,0)}}

    .main>.page.active{animation:tkFadeUp .22s cubic-bezier(.22,1,.36,1)}
    .pagehead{animation:tkFadeIn .24s ease both}
    .main>.page.active>.card,.main>.page.active>.grid>.card,.main>.page.active>.grid3>.card,.main>.page.active>.grid4>.card,
    .main>.page.active .tablewrap{animation:tkScale .22s cubic-bezier(.22,1,.36,1) both}

    .kpi-card{transition:transform .16s cubic-bezier(.22,1,.36,1),box-shadow .16s ease;position:relative;overflow:hidden}
    .kpi-card:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 28%,rgba(255,255,255,.48) 45%,transparent 62%);background-size:600px 100%;background-position:-300px 0;opacity:0;pointer-events:none}
    .kpi-card:hover:after{opacity:1;animation:tkShimmer .65s ease}
    .kpi-card:hover{transform:translate3d(0,-4px,0);box-shadow:0 16px 32px rgba(15,23,42,.10)}
    .kpi-card .kpi{transition:transform .2s ease}.kpi-card:hover .kpi{transform:scale(1.03)}

    .side button{transition:transform .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease}
    .side button:hover{transform:translate3d(2px,0,0)}
    .side button.active:after{content:"";position:absolute;right:6px;top:50%;width:4px;height:22px;border-radius:8px;transform:translateY(-50%);background:#fff;opacity:.9}

    button{transition:transform .12s ease,box-shadow .12s ease,filter .12s ease}
    button:hover{transform:translate3d(0,-1px,0)}
    button:active{transform:translate3d(0,1px,0) scale(.985)}

    .modal.show{animation:tkFadeIn .16s ease}.modal.show .modalbox{animation:tkScale .20s cubic-bezier(.22,1,.36,1)}
    .toast{animation:tkFadeUp .20s cubic-bezier(.22,1,.36,1)}
    .p{transition:transform .16s cubic-bezier(.22,1,.36,1),box-shadow .16s ease,border-color .16s ease}
    .p:hover{transform:translate3d(0,-4px,0) scale(1.005)!important;box-shadow:0 12px 24px rgba(37,99,235,.10)!important}
    input:focus,select:focus,textarea:focus{transition:box-shadow .14s ease,border-color .14s ease}

    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
    @media(max-width:650px){.main>.page.active{animation-duration:.18s}.kpi-card:hover,.p:hover{transform:none!important}}
  `;
  document.head.appendChild(s);

  let lastPage='';
  const refresh=()=>{
    const active=document.querySelector('.main>.page.active');
    if(!active||active.id===lastPage)return;
    lastPage=active.id;
    active.querySelectorAll('.card,.tablewrap').forEach((el,i)=>{el.style.animationDelay=Math.min(i*25,150)+'ms'});
  };

  const animateNumber=el=>{
    if(!el||el.dataset.tkAnimating)return;
    const targetText=el.textContent.trim();
    if(!/^[-+]?\d[\d.,]*(?:\s*TL)?$/i.test(targetText))return;
    const target=Number(targetText.replace(/\s*TL/i,'').replace(/\./g,'').replace(',','.'));
    if(!Number.isFinite(target))return;
    const current=Number(el.dataset.tkValue||0);
    if(current===target)return;
    el.dataset.tkAnimating='1';el.dataset.tkValue=String(target);
    const start=performance.now(),duration=520;
    const step=now=>{
      const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3),v=current+(target-current)*e;
      el.textContent=targetText.toUpperCase().includes('TL')?new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(v)+' TL':(Number.isInteger(target)?Math.round(v):v.toFixed(2));
      if(p<1)requestAnimationFrame(step);else el.dataset.tkAnimating='';
    };
    requestAnimationFrame(step);
  };

  const refreshNumbers=()=>document.querySelectorAll('.kpi-card .kpi').forEach(animateNumber);
  const originalPage=window.page;
  if(typeof originalPage==='function'&&!window.__turkogluMotionPageWrapped){
    window.__turkogluMotionPageWrapped=true;
    window.page=function(id){const result=originalPage.apply(this,arguments);requestAnimationFrame(()=>{refresh();refreshNumbers()});return result};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{refresh();refreshNumbers()},{once:true});
  else requestAnimationFrame(()=>{refresh();refreshNumbers()});
})();
