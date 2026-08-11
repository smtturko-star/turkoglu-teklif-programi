/* Teklif ürün seçimi ve teklif satırı yardımcıları. */
(function(){
  'use strict';

  const norm = v => String(v ?? '').trim().toLocaleLowerCase('tr-TR');
  const products = () => Array.isArray(window.products) ? window.products : [];
  const subOf = p => String(p?.subcategory ?? p?.sub_category ?? p?.altCategory ?? p?.alt_category ?? p?.altKategori ?? '').trim();
  const unitOf = p => norm(p?.unit ?? p?.birim ?? p?.unit_name ?? p?.unitName ?? p?.olcuBirimi ?? '');
  const isMeterProduct = p => {
    if(!p) return false;
    const u = unitOf(p);
    if(/metre|meter|^mt$|^m$/.test(u)) return true;
    const name = norm(p?.name);
    const cat = norm(p?.category);
    if(/kablo kanalı|kablo kanali/.test(name)) return true;
    if(/kablo/.test(name) && !/bnc/.test(name)) return true;
    if(/kablo|kablo kanalı|kablo kanali/.test(cat) && !/bnc/.test(name)) return true;
    return false;
  };
  const getModal = () => document.getElementById('modalBox');
  const getOverlay = () => document.getElementById('modal');
  const getPicker = () => document.getElementById('quoteProducts');

  function findProduct(card){
    const list = products();
    const raw = card?.getAttribute('onclick') || '';
    const m = raw.match(/addQuoteItem\s*\(\s*['\"]?([^'\")]+)['\"]?\s*\)/i);
    if(m){
      const p = list.find(x => String(x.id) === String(m[1]));
      if(p) return p;
    }
    const text = norm(card?.textContent);
    return list.find(p => text.includes(norm(p.name)) && (!p.model || text.includes(norm(p.model)))) || null;
  }

  function findRowProduct(row){
    const list = products();
    const id = row?.dataset?.productId || row?.getAttribute('data-product-id');
    if(id){
      const p = list.find(x => String(x.id) === String(id));
      if(p) return p;
    }
    const text = norm(row?.textContent || '');
    return list.find(p => text.includes(norm(p.name)) && (!p.model || text.includes(norm(p.model)))) || null;
  }

  function moveSelected(){
    const modal = getModal(), picker = getPicker();
    if(!modal || !picker) return;
    const pickerParent = picker.closest('.card') || picker.parentElement;
    if(!pickerParent) return;
    const tables = [...modal.querySelectorAll('table')];
    const table = tables.find(t => t !== picker.closest('table') && [...t.querySelectorAll('tr')].some(r => {
      const txt = norm(r.textContent || '');
      return /×|\bx\b|sil|kaldır/.test(txt) || r.querySelector('[onclick*="remove"],[onclick*="delete"],[aria-label="×"]');
    }));
    if(!table) return;
    const box = table.closest('.card') || table.parentElement;
    if(!box || box === pickerParent || box === picker || !box.parentElement) return;
    if(!box.dataset.quoteSelectedBox){
      box.dataset.quoteSelectedBox = '1';
      const title = document.createElement('div');
      title.className = 'quote-selected-title';
      title.innerHTML = '<strong>Teklife Eklenen Ürünler</strong><span class="muted"> Eklediğiniz ürünleri burada görebilirsiniz.</span>';
      box.parentElement.insertBefore(title, box);
    }
    const parent = pickerParent.parentElement || modal;
    if(box.parentElement !== parent) parent.insertBefore(box, pickerParent);
    else if(box.nextElementSibling !== pickerParent) parent.insertBefore(box, pickerParent);
    box.style.border = '2px solid #0f766e';
    box.style.background = '#f8fffd';
    box.style.marginBottom = '16px';
  }

  function setOptions(select, placeholder, values, keep){
    if(!select) return;
    const wanted = String(keep ?? 'all');
    select.replaceChildren(new Option(placeholder, 'all'));
    values.forEach(v => select.add(new Option(v, v)));
    select.value = values.some(v => String(v) === wanted) ? wanted : 'all';
  }

  function removeDuplicateClearButtons(bar){
    if(!bar) return null;
    const buttons = [...bar.querySelectorAll('button')].filter(b => norm(b.textContent).replace(/\s+/g,' ') === 'filtreleri temizle');
    const keep = buttons[0] || null;
    buttons.slice(1).forEach(b => b.remove());
    return keep;
  }

  function ensureSelect(bar, id){
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement('select');
      el.id = id;
      el.style.maxWidth = '210px';
      bar.appendChild(el);
    }
    return el;
  }

  function applyFilters(){
    const box = getPicker();
    if(!box) return;
    const input = document.getElementById('quoteProductSearch');
    const brand = document.getElementById('quoteProductBrandFilter');
    const cat = document.getElementById('quoteProductCategoryFilter');
    const sub = document.getElementById('quoteProductSubcategoryFilter');
    const stock = document.getElementById('quoteProductStockFilter');
    const q = norm(input?.value), b = norm(brand?.value || 'all'), c = norm(cat?.value || 'all');
    const sb = norm(sub?.value || 'all'), s = norm(stock?.value || 'all');
    box.querySelectorAll('.p').forEach(card => {
      const p = findProduct(card), text = norm(card.textContent);
      const vals = [text,norm(p?.name),norm(p?.model),norm(p?.brand),norm(p?.category),norm(subOf(p))];
      const qty = Number(p?.stock ?? 0);
      const searchOK = !q || vals.some(v => v.includes(q));
      const brandOK = b === 'all' || norm(p?.brand) === b;
      const catOK = c === 'all' || norm(p?.category) === c;
      const subOK = sb === 'all' || norm(subOf(p)) === sb;
      const stockOK = s === 'all' || (s === 'available' ? qty > 0 : s === 'low' ? qty > 0 && qty <= 5 : s === 'zero' ? qty <= 0 : true);
      card.hidden = !(searchOK && brandOK && catOK && subOK && stockOK);
      card.style.display = card.hidden ? 'none' : '';
    });
  }

  function refreshSubcategory(){
    const cat = document.getElementById('quoteProductCategoryFilter'), sub = document.getElementById('quoteProductSubcategoryFilter');
    if(!cat || !sub) return;
    const keep = sub.value;
    const values = [...new Set(products().filter(p => cat.value === 'all' || norm(p.category) === norm(cat.value)).map(subOf).filter(Boolean))].sort((a,b) => a.localeCompare(b,'tr'));
    setOptions(sub, 'Tüm alt kategoriler', values, keep);
  }

  function initFilters(){
    const input = document.getElementById('quoteProductSearch'), box = getPicker();
    if(!input || !box || box.dataset.quoteFilterInit === '1') return;
    const bar = input.parentElement;
    if(!bar) return;
    box.dataset.quoteFilterInit = '1';
    const brand = ensureSelect(bar, 'quoteProductBrandFilter');
    const cat = ensureSelect(bar, 'quoteProductCategoryFilter');
    const sub = ensureSelect(bar, 'quoteProductSubcategoryFilter');
    const stock = ensureSelect(bar, 'quoteProductStockFilter');
    let clear = removeDuplicateClearButtons(bar);
    if(!clear){
      clear = document.createElement('button');
      clear.type = 'button'; clear.className = 'light'; clear.textContent = 'Filtreleri Temizle'; bar.appendChild(clear);
    }
    clear.id = 'quoteFilterClear';
    const list = products();
    setOptions(brand, 'Tüm markalar', [...new Set(list.map(p => String(p.brand || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(cat, 'Tüm kategoriler', [...new Set(list.map(p => String(p.category || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(sub, 'Tüm alt kategoriler', [...new Set(list.map(subOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(stock, 'Tüm stoklar', ['Stokta var','Düşük stok','Stok yok'], 'all');
    stock.options[1].value='available'; stock.options[2].value='low'; stock.options[3].value='zero';
    input.addEventListener('input', applyFilters);
    brand.addEventListener('change', applyFilters);
    cat.addEventListener('change', () => { refreshSubcategory(); applyFilters(); });
    sub.addEventListener('change', applyFilters);
    stock.addEventListener('change', applyFilters);
    clear.addEventListener('click', () => { input.value=''; brand.value='all'; cat.value='all'; sub.value='all'; stock.value='all'; refreshSubcategory(); applyFilters(); });
    applyFilters();
  }

  function cardClick(){
    const box=getPicker();
    if(!box || box.dataset.quoteClickFix==='1') return;
    box.dataset.quoteClickFix='1';
    box.addEventListener('click', ev => {
      const card=ev.target.closest('.p');
      if(!card || ev.target.closest('button,a,input,select')) return;
      const p=findProduct(card);
      if(!p) return;
      const raw=card.getAttribute('onclick') || '';
      if(!raw && typeof window.addQuoteItem==='function') window.addQuoteItem(p.id);
    });
  }

  /* Teklif kalemi silme: tek event sahibi. Capture kullanılmaz; mevcut satır davranışını ezmez. */
  function removeFix(){
    const modal=getModal();
    if(!modal || modal.dataset.quoteRemoveFix==='1') return;
    modal.dataset.quoteRemoveFix='1';
    modal.addEventListener('click', ev => {
      const el=ev.target.closest('button,a,[role="button"]');
      if(!el || !modal.contains(el)) return;
      const label=norm(el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent).replace(/\s+/g,'');
      if(label!=='×' && label!=='x') return;
      const row=el.closest('#qitems tr');
      const rows=[...modal.querySelectorAll('#qitems tr')];
      const index=row ? rows.indexOf(row) : -1;
      if(index < 0 || !Array.isArray(window.quoteDraft?.items)) return;
      ev.preventDefault();
      ev.stopPropagation();
      window.quoteDraft.items.splice(index,1);
      if(typeof window.renderQuoteDraft==='function') window.renderQuoteDraft();
      setTimeout(moveSelected,0);
    });
  }

  /* Teklif içindeki alanlar: modalın kapanma mekanizmasına ve üst click handler'larına ulaşmaz. */
  function protectQuoteFields(){
    const modal=getModal();
    if(!modal || modal.dataset.quoteFieldFix==='1') return;
    modal.dataset.quoteFieldFix='1';
    const stop = ev => {
      const target = ev.target.closest('#qitems input,#qitems select,#qitems textarea,#qitems button');
      if(!target) return;
      ev.stopPropagation();
    };
    ['pointerdown','mousedown','click','touchstart'].forEach(type => modal.addEventListener(type, stop, true));

    const syncUnits = () => {
      const rows = [...modal.querySelectorAll('#qitems tr')];
      rows.forEach(row => {
        const p = findRowProduct(row);
        if(!p) return;
        const meter = isMeterProduct(p);
        row.dataset.quoteUnit = meter ? 'mt' : 'Adet';
        row.querySelectorAll('select').forEach(sel => {
          const opts = [...sel.options].map(o => norm(o.textContent));
          const hasUnitOptions = opts.some(v => /adet|mt|metre|meter/.test(v));
          if(!hasUnitOptions) return;
          const wanted = meter ? ['mt','metre','meter'] : ['adet'];
          const option = [...sel.options].find(o => wanted.includes(norm(o.textContent)) || wanted.includes(norm(o.value)));
          if(option && sel.value !== option.value) sel.value = option.value;
        });
        const number = row.querySelector('input[type="number"]');
        if(number){
          const holder = number.parentElement;
          if(holder && !holder.querySelector('.quote-unit-suffix')){
            const suffix = document.createElement('span');
            suffix.className='quote-unit-suffix';
            suffix.textContent=meter?'mt':'Adet';
            suffix.style.cssText='margin-left:6px;font-weight:800;color:#0f766e;white-space:nowrap';
            holder.style.display='flex';
            holder.style.alignItems='center';
            holder.appendChild(suffix);
          } else if(holder){
            const suffix=holder.querySelector('.quote-unit-suffix');
            if(suffix) suffix.textContent=meter?'mt':'Adet';
          }
        }
      });
      syncPrintUnits();
    };

    const syncPrintUnits = () => {
      const root=document.getElementById('printPage') || document;
      root.querySelectorAll('table').forEach(table => {
        const headers=[...table.querySelectorAll('thead th')].map(th=>norm(th.textContent));
        const qtyIndex=headers.findIndex(h=>h==='adet'||h==='miktar'||h.includes('miktar'));
        if(qtyIndex<0) return;
        [...table.querySelectorAll('tbody tr')].forEach(row=>{
          const p=findRowProduct(row);
          if(!p || !isMeterProduct(p)) return;
          const cell=row.children[qtyIndex];
          if(!cell || cell.dataset.quoteUnitDone==='1') return;
          const raw=cell.textContent.trim();
          if(!raw || /mt$/i.test(raw)) return;
          cell.textContent=raw+' mt';
          cell.dataset.quoteUnitDone='1';
        });
      });
    };

    modal.addEventListener('input', ev => {
      if(ev.target.closest('#qitems')) setTimeout(syncUnits,0);
    }, true);
    modal.addEventListener('change', ev => {
      if(ev.target.closest('#qitems')) setTimeout(syncUnits,0);
    }, true);

    const observer=new MutationObserver(()=>syncUnits());
    observer.observe(modal,{childList:true,subtree:true});
    const printObserver=new MutationObserver(()=>syncPrintUnits());
    printObserver.observe(document.body,{childList:true,subtree:true});
    syncUnits();
  }

  function installQuoteWindow(){
    const modal=getModal(), overlay=getOverlay();
    if(!modal || !overlay || modal.dataset.quoteWindowInit==='1') return;
    modal.dataset.quoteWindowInit='1';
    overlay.addEventListener('click', ev => {
      if(ev.target === overlay){
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
      }
    }, true);
    const addControls = () => {
      const head=modal.querySelector('.modalhead');
      const title=head?.querySelector('h2');
      if(!head || !title) return;
      const isQuote=/teklif/i.test(title.textContent||'') || !!modal.querySelector('#qitems');
      if(!isQuote || head.dataset.quoteWindowControls==='1') return;
      head.dataset.quoteWindowControls='1';
      const actions=document.createElement('div');
      actions.className='quote-window-actions';
      actions.style.cssText='display:flex;gap:6px;margin-left:auto;margin-right:8px;align-items:center';
      actions.innerHTML='<button type="button" class="light" title="Küçült" aria-label="Küçült" style="width:36px;height:36px;padding:0;font-size:18px">−</button><button type="button" class="light" title="Büyüt" aria-label="Büyüt" style="width:36px;height:36px;padding:0;font-size:17px">⛶</button>';
      const close=head.querySelector('.close');
      head.insertBefore(actions,close||null);
      const minBtn=actions.children[0], maxBtn=actions.children[1];
      minBtn.addEventListener('click', ev => {
        ev.preventDefault(); ev.stopPropagation();
        overlay.classList.add('quote-minimized');
        modal.classList.add('quote-minimized-box');
        let bar=document.getElementById('quoteMinimizedBar');
        if(!bar){
          bar=document.createElement('button');
          bar.id='quoteMinimizedBar'; bar.type='button'; bar.textContent='🧾 Teklif — devam et'; bar.title='Teklifi geri aç';
          bar.style.cssText='position:fixed;right:18px;bottom:18px;z-index:10000;background:#0f172a;color:#fff;border:0;border-radius:12px;padding:11px 16px;font-weight:800;box-shadow:0 8px 24px #0003';
          document.body.appendChild(bar);
          bar.addEventListener('click',()=>{ overlay.classList.remove('quote-minimized'); modal.classList.remove('quote-minimized-box'); bar.remove(); });
        }
      });
      maxBtn.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); modal.classList.toggle('quote-maximized-box'); });
    };
    addControls();
    const observer=new MutationObserver(addControls);
    observer.observe(modal,{childList:true,subtree:true});
  }

  function addQuoteWindowStyles(){
    if(document.getElementById('quoteWindowStyles')) return;
    const style=document.createElement('style');
    style.id='quoteWindowStyles';
    style.textContent='.modal:has(.quote-minimized-box){background:transparent!important;pointer-events:none}.modal .quote-minimized-box{display:none!important}.modal .quote-maximized-box{width:calc(100vw - 28px)!important;max-width:none!important;height:calc(100vh - 28px)!important;max-height:none!important}.modal .quote-maximized-box{pointer-events:auto}.modal:has(.quote-maximized-box){padding:14px}.modal:has(.quote-maximized-box) .quote-maximized-box{overflow:auto}.quote-unit-suffix{font-size:12px}';
    document.head.appendChild(style);
  }

  function observeLayout(){
    const modal=getModal();
    if(!modal || modal.dataset.quoteLayoutObserver==='1') return;
    modal.dataset.quoteLayoutObserver='1';
    let queued=false;
    const schedule=()=>{ if(queued)return; queued=true; requestAnimationFrame(()=>{queued=false; moveSelected(); installQuoteWindow(); protectQuoteFields();}); };
    new MutationObserver(schedule).observe(modal,{childList:true,subtree:true});
  }

  function boot(){
    const modal=getModal();
    if(!modal) return false;
    addQuoteWindowStyles();
    initFilters(); cardClick(); removeFix(); installQuoteWindow(); protectQuoteFields(); observeLayout(); moveSelected();
    return true;
  }
  function start(){
    if(boot()) return;
    const timer=setInterval(()=>{if(boot())clearInterval(timer);},150);
    setTimeout(()=>clearInterval(timer),10000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
  window.turkogluQuoteFix={apply:applyFilters,moveSelected};
})();