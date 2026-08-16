/* Teklif PDF imza/kaşe alanları — mevcut teklif verisini değiştirmez. */
(function(){
  'use strict';
  if(window.__tkQuoteSignaturesInstalled)return;
  window.__tkQuoteSignaturesInstalled=true;

  const esc=s=>typeof window.esc==='function'?window.esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const install=()=>{
    if(document.getElementById('tk-quote-signature-style'))return;
    const s=document.createElement('style');s.id='tk-quote-signature-style';
    s.textContent=`
      #quotePrint .tk-signature-section{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:16px;break-inside:avoid}
      #quotePrint .tk-sign-box{min-height:185px;border:1px solid #dbe3ec;border-radius:16px;background:linear-gradient(180deg,#ffffff,#f8fafc);padding:17px 18px;position:relative;break-inside:avoid}
      #quotePrint .tk-sign-title{font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:900;color:#2563eb}
      #quotePrint .tk-sign-sub{font-size:11px;color:#64748b;margin-top:3px}
      #quotePrint .tk-sign-space{height:62px;margin-top:8px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-sign-space:after{content:"İmza";position:absolute;left:0;bottom:-18px;font-size:10px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:25px;font-size:12px;color:#334155;font-weight:800}
      #quotePrint .tk-stamp-placeholder{position:absolute;right:18px;bottom:18px;width:108px;height:72px;border:2px dashed #94a3b8;border-radius:12px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:9px;line-height:1.3;color:#64748b;font-weight:800;transform:rotate(-3deg);text-transform:uppercase;background:rgba(248,250,252,.6)}
      #quotePrint .tk-approval-note{margin-top:11px;padding:10px 12px;border-radius:11px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:10px;line-height:1.5}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-sign-box{min-height:155px}}
      @media print{#quotePrint .tk-signature-section{grid-template-columns:1fr 1fr}#quotePrint .tk-sign-box{box-shadow:none;background:#fff}}
    `;
    document.head.appendChild(s);
  };

  const add=()=>{
    const root=document.getElementById('quotePrint');
    if(!root||!root.innerHTML.trim())return;
    install();
    if(root.querySelector('.tk-signature-section'))return;
    const inner=root.querySelector('.tk-quote-inner')||root;
    const q=window.__tkCurrentQuote||{};
    const c=q.customers||{};
    const customerName=String(c.contact_person||'').trim();
    const companyName=String(window.company?.company_name||'Türkoğlu Elektrik Elektronik').trim();
    const firmRep=String(window.company?.contact_person||window.company?.authorized_person||'Yetkili').trim();
    const section=document.createElement('section');
    section.className='tk-signature-section';
    section.innerHTML=`
      <div class="tk-sign-box">
        <div class="tk-sign-title">Firma Kaşe / İmza</div>
        <div class="tk-sign-sub">Firma yetkilisi tarafından onay</div>
        <div class="tk-sign-space"></div>
        <div class="tk-sign-name">Yetkili: ${esc(firmRep||'................................')}</div>
        <div class="tk-stamp-placeholder">${esc(companyName)}<br>KAŞE + İMZA</div>
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
  const target=document.getElementById('quotePrint');
  if(target){let p=false;new MutationObserver(()=>{if(p)return;p=true;requestAnimationFrame(()=>{p=false;add()})}).observe(target,{childList:true,subtree:true});}
})();
