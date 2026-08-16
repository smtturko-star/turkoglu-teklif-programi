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
    @keyframes tkShimmer{0%{background-position:-350px 0}100%{background-position:350px 0}}
    @keyframes tkGlow{0%,100%{box-shadow:0 8px 24px rgba(15,23,42,.055)}50%{box-shadow:0 14px 38px rgba(37,99,235,.14)}}
    @keyframes tkPulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.15)}50%{box-shadow:0 0 0 8px rgba(37,99,235,0)}}
    @keyframes tkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
    .main>.page:not(.hidden){animation:tkFadeUp .32s cubic-bezier(.22,1,.36,1)}
    .pagehead{animation:tkFadeIn .35s ease both}
    .card,.tablewrap{animation:tkScale .32s cubic-bezier(.22,1,.36,1) both}
    .kpi-card{transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease;position:relative;overflow:hidden}
    .kpi-card:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.5) 45%,transparent 65%);background-size:700px 100%;background-position:-350px 0;opacity:0;pointer-events:none}
    .kpi-card:hover:after{opacity:1;animation:tkShimmer .75s ease}
    .kpi-card:hover{transform:translateY(-5px);box-shadow:0 18px 36px rgba(15,23,42,.12)}
    .kpi-card .kpi{transition:transform .25s ease,letter-spacing .25s ease}.kpi-card:hover .kpi{transform:scale(1.04);letter-spacing:-.04em}
    .side button{transition:transform .2s cubic-bezier(.22,1,.36,1),background .2s ease,color .2s ease,box-shadow .2s ease}
    .side button.active:after{content:"";position:absolute;right:6px;top:50%;width:4px;height:22px;border-radius:8px;transform:translateY(-50%);background:#fff;opacity:.9;animation:tkFloat 1.8s ease-in-out infinite}
    button{transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}
    button:hover{transform:translateY(-2px)}button:active{transform:translateY(1px) scale(.98)}
    .modal:not(.hidden){animation:tkFadeIn .18s ease}.modal:not(.hidden) .modalbox{animation:tkScale .24s cubic-bezier(.22,1,.36,1)}
    .toast{animation:tkFadeUp .25s cubic-bezier(.22,1,.36,1)}
    .p{transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,border-color .22s ease}
    .p:hover{transform:translateY(-5px) scale(1.01)!important}
    input:focus,select:focus,textarea:focus{transition:box-shadow .2s ease,border-color .2s ease}
    .brand{transition:transform .2s ease}.brand:hover{transform:translateX(2px)}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  `;
  document.head.appendChild(s);

  const stagger=()=>document.querySelectorAll('.main>.page:not(.hidden) .card,.main>.page:not(.hidden) .tablewrap').forEach((el,i)=>{el.style.animationDelay=Math.min(i*45,300)+'ms'});

  const animateNumber=(el,next)=>{
    if(!el||el.dataset.tkAnimating===String(next))return;
    const raw=String(next??'');
    const match=raw.match(/([0-9][0-9.,]*)/);
    if(!match)return;
    const target=parseFloat(match[1].replace(/\./g,'').replace(',','.'));
    if(!Number.isFinite(target))return;
    const prefix=raw.slice(0,match.index),suffix=raw.slice(match.index+match[0].length);
    const old=parseFloat((el.dataset.tkValue||'0').replace(',','.'))||0;
    el.dataset.tkAnimating=String(next);el.dataset.tkValue=String(target);
    const start=performance.now(),duration=650;
    const step=now=>{const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3),v=old+(target-old)*e;el.textContent=prefix+(Number.isInteger(target)?Math.round(v):v.toFixed(2))+suffix;if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  };
  const watchKpis=()=>document.querySelectorAll('.kpi-card .kpi').forEach(el=>{const value=el.textContent.trim();if(value)animateNumber(el,value)});
  const staggerAndKpi=()=>{stagger();watchKpis()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',staggerAndKpi,{once:true});else staggerAndKpi();
  const observer=new MutationObserver(()=>{stagger();watchKpis()});
  observer.observe(document.body,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
})();
