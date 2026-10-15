'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenarios = {
    overview: {label:'IL CONTESTO DA INTERROGARE', heading:'Crescono le vendite. E il resto?', rows:[['Vendite ↔ marketing','Domanda'],['Costi ↔ incassi','Margini'],['Persone ↔ procedure','Operatività']], warning:'L’analisi usa le fonti collegate. I dati mancanti restano visibili.', title:'La domanda cambia. Il contesto resta.', text:'Puoi approfondire un reparto o incrociare vendite, costi, marketing e operatività. Il sistema usa il contesto comune per aiutarti a capire cosa succede e valutare le prossime mosse.', context:'Tutti i reparti + documenti + storico'},
    marketing: {label:'ANALISI DI UNA CAMPAGNA', heading:'Più vendite. Ma con quale margine?', rows:[['Risultati delle campagne','Raccolti'],['Prodotti venduti e costi','Collegati'],['Capacità del personale','Da verificare']], warning:'Prima di spingere la promozione, verifica la capacità di gestirla.', title:'Il marketing vede anche il resto.', text:'Le proposte di campagna usano storico clienti, vendite e costi. Puoi valutarne la convenienza e confrontare i risultati nello stesso contesto.', context:'Marketing + clienti + margini + persone'},
    memory: {label:'CONTINUITÀ OPERATIVA', heading:'La procedura resta in azienda.', rows:[['Procedura e documenti','Disponibili'],['Storico delle attività','Consultabile'],['Ultimo caricamento','Da completare']], warning:'Un documento non è stato caricato: il passaggio resta segnalato.', title:'Chi subentra sa da dove ripartire.', text:'Trova la procedura, i documenti e lo stato del lavoro. Un’assenza non cancella il contesto: sai cosa è stato fatto e cosa richiede ancora una persona.', context:'Procedure + documenti + persone + report'}
  };
  const tabs = [...document.querySelectorAll('[data-scenario]')];
  function selectScenario(tab, focus=false) {
    tabs.forEach(t => { t.setAttribute('aria-selected', String(t===tab)); t.tabIndex=t===tab?0:-1; });
    const s = scenarios[tab.dataset.scenario];
    document.querySelector('.report-preview').classList.toggle('context-preview',tab.dataset.scenario==='overview');
    document.getElementById('result-panel').setAttribute('aria-labelledby',tab.id);
    document.getElementById('report-label').textContent=s.label;
    document.getElementById('report-heading').textContent=s.heading;
    const rows=document.getElementById('report-rows'); rows.replaceChildren();
    s.rows.forEach(([label,value]) => { const div=document.createElement('div'),span=document.createElement('span'),b=document.createElement('b');span.textContent=label;b.textContent=value;div.append(span,b);rows.append(div); });
    document.getElementById('report-warning').textContent='! '+s.warning;
    document.getElementById('decision-heading').textContent=s.title;
    document.getElementById('decision-text').textContent=s.text;
    document.getElementById('decision-context').textContent=s.context;
    if(focus)tab.focus();
  }
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>selectScenario(tab));
    tab.addEventListener('keydown',e => { let n; if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length; if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+tabs.length-1)%tabs.length; if(e.key==='Home')n=0; if(e.key==='End')n=tabs.length-1; if(n!==undefined){e.preventDefault();selectScenario(tabs[n],true);} });
  });
  // Keep a single contact destination. Hide the mobile bar near the form or keyboard.
  const contact=document.getElementById('check-up'), hero=document.getElementById('top'), bar=document.getElementById('mobile-contact');
  function updateContactBar() {
    const rect=contact.getBoundingClientRect();
    const editing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    const visible=innerWidth<=600 && hero.getBoundingClientRect().bottom<72 && (rect.top>innerHeight || rect.bottom<72) && !editing;
    bar.hidden=!visible;document.body.classList.toggle('has-contact-bar',visible);
  }
  let queued=false;
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{updateContactBar();queued=false;});}},{passive:true});
  addEventListener('resize',updateContactBar,{passive:true});
  document.addEventListener('focusin',updateContactBar); document.addEventListener('focusout',()=>setTimeout(updateContactBar,0));
  window.visualViewport?.addEventListener('resize',updateContactBar);
  updateContactBar();
  // Keep the inline form reachable without opening the mobile keyboard.
  const form=document.getElementById('leadForm');
  const leadStatus=document.getElementById('leadStatus');
  form.tabIndex=-1;
  form.addEventListener('input',e=>{leadStatus.textContent='';e.target.removeAttribute('aria-invalid');});
  document.querySelectorAll('a[href="#check-up"]').forEach(link=>link.addEventListener('click',e=>{
    if(innerWidth>600)return;
    e.preventDefault();
    history.pushState(null,'','#check-up');
    form.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
    form.focus({preventScroll:true});
  }));
})();
