'use strict';
(() => {
  const board=document.getElementById('automation-panel');
  if(!board)return;
  const canvas=document.getElementById('automation-canvas');
  const svg=canvas.querySelector('svg');
  const sources=[...canvas.querySelectorAll('[data-auto-source]')];
  const actions=[...canvas.querySelectorAll('[data-auto-step]')];
  const brain=canvas.querySelector('.automation-brain');
  const start=document.getElementById('run-automation'),pause=document.getElementById('pause-automation');
  const status=document.getElementById('automation-status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const ns='http://www.w3.org/2000/svg';
  const scenarios={
    report:{sources:['vendite','costi','persone','procedure'],trigger:'Arriva il report delle vendite.',titles:['Acquisisce le vendite','Aggiorna il riepilogo','Prepara il report'],texts:['Importa il nuovo report dalla fonte collegata.','Applica le regole e mette insieme ricavi e costi disponibili.','Il quadro del periodo è pronto per la consultazione e l’analisi.'],result:'Un report aggiornato, senza ricopiare tutto.',description:'I passaggi ripetitivi vengono eseguiti dal sistema. Dati e storico restano disponibili anche per le altre analisi.',limitLabel:'SE MANCA UN DATO',limit:'Una fattura non caricata resta segnalata: il margine è provvisorio finché il quadro non è completo.',done:'Esempio concluso: il report è aggiornato e le informazioni mancanti sono segnalate.'},
    marketing:{sources:['vendite','costi','marketing','persone'],trigger:'Arrivano i risultati di una campagna.',titles:['Raccoglie i risultati','Aggiorna il confronto','Prepara una proposta'],texts:['Acquisisce risultati pubblicitari e vendite dalle fonti collegate.','Aggiorna il report con costi e prodotti venduti secondo le regole definite.','L’AI usa il contesto per suggerire cosa verificare nella prossima campagna.'],result:'Il marketing legge anche vendite e costi.',description:'La raccolta e l’aggiornamento sono automatici. L’analisi mette in relazione i risultati e prepara una proposta da valutare.',limitLabel:'PRIMA DI AGIRE',limit:'Pubblicare una campagna o cambiarne il budget richiede l’approvazione concordata nel progetto.',done:'Esempio concluso: confronto aggiornato e proposta disponibile per la revisione.'},
    procedura:{sources:['costi','persone','procedure'],trigger:'Un documento atteso non è stato caricato.',titles:['Controlla la scadenza','Segnala il passaggio','Prepara il recupero'],texts:['Verifica i caricamenti attesi secondo la procedura concordata.','Evidenzia l’attività incompleta e prepara l’avviso al referente previsto.','Rende disponibili istruzioni e storico per completare il lavoro.'],result:'Il lavoro mancante diventa visibile.',description:'La verifica non dipende da chi si ricorda di farla. Il sistema conserva la procedura e segnala il passaggio da completare.',limitLabel:'COSA RESTA ALLA PERSONA',limit:'Il documento mancante deve ancora essere recuperato. La segnalazione non sostituisce un dato che non c’è.',done:'Esempio concluso: attività incompleta segnalata, procedura pronta per chi interviene.'}
  };
  let current='report',routes=[],packets=[],raf=0,startTime=0,elapsed=0,running=false,paused=false,lastPhase=-1;
  const duration=6500;
  function element(tag,attrs={}){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;}
  function rect(el){const r=el.getBoundingClientRect(),c=canvas.getBoundingClientRect();return {x:r.left-c.left,y:r.top-c.top,w:r.width,h:r.height};}
  function addRoute(d,key){
    svg.querySelector('.routes-base').append(element('path',{d}));
    const path=element('path',{d});svg.querySelector('.routes-light').append(path);
    const group=element('g',{opacity:0});group.append(element('rect',{x:-5,y:-7,width:10,height:14,rx:1.5,class:'data-sheet'}));
    group.append(element('path',{d:'M-3 -3 H3 M-3 0 H3 M-3 3 H1',class:'sheet-line'}));svg.querySelector('.routes-documents').append(group);
    const route={key,path,group,length:path.getTotalLength()};routes.push(route);
  }
  function drawRoutes(){
    const previous=board.dataset.state;
    if(running||paused)finish();
    svg.querySelectorAll('g').forEach(g=>g.replaceChildren());routes=[];
    const mobile=innerWidth<=600,b=rect(brain);
    sources.forEach(source=>{
      const s=rect(source);let d;
      if(mobile){const x=s.x+s.w,y=s.y+s.h/2,ex=b.x,ey=b.y+b.h/2,m=(x+ex)/2;d=`M${x} ${y} C${m} ${y} ${m} ${ey} ${ex} ${ey}`;}
      else{const x=s.x+s.w/2,y=s.y+s.h,ex=b.x+b.w/2,ey=b.y,m=(y+ey)/2;d=`M${x} ${y} C${x} ${m} ${ex} ${m} ${ex} ${ey}`;}
      addRoute(d,source.dataset.autoSource);
    });
    const a=actions.map(rect),sx=b.x+b.w/2,sy=b.y+b.h,ex=a[0].x+a[0].w/2,ey=a[0].y;
    addRoute(`M${sx} ${sy} C${sx} ${(sy+ey)/2} ${ex} ${(sy+ey)/2} ${ex} ${ey}`,'action1');
    for(let i=0;i<2;i++){
      if(mobile){const x=a[i].x+a[i].w/2,y=a[i].y+a[i].h,xx=a[i+1].x+a[i+1].w/2,yy=a[i+1].y;addRoute(`M${x} ${y} L${xx} ${yy}`,'action'+(i+2));}
      else{const x=a[i].x+a[i].w,y=a[i].y+a[i].h/2,xx=a[i+1].x,yy=a[i+1].y+a[i+1].h/2;addRoute(`M${x} ${y} L${xx} ${yy}`,'action'+(i+2));}
    }
    if(previous==='complete'||board.dataset.state==='complete')routes.forEach(r=>r.path.classList.toggle('connected',r.key.startsWith('action')||scenarios[current].sources.includes(r.key)));
  }
  function clear(){cancelAnimationFrame(raf);running=false;paused=false;elapsed=0;lastPhase=-1;pause.hidden=true;board.dataset.state='ready';board.dataset.phase='0';start.disabled=false;start.innerHTML='<span aria-hidden="true">▶</span> Avvia l’esempio';actions.forEach(a=>{a.classList.remove('is-working','is-complete');a.querySelector('.action-state').textContent='In attesa';});sources.forEach(s=>s.classList.remove('is-lit'));routes.forEach(r=>{r.path.classList.remove('connected');r.group.setAttribute('opacity','0');});}
  function setPhase(n){
    if(n===lastPhase)return;lastPhase=n;board.dataset.phase=String(n);
    actions.forEach((a,i)=>{a.classList.toggle('is-working',i===n-1);a.classList.toggle('is-complete',i<n-1);a.querySelector('.action-state').textContent=i<n-1?'Completato':i===n-1?'In esecuzione':'In attesa';});
    status.textContent=n===0?'Le informazioni entrano nel contesto comune.':scenarios[current].titles[n-1]+'.';
  }
  function finish(){cancelAnimationFrame(raf);running=false;paused=false;elapsed=duration;board.dataset.state='complete';board.dataset.phase='3';pause.hidden=true;start.disabled=false;start.innerHTML='<span aria-hidden="true">↺</span> Rivedi l’esempio';actions.forEach(a=>{a.classList.remove('is-working');a.classList.add('is-complete');a.querySelector('.action-state').textContent='Completato';});sources.forEach(s=>s.classList.toggle('is-lit',scenarios[current].sources.includes(s.dataset.autoSource)));routes.forEach(r=>{r.group.setAttribute('opacity','0');r.path.classList.toggle('connected',r.key.startsWith('action')||scenarios[current].sources.includes(r.key));});status.textContent=scenarios[current].done;}
  function frame(now){
    if(!running)return;
    elapsed=Math.min(duration,now-startTime);
    setPhase(elapsed<1800?0:elapsed<3300?1:elapsed<4900?2:3);
    routes.forEach((r,i)=>{
      const input=i<5,active=input?scenarios[current].sources.includes(r.key):true;
      const begins=input?i*90:1800+(i-5)*1550;
      const length=input?1450:850,t=(elapsed-begins)/length;
      r.path.classList.toggle('connected',active&&t>=0);
      if(active&&t>=0&&t<=1){const p=r.path.getPointAtLength(r.length*t);r.group.setAttribute('transform',`translate(${p.x} ${p.y})`);r.group.setAttribute('opacity',String(Math.min(1,t*8,(1-t)*8)));}
      else r.group.setAttribute('opacity','0');
      if(input)sources[i].classList.toggle('is-lit',active&&t>=0);
    });
    if(elapsed>=duration){finish();return;}raf=requestAnimationFrame(frame);
  }
  function run(){clear();drawRoutes();if(reduced.matches){finish();return;}board.dataset.state='running';running=true;start.disabled=true;start.innerHTML='<span aria-hidden="true">ϟ</span> Esempio in corso';pause.hidden=false;pause.textContent='Metti in pausa';startTime=performance.now();raf=requestAnimationFrame(frame);}
  start.addEventListener('click',run);
  pause.addEventListener('click',()=>{if(paused){paused=false;running=true;board.dataset.state='running';pause.textContent='Metti in pausa';startTime=performance.now()-elapsed;raf=requestAnimationFrame(frame);}else{running=false;paused=true;cancelAnimationFrame(raf);board.dataset.state='paused';pause.textContent='Riprendi';status.textContent='Esempio in pausa.';}});
  const tabs=[...document.querySelectorAll('[data-auto-scenario]')];
  function select(tab,focus=false){clear();current=tab.dataset.autoScenario;const s=scenarios[current];tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});board.setAttribute('aria-labelledby',tab.id);sources.forEach(el=>el.classList.toggle('is-relevant',s.sources.includes(el.dataset.autoSource)));document.getElementById('automation-trigger').textContent=s.trigger;s.titles.forEach((title,i)=>{document.getElementById('auto-title-'+(i+1)).textContent=title;document.getElementById('auto-text-'+(i+1)).textContent=s.texts[i];});document.getElementById('automation-result-title').textContent=s.result;document.getElementById('automation-result-text').textContent=s.description;document.getElementById('automation-limit-label').textContent=s.limitLabel;document.getElementById('automation-limit').textContent=s.limit;status.textContent='Segui i documenti lungo i collegamenti.';drawRoutes();if(focus)tab.focus();}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();select(tabs[n],true);}});});
  reduced.addEventListener('change',e=>{if(e.matches&&(running||paused))finish();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){running=false;paused=true;cancelAnimationFrame(raf);board.dataset.state='paused';pause.textContent='Riprendi';status.textContent='Esempio in pausa.';}});
  let size='';new ResizeObserver(()=>{const next=canvas.clientWidth+'x'+canvas.clientHeight;if(next!==size){size=next;drawRoutes();}}).observe(canvas);
  document.fonts.ready.then(drawRoutes);drawRoutes();
})();
