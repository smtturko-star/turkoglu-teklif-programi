/* Türkoğlu CCTV katalog + ürün görsel otomasyonu + filtreler */
(function(){
  if(window.__turkogluCameraCatalogLoaded)return;
  window.__turkogluCameraCatalogLoaded=true;

  const catalog=[
    ['Avenir','2MP IP Kamera','AV-IP3020-I'],['Avenir','4MP IP Kamera','AV-IP4045-IS'],['Avenir','6MP IP Kamera','AV-M21'],['Avenir','8MP IP Kamera','AV-S242X'],
    ['Avenir','2MP HD Kamera','AV-DF234'],['Avenir','4MP HD Kamera','AV-DF418AHD'],
    ['HiLook','2MP IP Kamera','IPC-B120H-D'],['HiLook','4MP IP Kamera','IPC-B140H'],['HiLook','6MP IP Kamera','IPC-B469HAD-LUF/SL'],['HiLook','8MP IP Kamera','IPC-B180H'],
    ['Hikvision','2MP IP Kamera','DS-2CD1023G2-I(UF)'],['Hikvision','4MP IP Kamera','DS-2CD1043G2-LIU(F)'],['Hikvision','6MP IP Kamera','DS-2CD3063G2-LIU'],['Hikvision','8MP IP Kamera','DS-2CD3083G2-LIU/SL'],
    ['Hikvision','2MP HD Kamera','DS-2CE56D0T-IT3(C)'],['Hikvision','8MP HD Kamera','DS-2CE12UF3T-E'],
    ['Dahua','2MP IP Kamera','IPC-HFW1230S-S4'],['Dahua','4MP IP Kamera','DH-IPC-HFW1431S-S4'],['Dahua','6MP IP Kamera','IPC-HDW2649TM-S-IL'],['Dahua','8MP IP Kamera','DH-IPC-HFW3849T1-AS-PV'],
    ['Dahua','2MP HD Kamera','HAC-HFW1239MH(-A)-LED'],['Dahua','4MP HD Kamera','HAC-HFW1400TH-I4'],['Dahua','6MP HD Kamera','HAC-HFW2601E-A'],['Dahua','8MP HD Kamera','HAC-HFW1801T-A']
  ].map(([brand,category,model])=>({name:`${brand} ${category}`,brand,model,category,purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:`${brand} ${category} — doğrulanmış model ${model}.`,image_url:null}));

  /* Yalnızca modelle doğrulanmış görseller. Mevcut kullanıcı fotoğrafı ASLA ezilmez. */
  const imageMap={
    'hikvision|ds-2cd1023g2-i(uf)':'https://www.oncuguvenlik.com.tr/image/cache/catalog/ds-2cd1023g2-iufm-ds-2cd1023g2-iufm-hikvision-tr-tr-600x800.png',
    'hikvision|ds-2cd1043g2-liu(f)':'https://www.oncuguvenlik.com.tr/image/cache/catalog/ds-2cd1043g2-liuf-ds-2cd1043g2-liuf-hikvision-tr-tr-600x800.png',
    'hikvision|ds-2cd3063g2-liu':'https://www.hikvision.com/content/dam/hikvision/products/asset/M000135481/images/%E7%AD%92%E6%9C%BA91-%E5%8A%A0%E5%8F%8Cmic%E5%8F%8C%E5%85%89-%E5%8F%B3%E4%BE%A7-%E6%B5%B7%E5%BA%B7%E7%99%BD.png',
    'hikvision|ds-2cd3083g2-liu/sl':'https://assets.hikvision.com/prd/normal/all/image/m000077132/%E7%AD%92%E6%9C%BA39-%E5%A3%B0%E5%85%89%E6%8A%A5%E8%AD%A6-%E5%9F%BA%E7%BA%BF-%E5%B7%A6%E4%BE%A7.png',
    'hilook|ipc-b140h':'https://cdn.allmarket.ge/2601/01/12/83/80/81ccd539f0fb472f8f5425ef5a99a11b/video-satvaltvalo-kamera-hilook-ipc-b140h-2-8mm-4-mp-fixed-bullet-network-camera-white.png',
    'dahua|ipc-hfw1230s-s4':'https://sanatelektirik.com.tr/Resim/Minik/1500x1500_thumb_dahuaipc-hfw1230s-s-0360b-s42mp36mmip67sdka_65.jpg',
    'dahua|dh-ipc-hfw1431s-s4':'https://vidcom.uz/components/com_jshopping/files/img_products/full_full_full_2024-09-25_21-13-3912.jpg',
    'dahua|ipc-hdw2649tm-s-il':'https://www.dahuasecurity.com/content/dam/dahua-site/products/network-cameras/wizsense-2-series/smart-dual-light/ipc-hdw2649tm-s-il/images/IPC-HDW2649TM-S-IL_View_45left-logo.png',
    'dahua|dh-ipc-hfw3849t1-as-pv':'https://darkcoon.es/288829-large_default/dahua-ipc-hfw3849t1-as-pv-0280b-pro-tubular-ip-wizcolor-tioc-pro-h265-8m-wdr-iluminacion-dual-led50m-ir50m-28mm-ip67-poe-audio.jpg',
    'dahua|hac-hfw1239mh(-a)-led':'https://cdn.jmt.bg/images/products/113000/full/523395/analogova-kamera-analogova-kamera-dahua-hac-hfw1239mh-a-led-0360b-s3-1.jpg',
    'dahua|hac-hfw1801t-a':'https://wirelessshop.mx/ProdImg/DADHHACHFW1801TNA0280B_01.png',
    'avenir|av-ip4045-is':'https://www.avenir.com.tr/wp-content/uploads/2024/04/AV-BF535.jpg',
    'avenir|av-ip3020-i':'https://avenirbayi.com/images/av_p_3035.jpg'
  };

  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const key=p=>[p.name,p.brand,p.model,p.category].map(norm).join('|');
  const imageKey=p=>`${norm(p.brand)}|${norm(p.model)}`;
  let running=false,imageRunning=false;

  async function refreshExactProductCount(){
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    try{const r=await client.from('products').select('id',{count:'exact',head:true});if(r.error)throw r.error;const total=Number(r.count)||0;const el=document.getElementById('kp');if(el)el.textContent=String(total);window.turkogluProductTotal=total;}catch(e){console.error('Ürün toplamı:',e)}
  }

  async function seed(){
    if(running||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{const r=await client.from('products').select('name,brand,model,category');if(r.error)throw r.error;const existing=new Set((r.data||[]).map(key));const missing=catalog.filter(p=>!existing.has(key(p)));if(missing.length){const ins=await client.from('products').insert(missing);if(ins.error)throw ins.error;if(typeof loadAll==='function')await loadAll();}await refreshExactProductCount();}catch(e){console.error('Kamera kataloğu:',e)}finally{running=false}
  }

  async function autoFillImages(){
    if(imageRunning||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    imageRunning=true;
    try{const r=await client.from('products').select('id,brand,model,image_url');if(r.error)throw r.error;const targets=(r.data||[]).filter(p=>!String(p.image_url||'').trim()&&imageMap[imageKey(p)]);for(const p of targets){const u=await client.from('products').update({image_url:imageMap[imageKey(p)]}).eq('id',p.id);if(u.error)throw u.error;}if(targets.length&&typeof loadAll==='function')await loadAll();window.turkogluImageFilled=targets.length;}catch(e){console.error('Otomatik ürün görselleri:',e)}finally{imageRunning=false}
  }

  window.turkogluSeedCameras=seed;window.turkogluRefreshProductCount=refreshExactProductCount;window.turkogluAutoFillImages=autoFillImages;

  const originalRender=window.render;
  if(typeof originalRender==='function')window.render=function(){const result=originalRender.apply(this,arguments);refreshExactProductCount();if(typeof window.turkogluRefreshProductFilters==='function')setTimeout(window.turkogluRefreshProductFilters,0);return result;};

  const state={search:'',brand:'',category:'',stock:'',sort:'name:asc'};let rowsData=[],panel=null,listenersReady=false;
  function compare(a,b,field,dir){if(field==='price')return((Number(a.sale_price)||0)-(Number(b.sale_price)||0))*dir;if(field==='stock')return((Number(a.stock)||0)-(Number(b.stock)||0))*dir;return norm(a[field]).localeCompare(norm(b[field]),'tr',{numeric:true,sensitivity:'base'})*dir;}
  function filtered(){const q=norm(state.search);let list=rowsData.filter(p=>{const hay=norm([p.name,p.brand,p.model,p.category,p.description].join(' '));if(q&&!hay.includes(q))return false;if(state.brand&&norm(p.brand)!==norm(state.brand))return false;if(state.category&&norm(p.category)!==norm(state.category))return false;if(state.stock==='in'&&(Number(p.stock)||0)<=0)return false;if(state.stock==='out'&&(Number(p.stock)||0)>0)return false;return true;});const [field,d]=(state.sort||'name:asc').split(':');list.sort((a,b)=>compare(a,b,field,d==='desc'?-1:1));return list;}
  function renderRows(){const tbody=document.getElementById('productRows');if(!tbody)return;const list=filtered();const count=document.getElementById('productFilterCount');if(count)count.textContent=`${list.length} ürün gösteriliyor / ${rowsData.length} toplam`;tbody.innerHTML=list.map(p=>`<tr><td>${p.image_url?`<img class="thumb" src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:'-'}</td><td><b>${esc(p.name)}</b><br>${esc(p.brand||'')}</td><td>${esc(p.model||'')}</td><td>${esc(p.category||'')}</td><td>${money(p.sale_price)}</td><td>%${num(p.vat_rate)}</td><td><div class="rowactions"><button onclick="productModal('${p.id}')">Düzenle</button><button class="red" onclick="deleteProduct('${p.id}')">Sil</button></div></td></tr>`).join('')||'<tr><td colspan="7">Filtreye uyan ürün bulunamadı.</td></tr>';}
  async function loadFilterData(){if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;try{const r=await client.from('products').select('*').order('name',{ascending:true});if(r.error)throw r.error;rowsData=r.data||[];buildPanel();renderRows();}catch(e){console.error('Ürün filtreleri:',e)}}
  function buildPanel(){const rows=document.getElementById('productRows');if(!rows)return;const card=rows.closest('.card');const actions=card?.querySelector('.actions');if(!card||!actions)return;if(panel&&document.body.contains(panel))return;panel=document.createElement('div');panel.id='productFilters';panel.style.cssText='display:grid;grid-template-columns:minmax(220px,2fr) repeat(4,minmax(130px,1fr)) auto;gap:8px;align-items:end;margin:14px 0;padding:12px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px';panel.innerHTML=`<div><label>Ürün ara</label><input id="productSearch" type="search" placeholder="Ürün, marka, model, kategori..." autocomplete="off"></div><div><label>Marka</label><select id="productBrandFilter"><option value="">Tüm markalar</option></select></div><div><label>Kategori</label><select id="productCategoryFilter"><option value="">Tüm kategoriler</option></select></div><div><label>Stok</label><select id="productStockFilter"><option value="">Tüm stoklar</option><option value="in">Stokta var</option><option value="out">Stokta yok</option></select></div><div><label>Sıralama</label><select id="productSort"><option value="name:asc">Ürün A → Z</option><option value="name:desc">Ürün Z → A</option><option value="brand:asc">Marka A → Z</option><option value="brand:desc">Marka Z → A</option><option value="category:asc">Kategori A → Z</option><option value="category:desc">Kategori Z → A</option><option value="model:asc">Model A → Z</option><option value="model:desc">Model Z → A</option><option value="price:asc">Fiyat düşük → yüksek</option><option value="price:desc">Fiyat yüksek → düşük</option><option value="stock:asc">Stok az → çok</option><option value="stock:desc">Stok çok → az</option></select></div><div><button id="productFilterReset" class="light" type="button">Temizle</button></div><div id="productFilterCount" class="muted" style="grid-column:1/-1">0 ürün gösteriliyor</div>`;actions.insertAdjacentElement('afterend',panel);const brand=document.getElementById('productBrandFilter'),category=document.getElementById('productCategoryFilter');[...new Set(rowsData.map(p=>String(p.brand||'').trim()).filter(Boolean))].sort((a,b)=>norm(a).localeCompare(norm(b),'tr')).forEach(v=>brand.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));[...new Set(rowsData.map(p=>String(p.category||'').trim()).filter(Boolean))].sort((a,b)=>norm(a).localeCompare(norm(b),'tr')).forEach(v=>category.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));if(listenersReady)return;const apply=()=>{state.search=document.getElementById('productSearch').value;state.brand=brand.value;state.category=category.value;state.stock=document.getElementById('productStockFilter').value;state.sort=document.getElementById('productSort').value;renderRows();};['productSearch','productBrandFilter','productCategoryFilter','productStockFilter','productSort'].forEach(id=>document.getElementById(id).addEventListener(id==='productSearch'?'input':'change',apply));document.getElementById('productFilterReset').addEventListener('click',()=>{state.search='';state.brand='';state.category='';state.stock='';state.sort='name:asc';document.getElementById('productSearch').value='';brand.value='';category.value='';document.getElementById('productStockFilter').value='';document.getElementById('productSort').value='name:asc';renderRows();});listenersReady=true;}

  window.turkogluRefreshProductFilters=loadFilterData;

  /* Uygulama açılışında yalnızca bir kez katalog senkronizasyonu yapılır.
     Sürekli polling kaldırıldı; bu hem Supabase sorgularını hem de Netlify maliyetini azaltır. */
  let attempts=0;
  const startup=setInterval(()=>{
    attempts++;
    if(typeof user!=='undefined'&&user&&typeof client!=='undefined'&&client){clearInterval(startup);seed();autoFillImages();setTimeout(loadFilterData,250);}
    else if(attempts>=60)clearInterval(startup);
  },500);
})();