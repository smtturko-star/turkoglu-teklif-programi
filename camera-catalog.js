/* Türkoğlu CCTV katalog + güvenli ürün seed */
(function(){
  'use strict';
  if(window.__turkogluCameraCatalogLoaded)return;
  window.__turkogluCameraCatalogLoaded=true;

  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
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
})();