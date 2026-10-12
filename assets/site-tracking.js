
// Gate dei tracker — Google Consent Mode v2 AVANZATO:
// gtag sempre attivo con tutto negato di default (ping anonimi senza cookie -> modeling),
// consensi reali aggiornati dal banner. Pixel Meta: solo con consenso marketing.
(function(){
  var GA4_ID = 'G-W4JNRMTPEY';
  var META_PIXEL = '2944167229260391';
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
  gtag('js', new Date());
  gtag('config', GA4_ID, { anonymize_ip: true });
  var sc = document.createElement('script'); sc.async = true;
  sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(sc);

  var fbDone = false;
  function fbLoad(){
    if (fbDone || !META_PIXEL) return; fbDone = true;
    !function(f,b,e,v,n,t,x){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;x=b.getElementsByTagName(e)[0];x.parentNode.insertBefore(t,x)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL); fbq('track', 'PageView');
  }
  function apply(c){
    if (!c) return;
    gtag('consent', 'update', {
      analytics_storage: c.statistics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.marketing) fbLoad();
  }
  document.addEventListener('ailiv:cookie-consent', function(e){ apply(e.detail); });
  window.addEventListener('load', function(){
    if (window.AilivCookies) apply({
      statistics: window.AilivCookies.hasConsent('statistics'),
      marketing: window.AilivCookies.hasConsent('marketing')
    });
  });
  // Eventi CTA verso il form (con consenso: dato pieno; senza: ping anonimo -> modeling)
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href="#prenota"],a[href="check-up.html"]') : null;
    if (!a) return;
    gtag('event', 'cta_prenota_click', {
      cta_text: (a.textContent || '').trim().slice(0, 60),
      cta_class: a.className ? String(a.className).slice(0, 60) : ''
    });
  }, true);
})();
