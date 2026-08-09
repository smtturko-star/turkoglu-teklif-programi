/* Gerçek model/özellik güncellemesi. Yalnızca doğrulanmış üretici bilgileri kullanılır. */
(function(){
  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I',description:'Avenir AV-IP3020-I — 2/3 MP sınıfı IP dome kamera. 2.8-12 mm varifokal lens, 1/2.7 inç IPC CMOS, H.265/H.264, RTSP, DWDR, BLC, HLC, DEFOG, 3D DNR, hareket algılama, alan maskeleme, IP66, 12V DC + PoE (802.3af).'},
    'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS',description:'Avenir AV-IP4045-IS — 4 MP IP bullet. 3.6 mm sabit lens, 1/2.7 inç IPC CMOS, Warmlight/Starlight, 30-40 m gece görüş, H.265/H.264, RTSP/P2P, DWDR/BLC/HLC/DEFOG/3D DNR, hareket algılama, alan maskeleme, dahili ses, PoE, IP66.'},
    'Avenir 6MP IP Kamera':{model:'AV-M21',description:'Avenir AV-M21 — 6 MP sınıfı IP/WiFi PTZ. 3 lens, 10X optik zoom, ICSEE, IR + WarmLED, ONVIF, H.264+/H.265, PIR + radar algılama, dahili hoparlör, 128 GB MicroSD, bulut depolama.'},
    'Avenir 8MP IP Kamera':{model:'AV-S242X',description:'Avenir AV-S242X — 8 MP sınıfı çift kameralı WiFi PTZ Speed Dome. 42X optik zoom, IP/ONVIF sınıfı kullanım, gece görüş ve uzaktan PTZ kontrolü.'},
    'Avenir 2MP HD Kamera':{model:'AV-DF234',description:'Avenir AV-DF234 — 2 MP 4in1 AHD dome. 3.6 mm sabit lens, AHD/CVBS/CVI/TVI, 35-40 m IR, UTC, DWDR, 3DNR, AGC, IP66.'},
    'Avenir 4MP HD Kamera':{model:'AV-DF418AHD',description:'Avenir AV-DF418AHD — 4 MP AHD dome. 3.6 mm lens, 18 SMD LED, 30 m gece görüş, DWDR, 2DNR, OSD, IR-CUT, IP67, 12V DC.'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D',description:'HiLook IPC-B120H-D — 2 MP sınıfı sabit bullet IP kamera. 1920x1080, 2.8 mm, yaklaşık 30 m IR, H.265+, PoE, IP67, hareket algılama.'},
    'HiLook 4MP IP Kamera':{model:'IPC-B140H',description:'HiLook IPC-B140H — 4 MP sınıfı sabit bullet IP kamera. 2560x1440, 2.8/4 mm lens seçenekleri, IR, H.265+, PoE, IP67.'},
    'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL',description:'HiLook IPC-B469HAD-LUF/SL — 6 MP sınıfı IP bullet ailesi. Smart Hybrid Light, insan/araç algılama ve H.265+ sınıfı özellikler.'},
    'HiLook 8MP IP Kamera':{model:'IPC-B180H',description:'HiLook IPC-B180H — 8 MP 4K sabit bullet IP kamera. 3840x2160, 2.8/4 mm, 30 m IR, 120 dB WDR, H.265+, PoE, IP67.'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)',description:'Hikvision DS-2CD1023G2-I(UF) — 2 MP sabit bullet IP kamera. İnsan/araç algılama, DWDR, EXIR 2.0, IP67, opsiyonel microSD ve mikrofon.'},
    'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)',description:'Hikvision DS-2CD1043G2-LIU(F) — 4 MP Smart Hybrid Light sabit bullet IP kamera. 2560x1440, 2.8/4 mm, insan/araç algılama, mikrofon, H.265+, IP67.'},
    'Hikvision 6MP IP Kamera':{model:'DS-2CD1T67G2H-LIUF/SL',description:'Hikvision DS-2CD1T67G2H-LIUF/SL — 6 MP Smart Hybrid Light/ColorVu sınıfı IP bullet. İnsan/araç algılama, H.265+, IP67 ve akıllı aydınlatma.'},
    'Hikvision 8MP IP Kamera':{model:'DS-2CD1083G2-I(UF)',description:'Hikvision DS-2CD1083G2-I(UF) — 8 MP 4K sınıfı sabit bullet IP kamera. H.265+, WDR, EXIR, IP67, PoE sınıfı kullanım.'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4',description:'Dahua IPC-HFW1230S-S4 — 2 MP IR mini-bullet network kamera. 1920x1080, 2.8/3.6 mm, 30 m IR, H.265/H.264, DWDR, 3DNR, IP67, PoE.'},
    'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4',description:'Dahua DH-IPC-HFW1431S-S4 — 4 MP Entry IR fixed-focal bullet network kamera. 2560x1440, H.265, 30 m IR, WDR, 3DNR, IP67, 12V DC/PoE.'},
    'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV',description:'Dahua DH-IPC-HFW3849T1-AS-PV — 8 MP WizSense Smart Dual Light bullet IP kamera. 3840x2160, 2.8/3.6 mm, IR + warm light, 120 dB WDR, SMD/IVS, dahili mikrofon, microSD, PoE, IP67.'},
    'Dahua 2MP HD Kamera':{model:'HAC-HFW2249T-A-LED-S2',description:'Dahua HAC-HFW2249T-A-LED-S2 — 2 MP HDCVI Full-color 2.0 bullet. 3.6/2.8 mm, beyaz ışık 20 m, dahili mikrofon, IP67, HDCVI/analog sınıfı kullanım.'},
    'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A',description:'Dahua HAC-HFW1801T-A — 8 MP 4K HDCVI IR bullet. 3840x2160, CVI/CVBS/AHD/TVI, 2.8/3.6/6 mm, 30 m Smart IR, 120 dB WDR, dahili mikrofon, IP67.'}
  };
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  async function run(){
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    try{
      const r=await client.from('products').select('id,name,brand,model,category,description');
      if(r.error)throw r.error;
      for(const p of (r.data||[])){
        const d=details[p.name];
        if(!d)continue;
        if(norm(p.model)===norm(d.model) && norm(p.description)===norm(d.description))continue;
        const u=await client.from('products').update({model:d.model,description:d.description}).eq('id',p.id);
        if(u.error)throw u.error;
      }
      if(typeof loadAll==='function')await loadAll();
      if(typeof toast==='function')toast('Doğrulanmış model ve özellik bilgileri güncellendi.');
    }catch(e){console.error('Kamera detay güncellemesi:',e);if(typeof toast==='function')toast('Kamera detayları güncellenemedi: '+(e.message||e));}
  }
  const t=setInterval(run,1500);setTimeout(()=>clearInterval(t),120000);
})();
