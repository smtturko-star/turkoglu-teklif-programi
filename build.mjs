import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Netlify ortamından yalnızca public Supabase bilgilerini al.
// Service Role / Secret key kesinlikle kullanılmaz.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lweqpyaksyoquahjuqpc.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!key) {
  throw new Error('Supabase Publishable/Anon Key Netlify ortam değişkenlerinde bulunamadı.');
}

// Kullanıcıdan URL/key isteyen bağlantı kutusunu kaldır; yalnızca e-posta/şifre girişini göster.
html = html.replace(/<div id="setupBox">[\s\S]*?<\/div>/, '<div id="setupBox" class="hidden"></div>');
html = html.replace('<div id="authBox" class="hidden">', '<div id="authBox">');

// Mevcut localStorage değerlerine güvenme. Her açılışta build sırasında doğrulanmış public Supabase ayarlarını kullan.
html = html.replace(/function getCfg\(\)\{[\s\S]*?\}function saveConfig\(\)/, `function getCfg(){return {u:${JSON.stringify(url.replace(/\/$/, ''))},k:${JSON.stringify(key)}}}function saveConfig()`);

fs.writeFileSync(file, html, 'utf8');
console.log('Supabase otomatik bağlantı ve kimlik doğrulama yapılandırması etkin.');