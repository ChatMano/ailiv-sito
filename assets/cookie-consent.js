/* ============================================================================
   AILIV · COOKIE CONSENT — GDPR-compliant (Garante Privacy + Reg. UE 2016/679)
   Self-contained: inject HTML + CSS, manage localStorage, expose API.
   Categorie: necessari (sempre), preferenze, statistiche, marketing.
   Scadenza consenso: 6 mesi. Dopo, il banner si ripresenta.
   API pubblica:
     window.AilivCookies.open()               // riapre modal preferenze
     window.AilivCookies.hasConsent(category) // boolean
     window.AilivCookies.reset()              // cancella consenso (debug)
   ========================================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'ailiv_cookie_consent_v1';
  const EXPIRY_MS = 6 * 30 * 24 * 60 * 60 * 1000; // 6 mesi

  const CATEGORIES = [
    { key: 'necessary',   label: 'Strettamente necessari', desc: 'Cookie tecnici indispensabili per il funzionamento del sito (navigazione, sicurezza, form). Non richiedono consenso.', required: true },
    { key: 'preferences', label: 'Preferenze',             desc: 'Ricordano le tue scelte di navigazione (lingua, layout) per migliorare l\'esperienza.', required: false },
    { key: 'statistics',  label: 'Statistiche',            desc: 'Ci aiutano a capire come gli utenti usano il sito, in forma anonima e aggregata.', required: false },
    { key: 'marketing',   label: 'Marketing e terze parti', desc: 'Permettono di mostrare annunci e contenuti personalizzati (Meta Pixel, Google Ads, iframe social). Attivi solo col tuo consenso.', required: false }
  ];

  // ---------- storage helpers ----------
  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.expires || parsed.expires < Date.now()) return null;
      return parsed;
    } catch (_) { return null; }
  }
  function writeConsent(choices) {
    const record = {
      version: 1,
      timestamp: Date.now(),
      expires: Date.now() + EXPIRY_MS,
      necessary: true,
      preferences: !!choices.preferences,
      statistics: !!choices.statistics,
      marketing: !!choices.marketing
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (_) {}
    return record;
  }

  // ---------- styles ----------
  const css = `
    .aic-banner, .aic-modal-bg { font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; box-sizing: border-box; }
    .aic-banner *, .aic-banner *::before, .aic-banner *::after,
    .aic-modal *, .aic-modal *::before, .aic-modal *::after { box-sizing: border-box; }

    .aic-banner {
      position: fixed; left: 16px; right: 16px; bottom: 16px;
      max-width: 980px; margin: 0 auto;
      background: #fff;
      border: 1px solid rgba(20,61,92,0.1);
      border-radius: 20px;
      box-shadow: 0 24px 80px rgba(14,44,67,0.25);
      padding: 20px 22px;
      z-index: 9998;
      display: grid; grid-template-columns: 1fr auto; gap: 16px;
      align-items: center;
      animation: aicSlideUp .4s cubic-bezier(.2,.7,.3,1);
    }
    @keyframes aicSlideUp { from { transform: translateY(120%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    @media (max-width: 720px) { .aic-banner { grid-template-columns: 1fr; } }

    .aic-banner-text h3 { margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #143d5c; display: flex; align-items: center; gap: 6px; }
    .aic-banner-text p { margin: 0; font-size: 13px; line-height: 1.5; color: rgba(20,61,92,0.75); }
    .aic-banner-text a { color: #D4998D; text-decoration: underline; }

    .aic-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; align-items: center; }
    @media (max-width: 720px) { .aic-actions { justify-content: stretch; } .aic-actions button { flex: 1; min-width: 0; } }

    .aic-btn {
      font: inherit; font-weight: 600; font-size: 13px;
      padding: 10px 16px; border-radius: 9999px; border: 0; cursor: pointer;
      transition: all .2s; white-space: nowrap;
    }
    .aic-btn-ghost { background: transparent; color: #143d5c; border: 1.5px solid rgba(20,61,92,0.2); }
    .aic-btn-ghost:hover { border-color: #143d5c; background: rgba(20,61,92,0.04); }
    .aic-btn-secondary { background: #f5f3ee; color: #143d5c; }
    .aic-btn-secondary:hover { background: #ebe8e0; }
    .aic-btn-primary { background: #143d5c; color: #fff; box-shadow: 0 4px 14px rgba(20,61,92,0.25); }
    .aic-btn-primary:hover { background: #0e2c43; }
    .aic-btn-coral { background: #D4998D; color: #fff; box-shadow: 0 4px 14px rgba(212,153,141,0.4); }
    .aic-btn-coral:hover { background: #B5776A; }

    .aic-modal-bg {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(14,44,67,0.55); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .aic-modal-bg.open { display: flex; }
    .aic-modal {
      background: #fff; border-radius: 22px; max-width: 620px; width: 100%;
      max-height: calc(100vh - 32px); overflow-y: auto;
      padding: 24px 24px 20px; position: relative;
      box-shadow: 0 40px 100px rgba(0,0,0,0.3);
      animation: aicPop .25s ease-out;
    }
    @keyframes aicPop { from { transform: scale(.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }

    .aic-modal-close {
      position: absolute; top: 12px; right: 12px; width: 34px; height: 34px;
      border: 0; background: #f5f5f5; color: #143d5c; border-radius: 50%;
      cursor: pointer; font-size: 20px; line-height: 1;
    }
    .aic-modal-close:hover { background: #143d5c; color: #fff; }

    .aic-modal h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #143d5c; letter-spacing: -0.01em; }
    .aic-modal > p { margin: 0 0 16px; font-size: 13px; color: rgba(20,61,92,0.75); line-height: 1.5; }
    .aic-modal > p a { color: #D4998D; text-decoration: underline; }

    .aic-cat {
      padding: 14px; background: #fafaf7; border: 1px solid rgba(20,61,92,0.08);
      border-radius: 14px; margin-bottom: 10px;
      display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: flex-start;
    }
    .aic-cat-info h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #143d5c; }
    .aic-cat-info p { margin: 0; font-size: 12px; line-height: 1.5; color: rgba(20,61,92,0.7); }

    /* toggle switch */
    .aic-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
    .aic-toggle input { opacity: 0; width: 0; height: 0; }
    .aic-toggle-slider { position: absolute; inset: 0; background: rgba(20,61,92,0.2); border-radius: 24px; cursor: pointer; transition: .2s; }
    .aic-toggle-slider::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .aic-toggle input:checked + .aic-toggle-slider { background: #D4998D; }
    .aic-toggle input:checked + .aic-toggle-slider::before { transform: translateX(20px); }
    .aic-toggle input:disabled + .aic-toggle-slider { background: #143d5c; opacity: .7; cursor: not-allowed; }

    .aic-modal-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .aic-modal-actions .aic-btn { flex: 1; min-width: 140px; }
  `;

  // ---------- render helpers ----------
  function injectStyles() {
    if (document.getElementById('aic-styles')) return;
    const s = document.createElement('style');
    s.id = 'aic-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildBanner() {
    const el = document.createElement('div');
    el.className = 'aic-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Informativa cookie');
    el.innerHTML = `
      <div class="aic-banner-text">
        <h3>🍪 Usiamo i cookie</h3>
        <p>Usiamo cookie tecnici e, con il tuo consenso, cookie di statistica e marketing. Puoi accettare, rifiutare o personalizzare. Dettagli nella <a href="/privacy.html#cookie-policy">Cookie Policy</a>.</p>
      </div>
      <div class="aic-actions">
        <button type="button" class="aic-btn aic-btn-ghost" data-aic="reject">Solo necessari</button>
        <button type="button" class="aic-btn aic-btn-secondary" data-aic="customize">Personalizza</button>
        <button type="button" class="aic-btn aic-btn-coral" data-aic="accept-all">Accetta tutti</button>
      </div>
    `;
    el.querySelector('[data-aic="reject"]').addEventListener('click', () => { save({}); hideBanner(); });
    el.querySelector('[data-aic="accept-all"]').addEventListener('click', () => { save({preferences:true, statistics:true, marketing:true}); hideBanner(); });
    el.querySelector('[data-aic="customize"]').addEventListener('click', () => { openModal(); });
    return el;
  }

  function buildModal() {
    const existing = readConsent() || {};
    const bg = document.createElement('div');
    bg.className = 'aic-modal-bg';
    bg.setAttribute('role', 'dialog');
    bg.setAttribute('aria-modal', 'true');
    bg.innerHTML = `
      <div class="aic-modal">
        <button type="button" class="aic-modal-close" aria-label="Chiudi">&times;</button>
        <h2>Gestisci i cookie</h2>
        <p>Scegli quali categorie di cookie accettare. Puoi modificare le tue preferenze in qualsiasi momento. Dettagli nella <a href="/privacy.html#cookie-policy">Cookie Policy</a>.</p>
        <div class="aic-cats">
          ${CATEGORIES.map(c => `
            <div class="aic-cat">
              <div class="aic-cat-info">
                <h4>${c.label}</h4>
                <p>${c.desc}</p>
              </div>
              <label class="aic-toggle">
                <input type="checkbox" data-cat="${c.key}" ${c.required ? 'checked disabled' : (existing[c.key] ? 'checked' : '')}>
                <span class="aic-toggle-slider"></span>
              </label>
            </div>
          `).join('')}
        </div>
        <div class="aic-modal-actions">
          <button type="button" class="aic-btn aic-btn-ghost" data-aic="reject">Solo necessari</button>
          <button type="button" class="aic-btn aic-btn-primary" data-aic="save">Salva preferenze</button>
          <button type="button" class="aic-btn aic-btn-coral" data-aic="accept-all">Accetta tutti</button>
        </div>
      </div>
    `;
    bg.querySelector('.aic-modal-close').addEventListener('click', closeModal);
    bg.addEventListener('click', (e) => { if (e.target === bg) closeModal(); });
    bg.querySelector('[data-aic="reject"]').addEventListener('click', () => { save({}); closeModal(); hideBanner(); });
    bg.querySelector('[data-aic="accept-all"]').addEventListener('click', () => { save({preferences:true, statistics:true, marketing:true}); closeModal(); hideBanner(); });
    bg.querySelector('[data-aic="save"]').addEventListener('click', () => {
      const choices = {};
      bg.querySelectorAll('input[data-cat]').forEach(inp => { choices[inp.dataset.cat] = inp.checked; });
      save(choices);
      closeModal();
      hideBanner();
    });
    return bg;
  }

  // ---------- state ----------
  let bannerEl = null;
  let modalEl = null;

  function showBanner() {
    if (bannerEl) return;
    bannerEl = buildBanner();
    document.body.appendChild(bannerEl);
  }
  function hideBanner() {
    if (bannerEl && bannerEl.parentNode) { bannerEl.parentNode.removeChild(bannerEl); bannerEl = null; }
  }
  function openModal() {
    if (modalEl) { modalEl.classList.add('open'); return; }
    modalEl = buildModal();
    document.body.appendChild(modalEl);
    requestAnimationFrame(() => modalEl.classList.add('open'));
    document.addEventListener('keydown', escHandler);
  }
  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    if (modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
    document.removeEventListener('keydown', escHandler);
  }
  function escHandler(e) { if (e.key === 'Escape') closeModal(); }

  function save(choices) {
    const record = writeConsent(choices);
    // Dispatch event for external integrations (Analytics, Pixel, ecc.)
    try {
      document.dispatchEvent(new CustomEvent('ailiv:cookie-consent', { detail: record }));
    } catch (_) {}
  }

  // ---------- public API ----------
  window.AilivCookies = {
    open: openModal,
    hasConsent: (cat) => {
      const r = readConsent();
      return !!(r && r[cat]);
    },
    reset: () => { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} location.reload(); }
  };

  // ---------- boot ----------
  function init() {
    injectStyles();
    const existing = readConsent();
    if (!existing) showBanner();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
