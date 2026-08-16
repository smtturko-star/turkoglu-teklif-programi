/* Kullanıcının onayladığı 1. kaşe+imza tasarımını teklif PDF'sine uygular. */
(function(){
  'use strict';
  if(window.__tkSignatureReferenceInstalled)return;
  window.__tkSignatureReferenceInstalled=true;

  const SRC='./tk-stamp-signature.svg';

  function apply(){
    const root=document.getElementById('quotePrint');
    if(!root)return;
    const wrap=root.querySelector('.tk-stamp-wrap');
    if(!wrap)return;
    if(wrap.dataset.referenceSignature==='1')return;
    wrap.dataset.referenceSignature='1';
    wrap.innerHTML='';
    wrap.className='tk-stamp-wrap tk-approved-reference';
    const img=document.createElement('img');
    img.src=SRC;
    img.alt='TÜRKOĞLU ELEKTRİK ELEKTRONİK kaşe ve imza';
    img.className='tk-approved-stamp-signature';
    wrap.appendChild(img);
  }

  function style(){
    if(document.getElementById('tk-approved-reference-style'))return;
    const s=document.createElement('style');
    s.id='tk-approved-reference-style';
    s.textContent=`
      #quotePrint .tk-stamp-wrap.tk-approved-reference{
        position:absolute !important;
        left:50% !important;
        top:54% !important;
        width:92% !important;
        max-width:551px !important;
        height:auto !important;
        aspect-ratio:551/177 !important;
        transform:translate(-50%,-50%) !important;
        border:0 !important;
        box-shadow:none !important;
        background:transparent !important;
        color:inherit !important;
        opacity:1 !important;
        filter:none !important;
        mix-blend-mode:normal !important;
        overflow:visible !important;
      }
      #quotePrint .tk-approved-stamp-signature{
        display:block !important;
        width:100% !important;
        height:100% !important;
        object-fit:contain !important;
        object-position:center !important;
        transform:none !important;
        mix-blend-mode:multiply !important;
        opacity:.93 !important;
      }
      @media print{
        #quotePrint .tk-approved-stamp-signature{
          print-color-adjust:exact !important;
          -webkit-print-color-adjust:exact !important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function boot(){
    style();
    apply();
    const target=document.getElementById('quotePrint');
    if(!target){setTimeout(boot,250);return;}
    let timer=0;
    new MutationObserver(()=>{
      clearTimeout(timer);
      timer=setTimeout(apply,30);
    }).observe(target,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
