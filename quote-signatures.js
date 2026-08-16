/* Teklif PDF kaşe + imza efekti — PDF'ye basılmış mavi mürekkep görünümü verir. */
(function(){
  'use strict';
  if(window.__tkQuoteSignaturesInstalled)return;
  window.__tkQuoteSignaturesInstalled=true;
  const esc=s=>typeof window.esc==='function'?window.esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const install=()=>{
    if(document.getElementById('tk-quote-signature-style'))return;
    const s=document.createElement('style');s.id='tk-quote-signature-style';
    s.textContent=`
      #quotePrint .tk-signature-section{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:18px;break-inside:avoid}
      #quotePrint .tk-sign-box{min-height:205px;border:1px solid #dbe3ec;border-radius:15px;background:linear-gradient(180deg,#fff,#fafcff);padding:16px 18px;position:relative;break-inside:avoid;overflow:hidden}
      #quotePrint .tk-sign-title{font-size:10px;letter-spacing:.09em;text-transform:uppercase;font-weight:900;color:#2563eb}
      #quotePrint .tk-sign-sub{font-size:10px;color:#64748b;margin-top:3px}
      #quotePrint .tk-sign-space{height:80px;margin-top:6px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-sign-space:after{content:"İmza";position:absolute;left:0;bottom:-17px;font-size:9px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:23px;font-size:11px;color:#334155;font-weight:800}
      #quotePrint .tk-real-stamp{position:absolute;right:18px;bottom:17px;width:142px;height:98px;color:#0758b7;opacity:.78;transform:rotate(-4deg);mix-blend-mode:multiply;filter:saturate(.9)}
      #quotePrint .tk-real-stamp:before{content:"";position:absolute;inset:0;border:3px solid currentColor;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(7,88,183,.25)}
      #quotePrint .tk-real-stamp:after{content:"";position:absolute;left:7px;right:7px;top:10px;bottom:10px;border:1px solid rgba(7,88,183,.55);border-radius:50%}
      #quotePrint .tk-stamp-inner{position:absolute;inset:22px 14px 19px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.05;font-weight:900}
      #quotePrint .tk-stamp-main{font-size:10px;letter-spacing:.025em}
      #quotePrint .tk-stamp-sub{font-size:7px;margin-top:5px;font-weight:800}
      #quotePrint .tk-stamp-person{font-size:7px;margin-top:4px;font-weight:800}
      #quotePrint .tk-stamp-noise{position:absolute;inset:3px;border-radius:50%;background:repeating-radial-gradient(circle at 42% 58%,transparent 0 7px,rgba(7,88,183,.025) 8px 10px);opacity:.9}
      #quotePrint .tk-signature-ink{position:absolute;left:18px;bottom:54px;color:#0758b7;opacity:.84;mix-blend-mode:multiply;transform:rotate(-6deg);font-family:"Segoe Script","Brush Script MT","Lucida Handwriting",cursive;font-size:31px;font-weight:600;line-height:1;white-space:nowrap;letter-spacing:-1.4px;text-shadow:.35px .2px 0 rgba(7,88,183,.45)}
      #quotePrint .tk-signature-flourish{position:absolute;left:20px;bottom:45px;width:122px;height:17px;border-bottom:2px solid #0758b7;border-radius:50%;opacity:.58;transform:rotate(-5deg);mix-blend-mode:multiply}
      #quotePrint .tk-approval-note{margin-top:11px;padding:9px 11px;border-radius:10px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:9px;line-height:1.5}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-sign-box{min-height:180px}}
      @media print{#quotePrint .tk-signature-section{grid-template-columns:1fr 1fr}#quotePrint .tk-sign-box{box-shadow:none;background:#fff}#quotePrint .tk-real-stamp,#quotePrint .tk-signature-ink{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    `;
    document.head.appendChild(s);
  };
  const add=()=>{
    const root=document.getElementById('quotePrint');
    if(!root||!root.innerHTML.trim())return;
    install();
    const old=root.querySelector('.tk-signature-section');
    if(old)old.remove();
    const inner=root.querySelector('.tk-quote-inner')||root;
    const q=window.__tkCurrentQuote||{};
    const c=q.customers||{};
    const company=window.company||{};
    const customerName=String(c.contact_person||'').trim();
    const companyName=String(company.company_name||'TÜRKOĞLU ELEKTRİK ELEKTRONİK').trim();
    const firmRep=String(company.contact_person||company.authorized_person||'Samet Türkoğlu').trim()||'Samet Türkoğlu';
    const phone=String(company.phone||'0533 929 37 79').trim();
    const email=String(company.email||'turkogluguvenlik3838@gmail.com').trim();
    const section=document.createElement('section');
    section.className='tk-signature-section';
    section.innerHTML=`
      <div class="tk-sign-box">
        <div class="tk-sign-title">Firma Kaşe / İmza</div>
        <div class="tk-sign-sub">Teklif firma yetkilisi tarafından onaylanmıştır.</div>
        <div class="tk-sign-space"></div>
        <div class="tk-signature-ink">${esc(firmRep)}</div>
        <div class="tk-signature-flourish"></div>
        <div class="tk-sign-name">Yetkili: ${esc(firmRep)}</div>
        <div class="tk-real-stamp" aria-label="Firma kaşesi">
          <div class="tk-stamp-noise"></div>
          <div class="tk-stamp-inner">
            <div class="tk-stamp-main">${esc(companyName)}</div>
            <div class="tk-stamp-sub">GÜVENLİK KAMERA VE ELEKTRİK SİSTEMLERİ</div>
            <div class="tk-stamp-person">${esc(firmRep)} · ${esc(phone)}</div>
            <div class="tk-stamp-person">${esc(email)}</div>
          </div>
        </div>
      </div>
      <div class="tk-sign-box">
        <div class="tk-sign-title">Müşteri Onayı</div>
        <div class="tk-sign-sub">Teklifi kabul eden yetkili</div>
        <div class="tk-sign-space"></div>
        <div class="tk-sign-name">Ad Soyad: ${esc(customerName||'................................')}</div>
        <div class="tk-approval-note">“Teklifi ve belirtilen şartları kabul ediyorum.”</div>
      </div>`;
    inner.appendChild(section);
  };
  const watch=()=>requestAnimationFrame(add);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
  const observe=()=>{
    const target=document.getElementById('quotePrint');
    if(!target)return setTimeout(observe,250);
    let pending=false;
    new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;add()})}).observe(target,{childList:true,subtree:true});
  };
  observe();
})();
