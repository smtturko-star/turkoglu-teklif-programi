import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Public Supabase configuration only. Never use the service-role/secret key here.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lweqpyaksyoquahjuqpc.supabase.co';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nEC12IhKYJwv2IfSRoVbmw_u-rFe3Cn';
const cfg = { u: url.replace(/\/$/, ''), k: key };

// Bundle the browser SDK directly into the generated page. This removes the runtime
// dependency on a CDN and guarantees that window/globalThis.supabase exists before app code runs.
const umd = 'node_modules/@supabase/supabase-js/dist/umd/supabase.js';
if (!fs.existsSync(umd)) throw new Error('Supabase JS paketi bulunamadı.');
const sdk = fs.readFileSync(umd, 'utf8');
html = html.replace(/<script src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2["']><\/script>/, `<script>${sdk}</script>`);

// Public connection config is embedded at build time. It is safe for browser use.
const configScript = `<script>window.__TURKOGLU_SB_CONFIG=${JSON.stringify(cfg)};</script>`;
html = html.replace('</head>', `${configScript}</head>`);

// Hide the manual connection form; retain it only as a diagnostic fallback.
html = html.replace(/<div id="setupBox">[\s\S]*?<\/div>/, `<div id="setupBox" class="hidden"><label>Supabase Proje URL</label><input id="cfgUrl" value=${JSON.stringify(cfg.u)}><label style="margin-top:12px">Supabase Publishable / Anon Key</label><input id="cfgKey" type="password" value=${JSON.stringify(cfg.k)}><button class="green" style="width:100%;margin-top:14px" onclick="saveConfig()">Sisteme Bağlan</button><p class="muted">Bağlantı bilgileri bu cihazda hatırlanır. Service role / secret key kullanmayın.</p></div>`);
html = html.replace('<div id="authBox" class="hidden">', '<div id="authBox">');

// Prefer an explicitly saved public config; otherwise use the build-time config.
html = html.replace(/function getCfg\(\)\{[^}]*\}function saveConfig\(\)/, `function getCfg(){try{const s=JSON.parse(localStorage.getItem(SBKEY)||'{}');return s.u&&s.k?s:window.__TURKOGLU_SB_CONFIG||{}}catch{return window.__TURKOGLU_SB_CONFIG||{}}}function saveConfig()`);

// Initialize synchronously: the SDK is now inline, so no CDN/load race is possible.
const boot = `function initClient(){const c=getCfg();if($('cfgUrl'))$('cfgUrl').value=c.u||'';if($('cfgKey'))$('cfgKey').value=c.k||'';if(!c.u||!c.k){$('setupBox').classList.remove('hidden');$('authBox').classList.add('hidden');return false}const sdk=globalThis.supabase||window.supabase;if(!sdk||typeof sdk.createClient!=='function'){$('setupBox').classList.remove('hidden');$('authBox').classList.add('hidden');$('authMsg').textContent='Supabase istemci kütüphanesi yüklenemedi.';return false}try{client=sdk.createClient(c.u,c.k,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}catch(e){$('setupBox').classList.remove('hidden');$('authBox').classList.add('hidden');$('authMsg').textContent='Supabase bağlantısı kurulamadı: '+err(e);return false}$('setupBox').classList.add('hidden');$('authBox').classList.remove('hidden');return true}`;
html = html.replace(/function initClient\(\)[\s\S]*?\}\s*async function login/, `${boot}async function login`);
html = html.replace(/async function start\(\)\{if\(!initClient\(\)\)return;/, `async function start(){if(!initClient())return;`);

fs.writeFileSync(file, html, 'utf8');
console.log('Supabase SDK sayfaya gömüldü; istemci başlatma CDN bağımlılığından çıkarıldı.');
