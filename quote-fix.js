/* Teklif ürün seçimi: Ürünler bölümündeki filtre mantığını teklif ekranına taşır. */
(function(){
  'use strict';

  const norm = v => String(v ?? '').trim().toLocaleLowerCase('tr-TR');
  const products = () => Array.isArray(window.products) ? window.products : [];
  const subOf = p => String(p?.subcategory ?? p?.sub_category ?? p?.altCategory ?? p?.alt_category ?? p?.altKategori ?? '').trim();

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

  function getModal(){ return document.getElementById('modalBox'); }
  function getPicker(){ return document.getElementById('quoteProducts'); }

  /* Eklenen ürünler kutusunu ürün seçme listesinin ÜSTÜNDE tut.
     Sadece yerleşimi izler; filtre kontrollerini yeniden oluşturmaz. */
  function moveSelected(){
    const modal = getModal(), picker = getPicker();
    if(!modal || !picker) return;

    const pickerParent = picker.closest('.card') || picker.parentElement;
    if(!pickerParent) return;

    const tables = [...modal.querySelectorAll('table')];
    const table = tables.find(t => {
      if(t === picker.closest('table')) return false;
      return [...t.querySelectorAll('tr')].some(r => {
        const txt = norm(r.textContent || '');
        return /×|\bx\b|sil|kaldır/.test(txt) || r.querySelector('[onclick*="remove"],[onclick*="delete"],[aria-label="×"]');
      });
    });
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

    // Her zaman aynı parent altında, ürün seçme kartından hemen önce.
    const parent = pickerParent.parentElement || modal;
    if(box.parentElement !== parent){
      parent.insertBefore(box, pickerParent);
    } else if(box.nextElementSibling !== pickerParent){
      parent.insertBefore(box, pickerParent);
    }

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
    const q = norm(input?.value);
    const b = norm(brand?.value || 'all');
    const c = norm(cat?.value || 'all');
    const sb = norm(sub?.value || 'all');
    const s = norm(stock?.value || 'all');

    box.querySelectorAll('.p').forEach(card => {
      const p = findProduct(card), text = norm(card.textContent);
      const name = norm(p?.name), model = norm(p?.model), pb = norm(p?.brand), pc = norm(p?.category), ps = norm(subOf(p));
      const qty = Number(p?.stock ?? 0);
      const searchOK = !q || [text,name,model,pb,pc,ps].some(v => v.includes(q));
      const brandOK = b === 'all' || pb === b;
      const catOK = c === 'all' || pc === c;
      const subOK = sb === 'all' || ps === sb;
      const stockOK = s === 'all' || (s === 'available' ? qty > 0 : s === 'low' ? qty > 0 && qty <= 5 : s === 'zero' ? qty <= 0 : true);
      card.hidden = !(searchOK && brandOK && catOK && subOK && stockOK);
      card.style.display = card.hidden ? 'none' : '';
    });
  }

  function refreshSubcategory(){
    const cat = document.getElementById('quoteProductCategoryFilter');
    const sub = document.getElementById('quoteProductSubcategoryFilter');
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
      clear.type = 'button';
      clear.className = 'light';
      clear.textContent = 'Filtreleri Temizle';
      bar.appendChild(clear);
    }
    clear.id = 'quoteFilterClear';

    const list = products();
    setOptions(brand, 'Tüm markalar', [...new Set(list.map(p => String(p.brand || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(cat, 'Tüm kategoriler', [...new Set(list.map(p => String(p.category || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(sub, 'Tüm alt kategoriler', [...new Set(list.map(subOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')), 'all');
    setOptions(stock, 'Tüm stoklar', ['Mevcut stok','Düşük stok','Stok yok'], 'all');
    stock.options[1].value = 'available'; stock.options[2].value = 'low'; stock.options[3].value = 'zero';

    input.addEventListener('input', applyFilters);
    brand.addEventListener('change', applyFilters);
    cat.addEventListener('change', () => { refreshSubcategory(); applyFilters(); });
    sub.addEventListener('change', applyFilters);
    stock.addEventListener('change', applyFilters);
    clear.addEventListener('click', () => {
      input.value = ''; brand.value = 'all'; cat.value = 'all'; sub.value = 'all'; stock.value = 'all';
      refreshSubcategory(); applyFilters();
    });
    applyFilters();
  }

  function cardClick(){
    const box = getPicker();
    if(!box || box.dataset.quoteClickFix === '1') return;
    box.dataset.quoteClickFix = '1';
    box.addEventListener('click', ev => {
      const card = ev.target.closest('.p');
      if(!card || ev.target.closest('button,a,input,select')) return;
      const p = findProduct(card);
      if(!p) return;
      const raw = card.getAttribute('onclick') || '';
      if(!raw && typeof window.addQuoteItem === 'function') window.addQuoteItem(p.id);
    });
  }

  function removeFix(){
    const modal = getModal();
    if(!modal || modal.dataset.quoteRemoveFix === '1') return;
    modal.dataset.quoteRemoveFix = '1';
    modal.addEventListener('click', ev => {
      const el = ev.target.closest('button,a,[role="button"]');
      if(!el) return;
      const label = norm(el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent);
      if(!(label === '×' || label === 'x' || label.includes('sil') || label.includes('kaldır'))) return;
      const row = el.closest('tr');
      const onclick = el.getAttribute('onclick');
      ev.preventDefault(); ev.stopPropagation();
      if(onclick){ try { window.eval(onclick); } catch(e) { console.error(e); } }
      else if(row){
        const btn = row.querySelector('[onclick*="remove"],[onclick*="delete"],[onclick*="Quote"],button');
        if(btn && btn !== el && btn.getAttribute('onclick')) try { window.eval(btn.getAttribute('onclick')); } catch(e) { console.error(e); }
      }
      setTimeout(moveSelected, 80);
    }, true);
  }

  function observeLayout(){
    const modal = getModal();
    if(!modal || modal.dataset.quoteLayoutObserver === '1') return;
    modal.dataset.quoteLayoutObserver = '1';
    let queued = false;
    const schedule = () => {
      if(queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; moveSelected(); });
    };
    const observer = new MutationObserver(schedule);
    observer.observe(modal, {childList:true, subtree:true});
  }

  function boot(){
    const modal = getModal();
    if(!modal) return false;
    initFilters(); cardClick(); removeFix(); observeLayout(); moveSelected();
    return true;
  }

  function start(){
    if(boot()) return;
    const timer = setInterval(() => { if(boot()) clearInterval(timer); }, 150);
    setTimeout(() => clearInterval(timer), 10000);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
  window.turkogluQuoteFix = {apply: applyFilters, moveSelected};
})();
