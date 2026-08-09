/* Türkoğlu CCTV model doğrulama ve bağlantı yardımcıları. */
(function(){
  'use strict';

  async function connectFromSetup(){
    const urlEl=document.getElementById('cfgUrl');
    const keyEl=document.getElementById('cfgKey');
    const msgEl=document.getElementById('authMsg');
    const setup=document.getElementById('setupBox');
    const auth=document.getElementById('authBox');
    const u=(urlEl?.value||'').trim().replace(/\/$/,'');
    const k=(keyEl?.value||'').trim();
    if(msgEl)msgEl.textContent='';
    if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(u)||!k){if(msgEl)msgEl.textContent='Supabase Proje URL ve Publishable / Anon Key gerekli.';return;}
    try{
      localStorage.setItem('turkoglu_sb_cfg',JSON.stringify({u,k}));
      if(typeof initClient!=='function')throw new Error('Bağlantı motoru yüklenemedi.');
      const ok=initClient();
      if(!ok||typeof client==='undefined'||!client)throw new Error('Supabase istemcisi oluşturulamadı.');
      if(msgEl)msgEl.textContent='Supabase bağlantısı kontrol ediliyor...';
      const result=await client.auth.getSession();
      if(result.error)throw result.error;
      if(setup)setup.classList.add('hidden');
      if(auth)auth.classList.remove('hidden');
      if(msgEl)msgEl.textContent='Bağlantı başarılı. Şimdi giriş yapabilirsiniz.';
    }catch(e){console.error('Sisteme Bağlan:',e);if(msgEl)msgEl.textContent='Bağlantı kurulamadı: '+(e?.message||String(e));else alert('Bağlantı kurulamadı: '+(e?.message||String(e)));}
  }
  window.saveConfig=connectFromSetup;

  const details={
    'Avenir 2MP IP Kamera':{model:'AV-IP3020-I'},'Avenir 4MP IP Kamera':{model:'AV-IP4045-IS'},'Avenir 6MP IP Kamera':{model:'AV-M21'},'Avenir 8MP IP Kamera':{model:'AV-S242X'},'Avenir 2MP HD Kamera':{model:'AV-DF234'},'Avenir 4MP HD Kamera':{model:'AV-DF418AHD'},
    'HiLook 2MP IP Kamera':{model:'IPC-B120H-D'},'HiLook 4MP IP Kamera':{model:'IPC-B140H'},'HiLook 6MP IP Kamera':{model:'IPC-B469HAD-LUF/SL'},'HiLook 8MP IP Kamera':{model:'IPC-B180H'},
    'Hikvision 2MP IP Kamera':{model:'DS-2CD1023G2-I(UF)'},'Hikvision 4MP IP Kamera':{model:'DS-2CD1043G2-LIU(F)'},'Hikvision 6MP IP Kamera':{model:'DS-2CD3063G2-LIU'},'Hikvision 8MP IP Kamera':{model:'DS-2CD3083G2-LIU/SL'},'Hikvision 2MP HD Kamera':{model:'DS-2CE56D0T-IT3(C)'},'Hikvision 8MP HD Kamera':{model:'DS-2CE12UF3T-E'},
    'Dahua 2MP IP Kamera':{model:'IPC-HFW1230S-S4'},'Dahua 4MP IP Kamera':{model:'DH-IPC-HFW1431S-S4'},'Dahua 6MP IP Kamera':{model:'IPC-HDW2649TM-S-IL'},'Dahua 8MP IP Kamera':{model:'DH-IPC-HFW3849T1-AS-PV'},'Dahua 2MP HD Kamera':{model:'HAC-HFW1239MH(-A)-LED'},'Dahua 4MP HD Kamera':{model:'HAC-HFW1400TH-I4'},'Dahua 6MP HD Kamera':{model:'HAC-HFW2601E-A'},'Dahua 8MP HD Kamera':{model:'HAC-HFW1801T-A'}
  };
  const norm=v=>String(v??'').trim().toLocaleLowerCase('tr-TR');
  const names=new Map(Object.entries(details).map(([name,value])=>[norm(name),value]));
  let running=false;
  async function cleanCameraCatalog(){
    if(running||typeof client==='undefined'||!client||typeof user==='undefined'||!user)return;
    running=true;
    try{
      const r=await client.from('products').select('id,name,model');if(r.error)throw r.error;
      const groups=new Map();(r.data||[]).filter(p=>names.has(norm(p.name))).forEach(p=>{const key=norm(p.name);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);});
      const remove=[];
      for(const [key,list] of groups){const canonical=names.get(key);if(!canonical)continue;const keep=list.find(p=>norm(p.model)===norm(canonical.model))||list[0];const update=await client.from('products').update({model:canonical.model}).eq('id',keep.id);if(update.error)throw update.error;list.filter(p=>p.id!==keep.id).forEach(p=>remove.push(p.id));}
      for(let i=0;i<remove.length;i+=100){const d=await client.from('products').delete().in('id',remove.slice(i,i+100));if(d.error)throw d.error;}
      if(remove.length&&typeof loadAll==='function')await loadAll();if(remove.length&&typeof toast==='function')toast(`${remove.length} tekrarlı kamera kaydı temizlendi.`);
    }catch(e){console.error('CCTV katalog temizliği:',e)}finally{running=false;}
  }
  window.turkogluCleanCameraCatalog=cleanCameraCatalog;

  let recoveryStarted=false;
  async function recoverBrokenIndexScript(){
    if(recoveryStarted)return;recoveryStarted=true;
    try{
      if(typeof window.saveConfig==='function'&&typeof window.start==='function')return;
      const response=await fetch('./index.html?recovery='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('index.html kurtarma dosyası okunamadı: HTTP '+response.status);
      const html=await response.text();const match=html.match(/<script>\s*([\s\S]*?)<\/script>\s*<script src="\.\/camera-catalog\.js">/i);if(!match)throw new Error('Ana uygulama scripti bulunamadı.');
      const broken=match[1];const fixed=broken.replace("\"'\":'&#039;'}[m]),today=", "\"'\":'&#039;'}[m])),today=");if(fixed===broken)throw new Error('Bilinen JavaScript sözdizimi hatası bulunamadı.');
      (0,eval)(fixed);console.info('Türkoğlu: bozuk inline uygulama scripti kurtarıldı.');
    }catch(e){console.error('Türkoğlu uygulama kurtarma:',e);const msg=document.getElementById('authMsg');if(msg)msg.textContent='Uygulama JavaScript hatası düzeltilemedi: '+(e?.message||String(e));}
  }
  recoverBrokenIndexScript();

  /* Görsel tema: mevcut uygulama mantığına dokunmadan yalnızca görünümü iyileştirir. */
  function loadProfessionalTheme(){
    if(document.getElementById('turkogluProfessionalTheme'))return;
    const link=document.createElement('link');link.id='turkogluProfessionalTheme';link.rel='stylesheet';link.href='./theme.css?v=2';document.head.appendChild(link);
  }

  /* Kurumsal kimlik: site başlığı + Instagram + teklif çıktısı. */
  function addCorporateBranding(){
    const INSTAGRAM='https://www.instagram.com/turkogluguvenlik38/';
    const COMPANY='TÜRKOĞLU ELEKTRİK ELEKTRONİK';
    const logoSvg='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#10243f"/><stop offset="1" stop-color="#0f9f95"/></linearGradient></defs><rect width="96" height="96" rx="22" fill="url(#g)"/><path d="M22 54c0-18 12-30 29-30 10 0 18 4 23 11l-9 8c-4-5-8-7-14-7-9 0-15 7-15 18s6 18 15 18c6 0 11-3 15-8l9 8c-6 8-14 12-24 12-17 0-29-12-29-30z" fill="#fff"/></svg>');
    const top=document.querySelector('.top');
    if(top&&!top.querySelector('.corporate-brand')){
      const brand=top.querySelector('.brand');
      if(brand){brand.classList.add('corporate-brand');brand.innerHTML='<img class="corporate-logo" src="'+logoSvg+'" alt="Türkoğlu Elektrik Elektronik"><span><strong>'+COMPANY+'</strong><small>CCTV Teklif & İş Takip</small></span>';}
      const actions=document.createElement('div');actions.className='corporate-actions';
      actions.innerHTML='<a class="instagram-link" href="'+INSTAGRAM+'" target="_blank" rel="noopener noreferrer" aria-label="Instagram şirket hesabı"><span>◎</span><b>@turkogluguvenlik38</b></a>';
      const logout=top.querySelector('button[onclick="logout()"]');if(logout)top.insertBefore(actions,logout);else top.appendChild(actions);
    }

    const login=document.getElementById('loginView');
    if(login&&!login.querySelector('.login-social')){
      const social=document.createElement('a');social.className='login-social';social.href=INSTAGRAM;social.target='_blank';social.rel='noopener noreferrer';social.innerHTML='◎  @turkogluguvenlik38';login.appendChild(social);
    }

    const print=document.getElementById('printPage');
    if(print&&!print.querySelector('.quote-corporate')){
      const box=print.querySelector('.print')||print;
      const head=box.querySelector('.qhead');
      if(head){
        const existingLogo=head.querySelector('.qlogo');
        if(existingLogo){existingLogo.src=logoSvg;existingLogo.alt=COMPANY;existingLogo.classList.add('quote-logo');}
        const info=document.createElement('div');info.className='quote-corporate';info.innerHTML='<div class="quote-company">'+COMPANY+'</div><div>CCTV • Güvenlik Sistemleri • Elektrik & Elektronik</div><a href="'+INSTAGRAM+'" target="_blank" rel="noopener noreferrer">Instagram: @turkogluguvenlik38</a>';
        head.insertBefore(info,head.firstChild);
      }
      const footer=document.createElement('div');footer.className='quote-footer';footer.innerHTML='<strong>'+COMPANY+'</strong><span>Instagram: @turkogluguvenlik38</span><span>Güvenlik sistemleri ve elektrik çözümleri</span>';
      box.appendChild(footer);
    }
  }

  function watchCorporateBranding(){
    addCorporateBranding();
    const observer=new MutationObserver(()=>addCorporateBranding());
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('beforeprint',addCorporateBranding);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{loadProfessionalTheme();watchCorporateBranding()},{once:true});
  else{loadProfessionalTheme();watchCorporateBranding();}
})();
