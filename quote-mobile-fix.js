/* Mobile quote line editor fix. Loaded after quote-fix.js. */
(function(){
  'use strict';
  const q=(s)=>document.querySelector(s);
  const refreshTotals=()=>{
    if(typeof quoteTotals!=='function')return;
    const t=quoteTotals(),box=q('#qtot'); if(!box)return;
    box.innerHTML=`<span>Ara toplam</span><span>${money(t.subtotal)}</span><span>İşçilik</span><span>${money(t.labor)}</span><span>İskonto</span><span>-${money(t.discount)}</span><span>KDV</span><span>${money(t.vat)}</span><strong>GENEL TOPLAM</strong><strong>${money(t.total)}</strong>`;
  };
  const render=()=>{
    const el=q('#qitems'); if(!el)return;
    el.innerHTML=(quoteDraft.items||[]).map((i,n)=>`<tr>
      <td><b>${esc(i.product_name)}</b><br><span class="muted">${esc(i.product_model)}</span></td>
      <td><input class="qfix-qty" data-i="${n}" type="number" min="1" step="1" inputmode="numeric" value="${Math.max(1,Math.floor(num(i.quantity)))}"></td>
      <td><input class="qfix-price" data-i="${n}" type="number" min="0" step="0.01" inputmode="decimal" value="${num(i.unit_price)}"></td>
      <td><select class="qfix-vat" data-i="${n}"><option value="20" ${num(i.vat_rate)===20?'selected':''}>%20</option><option value="10" ${num(i.vat_rate)===10?'selected':''}>%10</option><option value="1" ${num(i.vat_rate)===1?'selected':''}>%1</option></select></td>
      <td class="qfix-total">${money(num(i.quantity)*num(i.unit_price))}</td>
      <td><button type="button" class="red qfix-remove" data-i="${n}" aria-label="Ürünü sil">×</button></td>
    </tr>`).join('')||emptyRow(6,'Henüz ürün eklenmedi.');
    refreshTotals();
  };
  const update=(el)=>{
    const i=quoteDraft.items?.[Number(el.dataset.i)]; if(!i)return;
    if(el.classList.contains('qfix-qty'))i.quantity=Math.max(1,Math.floor(Number(el.value)||1));
    if(el.classList.contains('qfix-price'))i.unit_price=Math.max(0,Number(el.value)||0);
    if(el.classList.contains('qfix-vat'))i.vat_rate=Number(el.value)||20;
    const row=el.closest('tr'); if(row)row.querySelector('.qfix-total').textContent=money(num(i.quantity)*num(i.unit_price));
    refreshTotals();
  };
  document.addEventListener('input',e=>{if(e.target.matches('#qitems .qfix-qty,#qitems .qfix-price'))update(e.target);});
  document.addEventListener('change',e=>{if(e.target.matches('#qitems .qfix-qty,#qitems .qfix-price,#qitems .qfix-vat'))update(e.target);});
  document.addEventListener('click',e=>{
    const b=e.target.closest('#qitems .qfix-remove'); if(!b)return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const i=Number(b.dataset.i); if(Number.isInteger(i)&&i>=0&&i<quoteDraft.items.length){quoteDraft.items.splice(i,1);render();}
  },true);
  const original=window.renderQuoteDraft;
  window.renderQuoteDraft=()=>{
    if(q('#qitems'))render(); else if(typeof original==='function')original();
  };
  const style=document.createElement('style');
  style.textContent=`#qitems input,#qitems select,#qitems button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}@media(max-width:650px){#qitems input.qfix-qty{width:68px!important}#qitems input.qfix-price{width:96px!important}#qitems .qfix-vat{min-width:68px}#qitems .qfix-remove{width:42px;height:42px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:20px}}`;
  document.head.appendChild(style);
  const boot=()=>{if(q('#qitems')&&!q('#qitems').dataset.qfixBoot){q('#qitems').dataset.qfixBoot='1';if(typeof window.renderQuoteDraft==='function'&&quoteDraft.items?.length)window.renderQuoteDraft();}};
  new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
  boot();
})();
