/* Teklif kalemleri: adet, birim fiyat, KDV, silme ve metre birimi. */
(function(){
  'use strict';
  const q=s=>document.querySelector(s);
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const meterText=i=>norm(`${i?.product_name??''} ${i?.product_model??''} ${i?.product_category??''} ${i?.category??''} ${i?.unit??''} ${i?.birim??''}`);
  const isMeterItem=i=>{
    const t=meterText(i);
    return /metre|meter|\bmt\b/.test(t)||/kablo kanalı|kablo kanali/.test(t)||(/kablo/.test(t)&&!/bnc/.test(t));
  };
  const refreshTotals=()=>{
    if(typeof quoteTotals!=='function')return;
    const t=quoteTotals(),box=q('#qtot');if(!box)return;
    box.innerHTML=`<span>Ara toplam</span><span>${money(t.subtotal)}</span><span>İşçilik</span><span>${money(t.labor)}</span><span>İskonto</span><span>-${money(t.discount)}</span><span>KDV</span><span>${money(t.vat)}</span><strong>GENEL TOPLAM</strong><strong>${money(t.total)}</strong>`;
  };
  const render=()=>{
    const el=q('#qitems');if(!el||typeof quoteDraft==='undefined')return;
    el.innerHTML=(quoteDraft.items||[]).map((i,n)=>{
      const meter=isMeterItem(i),unit=meter?'mt':'Adet';
      return `<tr data-qindex="${n}">
        <td><b>${esc(i.product_name)}</b><br><span class="muted">${esc(i.product_model)}</span></td>
        <td><div class="qfix-qty-wrap"><input class="qfix-qty" data-i="${n}" type="number" min="1" step="1" inputmode="numeric" value="${Math.max(1,Math.floor(num(i.quantity)))}"><span class="qfix-unit">${unit}</span></div></td>
        <td><input class="qfix-price" data-i="${n}" type="number" min="0" step="0.01" inputmode="decimal" value="${num(i.unit_price)}"></td>
        <td><select class="qfix-vat" data-i="${n}"><option value="20" ${num(i.vat_rate)===20?'selected':''}>%20</option><option value="10" ${num(i.vat_rate)===10?'selected':''}>%10</option><option value="1" ${num(i.vat_rate)===1?'selected':''}>%1</option></select></td>
        <td class="qfix-total">${money(num(i.quantity)*num(i.unit_price))}</td>
        <td><button type="button" class="red qfix-remove" data-i="${n}" aria-label="Ürünü sil" title="Ürünü sil">×</button></td>
      </tr>`;
    }).join('')||emptyRow(6,'Henüz ürün eklenmedi.');
    refreshTotals();
    syncPrintUnits();
  };
  const update=el=>{
    if(typeof quoteDraft==='undefined')return;
    const i=quoteDraft.items?.[Number(el.dataset.i)];if(!i)return;
    if(el.classList.contains('qfix-qty'))i.quantity=Math.max(1,Math.floor(Number(el.value)||1));
    else if(el.classList.contains('qfix-price'))i.unit_price=Math.max(0,Number(el.value)||0);
    else if(el.classList.contains('qfix-vat'))i.vat_rate=Number(el.value)||20;
    const row=el.closest('tr');
    if(row){const total=row.querySelector('.qfix-total');if(total)total.textContent=money(num(i.quantity)*num(i.unit_price));}
    refreshTotals();
    syncPrintUnits();
  };
  const syncPrintUnits=()=>{
    const root=q('#quotePrint');if(!root)return;
    root.querySelectorAll('table tbody tr').forEach(row=>{
      const cells=row.children;if(cells.length<7)return;
      const product=norm(cells[1]?.textContent||'');
      if(!(/kablo kanalı|kablo kanali/.test(product)||(/kablo/.test(product)&&!/bnc/.test(product))))return;
      const qty=cells[3];if(!qty)return;
      const raw=qty.textContent.trim().replace(/\s*(mt|metre|meter)$/i,'');
      if(raw)qty.textContent=raw+' mt';
    });
  };
  const bind=()=>{
    const el=q('#qitems');if(!el||el.dataset.stableQuoteEditor==='1')return;
    el.dataset.stableQuoteEditor='1';
    el.addEventListener('input',e=>{
      const target=e.target.closest('.qfix-qty,.qfix-price');if(!target)return;
      e.stopPropagation();update(target);
    });
    el.addEventListener('change',e=>{
      const target=e.target.closest('.qfix-qty,.qfix-price,.qfix-vat');if(!target)return;
      e.stopPropagation();update(target);
    });
    el.addEventListener('blur',e=>{
      const target=e.target.closest('.qfix-qty,.qfix-price');if(!target)return;
      update(target);
    },true);
    el.addEventListener('click',e=>{
      const remove=e.target.closest('.qfix-remove');if(remove){
        e.preventDefault();e.stopPropagation();
        const i=Number(remove.dataset.i);
        if(Number.isInteger(i)&&i>=0&&i<quoteDraft.items.length){quoteDraft.items.splice(i,1);render();}
        return;
      }
      const field=e.target.closest('.qfix-qty,.qfix-price,.qfix-vat');
      if(field){e.stopPropagation();field.focus();}
    });
  };
  const original=window.renderQuoteDraft;
  window.renderQuoteDraft=()=>{
    if(q('#qitems')){render();bind();}
    else if(typeof original==='function')original();
  };
  const style=document.createElement('style');
  style.textContent=`#qitems input,#qitems select,#qitems button{touch-action:manipulation;-webkit-tap-highlight-color:transparent;position:relative;z-index:2}#qitems .qfix-qty-wrap{display:flex;align-items:center;gap:6px;min-width:0}#qitems .qfix-unit{font-size:12px;font-weight:800;color:#0f766e;white-space:nowrap}#qitems .qfix-qty,#qitems .qfix-price{cursor:text;user-select:text}#qitems .qfix-vat{cursor:pointer}@media(max-width:650px){#qitems input.qfix-qty{width:76px!important}#qitems input.qfix-price{width:100px!important}#qitems .qfix-vat{min-width:70px}#qitems .qfix-remove{width:42px;height:42px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:20px}}`;
  document.head.appendChild(style);
  const boot=()=>{const el=q('#qitems');if(el){bind();if(typeof quoteDraft!=='undefined'&&quoteDraft.items?.length)render();}};
  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
  boot();
})();
