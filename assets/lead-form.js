(function(){
    var form = document.getElementById('leadForm');
    if (!form) return;
    var KEY = '6LeDBFwpAAAAAJe8ux9-imrqZ2ueRsEtdiWoDDpX';
    var FORM_ID = 'BurG4Q7fFt6liEwrBBuF';
    var LOC_ID = 'BphV4FTBieSmV7ou2li2';
    var loading = null;
    function loadRecaptcha(){
      if (window.grecaptcha && window.grecaptcha.enterprise) return Promise.resolve();
      if (loading) return loading;
      loading = new Promise(function(res, rej){
        var sc = document.createElement('script');
        sc.src = 'https://www.google.com/recaptcha/enterprise.js?render=' + KEY;
        sc.async = true; sc.onload = res; sc.onerror = rej;
        document.head.appendChild(sc);
        // Timeout: senza, se google.com non risponde (webview di Gmail, adblocker,
        // rete aziendale filtrata) la promise resta pendente PER SEMPRE: il bottone
        // resta su "Invio in corso…", nessun errore, lead perso in silenzio.
        setTimeout(function(){ rej(new Error('recaptcha-timeout')); }, 6000);
      });
      return loading;
    }
    // Token con resa graziosa: se il captcha non arriva, si invia comunque.
    // Meglio un lead senza token che nessun lead.
    function tokenCaptcha(){
      return loadRecaptcha()
        .then(function(){
          return new Promise(function(res, rej){
            if (!window.grecaptcha || !window.grecaptcha.enterprise) return rej(new Error('no-grecaptcha'));
            grecaptcha.enterprise.ready(function(){
              grecaptcha.enterprise.execute(KEY, { action: 'LEADGEN_FORM_SUBMIT' }).then(res, rej);
            });
          });
        })
        .catch(function(){ return ''; });
    }
    var EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    form.addEventListener('focusin', function(){ loadRecaptcha().catch(function(){}); }, { once: true });
    var statusEl = document.getElementById('leadStatus');
    var btn = form.querySelector('.lead-submit');
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      if (btn.disabled) return;
      var d = {
        first_name: form.first_name.value.trim(),
        last_name: form.last_name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim()
      };
      if (!d.first_name || !d.phone || !d.email) {
        statusEl.textContent = 'Compila nome, telefono ed email.';
        try { gtag('event', 'form_incompleto', { campo: !d.first_name ? 'nome' : (!d.phone ? 'telefono' : 'email') }); } catch (_) {}
        return;
      }
      // L'email è l'UNICO canale che consegna il link per prenotare: "mario@gmail"
      // entrerebbe in CRM come lead irraggiungibile e la call non si farebbe mai.
      if (!EMAIL_RX.test(d.email)) {
        statusEl.textContent = "Controlla l'email: è lì che ti arriva il link per scegliere l'orario.";
        try { gtag('event', 'form_incompleto', { campo: 'email_formato' }); } catch (_) {}
        return;
      }
      btn.disabled = true; btn.textContent = 'Invio in corso…'; statusEl.textContent = '';
      tokenCaptcha().then(function(token){
        var payload = {
          first_name: d.first_name, last_name: d.last_name, phone: d.phone, email: d.email,
          formId: FORM_ID, location_id: LOC_ID,
          eventData: {
            source: document.referrer ? 'referral' : 'direct',
            referrer: document.referrer || '',
            page: { url: location.href, title: document.title },
            timestamp: Date.now(),
            type: 'page-visit', parentId: FORM_ID, pageVisitType: 'form',
            domain: 'ailiv.it', version: 'v3', medium: 'form', mediumId: FORM_ID
          },
          Timezone: 'Europe/Rome (GMT+02:00)'
        };
        var fd = new FormData();
        fd.append('formData', JSON.stringify(payload));
        fd.append('locationId', LOC_ID);
        fd.append('formId', FORM_ID);
        if (token) fd.append('captchaV3', token);
        return fetch('https://backend.leadconnectorhq.com/forms/submit?formId=' + FORM_ID + '&locationId=' + LOC_ID, { method: 'POST', body: fd });
      }).then(function(r){
        return r.json().catch(function(){ return {}; }).then(function(j){ return { ok: r.ok, j: j }; });
      }).then(function(x){
        if (x.ok && (x.j.status === true || x.j.contactId || x.j.submissionId)) {
          window.location.href = 'grazie.html';
        } else { throw new Error('submit'); }
      }).catch(function(){
        btn.disabled = false; btn.textContent = 'Richiedi il check-up gratuito →';
        statusEl.textContent = 'Non è andato — riprova tra qualche secondo, o scrivici a info@ailiv.it';
        // senza questo evento, "zero lead perché nessuno compila" e "zero lead
        // perché il form è rotto" sono indistinguibili nei dati
        try { gtag('event', 'form_errore'); } catch (_) {}
      });
    });
  })();
