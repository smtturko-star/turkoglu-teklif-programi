/* Türkoğlu CCTV kamera kataloğu: giriş yapan hesabın products tablosuna eksikleri bir kez ekler. */
(function(){
  const KEY='turkoglu_camera_catalog_v1';
  const catalog=[];
  const ipBrands=['Avenir','HiLook','Hikvision','Dahua'];
  const hdBrands=['Hikvision','Dahua'];
  [
    ...ipBrands.flatMap(brand=>[2,4,6,8].map(mp=>({brand,category:'IP Kamera',mp}))),
    ...hdBrands.flatMap(brand=>[2,4,6,8].map(mp=>({brand,category:'HD Kamera',mp})))
  ].forEach(x=>catalog.push({
    name:`${x.brand} ${x.mp}MP ${x.category}`,
    brand:x.brand,
    model:`GEN-${x.category==='IP Kamera'?'IP':'HD'}-${x.mp}MP`,
    category:x.category,
    purchase_price:0,
    sale_price:0,
    vat_rate:20,
    stock:0,
    description:`${x.brand} ${x.mp} MP ${x.category}. Fiyat ve gerçek model bilgisi sonradan düzenlenebilir.`,
    image_url:null
  }));

  async function seed(){
    if(!window.client || !window.user) return;
    if(localStorage.getItem(KEY)==='done') return;
    try{
      const r=await window.client.from('products').select('name,brand,model,category');
      if(r.error) throw r.error;
      const existing=new Set((r.data||[]).map(p=>[p.name,p.brand,p.model,p.category].map(v=>String(v||'').trim().toLocaleLowerCase('tr-TR')).join('|')));
      const missing=catalog.filter(p=>!existing.has([p.name,p.brand,p.model,p.category].map(v=>String(v||'').trim().toLocaleLowerCase('tr-TR')).join('|')));
      if(missing.length){
        const ins=await window.client.from('products').insert(missing);
        if(ins.error) throw ins.error;
      }
      localStorage.setItem(KEY,'done');
      if(typeof window.loadAll==='function') await window.loadAll();
      if(typeof window.toast==='function') window.toast(`${missing.length} kamera ürünü kataloğa eklendi.`);
    }catch(e){
      console.error('Kamera kataloğu eklenemedi:',e);
    }
  }
  let tries=0;
  const timer=setInterval(()=>{tries++;if(window.client&&window.user){clearInterval(timer);seed()}else if(tries>120)clearInterval(timer)},500);
})();
