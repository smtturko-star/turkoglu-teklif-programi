/* Teklif ürün seçimi: stabil filtreler, alt kategori, silme ve görünür seçili ürün paneli. */
(function(){
  'use strict';
  const n=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const source=()=>Array.isArray(window.products)?window.products:[];
  const subOf=p=>String(p?.subcategory??p?.sub_category??p?.altCategory??p?.alt_category??p?.altKategori??'').trim();
  const productForCard=card=>{
    const list=source(),raw=card.getAttribute('onclick')||'';
    const m=raw.match(/addQuoteItem\s*\(\s*['\"]?([^'\")]+)['\"]?\s*\)/i);
    if(m){const p=list.find(x=>String(x.id)===String(m[1]));if(p)return p;}
    const text=n(card.textContent);
    return list.find(p=>text.includes(n(p.name))&&(!p.model||text.includes(n(p.model))))||null;
  };
  function selectedTable(modal,picker){return [...modal.querySelectorAll('table')].find(t=>t!==picker?.closest('table')&&[...t.querySelectorAll('tr')].some(r=>/×|\bx\b|sil|kaldır/i.test(r.textContent||'')))||null;}
  function moveSelected(){
    const modal=document.getElementById('modalBox'),picker=document.getElementById('quoteProducts');if(!modal||!picker)return;
    const table=selectedTable(modal,picker);if(!table)return;let box=table.closest('.card')||table.parentElement;if(!box||box===picker)return;
    if(!box.dataset.quoteSelectedBox){box.dataset.quoteSelectedBox='1';const title=document.createElement('div');title.className='quote-selected-title';title.innerHTML='<strong>Teklife Eklenen Ürünler</strong><span class="muted">Eklediğiniz ürünleri burada görebilirsiniz.</span>';box.parentElement?.insertBefore(title,box);}
    const pickerParent=picker.closest('.card')||picker.parentElement;if(pickerParent&&box!==pickerParent)modal.insertBefore(box,pickerParent);else if(box!==picker)modal.insertBefore(box,picker);
    box.style.cssText+=';border:2px solid #0f766e;background:#f8fffd;margin-bottom:16px;';
  }
  function options(select,placeholder,values,keep){
    select.innerHTML='';select.add(new Option(placeholder,'all'));values.forEach(v=>select.add(new Option(v,v)));select.value=values.includes(keep)?keep:'all';
  }
  function initFilters(){
    const search=document.getElementById('quoteProductSearch'),box=document.getElementById('quoteProducts');if(!search||!box)return;
    const bar=search.parentElement;if(!bar)return;
    // Daha önce eklenmiş temizleme düğmelerinin tamamını kaldır; tek düğme oluştur.
    bar.querySelectorAll('#quoteFilterClear').forEach((x,i)=>{if(i>0)x.remove();});
    let brand=document.getElementById('quoteProductBrandFilter'),cat=document.getElementById('quoteProductCategoryFilter'),sub=document.getElementById('quoteProductSubcategoryFilter'),stock=document.getElementById('quoteProductStockFilter');
    const make=(el,id,label)=>{if(!el){el=document.createElement('select');el.id=id;bar.appendChild(el);}return el;};
    brand=make(brand,'quoteProductBrandFilter','Tüm markalar');cat=make(cat,'quoteProductCategoryFilter','Tüm kategoriler');sub=make(sub,'quoteProductSubcategoryFilter','Tüm alt kategoriler');stock=make(stock,'quoteProductStockFilter','Tüm stoklar');
    let clear=document.getElementById('quoteFilterClear');if(!clear){clear=document.createElement('button');clear.type='button';clear.className='light';clear.id='quoteFilterClear';clear.textContent='Filtreleri Temizle';bar.appendChild(clear);}
    const list=source();
    const current={q:search.value,b:brand.value,c:cat.value,sb:sub.value,s:stock.value};
    const brands=[...new Set(list.map(p=>String(p.brand||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    const cats=[...new Set(list.map(p=>String(p.category||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    options(brand,'Tüm markalar',brands,current.b);
    options(cat,'Tüm kategoriler',cats,current.c);
    const subs=[...new Set(list.filter(p=>cat.value==='all'||n(p.category)===n(cat.value)).map(subOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    options(sub,'Tüm alt kategoriler',subs,current.sb);
    const applyAndKeep=()=>{updateSub();apply();};
    search.oninput=apply;
    brand.onchange=apply;
    cat.onchange=applyAndKeep;
    sub.onchange=apply;
    stock.onchange=apply;
    clear.onclick=()=>{search.value='';brand.value='all';cat.value='all';sub.value='all';stock.value='all';updateSub();apply();};
    function updateSub(){
      const selected=sub.value;
      const values=[...new Set(list.filter(p=>cat.value==='all'||n(p.category)===n(cat.value)).map(subOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
      options(sub,'Tüm alt kategoriler',values,selected);
    }
    if(!box.dataset.quoteFilterInit){box.dataset.quoteFilterInit='1';apply();}
  }
  function apply(){
    const input=document.getElementById('quoteProductSearch'),brand=document.getElementById('quoteProductBrandFilter'),cat=document.getElementById('quoteProductCategoryFilter'),sub=document.getElementById('quoteProductSubcategoryFilter'),stock=document.getElementById('quoteProductStockFilter');
    const q=n(input?.value),b=n(brand?.value||'all'),c=n(cat?.value||'all'),sb=n(sub?.value||'all'),s=stock?.value||'all';
    document.querySelectorAll('#quoteProducts .p').forEach(card=>{
      const p=productForCard(card),text=n(card.textContent),name=n(p?.name),model=n(p?.model),pb=n(p?.brand),pc=n(p?.category),ps=n(subOf(p));
      const searchOk=!q||text.includes(q)||name.includes(q)||model.includes(q)||pb.includes(q)||pc.includes(q)||ps.includes(q);
      const brandOk=b==='all'||pb===b||text.includes(b),catOk=c==='all'||pc===c||text.includes(c),subOk=sb==='all'||ps===sb||text.includes(sb);
      const qty=Number(p?.stock??0),stockOk=s==='all'||(s==='available'?qty>0:s==='low'?qty>0&&qty<=5:s==='zero'?qty<=0:true);
      card.hidden=!(searchOk&&brandOk&&catOk&&subOk&&stockOk);card.style.display=card.hidden?'none':'';
    });
  }
  function cardClick(){const box=document.getElementById('quoteProducts');if(!box||box.dataset.quoteClickFix)return;box.dataset.quoteClickFix='1';box.addEventListener('click',ev=>{const card=ev.target.closest('.p');if(!card||ev.target.closest('button,a,input,select'))return;const p=productForCard(card);if(!p)return;const raw=card.getAttribute('onclick')||'';if(!raw&&typeof window.addQuoteItem==='function')window.addQuoteItem(p.id);});}
  function removeFix(){
    const modal=document.getElementById('modalBox');if(!modal||modal.dataset.quoteRemoveFix4)return;modal.dataset.quoteRemoveFix4='1';
    modal.addEventListener('click',ev=>{
      const el=ev.target.closest('button,a,[role="button"]');if(!el)return;
      const label=n(el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent);if(!['×','x','sil','kaldır'].includes(label)&&!label.includes('sil')&&!label.includes('kaldır'))return;
      const row=el.closest('tr'),onclick=el.getAttribute('onclick');ev.preventDefault();ev.stopPropagation();
      if(onclick){try{window.eval(onclick);}catch(e){console.error(e);}}
      else if(row){const btn=row.querySelector('[onclick*="remove"],[onclick*="delete"],[onclick*="Quote"],button');if(btn&&btn!==el&&btn.getAttribute('onclick')){try{window.eval(btn.getAttribute('onclick'));}catch(e){console.error(e);}}}
      setTimeout(()=>{moveSelected();apply();},100);
    },true);
  }
  function boot(){const modal=document.getElementById('modalBox');if(!modal)return;initFilters();cardClick();removeFix();moveSelected();if(modal.dataset.quoteFixObserver)return;modal.dataset.quoteFixObserver='1';const ob=new MutationObserver(()=>{clearTimeout(ob.t);ob.t=setTimeout(()=>{cardClick();removeFix();moveSelected();},80)});ob.observe(modal,{childList:true,subtree:true});}
  function start(){boot();setTimeout(boot,300);setTimeout(boot,1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.turkogluQuoteFix={apply,moveSelected};
})();