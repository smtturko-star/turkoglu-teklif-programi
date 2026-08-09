import fs from 'node:fs';
const file='index.html';
let html=fs.readFileSync(file,'utf8');
const url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL||'https://lweqpyaksyoquahjuqpc.supabase.co';
const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY||process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY||process.env.PUBLIC_SUPABASE_ANON_KEY||'';
if(!key){console.warn('Supabase publishable/anon key bulunamadı; mevcut manuel bağlantı ekranı korunuyor.');process.exit(0)}
html=html.replace(/<div id="setupBox">[\s\S]*?<\/div>/,'<div id="setupBox" class="hidden"></div>');
const old=/function getCfg\(\)\{[\s\S]*?function clearConfig\(\)\{localStorage\.removeItem\(SBKEY\);location\.reload\(\)\}/;
const neu=`function getCfg(){return {u:${JSON.stringify(url.replace(/\/$/,''))},k:${JSON.stringify(key)}}}\nfunction saveConfig(){return true}\nfunction clearConfig(){return true}`;
html=html.replace(old,neu);
fs.writeFileSync(file,html,'utf8');
console.log('Supabase bağlantısı build sırasında otomatik tanımlandı.');
