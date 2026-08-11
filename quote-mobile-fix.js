/* Teklif ekranı: yalnızca pencere kontrolleri ve güvenli modal davranışı. */
(function(){
  'use strict';

  const get = id => document.getElementById(id);

  function isQuoteModal(modal){
    if(!modal) return false;
    return !!modal.querySelector('#qitems') || /teklif/i.test(modal.querySelector('.modalhead h2')?.textContent || '');
  }

  function installOverlayGuard(){
    const overlay = get('modal');
    if(!overlay || overlay.dataset.quoteOverlayGuard === '1') return;
    overlay.dataset.quoteOverlayGuard = '1';
    overlay.addEventListener('click', ev => {
      const modal = get('modalBox');
      if(isQuoteModal(modal) && ev.target === overlay){
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
      }
    }, true);
  }

  function installWindowControls(){
    const modal = get('modalBox');
    if(!modal || !isQuoteModal(modal)) return;
    const head = modal.querySelector('.modalhead');
    const close = head?.querySelector('.close');
    if(!head || !close || head.dataset.quoteWindowControls === '1') return;

    head.dataset.quoteWindowControls = '1';
    const overlay = get('modal');
    const actions = document.createElement('div');
    actions.className = 'quote-window-actions';
    actions.style.cssText = 'display:flex;gap:6px;margin-left:auto;margin-right:8px;align-items:center';
    actions.innerHTML = '<button type="button" class="light" title="Küçült" aria-label="Küçült" style="width:36px;height:36px;padding:0;font-size:18px">−</button><button type="button" class="light" title="Büyüt" aria-label="Büyüt" style="width:36px;height:36px;padding:0;font-size:17px">⛶</button>';
    head.insertBefore(actions, close);

    const minBtn = actions.children[0];
    const maxBtn = actions.children[1];

    minBtn.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      overlay?.classList.add('quote-minimized');
      modal.classList.add('quote-minimized-box');
      let bar = get('quoteMinimizedBar');
      if(!bar){
        bar = document.createElement('button');
        bar.id = 'quoteMinimizedBar';
        bar.type = 'button';
        bar.textContent = '🧾 Teklif — devam et';
        bar.title = 'Teklifi geri aç';
        bar.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:10000;background:#0f172a;color:#fff;border:0;border-radius:12px;padding:11px 16px;font-weight:800;box-shadow:0 8px 24px #0003';
        document.body.appendChild(bar);
        bar.addEventListener('click', ev2 => {
          ev2.preventDefault();
          ev2.stopPropagation();
          overlay?.classList.remove('quote-minimized');
          modal.classList.remove('quote-minimized-box');
          bar.remove();
        }, {once:false});
      }
    });

    maxBtn.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      modal.classList.toggle('quote-maximized-box');
    });
  }

  const boot = () => {
    installOverlayGuard();
    installWindowControls();
  };

  boot();
  let ticks = 0;
  const timer = setInterval(() => {
    boot();
    ticks += 1;
    if(ticks >= 120) clearInterval(timer);
  }, 250);
})();