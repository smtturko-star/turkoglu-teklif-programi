/* Türkoğlu CCTV kamera kataloğu v3 - aktif uygulama oturumu üzerinden eksik ürünleri ekler. */
(function(){
  const catalog=[];
  const ipBrands=['Avenir','HiLook','Hikvision','Dahua'];
  const hdBrands=['Hikvision','Dahua'];
  [...ipBrands.flatMap(brand=>[2,4,6,8].map(mp=>({brand,category:'IP Kamera',mp}))),...hdBrands.flatMap(brand=>[2,4,6,8].map(mp=>({brand,category:'HD Kamera',mp})))].forEach(x=>catalog.push({
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
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const key=p=>[p.name,p.brand,p.model,p.category].map(norm).join('|');
  let running=false;
  async function seed(){
    if(running)return;
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('name,brand,model,category');
      if(r.error)throw r.error;
      const existing=new Set((r.data||[]).map(key));
      const missing=catalog.filter(p=>!existing.has(key(p)));
      if(!missing.length)return;
      const ins=await client.from('products').insert(missing);
      if(ins.error)throw ins.error;
      if(typeof loadAll==='function')await loadAll();
      if(typeof toast==='function')toast(`${missing.length} kamera ürünü kataloğa eklendi.`);
    }catch(e){
      console.error('Kamera kataloğu eklenemedi:',e);
      if(typeof toast==='function')toast('Kamera kataloğu eklenemedi: '+(e.message||e));
    }finally{running=false}
  }
  window.turkogluSeedCameras=seed;
  const timer=setInterval(()=>{seed()},1000);
  setTimeout(()=>clearInterval(timer),120000);
})();
