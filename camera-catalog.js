/* Türkoğlu CCTV katalog + güvenli ürün seed + teklif kombinasyonları */
(function(){
  'use strict';
  if(window.__turkogluCameraCatalogLoaded)return;
  window.__turkogluCameraCatalogLoaded=true;

  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const price=p=>Number(p?.sale_price??p?.salePrice??p?.price??0)||0;
  const catalog=[
    ['Avenir','2MP IP Kamera','AV-IP3020-I'],['Avenir','4MP IP Kamera','AV-IP4045-IS'],['Avenir','6MP IP Kamera','AV-M21'],['Avenir','8MP IP Kamera','AV-S242X'],
    ['Avenir','2MP HD Kamera','AV-DF234'],['Avenir','4MP HD Kamera','AV-DF418AHD'],
    ['HiLook','2MP IP Kamera','IPC-B120H-D'],['HiLook','4MP IP Kamera','IPC-B140H'],['HiLook','6MP IP Kamera','IPC-B469HAD-LUF/SL'],['HiLook','8MP IP Kamera','IPC-B180H'],
    ['Hikvision','2MP IP Kamera','DS-2CD1023G2-I(UF)'],['Hikvision','4MP IP Kamera','DS-2CD1043G2-LIU(F)'],['Hikvision','6MP IP Kamera','DS-2CD3063G2-LIU'],['Hikvision','8MP IP Kamera','DS-2CD3083G2-LIU/SL'],
    ['Hikvision','2MP HD Kamera','DS-2CE56D0T-IT3(C)'],['Hikvision','8MP HD Kamera','DS-2CE12UF3T-E'],
    ['Dahua','2MP IP Kamera','IPC-HFW1230S-S4'],['Dahua','4MP IP Kamera','DH-IPC-HFW1431S-S4'],['Dahua','6MP IP Kamera','IPC-HDW2649TM-S-IL'],['Dahua','8MP IP Kamera','DH-IPC-HFW3849T1-AS-PV'],
    ['Dahua','2MP HD Kamera','HAC-HFW1239MH(-A)-LED'],['Dahua','4MP HD Kamera','HAC-HFW1400TH-I4'],['Dahua','6MP HD Kamera','HAC-HFW2601E-A'],['Dahua','8MP HD Kamera','HAC-HFW1801T-A']
  ].map(([brand,category,model])=>({name:`${brand} ${category}`,brand,model,category,purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:`${brand} ${category} — doğrulanmış model ${model}.`,image_url:null}));

  const extraProducts=[
    {name:"3'lü Grup Priz",brand:'Standart',model:'3LÜ-GRUP-PRİZ',category:'Elektrik Malzemeleri',purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:'3 çıkışlı grup priz',image_url:null},
    {name:'Erkek Fiş',brand:'Standart',model:'ERKEK-FİŞ',category:'Elektrik Malzemeleri',purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:'Standart erkek fiş',image_url:null}
  ];

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

  const key=p=>norm(`${p.name}|${p.brand}|${p.model}|${p.category}`);
  const modelKey=p=>norm(`${p.brand}|${p.model}`);
  let busy=false;

  async function seedProducts(){
    if(busy||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    busy=true;
    try{
      const r=await client.from('products').select('id,name,brand,model,category,image_url');
      if(r.error)throw r.error;
      const rows=r.data||[];
      const existing=new Set(rows.map(key));
      const wanted=[...catalog,...extraProducts];
      const missing=wanted.filter(p=>!existing.has(key(p)));
      if(missing.length){
        const ins=await client.from('products').insert(missing);
        if(ins.error)throw ins.error;
      }
      const refreshed=await client.from('products').select('id,brand,model,image_url');
      if(!refreshed.error){
        const updates=(refreshed.data||[]).filter(p=>!String(p.image_url||'').trim()&&imageMap[modelKey(p)]);
        for(const p of updates){await client.from('products').update({image_url:imageMap[modelKey(p)]}).eq('id',p.id);}
      }
      if(typeof loadAll==='function')await loadAll();
      if(typeof window.turkogluRefreshProductFilters==='function')window.turkogluRefreshProductFilters();
    }catch(e){console.error('Kamera/elektrik ürün seed:',e)}finally{busy=false;}
  }

  window.turkogluSeedCameras=seedProducts;
  window.turkogluRefreshProductFilters=()=>{};
  setTimeout(seedProducts,1200);
  setInterval(()=>{if(typeof user!=='undefined'&&user)seedProducts();},15000);

  /* ---------------------------------------------------------
     TEKLİF KAMERA KOMBİNASYON SİHİRBAZI
     Mevcut ürünleri kullanır; yeni ürün veya veritabanı tablosu oluşturmaz.
     4/8/16 kamera + Ekonomik/Orta/Profesyonel seçenekleri verir.
  --------------------------------------------------------- */
  const domProducts=()=>[...document.querySelectorAll('#quoteProducts .p')].map(card=>{
    const raw=card.getAttribute('onclick')||'';
    const m=raw.match(/addQuoteItem\s*\(\s*['\"]?([^'\")]+)['\"]?\s*\)/i);
    const lines=[...card.querySelectorAll('b,small')].map(x=>x.textContent.trim()).filter(Boolean);
    const name=lines[0]||card.textContent.trim().split('\n')[0]||'';
    const model=lines[1]||'';
    const txt=norm(card.textContent);
    const pm=card.textContent.match(/(?:₺|TL)\s*([\d.,]+)/i)||card.textContent.match(/([\d.]+,[\d]{2})\s*(?:₺|TL)/i);
    const sale_price=pm?Number(String(pm[1]).replace(/\./g,'').replace(',','.')):0;
    return {id:m?m[1]:'',name,model,category:'',brand:'',stock:1000,sale_price};
  }).filter(p=>p.id&&p.name);
  const allProducts=()=>Array.isArray(window.products)&&window.products.length?window.products:domProducts();
  const text=p=>norm(`${p?.name||''} ${p?.model||''} ${p?.category||''} ${p?.subcategory||''}`);
  const stock=p=>Number(p?.stock??1000)||0;
  const compatible=(p,words)=>words.some(w=>text(p).includes(norm(w)));
  const tierIndex=(tier,n)=>tier==='economic'?0:tier==='premium'?Math.max(0,n-1):Math.floor((n-1)/2);

  function byRole(words, excludeWords=[]){
    return allProducts().filter(p=>stock(p)>0 && compatible(p,words) && !compatible(p,excludeWords));
  }

  function choose(list,tier){
    if(!list.length)return null;
    const sorted=[...list].sort((a,b)=>price(a)-price(b));
    return sorted[Math.min(tierIndex(tier,sorted.length),sorted.length-1)];
  }

  function chooseNvr(count,tier){
    let list=byRole(['nvr','kayıt cihazı','kayıt cihaz']);
    if(!list.length)return null;
    const channelScore=p=>{
      const m=text(p).match(/(?:^|\D)(4|8|16|32|64)(?:\s*kanal|\s*ch|ch\s*)/);
      const n=m?Number(m[1]):0;
      return n>=count?n:999;
    };
    list.sort((a,b)=>channelScore(a)-channelScore(b)||price(a)-price(b));
    const exact=list.filter(p=>channelScore(p)!==999);
    return choose(exact.length?exact:list,tier);
  }

  function chooseCamera(tier){
    let list=byRole(['ip kamera','kamera'],['nvr','kayıt cihaz','dummy','sahte']);
    const ip=list.filter(p=>text(p).includes('ip kamera'));
    return choose(ip.length?ip:list,tier);
  }

  function buildCombo(count,tier){
    const picked=[];
    const add=(role,p,qty=1)=>{if(p)picked.push({role,p,qty});};
    add('Kamera',chooseCamera(tier),count);
    add('NVR',chooseNvr(count,tier),1);
    add('HDD',choose(byRole(['hdd','hard disk','disk']),tier),1);
    add('PoE / Switch',choose(byRole(['poe switch','poe','switch']),tier),1);
    add('Kablo',choose(byRole(['cat6','cat 6','rg59','koaksiyel','cctv kablo','kablo']),tier),count===4?100:count===8?150:250);
    add('Kablo Kanalı',choose(byRole(['kablo kanalı','kablo kanali']),tier),count===4?100:count===8?150:250);
    add('BNC',choose(byRole(['bnc']),tier),text(picked.find(x=>x.role==='Kamera')?.p||{}).includes('hd')?count*2:0);
    add('Adaptör / Güç',choose(byRole(['adaptör','adaptör','güç kaynağı','power supply']),tier),1);
    return picked.filter(x=>x.p&&x.qty>0);
  }

  function money(n){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(n||0);}

  function comboStyle(){
    if(document.getElementById('comboWizardStyle'))return;
    const s=document.createElement('style');s.id='comboWizardStyle';s.textContent=`
      .combo-wizard{border:1px solid #dbe5e1;border-radius:14px;background:#f8fffd;padding:14px;margin:0 0 16px}
      .combo-wizard h3{margin:0 0 4px}.combo-wizard .muted{margin-bottom:10px}.combo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.combo-card{background:#fff;border:1px solid #dfe7e4;border-radius:12px;padding:10px}.combo-card strong{display:block}.combo-card small{display:block;color:#64748b;margin:4px 0 8px}.combo-card button{width:100%;padding:8px}.combo-result{margin-top:10px;border-top:1px dashed #cbd5e1;padding-top:10px}.combo-result table{min-width:0}.combo-result td,.combo-result th{padding:7px 8px}.combo-note{font-size:11px;color:#64748b;margin-top:8px}@media(max-width:650px){.combo-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function setQuoteQty(product,qty){
    const modal=document.getElementById('modalBox');if(!modal)return;
    const rows=[...modal.querySelectorAll('#qitems tr')];
    const needle=norm(product?.name||'');
    const row=rows.find(r=>norm(r.textContent).includes(needle)&&(!product.model||norm(r.textContent).includes(norm(product.model))));
    if(!row)return;
    const input=row.querySelector('input[type="number"]');
    if(!input)return;
    input.value=String(qty);
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function addComboToQuote(picked){
    if(typeof window.addQuoteItem!=='function')return;
    picked.forEach(x=>window.addQuoteItem(x.p.id));
    setTimeout(()=>picked.forEach(x=>setQuoteQty(x.p,x.qty)),350);
    setTimeout(()=>picked.forEach(x=>setQuoteQty(x.p,x.qty)),900);
    setTimeout(()=>{if(typeof window.renderQuoteDraft==='function')window.renderQuoteDraft();},1000);
  }

  function openComboWizard(){
    const modal=document.getElementById('modalBox');if(!modal)return;
    comboStyle();
    let box=document.getElementById('quoteComboWizard');
    if(box){box.classList.toggle('hidden');return;}
    box=document.createElement('div');box.id='quoteComboWizard';box.className='combo-wizard';
    box.innerHTML=`<h3>📦 Kamera Seti Kombinasyonu</h3><div class="muted">Mevcut stok ve satış fiyatlarından otomatik paket oluştur. Ürünler mevcut teklifine eklenir.</div><div class="combo-grid" id="comboCards"></div><div class="combo-result hidden" id="comboResult"></div><div class="combo-note">Metrajlar başlangıç önerisidir: 4 kamera 100 mt, 8 kamera 150 mt, 16 kamera 250 mt. Teklif içinde değiştirebilirsin.</div>`;
    const picker=document.getElementById('quoteProducts');
    const parent=picker?.closest('.card')||picker?.parentElement||modal;
    parent.parentElement?.insertBefore(box,parent);
    const cards=box.querySelector('#comboCards');
    [['economic','Ekonomik','En uygun maliyet'],['middle','Orta','Fiyat / performans'],['premium','Profesyonel','Üst seviye']].forEach(([tier,title,desc])=>{
      const c=document.createElement('div');c.className='combo-card';c.innerHTML=`<strong>${title}</strong><small>${desc}</small><div class="actions" style="margin-bottom:7px">${[4,8,16].map(n=>`<button type="button" class="light combo-add" data-tier="${tier}" data-count="${n}">${n} Kamera</button>`).join('')}</div>`;cards.appendChild(c);
    });
    box.addEventListener('click',ev=>{
      const b=ev.target.closest('.combo-add');if(!b)return;
      ev.preventDefault();ev.stopPropagation();
      const tier=b.dataset.tier,count=Number(b.dataset.count);const picked=buildCombo(count,tier);
      const result=box.querySelector('#comboResult');
      if(!picked.length){result.classList.remove('hidden');result.innerHTML='<strong>Uygun stok ürünü bulunamadı.</strong><div class="muted">Ürünleri mevcut stoktan eklediğin zaman kombinasyon otomatik oluşacaktır.</div>';return;}
      const total=picked.reduce((s,x)=>s+price(x.p)*x.qty,0);
      result.classList.remove('hidden');result.innerHTML=`<strong>${count} Kameralı ${tier==='economic'?'Ekonomik':tier==='middle'?'Orta':'Profesyonel'} Paket</strong><div class="muted" style="margin:4px 0 8px">Tahmini ürün toplamı: ${money(total)}</div><table><tbody>${picked.map(x=>`<tr><td>${x.p.name||x.p.model}</td><td style="text-align:right">${x.qty} ${/kablo/i.test(x.role)?'mt':'Adet'}</td></tr>`).join('')}</tbody></table><button type="button" class="green" id="comboApply" style="margin-top:9px">✓ Paketi Teklife Ekle</button>`;
      const apply=result.querySelector('#comboApply');apply.onclick=()=>{addComboToQuote(picked);apply.disabled=true;apply.textContent='✓ Teklife eklendi';};
    });
  }

  function installComboButton(){
    const modal=document.getElementById('modalBox');if(!modal)return;
    const head=modal.querySelector('.modalhead');const title=head?.querySelector('h2');
    if(!head||!title)return;
    const isQuote=/teklif/i.test(title.textContent||'')||!!modal.querySelector('#qitems');
    if(!isQuote||head.dataset.comboButton==='1')return;
    head.dataset.comboButton='1';
    const btn=document.createElement('button');btn.type='button';btn.className='green';btn.textContent='📦 Kombinasyon';btn.title='4 / 8 / 16 kamera hazır setleri';btn.style.cssText='margin-right:7px';
    const close=head.querySelector('.close');head.insertBefore(btn,close||null);btn.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();openComboWizard();});
  }

  function observeQuotes(){
    const modal=document.getElementById('modalBox');if(!modal||modal.dataset.comboObserver==='1')return;
    modal.dataset.comboObserver='1';
    const run=()=>installComboButton();
    new MutationObserver(run).observe(modal,{childList:true,subtree:true});
    run();
  }
  function startCombo(){
    comboStyle();
    const timer=setInterval(()=>{if(document.getElementById('modalBox'))observeQuotes();},300);
    setTimeout(()=>clearInterval(timer),15000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startCombo,{once:true});else startCombo();
})();