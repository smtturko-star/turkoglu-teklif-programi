/* CCTV katalog temizleme + doğrulanmış model/özellik/görsel güncellemesi. Uygulama açılışını bloke etmez. */
(function(){
  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I'},'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS'},'Avenir 6MP IP Kamera':{model:'AV-M21'},'Avenir 8MP IP Kamera':{model:'AV-S242X'},
    'Avenir 2MP HD Kamera':{model:'AV-DF234'},'Avenir 4MP HD Kamera':{model:'AV-DF418AHD'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D'},'HiLook 4MP IP Kamera':{model:'IPC-B140H'},'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL'},'HiLook 8MP IP Kamera':{model:'IPC-B180H'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)'},'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)'},'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU'},'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL'},
    'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)'},'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4'},'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4'},'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL'},'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV'},
    'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED'},'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4'},'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A'},'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A'}
  };
  const imageMap={
    'avenir|av-m21':'https://cdn.cimri.io/image/560x560/avenir-av-m21-3mp-2-kamerali-8x-zoom-onvif-wi-fi-ptz-renkli-gece-gorus-smart-guvenlik-kamerasi_914514244.jpg',
    'avenir|av-s242x':'https://cdn.dsmcdn.com/ty1654/prod/QC/20250324/13/025b2265-9800-3e01-bbc2-4d9592ce5334/1_org_zoom.jpg',
    'hikvision|ds-2ce12uf3t-e':'https://www.sourcesecurity.com/img/products/400/ds-2ce12uf3t-e-400.jpg',
    'hikvision|ds-2cd3083g2-liu/sl':'https://assets.hikvision.com/prd/normal/all/image/m000077132/%E7%AD%92%E6%9C%BA39-%E5%A3%B0%E5%85%89%E6%8A%A5%E8%AD%A6-%E5%9F%BA%E7%BA%BF-%E5%B7%A6%E4%BE%A7.png'
  };
  const extra=[
    {name:'Hikvision 8 Kanal PoE NVR',brand:'Hikvision',model:'DS-7608NI-K2/8P',category:'NVR Kayıt Cihazı',image_url:'https://www.getic.com/images/catalogue/2505/7600nik2_3-5f97b2dc0b69b-large.png',description:'8 kanal PoE NVR; 2 SATA, 4K HDMI, 8 PoE port.'},
    {name:'Dahua 8 Kanal PoE NVR',brand:'Dahua',model:'NVR4108HS-8P-4KS3',category:'NVR Kayıt Cihazı',image_url:'https://arteus.pe/cdn/shop/files/NVR4108-8P-4KS3_800x.jpg?v=1719863468',description:'8 kanal PoE NVR; 4K çıkış ve dahili PoE.'},
    {name:'Hikvision 8 Port PoE Switch',brand:'Hikvision',model:'DS-3E0510P-E/M',category:'PoE Switch',image_url:'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/96/MTA-41511867/hikvision_hikvision_switch_hub_poe_ds-3e0510p-e-m_8port_poe_-_2_port_uplink_full01_nmzdxg08.jpg',description:'8 PoE + 2 uplink portlu PoE switch.'},
    {name:'Dahua 8 Port PoE Switch',brand:'Dahua',model:'PFS3009-8ET-96',category:'PoE Switch',image_url:'https://shopdelta.eu/shop_image/product/dh-pfs3009-8et-96_d.jpg',description:'8 PoE portlu, 96W toplam bütçeli switch.'},
    {name:'TP-Link 8 Port PoE Switch',brand:'TP-Link',model:'TL-SG1008P',category:'PoE Switch',image_url:'https://assets.umart.com.au/newsite/images/201806/source_img/24006_P_1530084023659.jpg',description:'8 Gigabit port, 4 PoE portlu switch.'},
    {name:'WD Purple 4TB Güvenlik HDD',brand:'Western Digital',model:'WD43PURZ',category:'Gözetim HDD',image_url:'https://images.kabum.com.br/produtos/fotos/497179/hd-wd-4tb-purple-3-5-sata-wd43purz_1698145720_gg.jpg',description:'7/24 güvenlik kayıt sistemleri için 4TB SATA HDD.'},
    {name:'Seagate SkyHawk 4TB Güvenlik HDD',brand:'Seagate',model:'ST4000VX013',category:'Gözetim HDD',image_url:'https://static3.tcdn.com.br/img/editor/up/332274/10943_ampliacao.jpg',description:'7/24 güvenlik kayıt sistemleri için 4TB SATA HDD.'}
  ];
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const names=new Set(Object.keys(details).map(norm));
  const imageKey=p=>`${norm(p.brand)}|${norm(p.model)}`;
  let running=false,done=false;
  async function run(){
    if(running||done||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('id,name,brand,model,category,image_url');
      if(r.error)throw r.error;
      const rows=r.data||[];
      const groups=new Map();
      rows.filter(p=>names.has(norm(p.name))).forEach(p=>{const k=norm(p.name);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(p)});
      const remove=[];
      for(const [k,list] of groups){
        const canonical=details[list[0].name];
        const keep=list.find(p=>norm(p.model)===norm(canonical.model))||list[0];
        const u=await client.from('products').update({model:canonical.model}).eq('id',keep.id);
        if(u.error)throw u.error;
        list.filter(p=>p.id!==keep.id).forEach(p=>remove.push(p.id));
      }
      for(let i=0;i<remove.length;i+=100){
        const d=await client.from('products').delete().in('id',remove.slice(i,i+100));
        if(d.error)throw d.error;
      }
      for(const p of rows){
        const u=imageMap[imageKey(p)];
        if(u&&!String(p.image_url||'').trim()){
          const x=await client.from('products').update({image_url:u}).eq('id',p.id);
          if(x.error)console.warn('Görsel güncellenemedi',p.model,x.error);
        }
      }
      const existing=new Set(rows.map(p=>`${norm(p.name)}|${norm(p.brand)}|${norm(p.model)}|${norm(p.category)}`));
      const missing=extra.filter(p=>!existing.has(`${norm(p.name)}|${norm(p.brand)}|${norm(p.model)}|${norm(p.category)}`));
      if(missing.length){
        const x=await client.from('products').insert(missing);
        if(x.error)console.warn('Ek katalog eklenemedi',x.error);
      }
      done=true;
      if(typeof loadAll==='function')await loadAll();
      if(typeof window.turkogluRefreshProductFilters==='function')await window.turkogluRefreshProductFilters();
      if(typeof toast==='function'&& (remove.length||missing.length))toast(`${remove.length} tekrar temizlendi, ${missing.length} yeni ekipman eklendi.`);
    }catch(e){
      console.error('CCTV katalog işlemi:',e);
      done=true;
      if(typeof toast==='function')toast('Katalog işlemi tamamlanamadı: '+(e.message||e));
    }finally{running=false}
  }
  window.turkogluCleanCameraCatalog=run;
  function watch(){
    const app=document.getElementById('app');
    if(!app)return;
    const observer=new MutationObserver(()=>{if(!app.classList.contains('hidden')){observer.disconnect();setTimeout(run,250);}});
    observer.observe(app,{attributes:true,attributeFilter:['class']});
    if(!app.classList.contains('hidden')){observer.disconnect();setTimeout(run,250);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
