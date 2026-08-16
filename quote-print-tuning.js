/* Teklif yazdırma: A4'e sıkı yerleşim + büyük onaylı kaşe/imza. */
(function(){
  'use strict';
  if(window.__tkQuotePrintTuningInstalled)return;
  window.__tkQuotePrintTuningInstalled=true;
  function install(){
    if(document.getElementById('tk-quote-print-tuning'))return;
    const s=document.createElement('style');s.id='tk-quote-print-tuning';
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
        #quotePrint .tk-signature-section{margin-top:9px!important;gap:9px!important}
        #quotePrint .tk-sign-box{min-height:150px!important;height:150px!important;padding:8px 10px!important;border-radius:9px!important}
        #quotePrint .tk-sign-title{font-size:8px!important}
        #quotePrint .tk-sign-sub{font-size:7px!important;margin-top:2px!important}
        /* Birinci görseldeki oranı koru: kaşe + büyük imza tek parça ve kutunun ortasında. */
        #quotePrint .tk-exact-stamp{width:430px!important;max-width:94%!important;height:auto!important;left:50%!important;top:58%!important;transform:translate(-50%,-50%)!important}
        #quotePrint .tk-signature-legend{left:10px!important;bottom:6px!important;font-size:6px!important}
        #quotePrint .tk-approval-space{height:52px!important;margin-top:13px!important}
        #quotePrint .tk-approval-space:after{font-size:6.5px!important;bottom:-12px!important}
        #quotePrint .tk-sign-name{margin-top:14px!important;font-size:8px!important}
        #quotePrint .tk-approval-note{margin-top:6px!important;padding:5px 7px!important;font-size:6.5px!important}
        #quotePrint .tk-company-footer{margin-top:8px!important;padding:5px 2px 1px!important;gap:8px!important}
        #quotePrint .tk-contact-item{font-size:6.5px!important;gap:4px!important}
        #quotePrint .tk-contact-icon{font-size:10px!important}
        #quotePrint .tk-company-contact{gap:9px!important}
        #quotePrint .tk-company-slogan{font-size:11px!important}
        #quotePrint .tk-signature-section,#quotePrint .tk-sign-box,#quotePrint .tk-company-footer{break-inside:avoid!important;page-break-inside:avoid!important}
      }
    `;
    document.head.appendChild(s);
  }
  install();
})();
