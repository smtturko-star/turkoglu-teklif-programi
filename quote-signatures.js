/* Türkoğlu teklif PDF'si: otomatik mavi mürekkep kaşe + özgün imza + kurumsal alt iletişim. */
(function(){
  'use strict';
  if(window.__tkQuoteSignaturesInstalled)return;
  window.__tkQuoteSignaturesInstalled=true;

  const esc=s=>typeof window.esc==='function'?window.esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const FIRMA={
    name:'TÜRKOĞLU ELEKTRİK ELEKTRONİK',
    line:'Güvenlik Kamera ve Elektrik Sistemleri',
    person:'Samet Türkoğlu',
    phone:'0533 929 37 79',
    email:'turkogluguvenlik3838@gmail.com',
    slogan:'Güvenli Yarınlar İçin, Doğru Çözüm!'
  };

  function install(){
    if(document.getElementById('tk-quote-signature-style'))return;
    const s=document.createElement('style');s.id='tk-quote-signature-style';
    s.textContent=`
      #quotePrint .tk-signature-section{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:20px;break-inside:avoid;page-break-inside:avoid}
      #quotePrint .tk-sign-box{min-height:220px;border:1px solid #dbe3ec;border-radius:14px;background:#fff;padding:15px 17px;position:relative;break-inside:avoid;page-break-inside:avoid;overflow:hidden}
      #quotePrint .tk-sign-title{font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:900;color:#334155}
      #quotePrint .tk-sign-sub{font-size:9px;color:#64748b;margin-top:3px}
      #quotePrint .tk-stamp-wrap{position:absolute;left:50%;top:55%;width:300px;height:132px;transform:translate(-50%,-50%) rotate(-2.5deg);color:#0758b7;opacity:.77;mix-blend-mode:multiply;filter:saturate(.88)}
      #quotePrint .tk-real-stamp{position:absolute;inset:0;border:2.4px solid currentColor;border-radius:7px;padding:12px 15px;box-shadow:inset 0 0 0 1px rgba(7,88,183,.28);background:repeating-linear-gradient(0deg,transparent 0 5px,rgba(7,88,183,.018) 6px 7px)}
      #quotePrint .tk-real-stamp:before{content:"";position:absolute;inset:6px;border:1px solid rgba(7,88,183,.58);border-radius:3px;pointer-events:none}
      #quotePrint .tk-stamp-noise{position:absolute;inset:-2px;border-radius:8px;background:radial-gradient(circle at 12% 22%,rgba(7,88,183,.11) 0 1px,transparent 1.6px),radial-gradient(circle at 74% 74%,rgba(7,88,183,.09) 0 1px,transparent 1.7px),radial-gradient(circle at 45% 38%,rgba(7,88,183,.07) 0 1px,transparent 1.5px);background-size:9px 9px,11px 11px,13px 13px;opacity:.7;mix-blend-mode:multiply;pointer-events:none}
      #quotePrint .tk-stamp-inner{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.05;font-weight:900;color:#0758b7}
      #quotePrint .tk-stamp-main{font-size:12px;letter-spacing:.03em;white-space:nowrap}
      #quotePrint .tk-stamp-sub{font-size:8px;margin-top:6px;font-weight:900;white-space:nowrap}
      #quotePrint .tk-stamp-person{font-size:7.5px;margin-top:5px;font-weight:800;white-space:nowrap}
      #quotePrint .tk-stamp-email{font-size:6.6px;margin-top:3px;font-weight:800;white-space:nowrap}
      #quotePrint .tk-stamp-signature{position:absolute;z-index:4;left:7px;right:3px;bottom:-14px;height:86px;color:#064fa8;opacity:.93;mix-blend-mode:multiply;transform:rotate(-6deg);overflow:visible}
      #quotePrint .tk-stamp-signature path{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}
      #quotePrint .tk-stamp-signature .main{stroke-width:3.2}
      #quotePrint .tk-stamp-signature .fine{stroke-width:1.45;opacity:.82}
      #quotePrint .tk-stamp-signature .double{stroke-width:2.1;opacity:.9}
      #quotePrint .tk-stamp-signature .ink-break{stroke-dasharray:74 5 26 4;opacity:.82}
      #quotePrint .tk-signature-legend{position:absolute;left:18px;bottom:17px;font-size:8px;color:#94a3b8}
      #quotePrint .tk-approval-space{height:92px;margin-top:36px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-approval-space:after{content:"İmza";position:absolute;left:0;bottom:-16px;font-size:8px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:21px;font-size:10px;color:#334155;font-weight:800}
      #quotePrint .tk-approval-note{margin-top:10px;padding:8px 10px;border-radius:9px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:8px;line-height:1.45}

      /* Teklif PDF'sinin en altında kurumsal iletişim şeridi. */
      #quotePrint .tk-company-footer{margin-top:22px;padding:14px 7px 4px;border-top:1px solid #cbd5e1;display:flex;align-items:center;justify-content:space-between;gap:18px;break-inside:avoid;page-break-inside:avoid;color:#183b73}
      #quotePrint .tk-company-contact{display:flex;align-items:center;gap:22px;min-width:0;flex:1}
      #quotePrint .tk-contact-item{display:flex;align-items:center;gap:7px;font-size:8.5px;font-weight:700;white-space:nowrap}
      #quotePrint .tk-contact-icon{font-size:14px;line-height:1;color:#0758b7;font-weight:900}
      #quotePrint .tk-company-slogan{font-family:"Segoe Script","Brush Script MT","Lucida Handwriting",cursive;font-size:16px;font-weight:600;font-style:italic;line-height:1.1;text-align:right;white-space:nowrap;color:#0758b7;transform:rotate(-2deg);letter-spacing:-.3px}
      @media(max-width:800px){#quotePrint .tk-company-footer{flex-direction:column;align-items:flex-start}.tk-company-contact{flex-wrap:wrap;gap:10px}.tk-company-slogan{text-align:left}}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-stamp-wrap{width:min(300px,88%)}#quotePrint .tk-sign-box{min-height:190px}}
      @media print{#quotePrint .tk-signature-section{grid-template-columns:1fr 1fr}#quotePrint .tk-sign-box{box-shadow:none;background:#fff}#quotePrint .tk-real-stamp,#quotePrint .tk-stamp-signature,#quotePrint .tk-company-slogan{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    `;
    document.head.appendChild(s);
  }

  function getQuote(){return window.__tkCurrentQuote||window.currentQuote||window.selectedQuote||{}}

  function add(){
    const root=document.getElementById('quotePrint');
    if(!root||!root.innerHTML.trim())return;
    install();
    root.querySelector('.tk-signature-section')?.remove();
    root.querySelector('.tk-company-footer')?.remove();

    const q=getQuote();
    const customer=q.customers||q.customer||{};
    const customerName=String(customer.contact_person||customer.authorized_person||customer.name||'').trim();

    const section=document.createElement('section');section.className='tk-signature-section';
    section.innerHTML=`
      <div class="tk-sign-box">
        <div class="tk-sign-title">Firma Kaşe / İmza</div>
        <div class="tk-sign-sub">Teklif firma yetkilisi tarafından onaylanmıştır.</div>
        <div class="tk-stamp-wrap" aria-label="Firma kaşesi ve imzası">
          <div class="tk-real-stamp">
            <div class="tk-stamp-noise"></div>
            <div class="tk-stamp-inner">
              <div class="tk-stamp-main">${esc(FIRMA.name)}</div>
              <div class="tk-stamp-sub">${esc(FIRMA.line)}</div>
              <div class="tk-stamp-person">${esc(FIRMA.person)} · Tel: ${esc(FIRMA.phone)}</div>
              <div class="tk-stamp-email">E-posta: ${esc(FIRMA.email)}</div>
            </div>
          </div>
          <svg class="tk-stamp-signature" viewBox="0 0 310 92" preserveAspectRatio="none" aria-hidden="true">
            <path class="main" d="M8 66 C24 40 27 74 42 57 C52 46 48 29 58 31 C66 33 55 57 69 58 C81 59 86 37 94 41 C101 45 91 63 104 60 C118 56 120 30 130 35 C139 40 129 62 143 61 C155 60 158 45 168 46 C178 47 170 63 184 59 C201 54 205 37 214 40 C222 43 214 58 227 57 C241 56 245 44 253 46 C264 49 254 62 270 58 C284 55 293 47 302 45"/>
            <path class="double" d="M20 75 C57 69 89 73 120 68 C150 64 176 68 205 63 C236 58 266 64 298 56"/>
            <path class="fine" d="M91 25 C111 10 130 13 137 24 C143 34 130 47 122 52 C113 59 108 67 116 76"/>
            <path class="fine ink-break" d="M168 24 C180 17 191 20 195 29 C199 39 189 48 179 51"/>
          </svg>
        </div>
        <div class="tk-signature-legend">Kaşe üzerine firma yetkilisi imzası</div>
      </div>
      <div class="tk-sign-box">
        <div class="tk-sign-title">Müşteri Onayı</div>
        <div class="tk-sign-sub">Teklifi kabul eden yetkili</div>
        <div class="tk-approval-space"></div>
        <div class="tk-sign-name">Ad Soyad: ${esc(customerName||'................................')}</div>
        <div class="tk-approval-note">“Teklifi ve belirtilen şartları kabul ediyorum.”</div>
      </div>`;

    const inner=root.querySelector('.tk-quote-inner')||root;
    inner.appendChild(section);

    const footer=document.createElement('footer');
    footer.className='tk-company-footer';
    footer.innerHTML=`
      <div class="tk-company-contact">
        <div class="tk-contact-item"><span class="tk-contact-icon">⌖</span><span>${esc(FIRMA.line)}</span></div>
        <div class="tk-contact-item"><span class="tk-contact-icon">☎</span><span>${esc(FIRMA.phone)}</span></div>
        <div class="tk-contact-item"><span class="tk-contact-icon">✉</span><span>${esc(FIRMA.email)}</span></div>
      </div>
      <div class="tk-company-slogan">${esc(FIRMA.slogan)}</div>`;
    inner.appendChild(footer);
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(add))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  const observe=()=>{const target=document.getElementById('quotePrint');if(!target)return setTimeout(observe,250);let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;add()})}).observe(target,{childList:true,subtree:true})};
  observe();
  window.tkApplyQuoteStamp=add;
})();
