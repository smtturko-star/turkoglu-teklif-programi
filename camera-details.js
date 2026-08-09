/* Türkoğlu CCTV model doğrulama ve bağlantı yardımcıları. */
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
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(u)||!k){if(msgEl)msgEl.textContent='Supabase Proje URL ve Publishable / Anon Key gerekli.';return;}
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
    }catch(e){console.error('Sisteme Bağlan:',e);if(msgEl)msgEl.textContent='Bağlantı kurulamadı: '+(e?.message||String(e));else alert('Bağlantı kurulamadı: '+(e?.message||String(e)));}
  }
  window.saveConfig=connectFromSetup;

  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I'},'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS'},'Avenir 6MP IP Kamera':{model:'AV-M21'},'Avenir 8MP IP Kamera':{model:'AV-S242X'},'Avenir 2MP HD Kamera':{model:'AV-DF234'},'Avenir 4MP HD Kamera':{model:'AV-DF418AHD'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D'},'HiLook 4MP IP Kamera':{model:'IPC-B140H'},'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL'},'HiLook 8MP IP Kamera':{model:'IPC-B180H'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)'},'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)'},'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU'},'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL'},'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)'},'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4'},'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4'},'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL'},'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV'},'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED'},'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4'},'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A'},'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A'}
  };
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const names=new Map(Object.entries(details).map(([name,value])=>[norm(name),value]));
  let running=false;
  async function cleanCameraCatalog(){
    if(running||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('id,name,model');if(r.error)throw r.error;
      const groups=new Map();(r.data||[]).filter(p=>names.has(norm(p.name))).forEach(p=>{const key=norm(p.name);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);});
      const remove=[];
      for(const [key,list] of groups){const canonical=names.get(key);if(!canonical)continue;const keep=list.find(p=>norm(p.model)===norm(canonical.model))||list[0];const update=await client.from('products').update({model:canonical.model}).eq('id',keep.id);if(update.error)throw update.error;list.filter(p=>p.id!==keep.id).forEach(p=>remove.push(p.id));}
      for(let i=0;i<remove.length;i+=100){const d=await client.from('products').delete().in('id',remove.slice(i,i+100));if(d.error)throw d.error;}
      if(remove.length&&typeof loadAll==='function')await loadAll();if(remove.length&&typeof toast==='function')toast(`${remove.length} tekrarlı kamera kaydı temizlendi.`);
    }catch(e){console.error('CCTV katalog temizliği:',e)}finally{running=false;}
  }
  window.turkogluCleanCameraCatalog=cleanCameraCatalog;

  let recoveryStarted=false;
  async function recoverBrokenIndexScript(){
    if(recoveryStarted)return;recoveryStarted=true;
    try{
      if(typeof window.saveConfig==='function'&&typeof window.start==='function')return;
      const response=await fetch('./index.html?recovery='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('index.html kurtarma dosyası okunamadı: HTTP '+response.status);
      const html=await response.text();const match=html.match(/<script>\s*([\s\S]*?)<\/script>\s*<script src="\.\/camera-catalog\.js">/i);if(!match)throw new Error('Ana uygulama scripti bulunamadı.');
      const broken=match[1];const fixed=broken.replace("\"'\":'&#039;'}[m]),today=", "\"'\":'&#039;'}[m])),today=");if(fixed===broken)throw new Error('Bilinen JavaScript sözdizimi hatası bulunamadı.');
      (0,eval)(fixed);console.info('Türkoğlu: bozuk inline uygulama scripti kurtarıldı.');
    }catch(e){console.error('Türkoğlu uygulama kurtarma:',e);const msg=document.getElementById('authMsg');if(msg)msg.textContent='Uygulama JavaScript hatası düzeltilemedi: '+(e?.message||String(e));}
  }
  recoverBrokenIndexScript();

  function loadProfessionalTheme(){
    if(document.getElementById('turkogluProfessionalTheme'))return;
    const link=document.createElement('link');link.id='turkogluProfessionalTheme';link.rel='stylesheet';link.href='./theme.css?v=1';document.head.appendChild(link);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadProfessionalTheme,{once:true});else loadProfessionalTheme();

  function initProductFilters(){
    const section=document.getElementById('products');
    const bar=section?.querySelector('.searchbar');
    if(!section||!bar||document.getElementById('productBrandFilter'))return;
    const makeSelect=(id,placeholder)=>{
      const s=document.createElement('select');
      s.id=id;s.title=placeholder;s.setAttribute('aria-label',placeholder);
      s.style.maxWidth='210px';s.innerHTML=`<option value="all">${placeholder}</option>`;
      s.addEventListener('change',applyProductFilters);return s;
    };
    const brand=makeSelect('productBrandFilter','Tüm markalar');
    const category=makeSelect('productCategoryFilter','Tüm kategoriler');
    const clear=document.createElement('button');
    clear.type='button';clear.className='light';clear.textContent='Filtreleri Temizle';clear.title='Ürün filtrelerini temizle';
    clear.addEventListener('click',()=>{
      brand.value='all';category.value='all';
      const stock=document.getElementById('stockFilter');if(stock)stock.value='all';
      const search=document.getElementById('productSearch');if(search)search.value='';
      if(typeof window.renderProducts==='function')window.renderProducts();else applyProductFilters();
    });
    bar.appendChild(brand);bar.appendChild(category);bar.appendChild(clear);refreshProductFilterOptions();
  }
  const productBrands=['Avenir','Dahua','Hikvision','HiLook','Uniview','Provision-ISR','TVT','TP-Link','Reçber','HES Kablo','Nexans','Mutlusan','Mean Well','Mervesan','Tunçmatik','Seagate','Western Digital','FormRack','NetConnect','Diverse','Standart','Hizmet'];
  function refreshProductFilterOptions(){
    const brand=document.getElementById('productBrandFilter'),category=document.getElementById('productCategoryFilter');if(!brand||!category)return;
    const oldBrand=brand.value,oldCategory=category.value;const rows=[...document.querySelectorAll('#productRows tr')];const cats=new Set();
    rows.forEach(row=>{const cells=row.cells;if(cells?.length>3){const c=cells[3].textContent.trim();if(c)cats.add(c);}});
    brand.innerHTML='<option value="all">Tüm markalar</option>'+productBrands.map(b=>`<option value="${b}">${b}</option>`).join('');
    category.innerHTML='<option value="all">Tüm kategoriler</option>'+[...cats].sort((a,b)=>a.localeCompare(b,'tr')).map(c=>`<option value="${c.replace(/"/g,'&quot;')}">${c}</option>`).join('');
    if([...brand.options].some(o=>o.value===oldBrand))brand.value=oldBrand;if([...category.options].some(o=>o.value===oldCategory))category.value=oldCategory;applyProductFilters();
  }
  function rowBrand(text){const n=norm(text);return productBrands.find(b=>n.includes(norm(b)))||'';}
  function applyProductFilters(){
    const brand=norm(document.getElementById('productBrandFilter')?.value||'all');const category=norm(document.getElementById('productCategoryFilter')?.value||'all');
    document.querySelectorAll('#productRows tr').forEach(row=>{const cells=row.cells;if(!cells||cells.length<4)return;const rowText=row.textContent||'';const rowCat=norm(cells[3].textContent);const brandOk=brand==='all'||norm(rowBrand(rowText))===brand;const categoryOk=category==='all'||rowCat===category;row.style.display=brandOk&&categoryOk?'':'none';});
  }
  function watchProductRows(){
    initProductFilters();const rows=document.getElementById('productRows');if(!rows||rows.dataset.filterWatcher)return;rows.dataset.filterWatcher='1';
    const observer=new MutationObserver(()=>{clearTimeout(observer._timer);observer._timer=setTimeout(()=>refreshProductFilterOptions(),0)});observer.observe(rows,{childList:true,subtree:true});
  }

  /* Teklif ürün filtreleri ve seçilen ürünler paneli. Filtreleme yalnızca görünürlüğü değiştirir. */
  function quoteProductSource(){return Array.isArray(window.products)?window.products:(typeof products!=='undefined'?products:[]);}
  function quoteCardProduct(card,source){
    const onclick=card.getAttribute('onclick')||'';
    const match=onclick.match(/addQuoteItem\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if(match){const byId=source.find(x=>String(x.id)===String(match[1]));if(byId)return byId;}
    const text=norm(card.textContent||'');
    return source.find(x=>text.includes(norm(x.name))&&(!x.model||text.includes(norm(x.model))))||null;
  }
  function quoteCardMatches(card,p,search,brand,category,stock){
    const text=norm(card.textContent||'');
    const searchOk=!search||text.includes(search);
    const brandText=norm(p?.brand||'');
    const catText=norm(p?.category||'');
    const brandOk=brand==='all'||text.includes(brand)||brandText===brand;
    const categoryOk=category==='all'||text.includes(category)||catText===category;
    const s=p?Number(p.stock||0):NaN;
    let stockOk=true;
    if(stock!=='all'&&!Number.isNaN(s))stockOk=stock==='available'?s>0:stock==='low'?s>0&&s<=5:stock==='zero'?s<=0:true;
    return searchOk&&brandOk&&categoryOk&&stockOk;
  }
  function initQuoteProductFilters(){
    const search=document.getElementById('quoteProductSearch'),box=document.getElementById('quoteProducts');
    if(!search||!box)return;
    let brand=document.getElementById('quoteProductBrandFilter'),category=document.getElementById('quoteProductCategoryFilter'),stock=document.getElementById('quoteProductStockFilter');
    if(!brand||!category||!stock){
      const bar=search.parentElement;if(!bar)return;
      const make=(id,label)=>{const s=document.createElement('select');s.id=id;s.title=label;s.setAttribute('aria-label',label);s.style.maxWidth='170px';s.innerHTML=`<option value="all">${label}</option>`;s.addEventListener('change',applyQuoteProductFilters);return s;};
      brand=make('quoteProductBrandFilter','Tüm markalar');category=make('quoteProductCategoryFilter','Tüm kategoriler');stock=make('quoteProductStockFilter','Tüm stoklar');
      const clear=document.createElement('button');clear.type='button';clear.className='light';clear.textContent='Filtreleri Temizle';clear.addEventListener('click',()=>{search.value='';brand.value='all';category.value='all';stock.value='all';applyQuoteProductFilters();});
      bar.appendChild(brand);bar.appendChild(category);bar.appendChild(stock);bar.appendChild(clear);
    }
    const source=quoteProductSource();
    const brands=[...new Set(source.map(p=>String(p.brand||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    const cats=[...new Set(source.map(p=>String(p.category||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    const oldBrand=brand.value,oldCategory=category.value,oldStock=stock.value;
    brand.innerHTML='<option value="all">Tüm markalar</option>'+brands.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    category.innerHTML='<option value="all">Tüm kategoriler</option>'+cats.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if([...brand.options].some(o=>o.value===oldBrand))brand.value=oldBrand;if([...category.options].some(o=>o.value===oldCategory))category.value=oldCategory;if([...stock.options].some(o=>o.value===oldStock))stock.value=oldStock;
    applyQuoteProductFilters();
    moveQuoteSelectedPanel();
  }
  function applyQuoteProductFilters(){
    const search=norm(document.getElementById('quoteProductSearch')?.value||'');const brand=norm(document.getElementById('quoteProductBrandFilter')?.value||'all');const category=norm(document.getElementById('quoteProductCategoryFilter')?.value||'all');const stock=document.getElementById('quoteProductStockFilter')?.value||'all';
    const source=quoteProductSource();
    document.querySelectorAll('#quoteProducts .p').forEach(card=>{
      const p=quoteCardProduct(card,source);
      const visible=quoteCardMatches(card,p,search,brand,category,stock);
      card.hidden=!visible;
      card.style.removeProperty('display');
    });
  }

  function quoteRemoveClickFix(){
    const modal=document.getElementById('modalBox');if(!modal||modal.dataset.quoteRemoveFix)return;modal.dataset.quoteRemoveFix='1';
    modal.addEventListener('click',function(ev){
      const target=ev.target?.closest?.('button,a,[role="button"]');if(!target)return;
      const label=norm(target.textContent||'');
      if(label!=='×'&&label!=='x'&&label!=='sil'&&label!=='kaldır')return;
      const attr=target.getAttribute('onclick');
      if(attr){
        try{ev.preventDefault();ev.stopImmediatePropagation();new Function(attr).call(target);setTimeout(moveQuoteSelectedPanel,0);}catch(e){console.error('Teklif ürün silme:',e);}
      }
    },true);
  }

  function moveQuoteSelectedPanel(){
    const modal=document.getElementById('modalBox');const picker=document.getElementById('quoteProducts');if(!modal||!picker)return;
    let candidate=null;
    const tables=[...modal.querySelectorAll('table')];
    for(const table of tables){
      const txt=norm(table.textContent||'');
      if((txt.includes('ürün')||txt.includes('model'))&&table!==picker.closest('table')){candidate=table;break;}
    }
    if(!candidate){
      const rows=[...modal.querySelectorAll('tr')].filter(r=>norm(r.textContent||'').includes('×'));
      if(rows.length)candidate=rows[0].closest('table')||rows[0].parentElement;
    }
    if(candidate&&candidate.parentElement!==modal){modal.insertBefore(candidate,modal.firstElementChild?.nextSibling||picker);}
    else if(candidate&&candidate!==picker&&candidate.compareDocumentPosition(picker)&Node.DOCUMENT_POSITION_FOLLOWING){modal.insertBefore(candidate,picker);}
    const heading=candidate&&candidate.previousElementSibling;
    if(candidate&&heading&&!heading.dataset.quoteSelectedTitle&&norm(heading.textContent||'').includes('seçilen'))heading.dataset.quoteSelectedTitle='1';
  }

  function watchQuoteProductFilters(){
    const modalBox=document.getElementById('modalBox');if(!modalBox||modalBox.dataset.quoteFilterWatcher)return;modalBox.dataset.quoteFilterWatcher='1';quoteRemoveClickFix();
    const observer=new MutationObserver(()=>{clearTimeout(observer._timer);observer._timer=setTimeout(()=>{initQuoteProductFilters();moveQuoteSelectedPanel();},20)});observer.observe(modalBox,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{watchProductRows();watchQuoteProductFilters()},{once:true});else setTimeout(()=>{watchProductRows();watchQuoteProductFilters()},50);
})();
