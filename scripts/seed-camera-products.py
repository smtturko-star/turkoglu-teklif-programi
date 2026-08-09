from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

if 'TURKOGLU_CAMERA_SEED_V2' in s:
    print('camera seed already installed')
    raise SystemExit(0)

marker = "async function start(){"
if marker not in s:
    raise SystemExit('start marker not found')

seed = r'''/* TURKOGLU_CAMERA_SEED_V2 */
const COMMON_CAMERA_PRODUCTS = [
  ['Avenir','Avenir IP 2MP Bullet Kamera','IP-2MP-BULLET','IP Kamera',0],
  ['Avenir','Avenir IP 4MP Bullet Kamera','IP-4MP-BULLET','IP Kamera',0],
  ['Avenir','Avenir IP 6MP Bullet Kamera','IP-6MP-BULLET','IP Kamera',0],
  ['Avenir','Avenir IP 8MP Bullet Kamera','IP-8MP-BULLET','IP Kamera',0],
  ['HiLook','HiLook IP 2MP Bullet Kamera','IPC-2MP-BULLET','IP Kamera',0],
  ['HiLook','HiLook IP 4MP Bullet Kamera','IPC-4MP-BULLET','IP Kamera',0],
  ['HiLook','HiLook IP 6MP Bullet Kamera','IPC-6MP-BULLET','IP Kamera',0],
  ['HiLook','HiLook IP 8MP Bullet Kamera','IPC-8MP-BULLET','IP Kamera',0],
  ['Hikvision','Hikvision IP 2MP Bullet Kamera','DS-2CD-2MP-BULLET','IP Kamera',0],
  ['Hikvision','Hikvision IP 4MP Bullet Kamera','DS-2CD-4MP-BULLET','IP Kamera',0],
  ['Hikvision','Hikvision IP 6MP Bullet Kamera','DS-2CD-6MP-BULLET','IP Kamera',0],
  ['Hikvision','Hikvision IP 8MP Bullet Kamera','DS-2CD-8MP-BULLET','IP Kamera',0],
  ['Dahua','Dahua IP 2MP Bullet Kamera','IPC-2MP-BULLET','IP Kamera',0],
  ['Dahua','Dahua IP 4MP Bullet Kamera','IPC-4MP-BULLET','IP Kamera',0],
  ['Dahua','Dahua IP 6MP Bullet Kamera','IPC-6MP-BULLET','IP Kamera',0],
  ['Dahua','Dahua IP 8MP Bullet Kamera','IPC-8MP-BULLET','IP Kamera',0],
  ['Hikvision','Hikvision HD 2MP Bullet Kamera','TVI-2MP-BULLET','HD Kamera',0],
  ['Hikvision','Hikvision HD 4MP Bullet Kamera','TVI-4MP-BULLET','HD Kamera',0],
  ['Hikvision','Hikvision HD 6MP Bullet Kamera','TVI-6MP-BULLET','HD Kamera',0],
  ['Hikvision','Hikvision HD 8MP Bullet Kamera','TVI-8MP-BULLET','HD Kamera',0],
  ['Dahua','Dahua HDCVI 2MP Bullet Kamera','HDCVI-2MP-BULLET','HD Kamera',0],
  ['Dahua','Dahua HDCVI 4MP Bullet Kamera','HDCVI-4MP-BULLET','HD Kamera',0],
  ['Dahua','Dahua HDCVI 6MP Bullet Kamera','HDCVI-6MP-BULLET','HD Kamera',0],
  ['Dahua','Dahua HDCVI 8MP Bullet Kamera','HDCVI-8MP-BULLET','HD Kamera',0]
];
async function seedCommonCameraProducts(){
  if(!client||!user)return;
  try{
    const existing=await client.from('products').select('name,brand,model');
    if(existing.error){console.warn('camera seed read failed',existing.error);return;}
    const have=new Set((existing.data||[]).map(x=>`${x.brand||''}|${x.name||''}|${x.model||''}`.toLowerCase()));
    const missing=COMMON_CAMERA_PRODUCTS.filter(([brand,name,model])=>!have.has(`${brand}|${name}|${model}`.toLowerCase()));
    if(!missing.length)return;
    const rows=missing.map(([brand,name,model,category])=>({brand,name,model,category,purchase_price:0,sale_price:0,vat_rate:20,stock:0,description:'Kamera ürünü - fiyatı ve görseli sonradan düzenlenebilir.',image_url:null}));
    const r=await client.from('products').insert(rows);
    if(r.error)console.warn('camera seed insert failed',r.error);else toast(`${rows.length} yaygın kamera ürünü eklendi.`);
  }catch(e){console.warn('camera seed failed',e)}
}

'''

s = s.replace(marker, seed + marker, 1)
s = s.replace("if(user){showApp();await loadAll()}", "if(user){showApp();await seedCommonCameraProducts();await loadAll()}", 1)
s = s.replace("if(session?.user){user=session.user;showApp();setTimeout(loadAll,0)}", "if(session?.user){user=session.user;showApp();setTimeout(async()=>{await seedCommonCameraProducts();await loadAll()},0)}", 1)
p.write_text(s, encoding='utf-8')
print('patched index.html')
