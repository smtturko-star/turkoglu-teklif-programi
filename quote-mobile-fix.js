/* Teklif ve ürün ekranları: stabil editör, güvenli modal, doğru birim ve görsel iyileştirmeler. */
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

  const refreshTotalsAndUnits=()=>{refreshTotals();syncPrintUnits();};

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
    bindFields();
    refreshTotalsAndUnits();
  };

  const update=el=>{
    if(typeof quoteDraft==='undefined')return;
    const i=quoteDraft.items?.[Number(el.dataset.i)];if(!i)return;
    if(el.classList.contains('qfix-qty'))i.quantity=Math.max(1,Math.floor(Number(el.value)||1));
    else if(el.classList.contains('qfix-price'))i.unit_price=Math.max(0,Number(el.value)||0);
    else if(el.classList.contains('qfix-vat'))i.vat_rate=Number(el.value)||20;
    const row=el.closest('tr');
    if(row){const total=row.querySelector('.qfix-total');if(total)total.textContent=money(num(i.quantity)*num(i.unit_price));}
    refreshTotalsAndUnits();
  };

  const protectTarget=el=>{
    if(!el||el.dataset.quoteTargetProtected==='1')return;
    el.dataset.quoteTargetProtected='1';
    ['click','pointerdown','mousedown','mouseup'].forEach(type=>el.addEventListener(type,e=>e.stopPropagation(),true));
  };

  const bindFields=()=>{
    const el=q('#qitems');if(!el)return;
    el.querySelectorAll('.qfix-qty,.qfix-price,.qfix-vat,.qfix-remove').forEach(protectTarget);
    if(el.dataset.stableQuoteEditor==='1')return;
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
      e.stopPropagation();
      const remove=e.target.closest('.qfix-remove');if(!remove)return;
      e.preventDefault();
      const i=Number(remove.dataset.i);
      if(Number.isInteger(i)&&i>=0&&i<quoteDraft.items.length){quoteDraft.items.splice(i,1);render();}
    });
  };

  const protectModal=()=>{
    const modal=q('#modal'),box=q('#modalBox');
    if(!modal)return;
    if(modal.dataset.stableModalProtection!=='1'){
      modal.dataset.stableModalProtection='1';
      modal.addEventListener('click',e=>{
        if(e.target===modal){e.preventDefault();e.stopImmediatePropagation();}
      },true);
      if(box){
        ['click','pointerdown','mousedown','mouseup'].forEach(type=>box.addEventListener(type,e=>{
          if(e.target!==box)e.stopPropagation();
        },false));
      }
    }
    if(box&&!box.dataset.stableQuoteFieldScan){
      box.dataset.stableQuoteFieldScan='1';
      const scan=()=>box.querySelectorAll('#qitems input,#qitems select,#qitems button').forEach(protectTarget);
      scan();
      new MutationObserver(scan).observe(box,{childList:true,subtree:true});
    }
  };

  const hideCombination=()=>{
    document.querySelectorAll('.card').forEach(card=>{
      const text=norm(card.textContent||'');
      if(text.includes('kamera seti kombinasyonu')||text.includes('ekonomik')&&text.includes('profesyonel')&&text.includes('4 kamera')&&text.includes('16 kamera')){
        card.classList.add('quote-combination-disabled');
      }
    });
  };

  const styleUI=()=>{
    if(document.getElementById('quoteProductUiStyles'))return;
    const style=document.createElement('style');
    style.id='quoteProductUiStyles';
    style.textContent=`
      .quote-combination-disabled{display:none!important}
      #qitems input,#qitems select,#qitems button{touch-action:manipulation;-webkit-tap-highlight-color:transparent;position:relative;z-index:2}
      #qitems .qfix-qty-wrap{display:flex;align-items:center;gap:7px;min-width:0}
      #qitems .qfix-unit{font-size:12px;font-weight:850;color:#0f766e;white-space:nowrap}
      #qitems .qfix-qty,#qitems .qfix-price{cursor:text;user-select:text;min-width:88px}
      #qitems .qfix-vat{cursor:pointer;min-width:78px}
      #qitems .qfix-remove{min-width:40px;min-height:40px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:19px}
      #products .tablewrap,#quotes .tablewrap{box-shadow:0 4px 18px rgba(15,23,42,.05);border-radius:14px}
      #products th,#quotes th{background:#f1f5f9;font-weight:850}
      #products tbody tr:hover,#quotes tbody tr:hover{background:#f8fffd}
      #products .thumb{width:62px;height:52px;border-radius:10px;background:#fff}
      #products td,#quotes td{vertical-align:middle}
      #quoteProducts .p{transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease;background:linear-gradient(180deg,#fff,#fbfdfd)}
      #quoteProducts .p:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(15,118,110,.10);border-color:#0f766e}
      #quoteProducts .p img{border-radius:10px;background:#f8fafc}
      @media(max-width:650px){#qitems input.qfix-qty{width:78px!important}#qitems input.qfix-price{width:105px!important}#qitems .qfix-vat{min-width:72px}#qitems .qfix-remove{width:42px;height:42px}}
    `;
    document.head.appendChild(style);
  };

  const original=window.renderQuoteDraft;
  window.renderQuoteDraft=()=>{
    if(q('#qitems')){render();protectModal();}
    else if(typeof original==='function')original();
  };

  const boot=()=>{
    styleUI();
    hideCombination();
    protectModal();
    const el=q('#qitems');
    if(el){bindFields();if(typeof quoteDraft!=='undefined'&&quoteDraft.items?.length)render();}
  };

  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
  boot();
})();
