/* Türkoğlu Elektrik Elektronik — modern mikro animasyonlar */
(function(){
  'use strict';
  if(window.__turkogluMotionInstalled)return;
  window.__turkogluMotionInstalled=true;
  const s=document.createElement('style');
  s.id='turkoglu-motion';
  s.textContent=`
    @keyframes tkFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @keyframes tkFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes tkScale{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
    @keyframes tkShimmer{0%{background-position:-250px 0}100%{background-position:250px 0}}
    @keyframes tkPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.15)}50%{box-shadow:0 0 0 8px rgba(37,99,235,0)}}
    .main>.page:not(.hidden){animation:tkFadeUp .32s cubic-bezier(.22,1,.36,1)}
    .pagehead{animation:tkFadeIn .35s ease both}
    .card,.tablewrap{animation:tkScale .32s cubic-bezier(.22,1,.36,1) both}
    .kpi-card{transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease}
    .kpi-card:hover{transform:translateY(-5px);box-shadow:0 18px 36px rgba(15,23,42,.12)}
    .side button{transition:transform .2s cubic-bezier(.22,1,.36,1),background .2s ease,color .2s ease,box-shadow .2s ease}
    .side button.active:after{content:"";position:absolute;right:6px;top:50%;width:4px;height:22px;border-radius:8px;transform:translateY(-50%);background:#fff;opacity:.9}
    button:active{transform:translateY(1px) scale(.98)}
    .modal:not(.hidden){animation:tkFadeIn .18s ease}.modal:not(.hidden) .modalbox{animation:tkScale .24s cubic-bezier(.22,1,.36,1)}
    .toast{animation:tkFadeUp .25s cubic-bezier(.22,1,.36,1)}
    .p{transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,border-color .22s ease}
    .p:hover{transform:translateY(-5px) scale(1.01)!important}
    input:focus,select:focus,textarea:focus{transition:box-shadow .2s ease,border-color .2s ease}
    .brand{transition:transform .2s ease}.brand:hover{transform:translateX(2px)}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  `;
  document.head.appendChild(s);
  const stagger=()=>{
    document.querySelectorAll('.main>.page:not(.hidden) .card,.main>.page:not(.hidden) .tablewrap').forEach((el,i)=>{
      el.style.animationDelay=Math.min(i*45,300)+'ms';
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stagger,{once:true});else stagger();
  const observer=new MutationObserver(stagger);
  observer.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
})();
