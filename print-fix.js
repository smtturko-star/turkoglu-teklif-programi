/* Türkoğlu: Yazdırma ekranında uygulamanın geri kalanını kesin olarak gizle. */
(function(){
  'use strict';
  if(window.__turkogluPrintFixInstalled)return;
  window.__turkogluPrintFixInstalled=true;

  const STYLE_ID='turkoglu-print-isolation';
  const CLASS='turkoglu-print-mode';

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      @media print {
        body.${CLASS} > * { visibility:hidden !important; }
        body.${CLASS} #printPage,
        body.${CLASS} #printPage * { visibility:visible !important; }
        body.${CLASS} #printPage {
          display:block !important;
          position:absolute !important;
          left:0 !important;
          top:0 !important;
          width:100% !important;
          max-width:none !important;
          margin:0 !important;
          padding:0 !important;
          background:#fff !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function beforePrint(){
    installStyle();
    document.body.classList.add(CLASS);
  }

  function afterPrint(){
    document.body.classList.remove(CLASS);
  }

  installStyle();
  window.addEventListener('beforeprint',beforePrint);
  window.addEventListener('afterprint',afterPrint);
})();
