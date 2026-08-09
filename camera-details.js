/* CCTV katalog temizleme + gerçek model/özellik güncellemesi
   - Sadece kamera katalog kayıtlarını etkiler.
   - Modeli olmayan kamera kayıtlarını siler.
   - Aynı kamera adının tekrarlarını tek kayda indirir.
   - Gerçek model/özellik doğrulanmış kayıtları korur.
*/
(function(){
  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I',description:'Avenir AV-IP3020-I — 2/3 MP sınıfı IP dome; 2.8-12 mm varifokal lens; H.265/H.264; RTSP; DWDR/BLC/HLC/DEFOG/3D DNR; hareket algılama; IP66; PoE/12V DC.'},
    'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS',description:'Avenir AV-IP4045-IS — 4 MP IP bullet; 3.6 mm sabit lens; Warmlight/Starlight; 30-40 m gece görüş; H.265/H.264; RTSP/P2P; DWDR/BLC/HLC/DEFOG/3D DNR; dahili ses; PoE; IP66.'},
    'Avenir 6MP IP Kamera':{model:'AV-M21',description:'Avenir AV-M21 — üretici sayfasında 6 MP olarak listelenen 3 lensli Wi-Fi PTZ IP kamera; 10X optik zoom; ICSEE; IR + WarmLED; ONVIF; H.264+/H.265; PIR + radar; dahili hoparlör; 128 GB MicroSD.'},
    'Avenir 8MP IP Kamera':{model:'AV-S242X',description:'Avenir AV-S242X — üretici sayfasında 8 MP, 42X optik zoomlu çift kameralı Wi-Fi PTZ Speed Dome; 80 m renkli/120 m IR gece görüş; ONVIF; insan takibi; 256 GB SD; IP66.'},
    'Avenir 2MP HD Kamera':{model:'AV-DF234',description:'Avenir AV-DF234 — 2 MP 4-in-1 AHD dome; 3.6 mm sabit lens; AHD/CVBS/CVI/TVI; 35-40 m IR; UTC; DWDR; 3DNR; AGC; IP66.'},
    'Avenir 4MP HD Kamera':{model:'AV-DF418AHD',description:'Avenir AV-DF418AHD — 4 MP AHD dome; 3.6 mm lens; 18 SMD LED; yaklaşık 30 m gece görüş; DWDR; 2DNR; OSD; IR-CUT; IP67; 12V DC.'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D',description:'HiLook IPC-B120H-D — 2 MP sabit bullet IP kamera ailesi; 1920x1080; 2.8 mm sınıfı lens; yaklaşık 30 m IR; H.265+; PoE; IP67.'},
    'HiLook 4MP IP Kamera':{model:'IPC-B140H',description:'HiLook IPC-B140H — 4 MP sabit bullet IP kamera; 2560x1440; 2.8/4 mm lens seçenekleri; IR; H.265+; PoE; IP67.'},
    'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL',description:'HiLook IPC-B469HAD-LUF/SL — 6 MP sınıfı IP bullet ailesi; Smart Hybrid Light; insan/araç algılama; H.265+ sınıfı video sıkıştırma.'},
    'HiLook 8MP IP Kamera':{model:'IPC-B180H',description:'HiLook IPC-B180H — 8 MP 4K sabit bullet IP kamera; 3840x2160; 2.8/4 mm; 30 m IR; 120 dB WDR; H.265+; PoE; IP67.'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)',description:'Hikvision DS-2CD1023G2-I(UF) — 2 MP sabit bullet IP; insan/araç algılama; DWDR; EXIR 2.0; IP67; PoE sınıfı kullanım.'},
    'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)',description:'Hikvision DS-2CD1043G2-LIU(F) — 4 MP Smart Hybrid Light sabit bullet IP; 2560x1440; 2.8/4 mm; insan/araç algılama; dahili mikrofon; H.265+; IP67.'},
    'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU',description:'Hikvision DS-2CD3063G2-LIU — 6 MP AcuSense Smart Hybrid Light sabit bullet IP; 3200x1800; 2.8/4/6 mm seçenekleri; 120 dB WDR; dahili çift mikrofon; IP67.'},
    'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL',description:'Hikvision DS-2CD3083G2-LIU/SL — 8 MP AcuSense Smart Hybrid Light sabit mini-bullet IP; 3840x2160; 2.8/4/6 mm seçenekleri; 120 dB WDR; dahili çift mikrofon; H.265+; IP67/IK10.'},
    'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)',description:'Hikvision DS-2CE56D0T-IT3(C) — 2 MP Turbo HD turret; 1920x1080; 2.8/3.6/6/8/12 mm lens seçenekleri; EXIR 2.0; 40 m IR; TVI; IP67.'},
    'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E',description:'Hikvision DS-2CE12UF3T-E — 8 MP 4K ColorVu PoC fixed mini-bullet Turbo HD; 3840x2160; 2.8/3.6/6 mm; 40 m beyaz ışık; 130 dB True WDR; IP67.'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4',description:'Dahua IPC-HFW1230S-S4 — 2 MP IR mini-bullet network kamera; 1920x1080; 2.8/3.6 mm; 30 m IR; H.265/H.264; DWDR; 3DNR; IP67; PoE.'},
    'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4',description:'Dahua DH-IPC-HFW1431S-S4 — 4 MP Entry IR fixed-focal bullet network kamera; 2560x1440; H.265; 30 m IR; WDR; 3DNR; IP67; 12V DC/PoE.'},
    'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL',description:'Dahua IPC-HDW2649TM-S-IL — 6 MP Smart Dual Light fixed-focal eyeball WizSense; 3288x1850; IR + LED; insan/araç sınıflandırma; dahili mikrofon; H.264+/H.265+; microSD.'},
    'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV',description:'Dahua DH-IPC-HFW3849T1-AS-PV — 8 MP WizSense Smart Dual Light bullet IP; 3840x2160; 2.8/3.6 mm; IR + warm light; 120 dB WDR; SMD/IVS; dahili mikrofon; microSD; PoE; IP67.'},
    'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED',description:'Dahua HAC-HFW1239MH(-A)-LED — 2 MP Full-color HDCVI bullet kamera ailesi; üretici HDCVI ürün seçicisinde doğrulanmış model.'},
    'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4',description:'Dahua HAC-HFW1400TH-I4 — 4 MP HDCVI IR bullet; 2560x1440; 2.8/3.6/6 mm; 40 m IR; HD/SD switchable; IP67; 12V DC.'},
    'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A',description:'Dahua HAC-HFW2601E-A — 6 MP WDR HDCVI IR bullet; 2880x1920; 3.6 mm (2.8/6 mm opsiyon); 40 m Smart IR; 120 dB True WDR; 3DNR; dahili mikrofon; IP67.'},
    'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A',description:'Dahua HAC-HFW1801T-A — 8 MP 4K HDCVI IR bullet; 3840x2160; CVI/CVBS/AHD/TVI; 2.8/3.6/6 mm; 30 m Smart IR; 120 dB WDR; dahili mikrofon; IP67.'}
  };
  const cameraName=n=>/^(Avenir|HiLook|Hikvision|Dahua) \d+MP (IP|HD) Kamera$/i.test(String(n||''));
  const validModel=m=>{const s=String(m||'').trim();return !!s && !/^DOĞRUL/i.test(s) && !/^GEN-/i.test(s);};
  async function run(){
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    try{
      const r=await client.from('products').select('id,name,brand,model,category,description');
      if(r.error)throw r.error;
      const rows=r.data||[];
      const groups=new Map();
      rows.filter(p=>cameraName(p.name)).forEach(p=>{const k=String(p.name).trim().toLocaleLowerCase('tr-TR');if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p);});
      const remove=[];
      for(const [name,list] of groups){
        const info=details[list[0].name];
        const preferred=list.filter(p=>validModel(p.model));
        if(!info || !info.model){remove.push(...list.map(p=>p.id));continue;}
        const keep=preferred.find(p=>p.model===info.model)||preferred[0]||list[0];
        for(const p of list)if(p.id!==keep.id)remove.push(p.id);
        const u=await client.from('products').update({model:info.model,description:info.description}).eq('id',keep.id);
        if(u.error)throw u.error;
      }
      for(const id of remove){const d=await client.from('products').delete().eq('id',id);if(d.error)throw d.error;}
      if(typeof loadAll==='function')await loadAll();
      if(typeof toast==='function')toast(`${remove.length} tekrarlı/yanlış kamera kaydı temizlendi. Modeli doğrulanmayan kamera kayıtları kaldırıldı.`);
    }catch(e){console.error('CCTV katalog temizliği:',e);if(typeof toast==='function')toast('Katalog temizlenemedi: '+(e.message||e));}
  }
  const t=setInterval(run,2000);setTimeout(()=>clearInterval(t),120000);
})();
