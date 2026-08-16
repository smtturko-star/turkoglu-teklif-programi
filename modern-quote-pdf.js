          oldRight.innerHTML=`<span class="tk-label">Fiyat Teklifi</span><span class="tk-number">${esc(match[1].trim())}</span><div class="tk-date">Tarih: ${esc(match[2].trim())}<br>Geçerlilik: ${esc(match[3].trim())}</div>`;
        }
      }
      const logo=currentHead.querySelector('.qlogo');
      const brandBox=currentHead.firstElementChild;
      if(brandBox)brandBox.classList.add('tk-brand-box');
      if(logo)logo.style.marginBottom='6px';
    }
    const cust=inner.querySelector('.qhead + div');
    if(cust&&!cust.classList.contains('tk-customer-box')){
      cust.className='tk-customer-box';
      const raw=cust.textContent||'';
      const lines=raw.split('\n').map(x=>x.trim()).filter(Boolean);
      const name=lines[1]||lines[0]||'';
      const meta=lines.slice(2).join(' · ');
      cust.innerHTML=`<div class="tk-customer-label">Müşteri</div><div class="tk-customer-name">${esc(name)}</div><div class="tk-customer-meta">${esc(meta)}</div>`;
    }
    const tables=[...inner.querySelectorAll('table')];
    const quoteTable=tables.find(t=>t.querySelector('th')&&/Ürün|Model|Toplam/i.test(t.textContent||''));
    if(quoteTable){