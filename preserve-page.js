/* F5 sonrası görünüm durumunu ana page()/render akışını değiştirmeden korur. */
(function(){
'use strict';
if(window.__turkogluViewStateInstalled)return;window.__turkogluViewStateInstalled=true;
const KEY='turkoglu_view_state_v1';
const pageIds=new Set(Array.from(document.querySelectorAll('.page')).map(page=>page.id).filter(id=>id&&id!=='printPage'));
const isViewControl=element=>Boolean(element?.id&&element.closest('.page')&&(/(?:search|filter|sort)/i.test(element.id)||element.dataset.persistState!==undefined));
const read=()=>{try{const state=JSON.parse(localStorage.getItem(KEY)||'{}');return state&&typeof state==='object'?state:{}}catch{return {}}};
const write=state=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const saveControl=element=>{if(!isViewControl(element))return;const state=read(),page=element.closest('.page').id;state.controls=state.controls&&typeof state.controls==='object'?state.controls:{};state.controls[element.id]={page,value:element.type==='checkbox'?element.checked:element.value};write(state)};
const savePage=id=>{if(!pageIds.has(id))return;const state=read();state.page=id;write(state)};
const hydratedControls=new WeakSet();
const restoreControls=()=>{const state=read(),controls=state.controls&&typeof state.controls==='object'?state.controls:{},changed=[];Object.entries(controls).forEach(([id,saved])=>{const element=document.getElementById(id);if(!element||hydratedControls.has(element)||!isViewControl(element)||saved?.page!==element.closest('.page').id)return;const value=String(saved.value??'');if(element.type==='checkbox'){if(element.checked!==Boolean(saved.value)){element.checked=Boolean(saved.value);changed.push(element)}hydratedControls.add(element);return}if(element.tagName==='SELECT'&&!Array.from(element.options).some(option=>option.value===value)){if(element.options.length>1)hydratedControls.add(element);return}if(element.value!==value){element.value=value;changed.push(element)}hydratedControls.add(element)});changed.forEach(element=>element.dispatchEvent(new Event(element.tagName==='INPUT'?'input':'change',{bubbles:true})))};
const originalPage=window.page;if(typeof originalPage==='function'){window.page=function(id){const result=originalPage.apply(this,arguments);savePage(id);return result}};
const originalRenderProducts=window.renderProducts;if(typeof originalRenderProducts==='function'&&!window.__turkogluProductViewStateRender){window.__turkogluProductViewStateRender=true;window.renderProducts=function(){const result=originalRenderProducts.apply(this,arguments);if(typeof window.productPage==='function')window.productPage();restoreControls();return result}};
document.addEventListener('input',event=>saveControl(event.target),true);document.addEventListener('change',event=>saveControl(event.target),true);
const restore=()=>{const state=read();restoreControls();if(pageIds.has(state.page)&&typeof window.page==='function')window.page(state.page)};
new MutationObserver(restoreControls).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
/* Modern tema ve animasyon dosyasını mevcut uygulama mantığına dokunmadan yükle. */
(function(){const load=()=>{if(document.querySelector('script[data-tk-motion]'))return;const s=document.createElement('script');s.src='./modern-animations.js';s.dataset.tkMotion='1';s.defer=true;document.head.appendChild(s)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load()})();
/* Dashboard KPI hızlı kontrol penceresini yükle. */
(function(){const load=()=>{if(document.querySelector('script[data-tk-dashboard-modal]'))return;const s=document.createElement('script');s.src='./dashboard-modal.js';s.dataset.tkDashboardModal='1';s.defer=true;document.head.appendChild(s)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load()})();
/* Premium Teklif PDF V2 katmanını yükle. */
(function(){const load=()=>{if(document.querySelector('script[data-tk-pdf-v2]'))return;const s=document.createElement('script');s.src='./modern-quote-pdf-v2.js';s.dataset.tkPdfV2='1';s.defer=true;document.head.appendChild(s)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load()})();
/* Müşteri ve firma kaşe/imza alanlarını yükle. */
(function(){const load=()=>{if(document.querySelector('script[data-tk-signatures]'))return;const s=document.createElement('script');s.src='./quote-signatures.js';s.dataset.tkSignatures='1';s.defer=true;document.head.appendChild(s)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load()})();
