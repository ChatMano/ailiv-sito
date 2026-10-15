'use strict';
(() => {
  const panel = document.querySelector('.demo-console');
  if (!panel) return;
  const map = panel.querySelector('.flow-map');
  const svg = panel.querySelector('.flow-wires svg');
  const sources = [...panel.querySelectorAll('.data-source')];
  const cores = [...svg.querySelectorAll('.wire-core path')];
  const glows = [...svg.querySelectorAll('.wire-glow path')];
  const manual = panel.querySelector('.manual-work');
  const brain = panel.querySelector('.connected-brain');
  const output = panel.querySelector('.connected-output');
  const action = panel.querySelector('.before-action');
  const before = document.getElementById('mode-before');
  const after = document.getElementById('mode-after');
  const status = document.getElementById('flow-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const packets = sources.map(() => {
    const group = document.createElementNS(ns, 'g');
    group.setAttribute('class', 'document-packet');
    const page = document.createElementNS(ns, 'rect');
    Object.entries({x:-5,y:-7,width:10,height:14,rx:2}).forEach(([k,v]) => page.setAttribute(k,v));
    const lines = document.createElementNS(ns, 'path');
    lines.setAttribute('d', 'M-2 -3H2M-2 0H2M-2 3H1');
    group.append(page, lines); svg.append(group);
    return group;
  });
  let geometry = [], progress = 0, target = 0, frame = 0, start = 0, from = 0, duration = 0, currentPhase = -1;
  const ease = t => t*t*t*(t*(t*6-15)+10);
  const mix = (a,b,t) => a+(b-a)*t;
  const pathString = p => `M${p[0]},${p[1]} C${p.slice(2,8).join(',')} C${p.slice(8,14).join(',')} C${p.slice(14).join(',')}`;
  function layout() {
    const box = map.getBoundingClientRect(), end = panel.querySelector('.flow-center').getBoundingClientRect();
    const bottom = panel.querySelector('.data-sources').getBoundingClientRect().bottom-box.top;
    const w = box.width, y = end.top-box.top, ex = w/2;
    const compact = matchMedia('(max-width:600px)').matches;
    svg.setAttribute('viewBox', `0 0 ${w} ${box.height}`);
    geometry = sources.map((source,i) => {
      const rect=source.getBoundingClientRect();
      const sx = rect.left-box.left + rect.width/2;
      const sy = rect.bottom-box.top;
      let x, sY, lane, gapY;
      if (compact && i < 4) {
        const right = i%2 === 1;
        x = rect.left-box.left + (right ? rect.width : 0);
        sY = rect.top-box.top + rect.height/2;
        lane = right ? w-5-i*2 : 5+i*2;
        gapY = bottom+12+i*3;
      } else { x=sx; sY=sy; lane=x; gapY=bottom+12; }
      const gap = y-gapY;
      const chaoticA = [.88,.11,.82,.17,.67][i]*w;
      const chaoticB = [.19,.84,.09,.9,.29][i]*w;
      const first = [x,sY,lane,sY,lane,gapY,lane,gapY];
      const tidy = [...first, lane,gapY+gap*.4, ex,gapY+gap*.38, ex,gapY+gap*.68, ex,gapY+gap*.8, ex,y-14, ex,y];
      const tangled = [...first, chaoticA,gapY+gap*(.12+i*.06), chaoticB,gapY+gap*.94, chaoticB,gapY+gap*.5,
        chaoticB,gapY-gap*.2, chaoticA,gapY+gap*1.12, ex+(i-2)*13,y];
      return {tidy,tangled};
    });
    draw();
  }
  function draw() {
    geometry.forEach(({tidy,tangled},i) => {
      const d=pathString(tidy.map((v,n)=>mix(tangled[n],v,progress)));
      cores[i].setAttribute('d',d); glows[i].setAttribute('d',d);
    });
  }
  function phase(n) {
    if(n===currentPhase)return;
    currentPhase=n; panel.dataset.phase=n;
    panel.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('complete',Number(el.dataset.step)<=n));
    status.textContent=['','I dati vengono raccolti dagli strumenti collegati.','Le automazioni aggiornano i report e segnalano i passaggi mancanti.','Ora puoi leggere più reparti nello stesso contesto.'][n];
  }
  function hidePackets(){packets.forEach(p=>p.style.opacity=0);}
  function tick(now) {
    const elapsed=now-start;
    progress=mix(from,target,ease(Math.min(1,elapsed/duration)));
    draw();
    if(target) {
      phase(elapsed<1000?0:elapsed<2500?1:elapsed<4000?2:3);
      packets.forEach((packet,i)=>{
        const t=(elapsed-1700-i*140)/1900;
        if(t<0||t>1){packet.style.opacity=0;return;}
        const point=cores[i].getPointAtLength(cores[i].getTotalLength()*t);
        packet.setAttribute('transform',`translate(${point.x} ${point.y})`);
        packet.style.opacity=Math.min(1,t*9,(1-t)*9);
      });
    }
    if(elapsed<(target?4700:duration))frame=requestAnimationFrame(tick);
    else{frame=0;hidePackets();panel.classList.remove('is-running');}
  }
  function setMode(next, replay=false) {
    if(next===target&&!replay)return;
    cancelAnimationFrame(frame);hidePackets();
    target=next;from=progress;start=performance.now();duration=Math.max(450,2100*Math.abs(target-from));
    panel.dataset.mode=next?'after':'before';
    before.setAttribute('aria-pressed',String(!next));after.setAttribute('aria-pressed',String(!!next));
    output.inert=!next; output.setAttribute('aria-hidden',String(!next));
    action.inert=!!next;action.setAttribute('aria-hidden',String(!!next));
    manual.setAttribute('aria-hidden',String(!!next));brain.setAttribute('aria-hidden',String(!next));
    phase(0);
    if(reduced.matches){progress=next;draw();phase(next?3:0);panel.classList.remove('is-running');return;}
    panel.classList.toggle('is-running',!!next);
    frame=requestAnimationFrame(tick);
  }
  before.addEventListener('click',()=>setMode(0));
  after.addEventListener('click',()=>setMode(1));
  document.getElementById('connect-data').addEventListener('click',()=>{after.focus({preventScroll:true});setMode(1);});
  document.getElementById('replay-flow').addEventListener('click',()=>setMode(1,true));
  reduced.addEventListener('change',()=>{if(reduced.matches)setMode(target,true);});
  const observer=new ResizeObserver(layout);
  observer.observe(map); sources.forEach(source=>observer.observe(source));
  document.fonts?.ready.then(layout);
  layout();
})();
