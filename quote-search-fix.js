/* Teklif > Malzemeler ürün araması: dinamik modal için dayanıklı arama düzeltmesi. */
(function(){
  'use strict';
  if(window.__tkQuoteSearchFixInstalled)return;
  window.__tkQuoteSearchFixInstalled=true;

  const norm=v=>String(v??'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const getProducts=()=>Array.isArray(window.products)?window.products:[];

  function productFromCard(card){
    if(!card)return null;
    const products=getProducts();
    const raw=card.getAttribute('onclick')||'';
    const match=raw.match(/addQuoteItem\s*\(\s*['\"]?([^'\")]+)['\"]?\s*\)/i);
    if(match){
      const found=products.find(p=>String(p.id)===String(match[1]));
      if(found)return found;
    }
    const dataId=card.dataset.productId||card.getAttribute('data-product-id');
    if(dataId){
      const found=products.find(p=>String(p.id)===String(dataId));
      if(found)return found;
    }
    const text=norm(card.textContent);
    return products.find(p=>text.includes(norm(p.name||'')) && (!p.model||text.includes(norm(p.model))))||null;
  }

  function matches(card,query){
    if(!query)return true;
    const p=productFromCard(card);
    const haystack=[
      card.textContent,
      p?.name,p?.brand,p?.model,p?.category,p?.subcategory,p?.sub_category,
      p?.description,p?.unit,p?.birim
    ].map(norm).filter(Boolean).join(' | ');
    return haystack.includes(query);
  }

  function render(){
    const input=document.getElementById('quoteProductSearch');
    const box=document.getElementById('quoteProducts');
    if(!input||!box)return false;
    const query=norm(input.value);
    const cards=[...box.querySelectorAll('.p')];
    let visible=0;
    cards.forEach(card=>{
      const show=matches(card,query);
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++;
    });
    let empty=box.querySelector('.tk-quote-search-empty');
    if(query && cards.length && visible===0){
      if(!empty){
        empty=document.createElement('div');
        empty.className='tk-quote-search-empty empty';
        empty.textContent='Aradığınız ürüne uygun malzeme bulunamadı.';
        box.appendChild(empty);
      }
      empty.style.display='block';
    }else if(empty){
      empty.style.display='none';
    }
    return true;
  }

  function install(){
    const input=document.getElementById('quoteProductSearch');
    const box=document.getElementById('quoteProducts');
    if(!input||!box)return false;
    if(input.dataset.tkSearchFix==='1')return true;
    input.dataset.tkSearchFix='1';
    input.addEventListener('input',render);
    input.addEventListener('search',render);
    input.addEventListener('keyup',render);
    render();
    return true;
  }

  function boot(){
    install();
    const modal=document.getElementById('modalBox');
    if(modal && modal.dataset.tkSearchObserver!=='1'){
      modal.dataset.tkSearchObserver='1';
      let pending=false;
      new MutationObserver(()=>{
        if(pending)return;
        pending=true;
        requestAnimationFrame(()=>{pending=false;install();render();});
      }).observe(modal,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  setInterval(install,500);
  window.tkQuoteSearchFix={render};
})();
