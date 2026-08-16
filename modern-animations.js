/* Türkoğlu Elektrik Elektronik — modern dashboard etkileşimleri ve hafif animasyonlar */
(function(){
  'use strict';
  if(window.__turkogluMotionInstalled)return;
  window.__turkogluMotionInstalled=true;

  const s=document.createElement('style');
  s.id='turkoglu-motion';
  s.textContent=`
    @keyframes tkFadeUp{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}
    @keyframes tkFadeIn{from{opacity:0}to{opacity:1}}
    @keyframes tkScale{from{opacity:0;transform:translate3d(0,5px,0) scale(.99)}to{opacity:1;transform:none}}
    @keyframes tkShimmer{0%{background-position:-350px 0}100%{background-position:350px 0}}
    @keyframes tkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
    @keyframes tkWall{0%{transform:translate3d(-1%,0,0) scale(1)}50%{transform:translate3d(1.2%,-.7%,0) scale(1.035)}100%{transform:translate3d(-.5%,.8%,0) scale(1.02)}}
    @keyframes tkWallGlow{0%,100%{opacity:.34}50%{opacity:.52}}

    .main>.page.active{animation:tkFadeUp .22s cubic-bezier(.22,1,.36,1)}
    .pagehead{animation:tkFadeIn .24s ease both}
    .main>.page.active>.card,.main>.page.active>.grid>.card,.main>.page.active>.grid3>.card,.main>.page.active>.grid4>.card,
    .main>.page.active .tablewrap{animation:tkScale .22s cubic-bezier(.22,1,.36,1) both}

    #dashboard{position:relative;isolation:isolate;overflow:hidden;border-radius:20px;padding-bottom:4px}
    #dashboard::before,#dashboard::after{content:"";position:absolute;pointer-events:none;z-index:-1;border-radius:50%;filter:blur(2px)}
    #dashboard::before{width:72%;height:52%;left:-14%;top:4%;background:radial-gradient(circle at 35% 35%,rgba(37,99,235,.16),rgba(14,165,233,.08) 38%,transparent 70%);animation:tkWall 20s ease-in-out infinite,tkWallGlow 8s ease-in-out infinite}
    #dashboard::after{width:62%;height:46%;right:-10%;bottom:4%;background:radial-gradient(circle at 60% 50%,rgba(20,184,166,.12),rgba(37,99,235,.07) 35%,transparent 72%);animation:tkWall 24s ease-in-out infinite reverse,tkWallGlow 10s ease-in-out infinite reverse}
    #dashboard>.pagehead,#dashboard>.grid4,#dashboard>.grid{position:relative;z-index:1}

    .kpi-card[data-tk-action]{cursor:pointer;user-select:none}
    .kpi-card[data-tk-action]:focus-visible{outline:3px solid rgba(59,130,246,.28);outline-offset:3px}
    .kpi-card[data-tk-action]:hover{transform:translate3d(0,-4px,0);box-shadow:0 16px 32px rgba(15,23,42,.10)}
    .kpi-card[data-tk-action]::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.5) 45%,transparent 65%);background-size:700px 100%;background-position:-350px 0;opacity:0;pointer-events:none}
    .kpi-card[data-tk-action]:hover::after{opacity:1;animation:tkShimmer .7s ease}
    .kpi-card .kpi{transition:transform .2s ease}.kpi-card[data-tk-action]:hover .kpi{transform:scale(1.035)}

    .side button{transition:transform .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease}
    .side button.active:after{content:"";position:absolute;right:6px;top:50%;width:4px;height:22px;border-radius:8px;transform:translateY(-50%);background:#fff;opacity:.9;animation:tkFloat 1.8s ease-in-out infinite}
    button{transition:transform .12s ease,box-shadow .12s ease,filter .12s ease}
    button:hover{transform:translate3d(0,-1px,0)}button:active{transform:translate3d(0,1px,0) scale(.985)}
    .modal.show{animation:tkFadeIn .16s ease}.modal.show .modalbox{animation:tkScale .20s cubic-bezier(.22,1,.36,1)}
    .toast{animation:tkFadeUp .20s cubic-bezier(.22,1,.36,1)}
    .p{transition:transform .16s cubic-bezier(.22,1,.36,1),box-shadow .16s ease,border-color .16s ease}
    .p:hover{transform:translate3d(0,-4px,0) scale(1.005)!important;box-shadow:0 12px 24px rgba(37,99,235,.10)!important}
    input:focus,select:focus,textarea:focus{transition:box-shadow .14s ease,border-color .14s ease}
    .brand{transition:transform .14s ease}.brand:hover{transform:translate3d(2px,0,0)}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
    @media(max-width:650px){#dashboard{border-radius:16px}#dashboard::before,#dashboard::after{animation-duration:30s;filter:none;opacity:.24}.kpi-card[data-tk-action]:hover{transform:none;box-shadow:inherit}.kpi-card[data-tk-action]:hover .kpi{transform:none}}
  `;
  document.head.appendChild(s);

  const pageMap={
    'Müşteri':()=>page('customers'),
    'Ürün':()=>page('products'),
    'Teklif':()=>page('quotes'),
    'Açık İş':()=>page('jobs'),
    'Tamamlanan İş':()=>page('jobs'),
    'Bekleyen Teklif':()=>page('quotes'),
    'Bekleyen Tahsilat':()=>page('payments'),
    'Düşük Stok':()=>{page('products');setTimeout(()=>{const el=document.getElementById('stockFilter');if(el){el.value='low';el.dispatchEvent(new Event('change',{bubbles:true}))}},0)}
  };

  const setupDashboardCards=()=>{
    document.querySelectorAll('#dashboard .kpi-card').forEach(card=>{
      if(card.dataset.tkBound==='1')return;
      const label=card.querySelector('.kpi-label')?.textContent?.trim();
      const action=pageMap[label];
      if(!action)return;
      card.dataset.tkAction=label;
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      card.title=label+' bölümünü aç';
      const run=()=>action();
      card.addEventListener('click',run);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run()}});
      card.dataset.tkBound='1';
    });
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
    const start=performance.now(),duration=480;
    const step=now=>{const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3),v=current+(target-current)*e;el.textContent=targetText.toUpperCase().includes('TL')?new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(v)+' TL':(Number.isInteger(target)?Math.round(v):v.toFixed(2));if(p<1)requestAnimationFrame(step);else el.dataset.tkAnimating=''};
    requestAnimationFrame(step);
  };

  const refresh=()=>{
    setupDashboardCards();
    const active=document.querySelector('.main>.page.active');
    if(active)active.querySelectorAll('.card,.tablewrap').forEach((el,i)=>{el.style.animationDelay=Math.min(i*18,100)+'ms'});
    document.querySelectorAll('.kpi-card .kpi').forEach(animateNumber);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else requestAnimationFrame(refresh);
  const originalPage=window.page;
  if(typeof originalPage==='function'&&!window.__turkogluMotionPageWrapped){
    window.__turkogluMotionPageWrapped=true;
    window.page=function(id){const result=originalPage.apply(this,arguments);requestAnimationFrame(refresh);return result};
  }
})();
