/* Türkoğlu teklif PDF'si: onaylanan kaşe + imza görselini birebir kullanır. */
(function(){
  'use strict';
  if(window.__tkQuoteSignaturesInstalled)return;
  window.__tkQuoteSignaturesInstalled=true;
  const esc=s=>typeof window.esc==='function'?window.esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const FIRMA={line:'Güvenlik Kamera ve Elektrik Sistemleri',phone:'0533 929 37 79',email:'turkogluguvenlik3838@gmail.com',slogan:'Güvenli Yarınlar İçin, Doğru Çözüm!'};
  function install(){
    if(document.getElementById('tk-quote-signature-style'))return;
    const s=document.createElement('style');s.id='tk-quote-signature-style';
    s.textContent=`
      #quotePrint .tk-signature-section{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:16px;break-inside:avoid;page-break-inside:avoid}
      #quotePrint .tk-sign-box{min-height:240px;border:1px solid #dbe3ec;border-radius:12px;background:#fff;padding:12px 14px;position:relative;break-inside:avoid;page-break-inside:avoid;overflow:hidden}
      #quotePrint .tk-sign-title{font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:900;color:#334155}
      #quotePrint .tk-sign-sub{font-size:8px;color:#64748b;margin-top:3px}
      #quotePrint .tk-exact-stamp{position:absolute;left:50%;top:56%;width:96%;max-width:560px;height:auto;display:block;transform:translate(-50%,-50%);opacity:1;mix-blend-mode:normal}
      #quotePrint .tk-signature-legend{position:absolute;left:14px;bottom:10px;font-size:7px;color:#94a3b8}
      #quotePrint .tk-approval-space{height:76px;margin-top:28px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-approval-space:after{content:"İmza";position:absolute;left:0;bottom:-15px;font-size:7px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:20px;font-size:9px;color:#334155;font-weight:800}
      #quotePrint .tk-approval-note{margin-top:8px;padding:7px 9px;border-radius:8px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:7px;line-height:1.4}
      #quotePrint .tk-company-footer{margin-top:14px;padding:10px 4px 3px;border-top:1px solid #cbd5e1;display:flex;align-items:center;justify-content:space-between;gap:14px;break-inside:avoid;page-break-inside:avoid;color:#183b73}
      #quotePrint .tk-company-contact{display:flex;align-items:center;gap:18px;min-width:0;flex:1}
      #quotePrint .tk-contact-item{display:flex;align-items:center;gap:5px;font-size:7.5px;font-weight:700;white-space:nowrap}
      #quotePrint .tk-contact-icon{font-size:12px;line-height:1;color:#0758b7;font-weight:900}
      #quotePrint .tk-company-slogan{font-family:"Segoe Script","Brush Script MT","Lucida Handwriting",cursive;font-size:14px;font-weight:600;font-style:italic;line-height:1.1;text-align:right;white-space:nowrap;color:#0758b7;transform:rotate(-2deg)}
      @media(max-width:800px){#quotePrint .tk-company-footer{flex-direction:column;align-items:flex-start}.tk-company-contact{flex-wrap:wrap;gap:10px}.tk-company-slogan{text-align:left}}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-exact-stamp{width:94%!important}}
      @media print{#quotePrint .tk-signature-section{grid-template-columns:1fr 1fr}#quotePrint .tk-sign-box{box-shadow:none;background:#fff}#quotePrint .tk-exact-stamp,#quotePrint .tk-company-slogan{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    `;
    document.head.appendChild(s);
  }
  function getQuote(){return window.__tkCurrentQuote||window.currentQuote||window.selectedQuote||{}}
  function add(){
    const root=document.getElementById('quotePrint');if(!root||!root.innerHTML.trim())return;
    install();root.querySelector('.tk-signature-section')?.remove();root.querySelector('.tk-company-footer')?.remove();
    const q=getQuote(),customer=q.customers||q.customer||{},customerName=String(customer.contact_person||customer.authorized_person||customer.name||'').trim();
    const section=document.createElement('section');section.className='tk-signature-section';
    section.innerHTML=`
      <div class="tk-sign-box">
        <div class="tk-sign-title">Firma Kaşe / İmza</div>
        <div class="tk-sign-sub">Teklif firma yetkilisi tarafından onaylanmıştır.</div>
        <img class="tk-exact-stamp" src="./tk-stamp-signature-approved.png?v=1" alt="TÜRKOĞLU ELEKTRİK ELEKTRONİK kaşe ve imza">
        <div class="tk-signature-legend">Kaşe üzerine firma yetkilisi imzası</div>
      </div>
      <div class="tk-sign-box">
        <div class="tk-sign-title">Müşteri Onayı</div>
        <div class="tk-sign-sub">Teklifi kabul eden yetkili</div>
        <div class="tk-approval-space"></div>
        <div class="tk-sign-name">Ad Soyad: ${esc(customerName||'................................')}</div>
        <div class="tk-approval-note">“Teklifi ve belirtilen şartları kabul ediyorum.”</div>
      </div>`;
    const inner=root.querySelector('.tk-quote-inner')||root;inner.appendChild(section);
    const footer=document.createElement('footer');footer.className='tk-company-footer';
    footer.innerHTML=`<div class="tk-company-contact"><div class="tk-contact-item"><span class="tk-contact-icon">⌖</span><span>${esc(FIRMA.line)}</span></div><div class="tk-contact-item"><span class="tk-contact-icon">☎</span><span>${esc(FIRMA.phone)}</span></div><div class="tk-contact-item"><span class="tk-contact-icon">✉</span><span>${esc(FIRMA.email)}</span></div></div><div class="tk-company-slogan">${esc(FIRMA.slogan)}</div>`;
    inner.appendChild(footer);
  }
  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(add))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  const observe=()=>{const target=document.getElementById('quotePrint');if(!target)return setTimeout(observe,250);let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;add()})}).observe(target,{childList:true,subtree:true})};
  observe();window.tkApplyQuoteStamp=add;
})();
