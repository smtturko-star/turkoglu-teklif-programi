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

  /* loadAll() ürün listesini render ettikten sonra gerçek DB toplamını tekrar yazar. */
  const originalRender=window.render;
  if(typeof originalRender==='function'){
    window.render=function(){
      const result=originalRender.apply(this,arguments);
      refreshExactProductCount();
      return result;
    };
  }

  /* Aynı script iki kez yüklenmiş olsa bile katalog ekleme işlemi çakışmasın. */
  const timer=setInterval(seed,1500);
  setTimeout(()=>clearInterval(timer),120000);
  countTimer=setInterval(refreshExactProductCount,5000);
  setTimeout(()=>clearInterval(countTimer),120000);
})();
