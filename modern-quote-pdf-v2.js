/* PDF V2: daha premium çıktı düzeni; mevcut teklif hesaplamasına dokunmaz. */
(function(){
  'use strict';
  if(window.__tkQuotePdfV2)return;
  window.__tkQuotePdfV2=true;

  const loadCss=()=>{
    if(document.querySelector('link[data-tk-pdf-v2]'))return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href='./pdf-modern-v2.css';l.dataset.tkPdfV2='1';
    document.head.appendChild(l);
  };

  const enhance=()=>{
    const root=document.getElementById('quotePrint');
    if(!root||!root.querySelector('.tk-quote-shell'))return;
    const inner=root.querySelector('.tk-quote-inner');
    if(!inner)return;

    const summary=inner.querySelector('.summary');
    if(summary&&!inner.querySelector('.tk-total-strip')){
      const total=[...summary.querySelectorAll('strong')].pop();
      if(total){
        const strip=document.createElement('div');
        strip.className='tk-total-strip';
        strip.innerHTML='<div><div class="label">Ödenecek Genel Toplam</div><div style="font-size:10px;opacity:.68;margin-top:3px">KDV ve indirimler dahil</div></div><div class="value"></div>';
        strip.querySelector('.value').textContent=total.textContent.trim();
        summary.after(strip);
      }
    }

    if(!inner.querySelector('.tk-signatures')){
      const footer=inner.querySelector('.tk-footer');
      const bank=inner.querySelector('.tk-bank-box');
      const sig=document.createElement('div');sig.className='tk-signatures';
      sig.innerHTML='<div class="tk-signature">Müşteri Onayı / Kaşe - İmza</div><div class="tk-signature">Türkoğlu Elektrik Elektronik / Yetkili</div>';
      (footer||bank||summary)?.after(sig);
    }

    const table=inner.querySelector('table.tk-quote-table');
    table?.querySelectorAll('tbody tr').forEach((row,i)=>{
      row.dataset.rowIndex=String(i+1);
    });
  };

  const start=()=>{
    loadCss();
    enhance();
    const root=document.getElementById('quotePrint');
    if(!root)return;
    let raf=0;
    const observer=new MutationObserver(()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(enhance);
    });
    observer.observe(root,{childList:true,subtree:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
