'use strict';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const byId = id => document.getElementById(id);
const menuButton = document.querySelector('.menu-toggle');
const menu = byId('mobile-nav');
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','Apri il menu');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open ? 'Chiudi il menu' : 'Apri il menu');
  document.body.classList.toggle('menu-open',open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{ if (e.key==='Escape' && !menu.hidden) closeMenu(true); });
matchMedia('(min-width: 851px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);} });
  },{threshold:.06,rootMargin:'0px 0px -12px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}
reducedMotion.addEventListener('change',e=>{if(e.matches)document.documentElement.classList.remove('motion-ready');});
let scrollQueued = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
  scrollQueued=false;
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress,{passive:true});
updateProgress();

// Every tab set supports touch, keyboard arrows, Home and End.
function bindTabs(selector,select) {
  const tabs=[...document.querySelectorAll(selector)];
  function activate(tab,focus=false){
    tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});
    const panel=byId(tab.getAttribute('aria-controls'));
    if(panel)panel.setAttribute('aria-labelledby',tab.id);
    select(tab);
    if(focus)tab.focus();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',e=>{
      let next;
      if(['ArrowRight','ArrowDown'].includes(e.key))next=(i+1)%tabs.length;
      if(['ArrowLeft','ArrowUp'].includes(e.key))next=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home')next=0;
      if(e.key==='End')next=tabs.length-1;
      if(next!==undefined){e.preventDefault();activate(tabs[next],true);}
    });
  });
  return {tabs,activate};
}
function animateSwap(el){
  if(!el || reducedMotion.matches)return;
  el.classList.remove('swap-in');
  requestAnimationFrame(()=>el.classList.add('swap-in'));
}
const story = {
  dati:{image:'lavoro',alt:'Marco e Giulia confrontano una fattura con i dati al computer',description:'Un file per gli incassi. Un gestionale per i costi. Un altro per il marketing. Il collegamento lo fanno ancora loro.',index:'01 / 03'},
  contesto:{image:'contesto',alt:'Giulia torna a spiegare il contesto alla chat sul computer',description:'Caricano documenti nella chat, cercano una risposta e devono spiegare di nuovo il contesto. Il quadro completo resta difficile da ricostruire.',index:'02 / 03'},
  procedure:{image:'ritardi',alt:'Marco e Giulia scoprono che alcune attività non sono state completate',description:'Un documento non è stato caricato. Chi doveva farlo è assente. Il report si ferma, e loro devono ritrovare il passaggio mancante.',index:'03 / 03'}
};
bindTabs('[data-story]',tab=>{
  const item=story[tab.dataset.story];
  byId('story-image').src=`assets/${item.image}.webp`;
  byId('story-image').alt=item.alt;
  byId('story-description').textContent=item.description;
  byId('story-counter').textContent=item.index;
  animateSwap(byId('story-panel'));
});
const agents = {
  volt:{image:'volt',alt:'Il sistema collega gli incassi con le altre aree del ristorante',role:'01 / I COLLEGAMENTI',title:'Ogni dato arriva al posto giusto.',text:'Vendite, fatture, banca e marketing smettono di vivere separati. I collegamenti raccolgono i dati e aggiornano i processi con regole definite.',result:'Il report delle vendite entra nel riepilogo, senza ricopiarlo ogni volta.',href:'collegamenti.html#vendite',link:'Vedi cosa possiamo collegare',index:'01 / 03'},
  custode:{image:'custode',alt:'Il sistema protegge le procedure e segnala i documenti mancanti',role:'02 / LA MEMORIA',title:'Il sapere rimane. Anche quando cambia una persona.',text:'Procedure, documenti e storico vengono conservati e resi consultabili. Chi subentra trova un percorso, e le attività incomplete diventano visibili.',result:'Un’assenza non cancella il modo di lavorare. Sai quali passaggi sono stati fatti e quali mancano.',href:'collegamenti.html#persone',link:'Persone, procedure e continuità',index:'02 / 03'},
  prisma:{image:'prisma',alt:'Il sistema mette in relazione tutte le aree del ristorante',role:'03 / LA VISIONE D’INSIEME',title:'Ogni decisione vede più lontano.',text:'Vendite, costi, persone e campagne vengono letti insieme. Puoi fare domande tenendo conto di ciò che succede negli altri reparti.',result:'Valuti una promozione insieme ai margini e alla capacità di gestirla, oltre ai risultati pubblicitari.',href:'sistema.html#visione',link:'Guarda il sistema nel suo insieme',index:'03 / 03'}
};
const crew = bindTabs('[data-agent]',tab=>{
  const item=agents[tab.dataset.agent];
  byId('agent-image').src=`assets/${item.image}.webp`;
  byId('agent-image').alt=item.alt;
  byId('agent-role').textContent=item.role;
  byId('agent-title').textContent=item.title;
  byId('agent-text').textContent=item.text;
  byId('agent-result').textContent=item.result;
  byId('agent-link').href=item.href;
  byId('agent-link').textContent=item.link+' ↗';
  document.querySelector('.crew-index').textContent=item.index;
  animateSwap(byId('crew-panel'));
});
const crewImage=document.querySelector('.crew-image');
if(crewImage){
  let touchStart=null;
  crewImage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchStart={x:e.clientX,y:e.clientY};},{passive:true});
  crewImage.addEventListener('pointerup',e=>{
    if(!touchStart)return;
    const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4){
      const current=crew.tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
      crew.activate(crew.tabs[(current+(dx<0?1:crew.tabs.length-1))%crew.tabs.length]);
    }
  },{passive:true});
  crewImage.addEventListener('pointercancel',()=>{touchStart=null;},{passive:true});
}
const questions={
  promo:{sources:['vendite','costi','marketing','persone'],title:'Una promozione che regga anche nei margini.',text:'Metti insieme prodotti venduti, costo delle materie prime, risultati delle campagne e disponibilità del personale prima di decidere cosa spingere.'},
  mese:{sources:['vendite','costi','persone','procedure'],title:'Un bilancino che mostri anche cosa manca.',text:'Incassi, costi fissi, personale e acquisti entrano nel riepilogo del mese. I documenti non caricati sono evidenziati, così sai quanto è completo il quadro.'},
  persona:{sources:['persone','procedure','costi'],title:'Un passaggio di consegne con una memoria.',text:'Chi subentra trova procedure, documenti e storico delle attività. Se una fattura non è stata caricata, il passaggio mancante è visibile anche negli aggiornamenti dei costi.'}
};
function showQuestion(key,animate=true){
  const item=questions[key], panel=byId('question-panel');
  if(!panel)return;
  panel.querySelectorAll('[data-source]').forEach((node,i)=>{
    const active=item.sources.includes(node.dataset.source);
    node.classList.toggle('connected',active);
    document.querySelectorAll('.beam-field i')[i].classList.toggle('lit',active);
  });
  byId('question-title').textContent=item.title;
  byId('question-text').textContent=item.text;
  if(animate && !reducedMotion.matches){
    panel.classList.remove('energized');
    requestAnimationFrame(()=>panel.classList.add('energized'));
    animateSwap(panel.querySelector('.answer'));
  }
}
bindTabs('[data-question]',tab=>showQuestion(tab.dataset.question));
showQuestion('promo',false);

