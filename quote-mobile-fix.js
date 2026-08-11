/* Teklif ekranı: ürün işlemleri üstte, kompakt satır, çalışan pencere kontrolleri. */
(function(){
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #modalBox #qitems{width:100%;}
    #modalBox #qitems th,#modalBox #qitems td{padding:6px 5px;vertical-align:middle;}
    #modalBox #qitems th:nth-child(1){width:31%;}
    #modalBox #qitems th:nth-child(2){width:10%;}
    #modalBox #qitems th:nth-child(3){width:9%;}
    #modalBox #qitems th:nth-child(4){width:15%;}
    #modalBox #qitems th:nth-child(5){width:11%;}
    #modalBox #qitems th:nth-child(6){width:18%;}
    #modalBox #qitems th:nth-child(7){width:6%;}
    #modalBox #qitems input,#modalBox #qitems select{box-sizing:border-box;margin:0;height:36px;}
    #modalBox #qitems td:nth-child(2) input{width:64px!important;max-width:100%;}
    #modalBox #qitems td:nth-child(3) .quote-unit{display:inline-flex;min-width:34px;height:36px;align-items:center;justify-content:center;font-weight:850;color:#0f766e;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:0 7px;white-space:nowrap;}
    #modalBox #qitems td:nth-child(4) input{width:105px!important;max-width:100%;}
    #modalBox #qitems td:nth-child(5) select{width:72px!important;max-width:100%;}
    #modalBox #qitems td:nth-child(7) button{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;}
    #modalBox .quote-selected-title{display:none!important;}
    #modalBox .quote-selected-box{margin-bottom:14px!important;}
    #modalBox .quote-product-picker{margin-bottom:14px;}
    #modalBox .quote-window-actions{display:flex;gap:6px;margin-left:auto;margin-right:8px;align-items:center;}
    #modalBox.quote-maximized-box{width:calc(100vw - 24px)!important;max-width:none!important;height:calc(100vh - 24px)!important;max-height:none!important;}
    #modal.quote-minimized .modalbox.quote-minimized-box{display:none!important;}
    #modal.quote-minimized{background:transparent!important;pointer-events:none!important;}
    #quoteMinimizedBar{pointer-events:auto;}
    @media(max-width:760px){
      #modalBox{width:100%!important;padding:12px!important;}
      #modalBox #qitems{table-layout:fixed;min-width:0;}
      #modalBox #qitems th,#modalBox #qitems td{padding:4px 3px;font-size:11px;}
      #modalBox #qitems th:nth-child(1){width:29%;}
      #modalBox #qitems th:nth-child(2){width:13%;}
      #modalBox #qitems th:nth-child(3){width:10%;}
      #modalBox #qitems th:nth-child(4){width:17%;}
      #modalBox #qitems th:nth-child(5){width:12%;}
      #modalBox #qitems th:nth-child(6){width:13%;}
      #modalBox #qitems th:nth-child(7){width:6%;}
      #modalBox #qitems td:nth-child(2) input{width:48px!important;padding:6px 4px;}
      #modalBox #qitems td:nth-child(3) .quote-unit{min-width:30px;height:32px;padding:0 4px;font-size:10px;}
      #modalBox #qitems td:nth-child(4) input{width:70px!important;padding:6px 4px;}
      #modalBox #qitems td:nth-child(5) select{width:55px!important;padding:6px 3px;}
      #modalBox #qitems td:nth-child(7) button{width:28px;height:30px;}
    }
  `;
  document.head.appendChild(style);

  function quoteUnit(item){
    const text = `${item?.product_name||''} ${item?.product_model||''}`.toLocaleLowerCase('tr-TR');
    if(/kablolu\s*bnc/.test(text) || /kablo\s*test/.test(text) || /kablo\s*test\s*cihaz/.test(text)) return 'Adet';
    if(/kablo\s*kanal/.test(text) || /kablo/.test(text)) return 'mt';
    return 'Adet';
  }

  function installRenderFix(){
    if(typeof window.renderQuoteDraft !== 'function' || window.renderQuoteDraft.__compactUnitFixV2) return;
    const original = window.renderQuoteDraft;
    function wrappedRenderQuoteDraft(){
      original.apply(this, arguments);
      const items = window.quoteDraft?.items || [];
      const table = document.querySelector('#qitems')?.closest('table');
      if(!table) return;
      const head = table.querySelector('thead tr');
      if(head && head.children.length === 6){
        const h = document.createElement('th');
        h.textContent = 'Birim';
        head.insertBefore(h, head.children[2]);
        head.children[3].textContent = 'Birim Fiyat';
      }
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row,index)=>{
        if(!items[index]) return;
        const cells = row.children;
        if(cells.length < 6) return;
        if(cells.length === 6){
          const unitCell = document.createElement('td');
          const unit = document.createElement('span');
          unit.className = 'quote-unit';
          unit.textContent = quoteUnit(items[index]);
          unitCell.appendChild(unit);
          row.insertBefore(unitCell, cells[2]);
        } else {
          const unit = cells[2].querySelector('.quote-unit');
          if(unit) unit.textContent = quoteUnit(items[index]);
        }
      });
      moveSelectedTop();
    }
    wrappedRenderQuoteDraft.__compactUnitFixV2 = true;
    window.renderQuoteDraft = wrappedRenderQuoteDraft;
  }

  function moveSelectedTop(){
    const modal=document.getElementById('modalBox');
    const picker=document.getElementById('quoteProducts');
    const qitems=document.getElementById('qitems');
    if(!modal || !picker || !qitems) return;
    const pickerBox=picker.closest('.card') || picker.parentElement;
    const tableBox=qitems.closest('.tablewrap') || qitems.closest('.card') || qitems.parentElement;
    if(!pickerBox || !tableBox || tableBox===pickerBox) return;
    const parent=pickerBox.parentElement;
    if(!parent) return;
    if(tableBox.parentElement!==parent) parent.insertBefore(tableBox,pickerBox);
    else if(tableBox.nextElementSibling!==pickerBox) parent.insertBefore(tableBox,pickerBox);
    tableBox.classList.add('quote-selected-box');
    const oldTitle=modal.querySelector('.quote-selected-title');
    if(oldTitle) oldTitle.remove();
  }

  function installWindowControls(){
    const modal=document.getElementById('modalBox');
    const overlay=document.getElementById('modal');
    if(!modal || !overlay) return;
    const head=modal.querySelector('.modalhead');
    if(!head || !modal.querySelector('#qitems')) return;
    if(head.dataset.quoteWindowControls==='1') return;
    head.dataset.quoteWindowControls='1';
    const close=head.querySelector('.close');
    const actions=document.createElement('div');
    actions.className='quote-window-actions';
    actions.innerHTML='<button type="button" class="light" title="Küçült" aria-label="Küçült">−</button><button type="button" class="light" title="Tam ekran" aria-label="Tam ekran">⛶</button>';
    head.insertBefore(actions,close||null);
    const minBtn=actions.children[0], maxBtn=actions.children[1];
    minBtn.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      overlay.classList.add('quote-minimized');
      modal.classList.add('quote-minimized-box');
      let bar=document.getElementById('quoteMinimizedBar');
      if(!bar){
        bar=document.createElement('button');
        bar.id='quoteMinimizedBar';bar.type='button';bar.textContent='🧾 Teklif — devam et';bar.title='Teklifi geri aç';
        document.body.appendChild(bar);
        bar.addEventListener('click',function(){overlay.classList.remove('quote-minimized');modal.classList.remove('quote-minimized-box');bar.remove();});
      }
    });
    maxBtn.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      modal.classList.toggle('quote-maximized-box');
      maxBtn.textContent=modal.classList.contains('quote-maximized-box')?'⛶':'⛶';
    });
  }

  function boot(){
    installRenderFix();
    installWindowControls();
    moveSelectedTop();
  }

  boot();
  [100,300,700,1200].forEach(t=>setTimeout(boot,t));
  const observer=new MutationObserver(()=>boot());
  observer.observe(document.body,{childList:true,subtree:true});
})();