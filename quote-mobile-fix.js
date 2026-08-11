/* Teklif ekranı düzeltmesi: Ürün, Adet, Birim Fiyat, KDV, Toplam, × */
(function(){
'use strict';
const style=document.createElement('style');
style.textContent=`
#modalBox #qitems{width:100%;}
#modalBox #qitems th,#modalBox #qitems td{padding:6px 5px;vertical-align:middle;}
#modalBox #qitems th:nth-child(1){width:34%;}#modalBox #qitems th:nth-child(2){width:10%;}#modalBox #qitems th:nth-child(3){width:17%;}#modalBox #qitems th:nth-child(4){width:10%;}#modalBox #qitems th:nth-child(5){width:19%;}#modalBox #qitems th:nth-child(6){width:6%;}
#modalBox #qitems input,#modalBox #qitems select{box-sizing:border-box;margin:0;height:36px;}
#modalBox #qitems td:nth-child(2) input{width:64px!important;max-width:100%;}
#modalBox #qitems td:nth-child(3) input{width:105px!important;max-width:100%;}
#modalBox #qitems td:nth-child(4) select{width:72px!important;max-width:100%;}
#modalBox #qitems td:nth-child(5){white-space:nowrap;}
#modalBox #qitems td:nth-child(6) button{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;}
#modalBox .quote-selected-title{display:none!important;}
#modalBox .quote-selected-box{margin-bottom:14px!important;}
#modalBox .quote-window-actions{display:flex;gap:6px;margin-left:auto;margin-right:8px;align-items:center;}
#modalBox.quote-maximized-box{width:calc(100vw - 24px)!important;max-width:none!important;height:calc(100vh - 24px)!important;max-height:none!important;}
#modal.quote-minimized .modalbox.quote-minimized-box{display:none!important;}#modal.quote-minimized{background:transparent!important;pointer-events:none!important;}#quoteMinimizedBar{pointer-events:auto;}
@media(max-width:760px){
#modalBox{width:100%!important;padding:12px!important;}#modalBox #qitems{table-layout:fixed;min-width:0;}#modalBox #qitems th,#modalBox #qitems td{padding:4px 3px;font-size:11px;}
#modalBox #qitems th:nth-child(1){width:30%;}#modalBox #qitems th:nth-child(2){width:13%;}#modalBox #qitems th:nth-child(3){width:18%;}#modalBox #qitems th:nth-child(4){width:12%;}#modalBox #qitems th:nth-child(5){width:21%;}#modalBox #qitems th:nth-child(6){width:6%;}
#modalBox #qitems td:nth-child(2) input{width:48px!important;padding:6px 4px;}#modalBox #qitems td:nth-child(3) input{width:70px!important;padding:6px 4px;}#modalBox #qitems td:nth-child(4) select{width:55px!important;padding:6px 3px;}#modalBox #qitems td:nth-child(6) button{width:28px;height:30px;}
}`;document.head.appendChild(style);
function quoteUnit(item){
 const text=`${item?.product_name||''} ${item?.product_model||''} ${item?.category||''}`.toLocaleLowerCase('tr-TR');
 /* Hazır/sonlandırılmış kablolar adet kalır. */
 if(/hazır\s*kablo|patch\s*cord|patch\s*kablo|jumper\s*kablo|jumper|kablo\s*seti|kablo\s*set|konfeksiyonlu|konfeksiyon|uçlu\s*kablo|sonlandirilmiş|sonlandırılmış|hdmi|usb\s*kablo|type[- ]?c\s*kablo|displayport|scart/.test(text)) return 'Adet';
 if(/kablolu\s*bnc|kablo\s*test|kablo\s*test\s*cihaz/.test(text)) return 'Adet';
 /* Metraj satılan tüm kablolar ve kablo kanalları mt. */
 if(/kablo\s*kanal|kablo\s*kanalı|kanal\s*25|kanal\s*40/.test(text)) return 'mt';
 if(/kablo|cat\s*[5-7]|cat5|cat6|cat7|coax|koaksiyel|rg59|rg6|fiber|optik\s*fiber|ny[aym]|ttr|n2xh|h05|h07|liy?y|j[- ]?y\(st\)y|alarm\s*kablosu|yangın\s*kablosu|sinyal\s*kablosu|hoparlör\s*kablosu|kamera\s*kablosu|telefon\s*kablosu|elektrik\s*kablosu/.test(text)) return 'mt';
 return 'Adet';
}
function fix(){if(typeof window.renderQuoteDraft!=='function'||window.renderQuoteDraft.__unitV4)return;const original=window.renderQuoteDraft;function wrapped(){original.apply(this,arguments);const items=window.quoteDraft?.items||[];const table=document.querySelector('#qitems')?.closest('table');if(!table)return;const head=table.querySelector('thead tr');if(head){const hs=[...head.children].map(x=>x.textContent.trim());if(hs.length===6){hs[1].textContent='Adet';hs[2].textContent='Birim Fiyat';hs[3].textContent='KDV';hs[4].textContent='Toplam';hs[5].textContent='×';}}table.querySelectorAll('tbody tr').forEach((row,i)=>{const cells=row.children;if(cells.length!==6||!items[i])return;const qty=cells[1];if(qty&&!qty.dataset.unitApplied){const unit=document.createElement('span');unit.textContent=' '+quoteUnit(items[i]);unit.style.fontWeight='700';unit.style.whiteSpace='nowrap';unit.style.marginLeft='4px';qty.appendChild(unit);qty.dataset.unitApplied='1';}});}wrapped.__unitV4=true;window.renderQuoteDraft=wrapped;}
function controls(){const modal=document.getElementById('modalBox'),overlay=document.getElementById('modal');if(!modal||!overlay)return;const head=modal.querySelector('.modalhead');if(!head||!modal.querySelector('#qitems')||head.dataset.quoteWindowControls==='1')return;head.dataset.quoteWindowControls='1';const close=head.querySelector('.close'),actions=document.createElement('div');actions.className='quote-window-actions';actions.innerHTML='<button type="button" class="light" title="Küçült" aria-label="Küçült">−</button><button type="button" class="light" title="Tam ekran" aria-label="Tam ekran">⛶</button>';head.insertBefore(actions,close||null);actions.children[0].onclick=e=>{e.preventDefault();e.stopPropagation();overlay.classList.add('quote-minimized');modal.classList.add('quote-minimized-box');let bar=document.getElementById('quoteMinimizedBar');if(!bar){bar=document.createElement('button');bar.id='quoteMinimizedBar';bar.type='button';bar.textContent='🧾 Teklif — devam et';document.body.appendChild(bar);bar.onclick=()=>{overlay.classList.remove('quote-minimized');modal.classList.remove('quote-minimized-box');bar.remove();};}};actions.children[1].onclick=e=>{e.preventDefault();e.stopPropagation();modal.classList.toggle('quote-maximized-box');};}
function boot(){fix();controls();}boot();[100,300,700,1200].forEach(t=>setTimeout(boot,t));new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();