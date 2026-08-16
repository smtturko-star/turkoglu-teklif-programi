/* Teklif yazdırma: A4'e daha sıkı yerleşim + onaylanan imza formu. */
(function(){
  'use strict';
  if(window.__tkQuotePrintTuningInstalled)return;
  window.__tkQuotePrintTuningInstalled=true;

  function install(){
    if(document.getElementById('tk-quote-print-tuning'))return;
    const s=document.createElement('style');
    s.id='tk-quote-print-tuning';
    s.textContent=`
      @media print{
        @page{size:A4 portrait;margin:6mm 7mm}
        html,body{margin:0!important;padding:0!important;background:#fff!important}
        #printPage{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
        #quotePrint{width:100%!important;margin:0!important;padding:0!important;font-size:10px!important}
        #quotePrint .tk-quote-shell{border:0!important;border-radius:0!important;box-shadow:none!important}
        #quotePrint .tk-quote-accent{height:3px!important}
        #quotePrint .tk-quote-inner{padding:4mm 4mm 3mm!important}
        #quotePrint .qhead{padding-bottom:9px!important;gap:12px!important}
        #quotePrint .qhead h2{font-size:18px!important;margin:3px 0!important}
        #quotePrint .qhead b{font-size:8px!important}
        #quotePrint .qhead .muted{font-size:9px!important;line-height:1.35!important}
        #quotePrint .qlogo{max-width:105px!important;max-height:55px!important}
        #quotePrint .tk-quote-meta{min-width:130px!important}
        #quotePrint .tk-quote-meta .tk-label{font-size:8px!important;margin-bottom:2px!important}
        #quotePrint .tk-quote-meta .tk-number{font-size:15px!important;margin-bottom:3px!important}
        #quotePrint .tk-quote-meta .tk-date{font-size:9px!important;line-height:1.3!important}
        #quotePrint .tk-customer-box{margin-bottom:9px!important;padding:8px 10px!important;border-radius:9px!important}
        #quotePrint .tk-customer-label{font-size:8px!important;margin-bottom:2px!important}
        #quotePrint .tk-customer-name{font-size:12px!important}
        #quotePrint .tk-customer-meta{font-size:9px!important;line-height:1.3!important}
        #quotePrint table{margin-top:4px!important;border-radius:9px!important}
        #quotePrint thead th{font-size:8px!important;padding:6px 6px!important}
        #quotePrint tbody td{padding:6px 6px!important;font-size:9.5px!important;line-height:1.2!important}
        #quotePrint tbody td:first-child{width:48px!important}
        #quotePrint tbody .thumb{width:38px!important;height:31px!important;border-radius:5px!important}
        #quotePrint .summary{margin-top:8px!important;padding:7px 10px!important;max-width:310px!important;border-radius:8px!important}
        #quotePrint .summary span,#quotePrint .summary strong{font-size:9.5px!important}
        #quotePrint .summary strong.total{font-size:16px!important}
        #quotePrint .tk-note-box,#quotePrint .tk-bank-box{margin-top:8px!important;padding:8px 10px!important;border-radius:8px!important}
        #quotePrint .tk-note-box p,#quotePrint .tk-bank-line{font-size:9px!important;line-height:1.35!important}
        #quotePrint .tk-footer{margin-top:9px!important;padding-top:7px!important;font-size:8px!important;line-height:1.35!important}

        #quotePrint .tk-signature-section{margin-top:10px!important;gap:9px!important}
        #quotePrint .tk-sign-box{min-height:132px!important;height:132px!important;padding:9px 11px!important;border-radius:9px!important}
        #quotePrint .tk-sign-title{font-size:8px!important}
        #quotePrint .tk-sign-sub{font-size:7px!important;margin-top:2px!important}
        #quotePrint .tk-stamp-wrap{width:245px!important;height:102px!important;top:58%!important;left:50%!important;transform:translate(-50%,-50%) rotate(-2.5deg)!important}
        #quotePrint .tk-real-stamp{padding:8px 10px!important;border-width:1.8px!important}
        #quotePrint .tk-stamp-main{font-size:9px!important}
        #quotePrint .tk-stamp-sub{font-size:6px!important;margin-top:3px!important}
        #quotePrint .tk-stamp-person{font-size:5.7px!important;margin-top:3px!important}
        #quotePrint .tk-stamp-email{font-size:5.2px!important;margin-top:2px!important}
        #quotePrint .tk-stamp-signature{height:86px!important;left:-5px!important;right:-9px!important;bottom:-13px!important;transform:rotate(-6deg)!important}
        #quotePrint .tk-stamp-signature .main{stroke-width:3!important}
        #quotePrint .tk-stamp-signature .double{stroke-width:1.8!important}
        #quotePrint .tk-stamp-signature .fine{stroke-width:1.25!important}
        #quotePrint .tk-signature-legend{left:11px!important;bottom:8px!important;font-size:6.5px!important}
        #quotePrint .tk-approval-space{height:55px!important;margin-top:13px!important}
        #quotePrint .tk-approval-space:after{font-size:6.5px!important;bottom:-12px!important}
        #quotePrint .tk-sign-name{margin-top:15px!important;font-size:8px!important}
        #quotePrint .tk-approval-note{margin-top:6px!important;padding:5px 7px!important;font-size:6.5px!important}
        #quotePrint .tk-company-footer{margin-top:9px!important;padding:6px 2px 1px!important;gap:8px!important}
        #quotePrint .tk-contact-item{font-size:6.5px!important;gap:4px!important}
        #quotePrint .tk-contact-icon{font-size:10px!important}
        #quotePrint .tk-company-contact{gap:9px!important}
        #quotePrint .tk-company-slogan{font-size:11px!important}
        #quotePrint .tk-signature-section,#quotePrint .tk-sign-box,#quotePrint .tk-company-footer{break-inside:avoid!important;page-break-inside:avoid!important}
      }
    `;
    document.head.appendChild(s);
  }

  function refreshSignature(){
    const root=document.getElementById('quotePrint');
    const svg=root?.querySelector('.tk-stamp-signature');
    if(!svg)return;
    /* Gönderdiğin son görseldeki imzaya daha yakın: uzun tek çizgi, güçlü yükselişler ve sağa uzayan bitiş. */
    svg.setAttribute('viewBox','0 0 560 170');
    svg.innerHTML=`
      <path class="main" d="M8 130 C48 111 67 111 96 100 C116 92 119 61 128 55 C138 48 143 72 133 89 C125 102 110 111 119 116 C132 123 157 100 176 82 C190 69 201 42 213 45 C225 48 214 79 201 96 C192 108 187 123 198 128 C212 134 238 103 252 85 C264 70 277 46 289 49 C302 52 295 78 282 94 C270 109 267 122 279 125 C294 129 315 101 330 86 C346 69 358 51 371 55 C384 59 374 83 361 98 C348 113 350 123 363 124 C382 126 400 104 417 91 C435 77 451 63 467 66 C484 69 475 89 462 101 C448 114 456 124 474 123 C495 122 516 108 550 92"/>
      <path class="double" d="M18 145 C76 135 124 132 174 126 C226 120 278 122 330 117 C384 112 431 112 478 104 C507 99 530 96 554 91"/>
      <path class="fine" d="M153 76 C171 47 190 28 205 34 C218 39 213 59 198 74 C181 91 166 110 151 143"/>
      <path class="fine" d="M365 61 C383 35 404 25 418 33 C431 41 424 61 407 76 C391 90 381 108 374 132"/>
      <path class="fine break" d="M430 115 C453 101 478 98 500 101 C521 104 535 100 552 92"/>`;
  }

  install();
  refreshSignature();
  const watch=()=>{refreshSignature();};
  const start=()=>{const r=document.getElementById('quotePrint');if(!r)return setTimeout(start,250);new MutationObserver(()=>requestAnimationFrame(watch)).observe(r,{childList:true,subtree:true});};
  start();
})();
