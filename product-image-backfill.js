/* Türkoğlu ürün görsel backfill + temel CCTV ekipmanları */
(function(){
  if(window.__turkogluProductImageBackfillLoaded)return;
  window.__turkogluProductImageBackfillLoaded=true;

  const images={
    'avenir|av-m21':'https://cdn.cimri.io/image/560x560/avenir-av-m21-3mp-2-kamerali-8x-zoom-onvif-wi-fi-ptz-renkli-gece-gorus-smart-guvenlik-kamerasi_914514244.jpg',
    'avenir|av-s242x':'https://cdn.dsmcdn.com/ty1654/prod/QC/20250324/13/025b2265-9800-3e01-bbc2-4d9592ce5334/1_org_zoom.jpg',
    'avenir|av-df234':'https://image01.idefix.com/resize/1200/0/product/4125376/avenir-av-bf236-2mp-ahd-36mm-lens-ic-ve-dis-mekan-bullet-kamera-66fcff77d385c.jpg',
    'hilook|ipc-b120h-d':'https://meta.vn/Data/image/2020/02/09/camera-ip-wifi-2mp-1080p-hilook-ipc-p120-d-w-t1.jpg',
    'hikvision|ds-2ce12uf3t-e':'https://www.sourcesecurity.com/img/products/400/ds-2ce12uf3t-e-400.jpg',
    'hikvision|ds-2cd3083g2-liu/sl':'https://assets.hikvision.com/prd/normal/all/image/m000077132/%E7%AD%92%E6%9C%BA39-%E5%A3%B0%E5%85%89%E6%8A%A5%E8%AD%A6-%E5%9F%BA%E7%BA%BF-%E5%B7%A6%E4%BE%A7.png',
    'dahua|hac-hfw1400th-i4':'https://toolmania.cl/37233-full_default/camara-de-seguridad-bullet-ip-ir-35m-4mp-dahua-dh-ipc-hfw1431t1-zs-s4.jpg',
    'dahua|hac-hfw2601e-a':'https://img001.varsai.ae/cache/catalog/products/dahua-dh-ipc-b1e20-a-2mp-eco-30m-built-in-mic-fixed-focal-bullet-network-camera-2-700x700.png'
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
  const k=(brand,model)=>`${norm(brand)}|${norm(model)}`;

  async function run(){
    if(typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    try{
      const r=await client.from('products').select('id,name,brand,model,category,image_url');
      if(r.error)throw r.error;
      const rows=r.data||[];
      for(const p of rows){
        const u=images[k(p.brand,p.model)];
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
      if(typeof loadAll==='function')await loadAll();
      if(typeof window.turkogluRefreshProductFilters==='function')await window.turkogluRefreshProductFilters();
      window.turkogluImageBackfillDone=true;
    }catch(e){console.error('Ürün görsel backfill:',e)}
  }
  window.turkogluBackfillProductImages=run;
  window.addEventListener('turkoglu:ready',run);
})();
