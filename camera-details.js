/* Türkoğlu: güvenli yardımcılar ve kompakt ürün filtreleri.
   Teklif satırlarına, modal tıklamalarına veya DOM gözlemine müdahale etmez. */
(function(){
  'use strict';

  async function connectFromSetup(){
    const urlEl=document.getElementById('cfgUrl');
    const keyEl=document.getElementById('cfgKey');
    const msgEl=document.getElementById('authMsg');
    const setup=document.getElementById('setupBox');
    const auth=document.getElementById('authBox');
    const u=(urlEl?.value||'').trim().replace(/\/$/,'');
    const k=(keyEl?.value||'').trim();
    if(msgEl)msgEl.textContent='';
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(u)||!k){
      if(msgEl)msgEl.textContent='Supabase Proje URL ve Publishable / Anon Key gerekli.';
      return;
    }
    try{
      localStorage.setItem('turkoglu_sb_cfg',JSON.stringify({u,k}));
      if(typeof initClient!=='function')throw new Error('Bağlantı motoru yüklenemedi.');
      const ok=initClient();
      if(!ok||typeof client==='undefined'||!client)throw new Error('Supabase istemcisi oluşturulamadı.');
      if(msgEl)msgEl.textContent='Supabase bağlantısı kontrol ediliyor...';
      const result=await client.auth.getSession();
      if(result.error)throw result.error;
      if(setup)setup.classList.add('hidden');
      if(auth)auth.classList.remove('hidden');
      if(msgEl)msgEl.textContent='Bağlantı başarılı. Şimdi giriş yapabilirsiniz.';
    }catch(e){
      console.error('Sisteme Bağlan:',e);
      if(msgEl)msgEl.textContent='Bağlantı kurulamadı: '+(e?.message||String(e));
    }
  }
  window.saveConfig=connectFromSetup;

  function loadProfessionalTheme(){
    if(document.getElementById('turkogluProfessionalTheme'))return;
    const link=document.createElement('link');
    link.id='turkogluProfessionalTheme';
    link.rel='stylesheet';
    link.href='./theme.css?v=2';
    document.head.appendChild(link);
  }

  const productBrands=['Avenir','Dahua','Hikvision','HiLook','Uniview','Provision-ISR','TVT','TP-Link','Reçber','HES Kablo','Nexans','Mutlusan','Mean Well','Mervesan','Tunçmatik','Seagate','Western Digital','FormRack','NetConnect','Diverse','Standart','Hizmet'];
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const unitOf=v=>{
    const raw=norm(v?.unit||v?.birim||'');
    if(raw==='mt'||raw==='m'||raw==='metre'||raw==='metre')return 'mt';
    if(raw==='adet'||raw==='ad')return 'adet';
    const text=norm(`${v?.name||''} ${v?.model||''} ${v?.category||''}`);
    const metraj=/kablo|kablo kanal|cat\s*5|cat\s*6|cat\s*7|coax|koaksiyel|elektrik kablosu|data kablosu|enerji kablosu|fiber.*kablo|fiber kablo/.test(text);
    const hazir=/hazır|sonlandırılmış|sonlandirilmis|patch cord|patch kablo|hdmi|vga|usb kablo|scart/.test(text);
    return metraj&&!hazir?'mt':'adet';
  };

  function productForRow(row){
    const cells=row?.cells;
    if(!cells||cells.length<4)return null;
    const name=norm(cells[1]?.textContent||'');
    const model=norm(cells[2]?.textContent||'');
    if(!name)return null;
    try{
      const list=typeof products!=='undefined'&&Array.isArray(products)?products:[];
      return list.find(p=>norm(p.name)===name&&(!model||norm(p.model)===model))||list.find(p=>norm(p.name)===name)||null;
    }catch{return null}
  }

  function applyProductFilters(){
    const brand=norm(document.getElementById('productBrandFilter')?.value||'all');
    const category=norm(document.getElementById('productCategoryFilter')?.value||'all');
    const unit=norm(document.getElementById('productUnitFilter')?.value||'all');
    const stock=norm(document.getElementById('stockFilter')?.value||'all');
    document.querySelectorAll('#productRows tr').forEach(row=>{
      const cells=row.cells;
      if(!cells||cells.length<4)return;
      const p=productForRow(row);
      const text=norm(row.textContent||'');
      const cat=norm(cells[3].textContent||'');
      const pBrand=norm(p?.brand||'');
      const pUnit=unitOf(p||{});
      const stockValue=Number(p?.stock);
      const brandOk=brand==='all'||pBrand===brand||(!p&&text.includes(brand));
      const categoryOk=category==='all'||cat===category;
      const unitOk=unit==='all'||pUnit===unit;
      const stockOk=stock==='all'||(stock==='low'&&stockValue<=5)||(stock==='zero'&&stockValue<=0);
      row.style.display=brandOk&&categoryOk&&unitOk&&stockOk?'':'none';
    });
  }

  function refreshProductFilterOptions(){
    const brand=document.getElementById('productBrandFilter');
    const category=document.getElementById('productCategoryFilter');
    if(!brand||!category)return;
    const oldBrand=brand.value;
    const oldCategory=category.value;
    const cats=new Set();
    const brands=new Set();
    try{
      const list=typeof products!=='undefined'&&Array.isArray(products)?products:[];
      list.forEach(p=>{if(p.brand)brands.add(String(p.brand).trim());if(p.category)cats.add(String(p.category).trim())});
    }catch{}
    document.querySelectorAll('#productRows tr').forEach(row=>{
      const c=row.cells?.[3]?.textContent?.trim();
      if(c)cats.add(c);
    });
    brand.innerHTML='<option value="all">Marka: Tümü</option>'+[...new Set([...productBrands,...brands])].sort((a,b)=>a.localeCompare(b,'tr')).map(b=>`<option value="${b.replace(/"/g,'&quot;')}">${b}</option>`).join('');
    category.innerHTML='<option value="all">Kategori: Tümü</option>'+[...cats].sort((a,b)=>a.localeCompare(b,'tr')).map(c=>`<option value="${c.replace(/"/g,'&quot;')}">${c}</option>`).join('');
    if([...brand.options].some(o=>o.value===oldBrand))brand.value=oldBrand;
    if([...category.options].some(o=>o.value===oldCategory))category.value=oldCategory;
    applyProductFilters();
  }

  function initProductFilters(){
    const section=document.getElementById('products');
    const bar=section?.querySelector('.searchbar');
    if(!section||!bar||document.getElementById('productBrandFilter'))return;
    const makeSelect=(id,label,maxWidth='170px')=>{
      const s=document.createElement('select');
      s.id=id;
      s.title=label;
      s.setAttribute('aria-label',label);
      s.style.maxWidth=maxWidth;
      s.style.flex='0 1 '+maxWidth;
      s.innerHTML=`<option value="all">${label}</option>`;
      s.addEventListener('change',applyProductFilters);
      return s;
    };
    const brand=makeSelect('productBrandFilter','Marka: Tümü','170px');
    const category=makeSelect('productCategoryFilter','Kategori: Tümü','180px');
    const unit=makeSelect('productUnitFilter','Birim: Tümü','130px');
    unit.innerHTML='<option value="all">Birim: Tümü</option><option value="adet">Adet</option><option value="mt">mt</option>';
    const stock=document.getElementById('stockFilter');
    if(stock){stock.style.maxWidth='150px';stock.style.flex='0 1 150px';stock.addEventListener('change',applyProductFilters)}
    const clear=document.createElement('button');
    clear.type='button';
    clear.className='light';
    clear.textContent='Temizle';
    clear.title='Filtreleri temizle';
    clear.style.whiteSpace='nowrap';
    clear.addEventListener('click',()=>{
      brand.value='all';
      category.value='all';
      unit.value='all';
      if(stock)stock.value='all';
      const search=document.getElementById('productSearch');
      if(search)search.value='';
      if(typeof window.renderProducts==='function')window.renderProducts();
      setTimeout(applyProductFilters,0);
    });
    bar.appendChild(brand);
    bar.appendChild(category);
    bar.appendChild(unit);
    bar.appendChild(clear);
    refreshProductFilterOptions();

    if(typeof window.renderProducts==='function'&&!window.__turkogluFilterWrapped){
      const original=window.renderProducts;
      window.renderProducts=function(){
        const result=original.apply(this,arguments);
        setTimeout(()=>{refreshProductFilterOptions();applyProductFilters()},0);
        return result;
      };
      window.__turkogluFilterWrapped=true;
    }
  }

  function boot(){
    loadProfessionalTheme();
    initProductFilters();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else setTimeout(boot,0);
})();
