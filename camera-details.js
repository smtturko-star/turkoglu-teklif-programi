/* Türkoğlu CCTV model doğrulama yardımcıları.
   ÖNEMLİ: Bu dosya uygulama açılışını ve Supabase bağlantısını değiştirmez.
   URL/key, oturum veya SDK kurulumu burada yapılmaz.
*/
(function(){
  'use strict';

  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I'},
    'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS'},
    'Avenir 6MP IP Kamera':{model:'AV-M21'},
    'Avenir 8MP IP Kamera':{model:'AV-S242X'},
    'Avenir 2MP HD Kamera':{model:'AV-DF234'},
    'Avenir 4MP HD Kamera':{model:'AV-DF418AHD'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D'},
    'HiLook 4MP IP Kamera':{model:'IPC-B140H'},
    'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL'},
    'HiLook 8MP IP Kamera':{model:'IPC-B180H'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)'},
    'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)'},
    'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU'},
    'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL'},
    'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)'},
    'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4'},
    'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4'},
    'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL'},
    'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV'},
    'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED'},
    'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4'},
    'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A'},
    'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A'}
  };

  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const names=new Map(Object.entries(details).map(([name,value])=>[norm(name),value]));
  let running=false;

  async function cleanCameraCatalog(){
    if(running||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('id,name,model');
      if(r.error)throw r.error;
      const groups=new Map();
      (r.data||[]).filter(p=>names.has(norm(p.name))).forEach(p=>{
        const key=norm(p.name);
        if(!groups.has(key))groups.set(key,[]);
        groups.get(key).push(p);
      });

      const remove=[];
      for(const [key,list] of groups){
        const canonical=names.get(key);
        if(!canonical)continue;
        const keep=list.find(p=>norm(p.model)===norm(canonical.model))||list[0];
        const update=await client.from('products').update({model:canonical.model}).eq('id',keep.id);
        if(update.error)throw update.error;
        list.filter(p=>p.id!==keep.id).forEach(p=>remove.push(p.id));
      }

      for(let i=0;i<remove.length;i+=100){
        const d=await client.from('products').delete().in('id',remove.slice(i,i+100));
        if(d.error)throw d.error;
      }

      if(remove.length&&typeof loadAll==='function')await loadAll();
      if(remove.length&&typeof toast==='function')toast(`${remove.length} tekrarlı kamera kaydı temizlendi.`);
    }catch(e){
      console.error('CCTV katalog temizliği:',e);
    }finally{
      running=false;
    }
  }

  window.turkogluCleanCameraCatalog=cleanCameraCatalog;

  /* Açılışta otomatik temizlik YOK. Site önce açılsın ve kullanıcı giriş yapabilsin. */
})();
