import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Supabase bağlantısı build sırasında Netlify ortam değişkenlerinden alınır.
// Service Role / Secret key kullanılmaz.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lweqpyaksyoquahjuqpc.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!key) {
  throw new Error('Supabase Publishable/Anon Key Netlify ortam değişkenlerinde bulunamadı.');
}

// Kullanıcıdan URL/key isteyen bağlantı kutusunu kaldır ve doğrudan giriş formunu göster.
html = html.replace(/<div id="setupBox">[\s\S]*?<\/div>/, '<div id="setupBox" class="hidden"></div>');
html = html.replace('<div id="authBox" class="hidden">', '<div id="authBox">');

// İlk açılışta localStorage boş olsa bile uygulama otomatik Supabase bağlantısı kullansın.
const oldGetCfg = /function getCfg\(\)\{[\s\S]*?function clearConfig\(\)\{localStorage\.removeItem\(SBKEY\);location\.reload\(\)\}/;
const newGetCfg = `function getCfg(){return {u:${JSON.stringify(url.replace(/\/$/, ''))},k:${JSON.stringify(key)}}}
function saveConfig(){return true}
function clearConfig(){location.reload()}`;
html = html.replace(oldGetCfg, newGetCfg);

fs.writeFileSync(file, html, 'utf8');
console.log('Supabase otomatik bağlantı etkin; kullanıcıdan URL/key istenmeyecek.');
