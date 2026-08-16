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
      #quotePrint .tk-stamp-wrap{position:absolute;left:50%;top:56%;width:304px;height:134px;transform:translate(-50%,-50%) rotate(-2.5deg);color:#0758b7;opacity:.77;mix-blend-mode:multiply;filter:saturate(.88)}
      #quotePrint .tk-real-stamp{position:absolute;inset:0;border:2.4px solid currentColor;border-radius:7px;padding:12px 15px;box-shadow:inset 0 0 0 1px rgba(7,88,183,.28);background:repeating-linear-gradient(0deg,transparent 0 5px,rgba(7,88,183,.018) 6px 7px)}
      #quotePrint .tk-real-stamp:before{content:"";position:absolute;inset:6px;border:1px solid rgba(7,88,183,.58);border-radius:3px;pointer-events:none}
      #quotePrint .tk-stamp-noise{position:absolute;inset:-2px;border-radius:8px;background:radial-gradient(circle at 12% 22%,rgba(7,88,183,.11) 0 1px,transparent 1.6px),radial-gradient(circle at 74% 74%,rgba(7,88,183,.09) 0 1px,transparent 1.7px),radial-gradient(circle at 45% 38%,rgba(7,88,183,.07) 0 1px,transparent 1.5px);background-size:9px 9px,11px 11px,13px 13px;opacity:.7;mix-blend-mode:multiply;pointer-events:none}
      #quotePrint .tk-stamp-inner{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.05;font-weight:900;color:#0758b7}
      #quotePrint .tk-stamp-main{font-size:12px;letter-spacing:.03em;white-space:nowrap}
      #quotePrint .tk-stamp-sub{font-size:8px;margin-top:6px;font-weight:900;white-space:nowrap}
      #quotePrint .tk-stamp-person{font-size:7.5px;margin-top:5px;font-weight:800;white-space:nowrap}
      #quotePrint .tk-stamp-email{font-size:6.6px;margin-top:3px;font-weight:800;white-space:nowrap}

      /* Kullanıcının gönderdiği son onaylı imza formu: isim yazısı yok, özgün el imzası çizgileri. */
      #quotePrint .tk-stamp-signature{position:absolute;z-index:4;left:-3px;right:-7px;bottom:-18px;height:104px;color:#064fa8;opacity:.96;mix-blend-mode:multiply;transform:rotate(-6deg);overflow:visible}
      #quotePrint .tk-stamp-signature path{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}
      #quotePrint .tk-stamp-signature .main{stroke-width:3.8}
      #quotePrint .tk-stamp-signature .fine{stroke-width:1.65;opacity:.86}
      #quotePrint .tk-stamp-signature .double{stroke-width:2.35;opacity:.92}
      #quotePrint .tk-stamp-signature .break{stroke-dasharray:95 7 28 5;opacity:.88}
      #quotePrint .tk-signature-legend{position:absolute;left:18px;bottom:17px;font-size:8px;color:#94a3b8}
      #quotePrint .tk-approval-space{height:92px;margin-top:36px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-approval-space:after{content:"İmza";position:absolute;left:0;bottom:-16px;font-size:8px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:21px;font-size:10px;color:#334155;font-weight:800}
      #quotePrint .tk-approval-note{margin-top:10px;padding:8px 10px;border-radius:9px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:8px;line-height:1.45}

      #quotePrint .tk-company-footer{margin-top:22px;padding:14px 7px 4px;border-top:1px solid #cbd5e1;display:flex;align-items:center;justify-content:space-between;gap:18px;break-inside:avoid;page-break-inside:avoid;color:#183b73}
      #quotePrint .tk-company-contact{display:flex;align-items:center;gap:22px;min-width:0;flex:1}
      #quotePrint .tk-contact-item{display:flex;align-items:center;gap:7px;font-size:8.5px;font-weight:700;white-space:nowrap}
      #quotePrint .tk-contact-icon{font-size:14px;line-height:1;color:#0758b7;font-weight:900}
      #quotePrint .tk-company-slogan{font-family:"Segoe Script","Brush Script MT","Lucida Handwriting",cursive;font-size:16px;font-weight:600;font-style:italic;line-height:1.1;text-align:right;white-space:nowrap;color:#0758b7;transform:rotate(-2deg);letter-spacing:-.3px}
      @media(max-width:800px){#quotePrint .tk-company-footer{flex-direction:column;align-items:flex-start}.tk-company-contact{flex-wrap:wrap;gap:10px}.tk-company-slogan{text-align:left}}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-stamp-wrap{width:min(304px,88%)}#quotePrint .tk-sign-box{min-height:190px}}
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
          <svg class="tk-stamp-signature" viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
            <path class="main" d="M9 111 C30 80 38 125 60 103 C78 85 70 52 84 49 C98 46 89 86 109 87 C127 88 140 57 151 62 C163 68 145 95 165 92 C185 88 191 45 206 49 C221 53 207 89 228 86 C248 83 257 57 272 61 C288 65 273 92 295 87 C319 82 326 48 341 53 C355 58 344 86 366 83 C390 79 397 58 412 61 C430 65 413 91 438 86 C461 81 477 67 506 60"/>
            <path class="double" d="M24 126 C67 116 101 119 143 111 C185 103 220 111 262 103 C302 96 337 102 380 94 C424 86 465 95 508 84"/>
            <path class="fine" d="M119 72 C143 47 170 43 184 58 C196 72 178 92 163 102 C145 114 137 129 151 140"/>
            <path class="fine break" d="M281 57 C301 38 325 41 334 58 C341 72 326 88 309 96"/>
            <path class="fine" d="M390 52 C404 28 429 23 443 36 C455 47 449 64 434 75"/>
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
