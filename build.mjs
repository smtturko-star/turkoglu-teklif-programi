import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Public Supabase configuration only. Never use the service-role/secret key here.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lweqpyaksyoquahjuqpc.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nEC12IhKYJwv2IfSRoVbmw_u-rFe3Cn';

// Use the installed package instead of a third-party CDN at runtime.
const umd = 'node_modules/@supabase/supabase-js/dist/umd/supabase.js';
if (!fs.existsSync(umd)) throw new Error('Supabase JS paketi bulunamadı.');
fs.copyFileSync(umd, 'supabase.js');

// Replace the remote CDN with the local bundle so login cannot fail because of CDN loading.
html = html.replace(/<script src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2["']><\/script>/, '<script src="./supabase.js"></script>');

// Hide manual configuration and expose only the public client configuration.
html = html.replace(/<div id="setupBox">[\s\S]*?<\/div>/, '<div id="setupBox" class="hidden"></div>');
html = html.replace('<div id="authBox" class="hidden">', '<div id="authBox">');
const configScript = `<script>window.__TURKOGLU_SB_CONFIG=${JSON.stringify({u:url.replace(/\/$/, ''),k:key})};</script>`;
html = html.replace('</head>', `${configScript}</head>`);

// Always prefer the build-time public config. Keep localStorage only as a legacy fallback.
html = html.replace(/function getCfg\(\)\{[\s\S]*?\}function saveConfig\(\)/, `function getCfg(){return window.__TURKOGLU_SB_CONFIG||{} }function saveConfig()`);

fs.writeFileSync(file, html, 'utf8');
console.log('Supabase yerel bundle ve otomatik bağlantı etkin.');
