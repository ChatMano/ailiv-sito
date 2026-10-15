
// Google Consent Mode v2 avanzato; Meta solo con consenso marketing.
(function(){
  if (window.AilivTracking) return;
  var GA4_ID = 'G-W4JNRMTPEY';
  var META_PIXEL = '2944167229260391';
  var RECEIPT_KEY = 'ailiv_lead_receipt_v1';
  var receipt = null;
  function validReceipt(r){ return r && typeof r.created === 'number' && Date.now() >= r.created && Date.now() - r.created < 30 * 60 * 1000; }
  if (/\/grazie\.html$/.test(location.pathname)) {
    try { var saved = JSON.parse(sessionStorage.getItem(RECEIPT_KEY)); if (validReceipt(saved)) receipt = saved; } catch (_) {}
  }
  function persistReceipt(){ try { sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt)); } catch (_) {} }
  // Non trasmettere dati di contatto eventualmente presenti nei link del calendario.
  function measurementUrl(value){
    try {
      var u = new URL(value, location.href), keep = new URLSearchParams();
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','dclid','gbraid','wbraid'].forEach(function(k){ if(u.searchParams.has(k)) keep.set(k,u.searchParams.get(k)); });
      return u.origin + u.pathname + (keep.toString() ? '?' + keep : '');
    } catch (_) { return ''; }
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);
  gtag('set', {page_location: measurementUrl(location.href), page_referrer: document.referrer ? measurementUrl(document.referrer) : ''});
  if (window.AilivCookies) gtag('consent', 'update', {
    analytics_storage: window.AilivCookies.hasConsent('statistics') ? 'granted' : 'denied',
    ad_storage: window.AilivCookies.hasConsent('marketing') ? 'granted' : 'denied',
    ad_user_data: window.AilivCookies.hasConsent('marketing') ? 'granted' : 'denied',
    ad_personalization: window.AilivCookies.hasConsent('marketing') ? 'granted' : 'denied'
  });
  gtag('js', new Date());
  gtag('config', GA4_ID, { anonymize_ip: true });
  var sc = document.createElement('script'); sc.async = true;
  sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(sc);

  var fbDone = false;
  function fbLoad(){
    if (fbDone || !META_PIXEL) return; fbDone = true;
    !function(f,b,e,v,n,t,x){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;x=b.getElementsByTagName(e)[0];x.parentNode.insertBefore(t,x)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('consent', 'grant');
    fbq('init', META_PIXEL); fbq('track', 'PageView');
  }
  function trackLead(){
    if (!validReceipt(receipt)) return;
    if (!receipt.ga) {
      receipt.ga = true; persistReceipt();
      // Nome storico conservato per le conversioni già configurate nell'account.
      gtag('event', 'genera_lead', {form_id:'leadForm'});
    }
    if (!receipt.meta && window.AilivCookies && window.AilivCookies.hasConsent('marketing') && window.fbq) {
      receipt.meta = true; persistReceipt();
      fbq('track', 'Lead');
    }
  }
  window.AilivTracking = {
    // Chiamato esclusivamente dopo la conferma positiva del servizio del modulo.
    leadAccepted: function(done){
      receipt = {created:Date.now(),ga:false,meta:false};
      try { sessionStorage.setItem(RECEIPT_KEY,JSON.stringify(receipt)); done(); }
      catch (_) { trackLead(); setTimeout(done,800); }
    }
  };
  function apply(c){
    if (!c) return;
    gtag('consent', 'update', {
      analytics_storage: c.statistics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.marketing) {
      if (fbDone) fbq('consent', 'grant'); else fbLoad();
    } else if (window.fbq) fbq('consent', 'revoke');
    trackLead();
  }
  document.addEventListener('ailiv:cookie-consent', function(e){ apply(e.detail); });
  function syncConsent(){
    if (window.AilivCookies) apply({
      statistics: window.AilivCookies.hasConsent('statistics'),
      marketing: window.AilivCookies.hasConsent('marketing')
    });
  }
  syncConsent();
  window.addEventListener('pageshow', syncConsent);
  window.addEventListener('storage', function(e){ if(e.key === 'ailiv_cookie_consent_v1') syncConsent(); });
  trackLead();
  // Eventi CTA verso il form (con consenso: dato pieno; senza: ping anonimo -> modeling)
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href="#prenota"],a[href="check-up.html"],a[href="#check-up"],a[href="index.html#check-up"]') : null;
    if (!a) return;
    gtag('event', 'cta_prenota_click', {
      cta_text: (a.textContent || '').trim().slice(0, 60),
      cta_class: a.className ? String(a.className).slice(0, 60) : ''
    });
  }, true);
  // Misura le interazioni volontarie con la dimostrazione, non i loop decorativi.
  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target.closest('#mode-before,#mode-after,#connect-data,#run-automation,[data-auto-scenario],[data-scenario]') : null;
    if (el) gtag('event','demo_interaction',{control:el.id,scenario:el.dataset.autoScenario || el.dataset.scenario || ''});
  });
  var film = document.getElementById('full-film');
  if (film) {
    var milestones = {};
    film.addEventListener('play',function(){ if(!milestones.start){milestones.start=true;gtag('event','video_start',{video_title:'AILIV — Dentro la tua azienda',video_provider:'self_hosted'});} });
    film.addEventListener('timeupdate',function(){
      if(!film.duration || film.seeking)return;
      [25,50,75].forEach(function(p){if(!milestones[p] && film.currentTime/film.duration*100>=p){milestones[p]=true;gtag('event','video_progress',{video_title:'AILIV — Dentro la tua azienda',video_percent:p,video_provider:'self_hosted'});}});
    });
    film.addEventListener('ended',function(){if(!milestones.end){milestones.end=true;gtag('event','video_complete',{video_title:'AILIV — Dentro la tua azienda',video_provider:'self_hosted'});} });
  }
})();
