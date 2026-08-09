/* Supabase bağlantı kurtarma + CCTV katalog temizleme. */
(function(){
  async function loadSdk(){
    if(window.supabase?.createClient)return true;
    const urls=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js','https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js'];
    for(const src of urls){
      try{
        await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
        if(window.supabase?.createClient)return true;
      }catch(e){console.warn('Supabase SDK yüklenemedi:',src,e)}
    }
    return false;
  }
  async function repairConnection(){
    try{
      const cfg=typeof getCfg==='function'?getCfg():{};
      if(!cfg.u||!cfg.k)return;
      if(!window.supabase?.createClient){
        const ok=await loadSdk();
        if(!ok){const m=document.getElementById('authMsg');if(m)m.textContent='Supabase bağlantı kütüphanesi yüklenemedi. Sayfayı yenileyin.';return;}
      }
      if(typeof client==='undefined'||!client){if(typeof initClient==='function')initClient()}
      if(typeof client==='undefined'||!client)return;
      const s=await client.auth.getSession();
      if(s.data?.session?.user){user=s.data.session.user;if(typeof showApp==='function')showApp();if(typeof loadAll==='function')await loadAll();}
      else{const setup=document.getElementById('setupBox'),auth=document.getElementById('authBox');if(setup)setup.classList.add('hidden');if(auth)auth.classList.remove('hidden');}
    }catch(e){console.error('Supabase bağlantı kurtarma:',e);const m=document.getElementById('authMsg');if(m)m.textContent='Supabase bağlantısı kurulamadı: '+(e.message||e)}
  }
  setTimeout(repairConnection,1200);setTimeout(repairConnection,3500);
  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I'},'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS'},'Avenir 6MP IP Kamera':{model:'AV-M21'},'Avenir 8MP IP Kamera':{model:'AV-S242X'},
    'Avenir 2MP HD Kamera':{model:'AV-DF234'},'Avenir 4MP HD Kamera':{model:'AV-DF418AHD'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D'},'HiLook 4MP IP Kamera':{model:'IPC-B140H'},'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL'},'HiLook 8MP IP Kamera':{model:'IPC-B180H'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)'},'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)'},'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU'},'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL'},
    'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)'},'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4'},'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4'},'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL'},'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV'},
    'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED'},'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4'},'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A'},'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A'}
  };
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');const names=new Set(Object.keys(details).map(norm));let running=false,done=false;
  async function run(){
    if(running||done||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;running=true;
    try{const r=await client.from('products').select('id,name,brand,model,category');if(r.error)throw r.error;const groups=new Map();(r.data||[]).filter(p=>names.has(norm(p.name))).forEach(p=>{const k=norm(p.name);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)});const remove=[];for(const [k,list] of groups){const canonical=details[list[0].name];const keep=list.find(p=>norm(p.model)===norm(canonical.model))||list[0];const u=await client.from('products').update({model:canonical.model}).eq('id',keep.id);if(u.error)throw u.error;list.filter(p=>p.id!==keep.id).forEach(p=>remove.push(p.id))}for(let i=0;i<remove.length;i+=100){const d=await client.from('products').delete().in('id',remove.slice(i,i+100));if(d.error)throw d.error}done=true;if(typeof loadAll==='function')await loadAll();if(typeof toast==='function')toast(`${remove.length} tekrarlı kamera kaydı temizlendi.`)}catch(e){console.error('CCTV katalog temizliği:',e);done=true;if(typeof toast==='function')toast('Katalog temizliği tamamlanamadı: '+(e.message||e))}finally{running=false}
  }
  const wait=setInterval(()=>{if(typeof user!=='undefined'&&user&&typeof client!=='undefined'){clearInterval(wait);setTimeout(run,3000)}},500);setTimeout(()=>clearInterval(wait),30000);window.turkogluCleanCameraCatalog=run;
})();