const dialog=byId('film-dialog'), film=byId('full-film');
const teaser=byId('teaser'), motionToggle=byId('motion-toggle');
let manualPause=reducedMotion.matches||Boolean(navigator.connection?.saveData),teaserVisible=false;
function syncMotion(){
  if(!teaser)return;
  const shouldPlay=teaserVisible&&!manualPause&&!dialog.open&&!document.hidden;
  if(shouldPlay){if(!teaser.src)teaser.src=teaser.dataset.src;teaser.play().catch(()=>{});}else teaser.pause();
  motionToggle.textContent=manualPause?'▶':'Ⅱ';
  motionToggle.setAttribute('aria-pressed',String(manualPause));
  motionToggle.setAttribute('aria-label',manualPause?'Riproduci l’anteprima animata':'Metti in pausa l’anteprima animata');
}
if(teaser){
  motionToggle.addEventListener('click',()=>{manualPause=!manualPause;syncMotion();});
  new IntersectionObserver(entries=>{teaserVisible=entries[0].isIntersecting;syncMotion();},{threshold:.15}).observe(teaser);
  reducedMotion.addEventListener('change',()=>{manualPause=reducedMotion.matches;syncMotion();});
  document.addEventListener('visibilitychange',syncMotion);
  syncMotion();
}
let filmOpener=null, requestedTime=0;
film.addEventListener('loadedmetadata',()=>{film.currentTime=requestedTime;});
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{
  filmOpener=button;requestedTime=Number(button.dataset.film);
  dialog.showModal();document.body.classList.add('modal-open');
  if(teaser)teaser.pause();
  byId('portal-video')?.pause();
  if(film.readyState>0)film.currentTime=requestedTime;
  film.play().catch(()=>{});
}));
byId('close-film').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{
  const r=dialog.getBoundingClientRect();
  if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();
});
dialog.addEventListener('close',()=>{film.pause();document.body.classList.remove('modal-open');syncMotion();filmOpener?.focus();});
document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>{requestedTime=Number(button.dataset.seek);film.currentTime=requestedTime;film.play().catch(()=>{});}));

