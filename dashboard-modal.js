/* Dashboard KPI kutuları için hafif, etkileşimli hızlı kontrol penceresi. */
(function(){
  'use strict';
  if(window.__turkogluDashboardModalInstalled)return;
  window.__turkogluDashboardModalInstalled=true;

  const escSafe=s=>typeof window.esc==='function'?window.esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const moneySafe=n=>typeof window.money==='function'?window.money(n):new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY'}).format(Number(n)||0);
  const arr=name=>Array.isArray(window[name])?window[name]:[];
  const byId=(id,name)=>arr(name).find(x=>x.id===id);

  const ensureStyles=()=>{
    if(document.getElementById('tk-dashboard-modal-style'))return;
    const s=document.createElement('style');s.id='tk-dashboard-modal-style';
    s.textContent=`
      @keyframes tkDashBg1{0%,100%{transform:translate3d(-2%,0,0) scale(1)}50%{transform:translate3d(5%,3%,0) scale(1.08)}}
      @keyframes tkDashBg2{0%,100%{transform:translate3d(4%,2%,0) scale(1)}50%{transform:translate3d(-4%,-3%,0) scale(1.1)}}
      @keyframes tkDashPanel{from{opacity:0;transform:translate3d(0,12px,0) scale(.98)}to{opacity:1;transform:none}}
      @keyframes tkDashRow{from{opacity:0;transform:translate3d(0,5px,0)}to{opacity:1;transform:none}}
      body.tk-dashboard-ambient .main{position:relative;isolation:isolate;overflow:clip}
      body.tk-dashboard-ambient .main:before,body.tk-dashboard-ambient .main:after{content:"";position:fixed;width:46vw;height:46vw;max-width:700px;max-height:700px;border-radius:50%;pointer-events:none;filter:blur(70px);opacity:.16;z-index:-1}
      body.tk-dashboard-ambient .main:before{left:-16vw;top:10vh;background:radial-gradient(circle,rgba(37,99,235,.72) 0,rgba(37,99,235,0) 68%);animation:tkDashBg1 16s ease-in-out infinite}
      body.tk-dashboard-ambient .main:after{right:-18vw;bottom:-15vh;background:radial-gradient(circle,rgba(14,165,233,.58) 0,rgba(14,165,233,0) 68%);animation:tkDashBg2 19s ease-in-out infinite}
      .tk-dash-kpi{cursor:pointer!important;user-select:none;position:relative}
      .tk-dash-kpi:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:3px}
      .tk-dash-kpi .tk-kpi-open{position:absolute;right:12px;bottom:11px;font-size:10px;font-weight:800;color:#64748b;opacity:0;transform:translateY(4px);transition:.18s ease}
      .tk-dash-kpi:hover .tk-kpi-open,.tk-dash-kpi:focus-visible .tk-kpi-open{opacity:1;transform:none}
      .tkdash-overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(15,23,42,.48);backdrop-filter:blur(6px);z-index:150}
      .tkdash-overlay.show{display:flex}
      .tkdash-panel{width:min(650px,calc(100vw - 30px));max-height:min(78vh,680px);overflow:auto;background:rgba(255,255,255,.985);border:1px solid rgba(226,232,240,.95);border-radius:22px;box-shadow:0 30px 80px rgba(15,23,42,.25);animation:tkDashPanel .22s cubic-bezier(.22,1,.36,1)}
      .tkdash-head{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid #e8edf3;position:sticky;top:0;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);z-index:2}
      .tkdash-head h3{margin:0;font-size:18px;flex:1}.tkdash-sub{font-size:12px;color:#64748b;margin-top:3px}
      .tkdash-close{width:36px;height:36px;border-radius:50%;padding:0;background:#f1f5f9!important;color:#334155!important;box-shadow:none!important}
      .tkdash-body{padding:16px 20px 20px}.tkdash-list{display:grid;gap:9px}.tkdash-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 13px;border:1px solid #e7edf3;border-radius:14px;background:#fbfdff;animation:tkDashRow .2s ease both}.tkdash-row:hover{border-color:#bfdbfe;background:#f8fbff}
      .tkdash-main{min-width:0}.tkdash-title{font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tkdash-meta{font-size:12px;color:#64748b;margin-top:2px}.tkdash-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.tkdash-actions button{padding:7px 10px;font-size:12px}
      .tkdash-empty{padding:30px 10px;text-align:center;color:#64748b}.tkdash-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
      @media(max-width:650px){.tkdash-panel{width:calc(100vw - 20px);max-height:82vh;border-radius:18px}.tkdash-body{padding:13px}.tkdash-head{padding:14px 15px}.tkdash-row{grid-template-columns:1fr}.tkdash-actions{justify-content:flex-start}}
      @media(prefers-reduced-motion:reduce){body.tk-dashboard-ambient .main:before,body.tk-dashboard-ambient .main:after,.tkdash-panel,.tkdash-row{animation:none!important}.tkdash-overlay *{transition:none!important}}
    `;document.head.appendChild(s);
  };

  const ensureMarkup=()=>{
    if(document.getElementById('tkDashboardOverlay'))return;
    const o=document.createElement('div');o.id='tkDashboardOverlay';o.className='tkdash-overlay';
    o.innerHTML='<div class="tkdash-panel" role="dialog" aria-modal="true"><div class="tkdash-head"><div><h3 id="tkDashTitle">Hızlı Kontrol</h3><div id="tkDashSub" class="tkdash-sub"></div></div><button class="tkdash-close" type="button" aria-label="Kapat" onclick="window.tkDashboardClose()">×</button></div><div id="tkDashBody" class="tkdash-body"></div></div>';
    o.addEventListener('click',e=>{if(e.target===o)window.tkDashboardClose()});document.body.appendChild(o);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')window.tkDashboardClose()});
  };

  const close=()=>{const o=document.getElementById('tkDashboardOverlay');if(o)o.classList.remove('show')};
  window.tkDashboardClose=close;

  const go=(pageId)=>{close();if(typeof window.page==='function')window.page(pageId)};
  const action=(type,id)=>{
    close();
    requestAnimationFrame(()=>{
      try{
        if(type==='customer'&&typeof window.customerModal==='function')window.customerModal(id||null);
        else if(type==='product'&&typeof window.productModal==='function')window.productModal(id||null);
        else if(type==='quote'&&typeof window.openQuote==='function')window.openQuote(id,false);
        else if(type==='job'&&typeof window.jobModal==='function')window.jobModal(id||null);
        else if(type==='payment'&&typeof window.paymentModal==='function')window.paymentModal();
      }catch(err){console.error(err)}
    });
  };
  const button=(label,fn,primary=false)=>`<button class="${primary?'green':'light'}" type="button" onclick="${fn}">${escSafe(label)}</button>`;
  const status=s=>`<span class="badge">${escSafe(s||'')}</span>`;

  function render(type){
    const titleMap={customers:'Müşteriler',products:'Ürünler',quotes:'Teklifler',jobs:'Açık İşler',payments:'Bekleyen Tahsilatlar',completed:'Tamamlanan İşler',waiting:'Bekleyen Teklifler',lowstock:'Düşük Stok'};
    const subMap={customers:'Son kayıtlar ve hızlı müşteri işlemleri',products:'Son ürünler ve hızlı stok işlemleri',quotes:'Son teklifler ve hızlı teklif işlemleri',jobs:'Devam eden işler ve hızlı iş işlemleri',payments:'Tahsilat bekleyen işler',completed:'Tamamlanan işler',waiting:'Onay bekleyen teklifler',lowstock:'Stok seviyesi 5 ve altındaki ürünler'};
    let rows=[],extra='';
    if(type==='customers'){
      rows=arr('customers').slice(0,7).map(x=>({title:x.company_name||'Müşteri',meta:[x.contact_person,x.phone].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('customer','${x.id}')`)}));
      extra=button('+ Müşteri',`window.__tkDashAction('customer','')`,true);
    } else if(type==='products'){
      rows=arr('products').slice(0,7).map(x=>({title:x.name||'Ürün',meta:[x.brand,x.model,`Stok: ${Number(x.stock)||0}`,moneySafe(x.sale_price)].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('product','${x.id}')`)}));
      extra=button('+ Ürün',`window.__tkDashAction('product','')`,true);
    } else if(type==='quotes'){
      rows=arr('quotes').slice(0,7).map(x=>({title:x.quote_number||'Teklif',meta:[x.customers?.company_name,x.status,moneySafe(x.grand_total)].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('quote','${x.id}')`)}));
      extra=button('+ Teklif',`window.tkDashboardClose();window.requestAnimationFrame(()=>window.newQuote())`,true);
    } else if(type==='jobs'){
      rows=arr('jobs').filter(x=>!['Tamamlandı','İptal'].includes(x.status)).slice(0,7).map(x=>({title:x.job_title||'İş',meta:[x.customers?.company_name,x.status,x.planned_installation_date].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('job','${x.id}')`)}));
      extra=button('+ İş',`window.__tkDashAction('job','')`,true);
    } else if(type==='payments'){
      rows=arr('jobs').filter(x=>Number(x.remaining_amount)>0).slice(0,7).map(x=>({title:x.customers?.company_name||x.job_title||'Tahsilat',meta:[x.job_title,`Kalan: ${moneySafe(x.remaining_amount)}`].filter(Boolean).join(' · '),actions:button('Ödeme Al',`window.__tkDashAction('payment','')`,true)}));
      extra=button('Tüm Ödemeler',`window.tkDashboardClose();window.requestAnimationFrame(()=>window.page('payments'))`);
    } else if(type==='completed'){
      rows=arr('jobs').filter(x=>x.status==='Tamamlandı').slice(0,7).map(x=>({title:x.job_title||'İş',meta:[x.customers?.company_name,x.completion_date].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('job','${x.id}')`)}));
    } else if(type==='waiting'){
      rows=arr('quotes').filter(x=>['Teklif Verildi','Onay Bekliyor'].includes(x.status)).slice(0,7).map(x=>({title:x.quote_number||'Teklif',meta:[x.customers?.company_name,x.status,moneySafe(x.grand_total)].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('quote','${x.id}')`)}));
      extra=button('+ Teklif',`window.tkDashboardClose();window.requestAnimationFrame(()=>window.newQuote())`,true);
    } else if(type==='lowstock'){
      rows=arr('products').filter(x=>Number(x.stock)<=5).slice(0,7).map(x=>({title:x.name||'Ürün',meta:[x.brand,x.model,`Stok: ${Number(x.stock)||0}`].filter(Boolean).join(' · '),actions:button('Aç',`window.__tkDashAction('product','${x.id}')`)}));
      extra=button('+ Ürün',`window.__tkDashAction('product','')`,true);
    }
    const body=document.getElementById('tkDashBody');
    body.innerHTML=rows.length?`<div class="tkdash-list">${rows.map((r,i)=>`<div class="tkdash-row" style="animation-delay:${Math.min(i*30,180)}ms"><div class="tkdash-main"><div class="tkdash-title">${escSafe(r.title)}</div><div class="tkdash-meta">${escSafe(r.meta||'')}</div></div><div class="tkdash-actions">${r.actions}</div></div>`).join('')}</div><div class="tkdash-footer">${extra}</div>`:`<div class="tkdash-empty">Bu bölümde gösterilecek kayıt bulunmuyor.</div><div class="tkdash-footer">${extra}</div>`;
    document.getElementById('tkDashTitle').textContent=titleMap[type]||'Hızlı Kontrol';
    document.getElementById('tkDashSub').textContent=subMap[type]||'';
  }

  window.__tkDashAction=action;
  window.tkDashboardOpen=type=>{ensureStyles();ensureMarkup();render(type);document.getElementById('tkDashboardOverlay').classList.add('show')};

  const wire=()=>{
    ensureStyles();ensureMarkup();
    const cards=[
      ['kc','customers','Müşteriler'],['kp','products','Ürün'],['kq','quotes','Teklif'],['kj','jobs','Açık İş'],
      ['kr','payments','Bekleyen Tahsilat'],['kd','completed','Tamamlanan İş'],['kqwait','waiting','Bekleyen Teklif'],['klow','lowstock','Düşük Stok']
    ];
    cards.forEach(([id,type,label])=>{
      const el=document.getElementById(id)?.closest('.kpi-card');if(!el||el.dataset.tkDashWired)return;
      el.dataset.tkDashWired='1';el.classList.add('tk-dash-kpi');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',`${label} hızlı kontrol`);
      if(!el.querySelector('.tk-kpi-open'))el.insertAdjacentHTML('beforeend','<span class="tk-kpi-open">Hızlı kontrol →</span>');
      el.addEventListener('click',()=>window.tkDashboardOpen(type));
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.tkDashboardOpen(type)}});
    });
  };

  const syncAmbient=()=>{
    const on=document.getElementById('dashboard')?.classList.contains('active');
    document.body.classList.toggle('tk-dashboard-ambient',!!on);
    wire();
  };
  const originalPage=window.page;
  if(typeof originalPage==='function'&&!window.__tkDashPageWrapped){
    window.__tkDashPageWrapped=true;
    window.page=function(id){const result=originalPage.apply(this,arguments);requestAnimationFrame(syncAmbient);return result};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncAmbient,{once:true});else requestAnimationFrame(syncAmbient);
})();
