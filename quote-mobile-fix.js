/* Teklif ekranı: sade, tek satır ve mevcut işlem kodlarına dokunmadan. */
(function(){
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #quoteModal #qitems th,#quoteModal #qitems td{padding:7px 6px;vertical-align:middle;}
    #quoteModal #qitems th:nth-child(1){width:34%;}
    #quoteModal #qitems th:nth-child(2){width:12%;}
    #quoteModal #qitems th:nth-child(3){width:18%;}
    #quoteModal #qitems th:nth-child(4){width:12%;}
    #quoteModal #qitems th:nth-child(5){width:18%;}
    #quoteModal #qitems th:nth-child(6){width:6%;}
    #quoteModal #qitems input,#quoteModal #qitems select{box-sizing:border-box;margin:0;height:38px;}
    #quoteModal #qitems td:nth-child(2) input{width:70px!important;max-width:100%;}
    #quoteModal #qitems td:nth-child(3) input{width:105px!important;max-width:100%;}
    #quoteModal #qitems td:nth-child(4) select{width:78px!important;max-width:100%;}
    #quoteModal #qitems td:nth-child(6) button{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;}
    #quoteModal #qitems .quote-unit{display:inline-block;margin-left:5px;font-weight:800;font-size:12px;color:#64748b;white-space:nowrap;}
    @media(max-width:760px){
      #quoteModal .modalbox{width:100%;padding:12px;}
      #quoteModal #qitems{min-width:0;}
      #quoteModal #qitems table{min-width:0;table-layout:fixed;}
      #quoteModal #qitems th,#quoteModal #qitems td{padding:5px 3px;font-size:11px;}
      #quoteModal #qitems th:nth-child(1){width:31%;}
      #quoteModal #qitems th:nth-child(2){width:17%;}
      #quoteModal #qitems th:nth-child(3){width:20%;}
      #quoteModal #qitems th:nth-child(4){width:13%;}
      #quoteModal #qitems th:nth-child(5){width:13%;}
      #quoteModal #qitems th:nth-child(6){width:6%;}
      #quoteModal #qitems td:nth-child(1) .muted{font-size:10px;}
      #quoteModal #qitems td:nth-child(2) input{width:52px!important;padding:7px 5px;}
      #quoteModal #qitems td:nth-child(3) input{width:76px!important;padding:7px 5px;}
      #quoteModal #qitems td:nth-child(4) select{width:58px!important;padding:7px 4px;}
      #quoteModal #qitems .quote-unit{margin-left:2px;font-size:10px;}
      #quoteModal #qitems td:nth-child(6) button{width:28px;height:30px;}
    }
  `;
  document.head.appendChild(style);

  function quoteUnit(item){
    const text = `${item?.product_name||''} ${item?.product_model||''}`.toLocaleLowerCase('tr-TR');
    if(/kablolu\s*bnc/.test(text) || /kablo\s*test/.test(text) || /kablo\s*test\s*cihaz/.test(text)) return 'Adet';
    if(/kablo\s*kanal/.test(text) || /kablo/.test(text)) return 'mt';
    return 'Adet';
  }

  function install(){
    if(typeof window.renderQuoteDraft !== 'function' || window.renderQuoteDraft.__compactUnitFix) return;
    const original = window.renderQuoteDraft;
    function wrappedRenderQuoteDraft(){
      original.apply(this, arguments);
      const items = window.quoteDraft?.items || [];
      const rows = document.querySelectorAll('#qitems tr');
      rows.forEach((row,index)=>{
        const input = row.querySelector('td:nth-child(2) input');
        if(!input || !items[index]) return;
        const cell = input.parentElement;
        let unit = cell.querySelector('.quote-unit');
        if(!unit){
          unit = document.createElement('span');
          unit.className='quote-unit';
          cell.appendChild(unit);
        }
        unit.textContent = quoteUnit(items[index]);
      });
    }
    wrappedRenderQuoteDraft.__compactUnitFix = true;
    window.renderQuoteDraft = wrappedRenderQuoteDraft;
  }

  install();
  setTimeout(install,100);
  setTimeout(install,500);
})();