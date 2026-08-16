/* Türkoğlu teklif PDF'si: otomatik firma kaşesi + isim bazlı imza. */
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
    email:'turkogluguvenlik3838@gmail.com'
  };

  function install(){
    if(document.getElementById('tk-quote-signature-style'))return;
    const s=document.createElement('style');s.id='tk-quote-signature-style';
    s.textContent=`
      #quotePrint .tk-signature-section{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:20px;break-inside:avoid;page-break-inside:avoid}
      #quotePrint .tk-sign-box{min-height:220px;border:1px solid #dbe3ec;border-radius:14px;background:#fff;padding:15px 17px;position:relative;break-inside:avoid;page-break-inside:avoid;overflow:hidden}
      #quotePrint .tk-sign-title{font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:900;color:#334155}
      #quotePrint .tk-sign-sub{font-size:9px;color:#64748b;margin-top:3px}
      #quotePrint .tk-sign-space{height:92px;margin-top:4px;border-bottom:1px dashed #cbd5e1;position:relative}
      #quotePrint .tk-sign-space:after{content:"İmza";position:absolute;left:0;bottom:-16px;font-size:8px;color:#94a3b8}
      #quotePrint .tk-sign-name{margin-top:21px;font-size:10px;color:#334155;font-weight:800}

      /* Gerçek kaşe hissi: çift halka, mavi mürekkep, düşük opaklık ve hafif baskı bozulması. */
      #quotePrint .tk-real-stamp{position:absolute;right:16px;bottom:16px;width:154px;height:108px;color:#0758b7;opacity:.74;transform:rotate(-4.5deg);mix-blend-mode:multiply;filter:saturate(.85)}
      #quotePrint .tk-real-stamp:before{content:"";position:absolute;inset:0;border:2.8px solid currentColor;border-radius:50%;box-shadow:inset 0 0 0 1.6px rgba(7,88,183,.42),inset 0 0 0 7px rgba(7,88,183,.025)}
      #quotePrint .tk-real-stamp:after{content:"";position:absolute;left:8px;right:8px;top:11px;bottom:11px;border:1px solid rgba(7,88,183,.52);border-radius:50%;clip-path:polygon(0 0,100% 0,100% 88%,74% 90%,50% 86%,23% 94%,0 90%)}
      #quotePrint .tk-stamp-noise{position:absolute;inset:2px;border-radius:50%;background:radial-gradient(circle at 30% 32%,rgba(7,88,183,.10) 0 1px,transparent 1.7px),radial-gradient(circle at 70% 68%,rgba(7,88,183,.08) 0 1px,transparent 1.7px);background-size:8px 8px,11px 11px;opacity:.65;mix-blend-mode:multiply}
      #quotePrint .tk-stamp-inner{position:absolute;inset:24px 14px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.04;font-weight:900;color:#0758b7}
      #quotePrint .tk-stamp-main{font-size:9px;letter-spacing:.025em;white-space:nowrap}
      #quotePrint .tk-stamp-sub{font-size:6.4px;margin-top:5px;font-weight:900;white-space:nowrap}
      #quotePrint .tk-stamp-person{font-size:6.4px;margin-top:4px;font-weight:800;white-space:nowrap}
      #quotePrint .tk-stamp-email{font-size:5.8px;margin-top:3px;font-weight:800;white-space:nowrap}

      /* İsim bazlı imza: Samet Türkoğlu. */
      #quotePrint .tk-signature-ink{position:absolute;left:17px;bottom:57px;color:#0758b7;opacity:.82;mix-blend-mode:multiply;transform:rotate(-7deg);font-family:"Segoe Script","Brush Script MT","Lucida Handwriting",cursive;font-size:30px;font-weight:600;line-height:1;white-space:nowrap;letter-spacing:-1.5px;text-shadow:.35px .2px 0 rgba(7,88,183,.38)}
      #quotePrint .tk-signature-flourish{position:absolute;left:19px;bottom:48px;width:128px;height:16px;border-bottom:2px solid #0758b7;border-radius:50%;opacity:.55;transform:rotate(-6deg);mix-blend-mode:multiply}
      #quotePrint .tk-approval-note{margin-top:10px;padding:8px 10px;border-radius:9px;background:#f8fafc;border:1px solid #edf1f5;color:#64748b;font-size:8px;line-height:1.45}
      @media(max-width:700px){#quotePrint .tk-signature-section{grid-template-columns:1fr}.tk-sign-box{min-height:190px}}
      @media print{#quotePrint .tk-signature-section{grid-template-columns:1fr 1fr}#quotePrint .tk-sign-box{box-shadow:none;background:#fff}#quotePrint .tk-real-stamp,#quotePrint .tk-signature-ink,#quotePrint .tk-signature-flourish{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    `;
    document.head.appendChild(s);
  }

  function getQuote(){
    return window.__tkCurrentQuote || window.currentQuote || window.selectedQuote || {};
  }

  function add(){
    const root=document.getElementById('quotePrint');
    if(!root||!root.innerHTML.trim())return;
    install();
    const old=root.querySelector('.tk-signature-section');
    if(old)old.remove();

    const q=getQuote();
    const customer=q.customers||q.customer||{};
    const customerName=String(customer.contact_person||customer.authorized_person||customer.name||'').trim();

    const section=document.createElement('section');
    section.className='tk-signature-section';
    section.innerHTML=`
      <div class="tk-sign-box">
        <div class="tk-sign-title">Firma Kaşe / İmza</div>
        <div class="tk-sign-sub">Teklif firma yetkilisi tarafından onaylanmıştır.</div>
        <div class="tk-sign-space"></div>
        <div class="tk-signature-ink">${esc(FIRMA.person)}</div>
        <div class="tk-signature-flourish"></div>
        <div class="tk-sign-name">Yetkili: ${esc(FIRMA.person)}</div>
        <div class="tk-real-stamp" aria-label="Firma kaşesi">
          <div class="tk-stamp-noise"></div>
          <div class="tk-stamp-inner">
            <div class="tk-stamp-main">${esc(FIRMA.name)}</div>
            <div class="tk-stamp-sub">${esc(FIRMA.line)}</div>
            <div class="tk-stamp-person">${esc(FIRMA.person)} · Tel: ${esc(FIRMA.phone)}</div>
            <div class="tk-stamp-email">E-posta: ${esc(FIRMA.email)}</div>
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

    const inner=root.querySelector('.tk-quote-inner')||root;
    inner.appendChild(section);
  }

  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(add));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();

  // Teklif PDF içeriği sonradan oluşturuluyorsa her oluşturulma işleminden sonra kaşeyi yeniden ekle.
  const observe=()=>{
    const target=document.getElementById('quotePrint');
    if(!target)return setTimeout(observe,250);
    let pending=false;
    new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;add()})}).observe(target,{childList:true,subtree:true});
  };
  observe();

  // Mevcut teklif/PDF fonksiyonları tarafından çağrılabilen genel kanca.
  window.tkApplyQuoteStamp=add;
})();
