/* Türkoğlu CCTV kamera kataloğu - yalnızca doğrulanmış model kayıtlarını oluşturur. */
(function(){
  const catalog=[
    ['Avenir','2MP IP Kamera','AV-IP3020-I'],['Avenir','4MP IP Kamera','AV-IP4045-IS'],['Avenir','6MP IP Kamera','AV-M21'],['Avenir','8MP IP Kamera','AV-S242X'],
    ['Avenir','2MP HD Kamera','AV-DF234'],['Avenir','4MP HD Kamera','AV-DF418AHD'],
    ['HiLook','2MP IP Kamera','IPC-B120H-D'],['HiLook','4MP IP Kamera','IPC-B140H'],['HiLook','6MP IP Kamera','IPC-B469HAD-LUF/SL'],['HiLook','8MP IP Kamera','IPC-B180H'],
    ['Hikvision','2MP IP Kamera','DS-2CD1023G2-I(UF)'],['Hikvision','4MP IP Kamera','DS-2CD1043G2-LIU(F)'],['Hikvision','6MP IP Kamera','DS-2CD3063G2-LIU'],['Hikvision','8MP IP Kamera','DS-2CD3083G2-LIU/SL'],
    ['Hikvision','2MP HD Kamera','DS-2CE56D0T-IT3(C)'],['Hikvision','8MP HD Kamera','DS-2CE12UF3T-E'],
    ['Dahua','2MP IP Kamera','IPC-HFW1230S-S4'],['Dahua','4MP IP Kamera','DH-IPC-HFW1431S-S4'],['Dahua','6MP IP Kamera','IPC-HDW2649TM-S-IL'],['Dahua','8MP IP Kamera','DH-IPC-HFW3849T1-AS-PV'],
    ['Dahua','2MP HD Kamera','HAC-HFW1239MH(-A)-LED'],['Dahua','4MP HD Kamera','HAC-HFW1400TH-I4'],['Dahua','6MP HD Kamera','HAC-HFW2601E-A'],['Dahua','8MP HD Kamera','HAC-HFW1801T-A']
  ].map(([brand,category,model])=>({name:`${brand} ${category}`,brand,model,category,purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:`${brand} ${category} — doğrulanmış model ${model}.`,image_url:null}));

  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const key=p=>[p.name,p.brand,p.model,p.category].map(norm).join('|');
  let running=false;
  let countTimer=null;

  async function refreshExactProductCount(){
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    try{
      const r=await client.from('products').select('id',{count:'exact',head:true});
      if(r.error)throw r.error;
      const total=Number(r.count)||0;
      const el=document.getElementById('kp');
      if(el)el.textContent=String(total);
      window.turkogluProductTotal=total;
    }catch(e){console.error('Ürün toplamı:',e)}
  }

  async function seed(){
    if(running||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('name,brand,model,category');
      if(r.error)throw r.error;
      const existing=new Set((r.data||[]).map(key));
      const missing=catalog.filter(p=>!existing.has(key(p)));
      if(missing.length){
        const ins=await client.from('products').insert(missing);
        if(ins.error)throw ins.error;
        if(typeof loadAll==='function')await loadAll();
      }
      await refreshExactProductCount();
    }catch(e){console.error('Kamera kataloğu:',e)}finally{running=false}
  }

  window.turkogluSeedCameras=seed;
  window.turkogluRefreshProductCount=refreshExactProductCount;

  /* Ürün sayısı: Supabase'den kesin COUNT. */
  const originalRender=window.render;
  if(typeof originalRender==='function'){
    window.render=function(){
      const result=originalRender.apply(this,arguments);
      refreshExactProductCount();
      return result;
    };
  }

  /* ------------------------------------------------------------
     ÜRÜN ARAMA / FİLTRE / SIRALAMA
     - A-Z / Z-A
     - Marka / kategori / model
     - Fiyat ve stok sıralaması
     - Birlikte çalışan arama + marka + kategori + stok filtresi
     - Veritabanındaki ürünleri değiştirmez veya silmez.
  ------------------------------------------------------------ */
  const productFilter={search:'',brand:'',category:'',stock:'',sort:'name-asc'};
  let filtersReady=false;

  function productCompare(a,b,field,dir=1){
    if(field==='price') return (Number(a.sale_price)||0-(Number(b.sale_price)||0))*dir;
    if(field==='stock') return ((Number(a.stock)||0)-(Number(b.stock)||0))*dir;
    return norm(a[field]).localeCompare(norm(b[field]),'tr',{numeric:true,sensitivity:'base'})*dir;
  }

  function filteredProducts(){
    const q=norm(productFilter.search);
    let list=(window.products||[]).filter(p=>{
      const hay=norm([p.name,p.brand,p.model,p.category,p.description].join(' '));
      if(q&&!hay.includes(q))return false;
      if(productFilter.brand&&norm(p.brand)!==norm(productFilter.brand))return false;
      if(productFilter.category&&norm(p.category)!==norm(productFilter.category))return false;
      if(productFilter.stock==='in')return (Number(p.stock)||0)>0;
      if(productFilter.stock==='out')return (Number(p.stock)||0)<=0;
      return true;
    });

    const [field,dirText]=productFilter.sort.split(':');
    const dir=dirText==='desc'?-1:1;
    if(field==='price'||field==='stock'||field==='name'||field==='brand'||field==='category'||field==='model'){
      list.sort((a,b)=>productCompare(a,b,field,dir));
    }
    return list;
  }

  function renderProductRows(){
    const tbody=document.getElementById('productRows');
    if(!tbody)return;
    const list=filteredProducts();
    const count=document.getElementById('productFilterCount');
    if(count)count.textContent=`${list.length} ürün gösteriliyor / ${(window.products||[]).length} toplam`;
    tbody.innerHTML=list.map(p=>`<tr><td>${p.image_url?`<img class="thumb" src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'-'}</td><td><b>${esc(p.name)}</b><br>${esc(p.brand)}</td><td>${esc(p.model)}</td><td>${esc(p.category)}</td><td>${money(p.sale_price)}</td><td>%${num(p.vat_rate)}</td><td><div class="rowactions"><button onclick="productModal('${p.id}')">Düzenle</button><button class="red" onclick="deleteProduct('${p.id}')">Sil</button></div></td></tr>`).join('')||'<tr><td colspan="7">Filtreye uyan ürün bulunamadı.</td></tr>';
  }

  function buildProductFilters(){
    const rows=document.getElementById('productRows');
    if(!rows||filtersReady)return;
    const card=rows.closest('.card');
    const actions=card?.querySelector('.actions');
    if(!card||!actions)return;

    const box=document.createElement('div');
    box.id='productFilters';
    box.style.cssText='display:grid;grid-template-columns:minmax(220px,2fr) repeat(4,minmax(130px,1fr)) auto;gap:8px;align-items:end;margin:14px 0;padding:12px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px';
    box.innerHTML=`
      <div><label>Ürün ara</label><input id="productSearch" type="search" placeholder="Ürün, marka, model, kategori..." autocomplete="off"></div>
      <div><label>Marka</label><select id="productBrandFilter"><option value="">Tüm markalar</option></select></div>
      <div><label>Kategori</label><select id="productCategoryFilter"><option value="">Tüm kategoriler</option></select></div>
      <div><label>Stok</label><select id="productStockFilter"><option value="">Tüm stoklar</option><option value="in">Stokta var</option><option value="out">Stokta yok</option></select></div>
      <div><label>Sıralama</label><select id="productSort"><option value="name:asc">Ürün A → Z</option><option value="name:desc">Ürün Z → A</option><option value="brand:asc">Marka A → Z</option><option value="brand:desc">Marka Z → A</option><option value="category:asc">Kategori A → Z</option><option value="category:desc">Kategori Z → A</option><option value="model:asc">Model A → Z</option><option value="model:desc">Model Z → A</option><option value="price:asc">Fiyat düşük → yüksek</option><option value="price:desc">Fiyat yüksek → düşük</option><option value="stock:asc">Stok az → çok</option><option value="stock:desc">Stok çok → az</option></select></div>
      <div><button id="productFilterReset" class="light" type="button">Temizle</button></div>
      <div id="productFilterCount" class="muted" style="grid-column:1/-1">0 ürün gösteriliyor</div>`;
    actions.insertAdjacentElement('afterend',box);

    const search=document.getElementById('productSearch');
    const brand=document.getElementById('productBrandFilter');
    const category=document.getElementById('productCategoryFilter');
    const stock=document.getElementById('productStockFilter');
    const sort=document.getElementById('productSort');
    const reset=document.getElementById('productFilterReset');

    const brands=[...new Set((window.products||[]).map(p=>String(p.brand||'').trim()).filter(Boolean))].sort((a,b)=>norm(a).localeCompare(norm(b),'tr'));
    const categories=[...new Set((window.products||[]).map(p=>String(p.category||'').trim()).filter(Boolean))].sort((a,b)=>norm(a).localeCompare(norm(b),'tr'));
    brands.forEach(v=>brand.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));
    categories.forEach(v=>category.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));

    const apply=()=>{
      productFilter.search=search.value;
      productFilter.brand=brand.value;
      productFilter.category=category.value;
      productFilter.stock=stock.value;
      productFilter.sort=sort.value||'name:asc';
      renderProductRows();
    };
    search.addEventListener('input',apply);
    brand.addEventListener('change',apply);
    category.addEventListener('change',apply);
    stock.addEventListener('change',apply);
    sort.addEventListener('change',apply);
    reset.addEventListener('click',()=>{
      search.value='';brand.value='';category.value='';stock.value='';sort.value='name:asc';apply();
    });
    filtersReady=true;
  }

  function refreshProductFilters(){
    if(!document.getElementById('productRows'))return;
    buildProductFilters();
    renderProductRows();
  }

  const originalRenderProducts=window.renderProducts;
  if(typeof originalRenderProducts==='function'){
    window.renderProducts=function(){
      buildProductFilters();
      renderProductRows();
    };
  }
  window.turkogluRefreshProductFilters=refreshProductFilters;

  /* Filtre paneli ilk yüklemede ve Ürünler sekmesine dönüldüğünde hazır olsun. */
  const filterTimer=setInterval(()=>{
    if(document.getElementById('productRows')){
      buildProductFilters();
      renderProductRows();
      if(window.products?.length)clearInterval(filterTimer);
    }
  },500);
  setTimeout(()=>clearInterval(filterTimer),30000);

  /* Aynı script iki kez yüklenmiş olsa bile katalog ekleme işlemi çakışmasın. */
  const timer=setInterval(seed,1500);
  setTimeout(()=>clearInterval(timer),120000);
  countTimer=setInterval(refreshExactProductCount,5000);
  setTimeout(()=>clearInterval(countTimer),120000);
})();
