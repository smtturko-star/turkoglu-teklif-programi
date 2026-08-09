/* Teklif ürün seçimi: filtre, silme ve görünür seçili ürün paneli. */
(function(){
  'use strict';
  const n=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  const source=()=>Array.isArray(window.products)?window.products:[];
  const productForCard=card=>{
    const list=source();
    const raw=card.getAttribute('onclick')||'';
    let m=raw.match(/addQuoteItem\s*\(\s*['\"]?([^'\")]+)['\"]?\s*\)/i);
    if(m){const p=list.find(x=>String(x.id)===String(m[1]));if(p)return p;}
    const text=n(card.textContent);
    return list.find(p=>text.includes(n(p.name)) && (!p.model || text.includes(n(p.model))))||null;
  };
  function selectedTable(modal,picker){
    const tables=[...modal.querySelectorAll('table')];
    return tables.find(t=>t!==picker?.closest('table') && [...t.querySelectorAll('tr')].some(r=>/×|\bx\b|sil/i.test(r.textContent||'')))||null;
  }
  function moveSelected(){
    const modal=document.getElementById('modalBox'),picker=document.getElementById('quoteProducts');
    if(!modal||!picker)return;
    const table=selectedTable(modal,picker);if(!table)return;
    let box=table.closest('.card')||table.parentElement;
    if(!box||box===picker)return;
    if(!box.dataset.quoteSelectedBox){
      box.dataset.quoteSelectedBox='1';
      const title=document.createElement('div');
      title.className='quote-selected-title';
      title.innerHTML='<strong>Teklife Eklenen Ürünler</strong><span class="muted">Eklediğiniz ürünleri burada görebilirsiniz.</span>';
      box.parentElement?.insertBefore(title,box);
    }
    const pickerParent=picker.closest('.card')||picker.parentElement;
    if(pickerParent && box!==pickerParent) modal.insertBefore(box,pickerParent);
    else if(box!==picker) modal.insertBefore(box,picker);
    box.style.cssText+=';border:2px solid #0f766e;background:#f8fffd;margin-bottom:16px;';
  }
  function rebuildFilters(){
    const search=document.getElementById('quoteProductSearch'),box=document.getElementById('quoteProducts');
    if(!search||!box)return;
    const bar=search.parentElement;
    if(!bar)return;
    ['quoteProductBrandFilter','quoteProductCategoryFilter','quoteProductStockFilter'].forEach(id=>{
      const old=document.getElementById(id);if(old)old.replaceWith(old.cloneNode(true));
    });
    const oldSearch=search.cloneNode(true);search.replaceWith(oldSearch);
    const input=document.getElementById('quoteProductSearch');
    const make=(id,label)=>{let s=document.getElementById(id);if(!s){s=document.createElement('select');s.id=id;bar.appendChild(s);}s.innerHTML='';s.add(new Option(label,'all'));return s;};
    const brand=make('quoteProductBrandFilter','Tüm markalar');
    const cat=make('quoteProductCategoryFilter','Tüm kategoriler');
    const stock=make('quoteProductStockFilter','Tüm stoklar');
    const clear=document.createElement('button');clear.type='button';clear.className='light';clear.id='quoteFilterClear';clear.textContent='Filtreleri Temizle';
    const oldClear=document.getElementById('quoteFilterClear');if(oldClear)oldClear.replaceWith(clear);else bar.appendChild(clear);
    const list=source();
    [...new Set(list.map(p=>String(p.brand||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')).forEach(v=>brand.add(new Option(v,v)));
    [...new Set(list.map(p=>String(p.category||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')).forEach(v=>cat.add(new Option(v,v)));
    input.oninput=apply;brand.onchange=apply;cat.onchange=apply;stock.onchange=apply;
    clear.onclick=()=>{input.value='';brand.value='all';cat.value='all';stock.value='all';apply();};
    apply();
  }
  function apply(){
    const input=document.getElementById('quoteProductSearch'),brand=document.getElementById('quoteProductBrandFilter'),cat=document.getElementById('quoteProductCategoryFilter'),stock=document.getElementById('quoteProductStockFilter');
    const q=n(input?.value),b=n(brand?.value||'all'),c=n(cat?.value||'all'),s=stock?.value||'all';
    document.querySelectorAll('#quoteProducts .p').forEach(card=>{
      const p=productForCard(card),text=n(card.textContent);
      const name=n(p?.name),model=n(p?.model),pb=n(p?.brand),pc=n(p?.category);
      const searchOk=!q||text.includes(q)||name.includes(q)||model.includes(q)||pb.includes(q)||pc.includes(q);
      const brandOk=b==='all'||pb===b||text.includes(b);
      const catOk=c==='all'||pc===c||text.includes(c);
      const qty=Number(p?.stock??0);
      const stockOk=s==='all'||(s==='available'?qty>0:s==='low'?qty>0&&qty<=5:s==='zero'?qty<=0:true);
      card.hidden=!(searchOk&&brandOk&&catOk&&stockOk);
      card.style.display=card.hidden?'none':'';
    });
  }
  function cardClick(){
    const box=document.getElementById('quoteProducts');if(!box||box.dataset.quoteClickFix)return;
    box.dataset.quoteClickFix='1';
    box.addEventListener('click',ev=>{
      const card=ev.target.closest('.p');if(!card||ev.target.closest('button,a,input,select'))return;
      const p=productForCard(card);if(!p)return;
      const raw=card.getAttribute('onclick')||'';
      if(raw)return; // mevcut inline handler varsa tarayıcı zaten çalıştırır
      if(typeof window.addQuoteItem==='function')window.addQuoteItem(p.id);
    });
  }
  function removeFix(){
    const modal=document.getElementById('modalBox');if(!modal||modal.dataset.quoteRemoveFix2)return;
    modal.dataset.quoteRemoveFix2='1';
    modal.addEventListener('click',ev=>{
      const el=ev.target.closest('button,a,[role="button"]');if(!el)return;
      const label=n(el.textContent);if(!['×','x','sil','kaldır'].includes(label))return;
      const raw=el.getAttribute('onclick');if(!raw)return;
      ev.preventDefault();ev.stopImmediatePropagation();
      try{window.eval(raw);}catch(e){console.error('Teklif ürün silme işlemi:',e);}
      setTimeout(moveSelected,30);
    },true);
  }
  function boot(){
    const modal=document.getElementById('modalBox');if(!modal)return;
    rebuildFilters();cardClick();removeFix();moveSelected();
    if(modal.dataset.quoteFixObserver)return;modal.dataset.quoteFixObserver='1';
    const ob=new MutationObserver(()=>{clearTimeout(ob.t);ob.t=setTimeout(()=>{rebuildFilters();cardClick();moveSelected();},80)});ob.observe(modal,{childList:true,subtree:true});
  }
  function start(){boot();setTimeout(boot,300);setTimeout(boot,1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.turkogluQuoteFix={apply,moveSelected};
})();
