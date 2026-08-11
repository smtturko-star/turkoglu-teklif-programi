/* Türkoğlu: güvenli yardımcılar ve ürün filtreleri.
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

  function applyProductFilters(){
    const brand=norm(document.getElementById('productBrandFilter')?.value||'all');
    const category=norm(document.getElementById('productCategoryFilter')?.value||'all');
    document.querySelectorAll('#productRows tr').forEach(row=>{
      const cells=row.cells;
      if(!cells||cells.length<4)return;
      const text=norm(row.textContent||'');
      const cat=norm(cells[3].textContent||'');
      const brandOk=brand==='all'||text.includes(brand);
      const categoryOk=category==='all'||cat===category;
      row.style.display=brandOk&&categoryOk?'':'none';
    });
  }

  function refreshProductFilterOptions(){
    const brand=document.getElementById('productBrandFilter');
    const category=document.getElementById('productCategoryFilter');
    if(!brand||!category)return;
    const oldBrand=brand.value;
    const oldCategory=category.value;
    const cats=new Set();
    document.querySelectorAll('#productRows tr').forEach(row=>{
      const c=row.cells?.[3]?.textContent?.trim();
      if(c)cats.add(c);
    });
    brand.innerHTML='<option value="all">Tüm markalar</option>'+productBrands.map(b=>`<option value="${b}">${b}</option>`).join('');
    category.innerHTML='<option value="all">Tüm kategoriler</option>'+[...cats].sort((a,b)=>a.localeCompare(b,'tr')).map(c=>`<option value="${c.replace(/"/g,'&quot;')}">${c}</option>`).join('');
    if([...brand.options].some(o=>o.value===oldBrand))brand.value=oldBrand;
    if([...category.options].some(o=>o.value===oldCategory))category.value=oldCategory;
    applyProductFilters();
  }

  function initProductFilters(){
    const section=document.getElementById('products');
    const bar=section?.querySelector('.searchbar');
    if(!section||!bar||document.getElementById('productBrandFilter'))return;
    const makeSelect=(id,label)=>{
      const s=document.createElement('select');
      s.id=id;
      s.title=label;
      s.setAttribute('aria-label',label);
      s.style.maxWidth='210px';
      s.innerHTML=`<option value="all">${label}</option>`;
      s.addEventListener('change',applyProductFilters);
      return s;
    };
    const brand=makeSelect('productBrandFilter','Tüm markalar');
    const category=makeSelect('productCategoryFilter','Tüm kategoriler');
    const clear=document.createElement('button');
    clear.type='button';
    clear.className='light';
    clear.textContent='Filtreleri Temizle';
    clear.addEventListener('click',()=>{
      brand.value='all';
      category.value='all';
      const stock=document.getElementById('stockFilter');
      const search=document.getElementById('productSearch');
      if(stock)stock.value='all';
      if(search)search.value='';
      if(typeof window.renderProducts==='function')window.renderProducts();
      applyProductFilters();
    });
    bar.appendChild(brand);
    bar.appendChild(category);
    bar.appendChild(clear);
    refreshProductFilterOptions();
  }

  function boot(){
    loadProfessionalTheme();
    initProductFilters();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else setTimeout(boot,0);
})();
