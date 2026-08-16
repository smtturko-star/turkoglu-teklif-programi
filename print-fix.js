/* Türkoğlu: Yazdırma ekranında uygulamanın geri kalanını kesin olarak gizle. */
(function(){
  'use strict';
  if(window.__turkogluPrintFixInstalled)return;
  window.__turkogluPrintFixInstalled=true;
  const STYLE_ID='turkoglu-print-isolation', CLASS='turkoglu-print-mode';
  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');style.id=STYLE_ID;
    style.textContent=`@media print{body.${CLASS}>*{visibility:hidden!important}body.${CLASS} #printPage,body.${CLASS} #printPage *{visibility:visible!important}body.${CLASS} #printPage{display:block!important;position:absolute!important;left:0!important;top:0!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;background:#fff!important}}`;
    document.head.appendChild(style);
  }
  function beforePrint(){installStyle();document.body.classList.add(CLASS)}
  function afterPrint(){document.body.classList.remove(CLASS)}
  installStyle();window.addEventListener('beforeprint',beforePrint);window.addEventListener('afterprint',afterPrint);

  const PRODUCT_STYLE_ID='turkoglu-product-window-style',MIN_BAR_ID='productMinimizedBar';
  function installProductWindowStyle(){
    if(document.getElementById(PRODUCT_STYLE_ID))return;
    const style=document.createElement('style');style.id=PRODUCT_STYLE_ID;
    style.textContent=`
      .modalbox.product-window-maximized{width:calc(100vw - 36px)!important;max-width:none!important;height:calc(100vh - 36px)!important;max-height:none!important;border-radius:12px!important}
      .modalbox.product-window-minimized{display:none!important}.product-window-actions{display:flex;gap:5px;margin-left:auto;margin-right:8px;align-items:center}
      .product-window-actions button{width:34px;height:34px;padding:0;border-radius:8px;background:#eef2f7;color:#111827;font-size:17px;line-height:1}.product-window-actions button:hover{background:#e2e8f0}
      #${MIN_BAR_ID}{position:fixed;right:18px;bottom:18px;z-index:10000;background:#0f172a;color:#fff;border:0;border-radius:12px;padding:11px 16px;font-weight:800;box-shadow:0 8px 24px #0003;cursor:pointer}
      @media(max-width:650px){.modalbox.product-window-maximized{width:100vw!important;height:100vh!important;max-height:none!important;border-radius:0!important}.product-window-actions{gap:3px;margin-right:5px}.product-window-actions button{width:32px;height:32px}}
    `;document.head.appendChild(style);
  }
  function removeMinimizedBar(){document.getElementById(MIN_BAR_ID)?.remove()}
  function isProductModal(box){return /Ürün/i.test(box?.querySelector('.modalhead h2')?.textContent||'')}
  function addProductWindowControls(){
    const overlay=document.getElementById('modal'),box=document.getElementById('modalBox');
    if(!overlay||!box||!overlay.classList.contains('show')||!isProductModal(box))return;
    const head=box.querySelector('.modalhead'),close=head?.querySelector('.close');
    if(!head||!close||head.dataset.productWindowControls==='1')return;
    head.dataset.productWindowControls='1';const actions=document.createElement('div');actions.className='product-window-actions';
    actions.innerHTML='<button type="button" title="Küçült" aria-label="Küçült">−</button><button type="button" title="Büyüt" aria-label="Büyüt">⛶</button>';head.insertBefore(actions,close);
    const minBtn=actions.children[0],maxBtn=actions.children[1];
    minBtn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();box.classList.add('product-window-minimized');box.classList.remove('product-window-maximized');removeMinimizedBar();const bar=document.createElement('button');bar.id=MIN_BAR_ID;bar.type='button';bar.textContent='📦 Ürün Ekle — devam et';bar.title='Ürün penceresini geri aç';document.body.appendChild(bar);bar.addEventListener('click',function(){box.classList.remove('product-window-minimized');bar.remove()})});
    maxBtn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();box.classList.toggle('product-window-maximized')});
  }
  installProductWindowStyle();
  const observer=new MutationObserver(function(){addProductWindowControls();const overlay=document.getElementById('modal');if(overlay&&!overlay.classList.contains('show'))removeMinimizedBar()});
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

  if(!document.querySelector('script[data-tk-modern-quote-pdf]')){const script=document.createElement('script');script.src='./modern-quote-pdf.js';script.dataset.tkModernQuotePdf='1';script.defer=true;document.head.appendChild(script)}
  function loadEnhancement(src,marker){if(document.querySelector('script[data-'+marker+']'))return;const script=document.createElement('script');script.src=src;script.dataset[marker]='1';script.defer=false;document.body.appendChild(script)}
  loadEnhancement('./dashboard-modal.js','tkDashboardEnhancement');
  loadEnhancement('./quote-signatures.js','tkQuoteSignatureEnhancement');
  loadEnhancement('./quote-search-fix.js','tkQuoteSearchFix');
  loadEnhancement('./quote-print-tuning.js','tkQuotePrintTuning');
})();
