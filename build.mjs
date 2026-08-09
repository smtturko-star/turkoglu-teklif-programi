import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Yalnızca public Supabase bilgilerini build sırasında uygulamaya göm.
// Service Role / Secret key kesinlikle kullanılmaz.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lweqpyaksyoquahjuqpc.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!key) throw new Error('Supabase Publishable/Anon Key Netlify ortam değişkenlerinde bulunamadı.');

html = html.replace(/<div id="setupBox">[\s\S]*?<\/div>/, '<div id="setupBox" class="hidden"></div>');
html = html.replace('<div id="authBox" class="hidden">', '<div id="authBox">');

// Public Supabase config yardımcı scriptler tarafından da okunabilsin.
const configScript = `<script>window.__TURKOGLU_SB_CONFIG=${JSON.stringify({u:url.replace(/\/$/, ''),k:key})};</script>`;
html = html.replace('</head>', `${configScript}</head>`);

html = html.replace(/function getCfg\(\)\{[\s\S]*?\}function saveConfig\(\)/, `function getCfg(){return window.__TURKOGLU_SB_CONFIG||{}}function saveConfig()`);

fs.writeFileSync(file, html, 'utf8');
console.log('Supabase otomatik bağlantı ve kimlik doğrulama yapılandırması etkin.');
