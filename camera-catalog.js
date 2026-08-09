/* Türkoğlu CCTV kamera kataloğu: giriş yapan hesabın products tablosuna eksikleri bir kez ekler. */
(function(){
  const KEY='turkoglu_camera_catalog_v1';
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
  async function seed(){
    if(localStorage.getItem(KEY)==='done') return;
    try{
      const cfg=JSON.parse(localStorage.getItem('turkoglu_sb_cfg')||'{}');
      if(!cfg.u||!cfg.k||!window.supabase?.createClient)return;
      const sb=window.supabase.createClient(cfg.u,cfg.k,{auth:{persistSession:true,autoRefreshToken:true}});
      const session=(await sb.auth.getSession()).data.session;
      if(!session?.user)return;
      const r=await sb.from('products').select('name,brand,model,category');
      if(r.error)throw r.error;
      const existing=new Set((r.data||[]).map(key));
      const missing=catalog.filter(p=>!existing.has(key(p)));
      if(missing.length){
        const ins=await sb.from('products').insert(missing);
        if(ins.error)throw ins.error;
      }
      localStorage.setItem(KEY,'done');
      if(typeof window.toast==='function')window.toast(`${missing.length} kamera ürünü kataloğa eklendi.`);
    }catch(e){console.error('Kamera kataloğu eklenemedi:',e)}
  }
  let tries=0;
  const timer=setInterval(()=>{tries++;seed();if(tries>120)clearInterval(timer)},500);
})();