const portal=byId('portal-video');
if(portal){
  const stage=document.querySelector('.portal-stage');
  const trigger=byId('enter-system'), hotspot=byId('portal-logo');
  const startActions=stage.querySelector('.portal-start');
  const controls=stage.querySelector('.portal-playback'), finish=stage.querySelector('.portal-finish');
  const poster=stage.querySelector('.portal-poster'), pause=byId('pause-portal'), status=byId('portal-status');
  let state='ready', attempt=0;
  function setState(next){
    state=next;stage.dataset.portalState=next;
    const initial=next==='ready'||next==='loading';
    startActions.hidden=!initial;hotspot.hidden=!initial;
    trigger.disabled=hotspot.disabled=next==='loading';
    controls.hidden=!['playing','paused'].includes(next);
    finish.hidden=next!=='ended';
    stage.setAttribute('aria-busy',String(next==='loading'));
  }
  function preparePortal(){
    if(!portal.getAttribute('src')){portal.src=portal.dataset.src;portal.preload='auto';portal.load();}
  }
  function failPortal(){
    attempt++;portal.pause();portal.hidden=true;stage.classList.remove('has-video-frame');
    poster.src='assets/ingresso-partenza.webp';setState('ready');
    status.textContent='Il video non è partito. Premi di nuovo per riprovare.';
  }
  function finishPortal(){
    const keepFocus=controls.contains(document.activeElement)||document.activeElement===trigger||document.activeElement===hotspot;
    portal.pause();setState('ended');status.textContent='I collegamenti prendono forma. Esplora come lavorano insieme.';
    if(keepFocus)finish.querySelector('a').focus({preventScroll:true});
  }
  function startPortal(forceMotion=false){
    if(state==='loading')return;
    const thisAttempt=++attempt;
    stage.scrollIntoView({block:'start',behavior:'instant'});
    if(reducedMotion.matches&&!forceMotion){
      portal.hidden=true;stage.classList.remove('has-video-frame');
      poster.src='assets/ingresso-arrivo.webp';poster.alt='Il mondo AILIV: i reparti collegati intorno alla stessa azienda';
      finishPortal();return;
    }
    poster.src='assets/ingresso-partenza.webp';
    poster.alt='Sul computer di Marco e Giulia, il logo AILIV da cliccare';
    stage.classList.remove('has-video-frame');setState('loading');
    status.textContent='L’ingresso si sta aprendo…';
    preparePortal();portal.hidden=false;portal.currentTime=0;
    portal.play().catch(()=>{if(attempt===thisAttempt)failPortal();});
  }
  portal.addEventListener('playing',()=>{
    if(!['loading','paused'].includes(state))return;
    const thisAttempt=attempt;
    const revealFrame=()=>{
      if(attempt!==thisAttempt||portal.paused)return;
      stage.classList.add('has-video-frame');setState('playing');
      pause.innerHTML='Ⅱ <span>Pausa</span>';pause.setAttribute('aria-label','Metti in pausa l’ingresso');
      status.textContent='Dal computer, dentro il sistema.';
    };
    if('requestVideoFrameCallback' in portal)portal.requestVideoFrameCallback(revealFrame);
    else requestAnimationFrame(revealFrame);
  });
  [trigger,hotspot].forEach(button=>{
    button.addEventListener('click',()=>startPortal());
    button.addEventListener('pointerenter',preparePortal,{once:true});
    button.addEventListener('focus',preparePortal,{once:true});
  });
  byId('replay-portal').addEventListener('click',()=>startPortal(true));
  byId('skip-portal').addEventListener('click',()=>{
    finishPortal();
    const target=byId('squadra');target.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});
    target.querySelector('[role="tab"]').focus({preventScroll:true});
  });
  pause.addEventListener('click',()=>{
    if(portal.paused){portal.play().catch(failPortal);}
    else{portal.pause();setState('paused');pause.innerHTML='▶ <span>Riprendi</span>';pause.setAttribute('aria-label','Riprendi l’ingresso');}
  });
  portal.addEventListener('ended',finishPortal);
  portal.addEventListener('pause',()=>{
    if(state==='playing'&&!portal.ended){setState('paused');pause.innerHTML='▶ <span>Riprendi</span>';pause.setAttribute('aria-label','Riprendi l’ingresso');}
  });
  portal.addEventListener('error',()=>{if(['loading','playing','paused'].includes(state))failPortal();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&state==='playing'){portal.pause();setState('paused');pause.innerHTML='▶ <span>Riprendi</span>';pause.setAttribute('aria-label','Riprendi l’ingresso');}
  });
  reducedMotion.addEventListener('change',e=>{if(e.matches&&['playing','loading'].includes(state)){poster.src='assets/ingresso-arrivo.webp';portal.hidden=true;stage.classList.remove('has-video-frame');finishPortal();}});
}

const form=byId('checkup-form');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    byId('form-status').textContent='Il percorso è completo. Questa è un’anteprima: nessuna richiesta è stata inviata e nessun dato è stato salvato.';
  });
}
