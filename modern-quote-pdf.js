/* Modern teklif PDF görünümü — mevcut teklif verisini değiştirmez. */
(function(){
  'use strict';
  if(window.__turkogluModernQuotePdfInstalled)return;
  window.__turkogluModernQuotePdfInstalled=true;

  const STYLE_ID='tk-modern-quote-pdf-style';
  const install=()=>{
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;
    s.textContent=`
      #quotePrint{font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#172033;background:#fff}
      #quotePrint .tk-quote-shell{position:relative;overflow:hidden;border:1px solid #e2e8f0;border-radius:22px;background:#fff;box-shadow:0 18px 55px rgba(15,23,42,.09);padding:0}
      #quotePrint .tk-quote-accent{height:7px;background:linear-gradient(90deg,#14213d 0%,#2563eb 55%,#0ea5e9 100%)}
      #quotePrint .tk-quote-inner{padding:30px 32px 28px}
      #quotePrint .qhead{border:0;padding:0 0 24px;margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:30px;align-items:start}
      #quotePrint .qhead h2{font-size:25px;line-height:1.15;letter-spacing:-.025em;margin:8px 0 4px;color:#0f172a}
      #quotePrint .qhead b{color:#2563eb;letter-spacing:.08em;font-size:11px;text-transform:uppercase}
      #quotePrint .qhead .muted{color:#64748b;line-height:1.6}
      #quotePrint .qlogo{max-width:150px;max-height:82px;object-fit:contain;margin-bottom:4px}
      #quotePrint .tk-quote-meta{text-align:right;min-width:190px}
      #quotePrint .tk-quote-meta .tk-label{display:block;color:#64748b;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;margin-bottom:5px}
      #quotePrint .tk-quote-meta .tk-number{display:block;color:#0f172a;font-size:20px;font-weight:900;letter-spacing:-.02em;margin-bottom:8px}
      #quotePrint .tk-quote-meta .tk-date{font-size:12px;line-height:1.6;color:#64748b}
      #quotePrint .tk-customer-box{margin:0 0 22px;padding:16px 18px;border:1px solid #dbeafe;background:linear-gradient(135deg,#f8fbff,#eff6ff);border-radius:15px}
      #quotePrint .tk-customer-label{font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#2563eb;margin-bottom:6px}
      #quotePrint .tk-customer-name{font-weight:900;font-size:17px;color:#0f172a}
      #quotePrint .tk-customer-meta{font-size:12px;color:#64748b;margin-top:3px;line-height:1.6}
      #quotePrint table{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #e2e8f0;border-radius:15px;margin-top:8px}
      #quotePrint thead th{background:#f8fafc;color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #e2e8f0;padding:12px 11px}
      #quotePrint tbody td{padding:13px 11px;border-bottom:1px solid #edf1f5;color:#334155;font-size:12px;vertical-align:middle}
      #quotePrint tbody tr:nth-child(even){background:#fbfdff}
      #quotePrint tbody tr:last-child td{border-bottom:0}
      #quotePrint tbody td:first-child{width:64px}
      #quotePrint tbody .thumb{width:52px;height:42px;border-radius:9px;border:1px solid #e2e8f0;background:#fff}
      #quotePrint .summary{margin-top:18px;max-width:390px;padding:15px 17px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:15px;grid-template-columns:1fr auto}
      #quotePrint .summary span{color:#64748b;font-size:12px}
      #quotePrint .summary strong{color:#0f172a}
      #quotePrint .summary strong.total{font-size:23px;color:#2563eb}
      #quotePrint .tk-note-box,#quotePrint .tk-bank-box{margin-top:18px;padding:15px 17px;border-radius:15px;border:1px solid #e2e8f0;background:#fff}
      #quotePrint .tk-section-title{font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:900;color:#2563eb;margin-bottom:7px}
      #quotePrint .tk-note-box p{margin:0;color:#475569;font-size:12px;line-height:1.7;white-space:pre-line}
      #quotePrint .tk-bank-box{background:#f8fafc}
      #quotePrint .tk-bank-line{font-size:12px;color:#475569;line-height:1.7}
      #quotePrint .tk-footer{margin-top:24px;padding-top:14px;border-top:1px solid #e2e8f0;color:#64748b;font-size:10px;line-height:1.7}
      @media(max-width:700px){
        #quotePrint .tk-quote-inner{padding:22px 18px}
        #quotePrint .qhead{grid-template-columns:1fr;gap:18px}
        #quotePrint .tk-quote-meta{text-align:left;min-width:0}
        #quotePrint .qhead h2{font-size:21px}
      }
      @media print{
        #quotePrint .tk-quote-shell{border:0;box-shadow:none;border-radius:0}
        #quotePrint .tk-quote-accent{height:5px}
        #quotePrint .tk-quote-inner{padding:8mm 9mm 7mm}
        #quotePrint table{break-inside:auto}
        #quotePrint tr{break-inside:avoid}
        #quotePrint thead{display:table-header-group}
        #quotePrint .tk-customer-box,#quotePrint .tk-note-box,#quotePrint .tk-bank-box{break-inside:avoid}
      }
    `;
    document.head.appendChild(s);
  };

  const esc=v=>typeof window.esc==='function'?window.esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const decorate=()=>{
    const root=document.getElementById('quotePrint');
    if(!root||!root.innerHTML.trim()||root.dataset.tkModernized==='1')return;
    const head=root.querySelector('.qhead');
    if(!head)return;
    install();
    const customer=root.querySelector('.qhead + div');
    const children=[...root.children];
    const currentTable=root.querySelector('table');
    const summary=root.querySelector('.summary');
    const bank=[...root.children].find(el=>/Banka Bilgileri/i.test(el.textContent||''));
    const footer=[...root.children].find(el=>el.textContent&&el.textContent.trim()===String(window.company?.quote_footer||'Fiyat teklifidir.').trim());
    if(!root.querySelector('.tk-quote-shell')){
      const shell=document.createElement('div');shell.className='tk-quote-shell';
      shell.innerHTML='<div class="tk-quote-accent"></div><div class="tk-quote-inner"></div>';
      const inner=shell.querySelector('.tk-quote-inner');
      while(root.firstChild)inner.appendChild(root.firstChild);
      root.appendChild(shell);
    }
    const shell=root.querySelector('.tk-quote-shell'),inner=shell?.querySelector('.tk-quote-inner');
    if(!shell||!inner)return;
    const currentHead=inner.querySelector('.qhead');
    if(currentHead&&!currentHead.querySelector('.tk-quote-meta')){
      const oldRight=currentHead.children[1];
      if(oldRight){
        oldRight.classList.add('tk-quote-meta');
        const text=oldRight.innerHTML||'';
        const match=text.match(/No:\s*([^<]+).*?Tarih:\s*([^<]+).*?Geçerlilik:\s*([^<]+)/i);
        if(match){
          oldRight.innerHTML=`<span class="tk-label">Fiyat Teklifi</span><span class="tk-number">${esc(match[1].trim())}</span><div class="tk-date">Tarih: ${esc(match[2].trim())}<br>Geçerlilik: ${esc(match[3].trim())}</div>`;
        }
      }
      const logo=currentHead.querySelector('.qlogo');
      const brandBox=currentHead.firstElementChild;
      if(brandBox)brandBox.classList.add('tk-brand-box');
      if(logo)logo.style.marginBottom='6px';
    }
    const cust=inner.querySelector('.qhead + div');
    if(cust&&!cust.classList.contains('tk-customer-box')){
      cust.className='tk-customer-box';
      const parts=cust.innerHTML.split(/<br\s*\/?>(?)/i);
      const raw=cust.textContent||'';
      const lines=raw.split('\n').map(x=>x.trim()).filter(Boolean);
      const name=lines[1]||lines[0]||'';
      const meta=lines.slice(2).join(' · ');
      cust.innerHTML=`<div class="tk-customer-label">Müşteri</div><div class="tk-customer-name">${esc(name)}</div><div class="tk-customer-meta">${esc(meta)}</div>`;
    }
    const tables=[...inner.querySelectorAll('table')];
    const quoteTable=tables.find(t=>t.querySelector('th')&&/Ürün|Model|Toplam/i.test(t.textContent||''));
    if(quoteTable){
      quoteTable.classList.add('tk-quote-table');
      quoteTable.querySelectorAll('.thumb').forEach(img=>{img.loading='eager'});
    }
    if(summary)summary.classList.add('tk-modern-summary');
    if(bank&&!bank.classList.contains('tk-bank-box')){
      bank.className='tk-bank-box';
      bank.innerHTML=bank.innerHTML.replace(/<b>Banka Bilgileri<\/b>/,'<div class="tk-section-title">Banka Bilgileri</div>').replace(/<br>/g,'<br>');
    }
    if(summary){
      const total=[...summary.querySelectorAll('strong')].pop();
      if(total)total.classList.add('total');
    }
    const note=[...inner.children].find(el=>/^<b>Not<\/b>/i.test(el.innerHTML||'')||/^Not$/i.test(el.querySelector?.('b')?.textContent||''));
    if(note&&!note.classList.contains('tk-note-box')){
      note.className='tk-note-box';
      note.innerHTML=note.innerHTML.replace(/^<b>Not<\/b>/i,'<div class="tk-section-title">Teklif Notu</div>');
    }
    const footers=[...inner.children].filter(el=>el.textContent&&!el.classList.contains('tk-footer')&&/Fiyat teklifidir|Teklifimiz|Garanti|KDV/i.test(el.textContent||''));
    const last=footers[footers.length-1];
    if(last&&!last.querySelector?.('.tk-section-title')&&last!==quoteTable&&last!==summary&&last!==cust&&last!==note&&last!==bank&&last.classList.contains('muted')===false){last.classList.add('tk-footer')}
    root.dataset.tkModernized='1';
  };

  const watch=()=>{install();decorate()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
  const target=()=>document.getElementById('quotePrint');
  let pending=false;
  const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorate()})});
  const start=()=>{const r=target();if(r)observer.observe(r,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
