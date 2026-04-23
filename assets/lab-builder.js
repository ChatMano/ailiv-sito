/* ============================================================================
   AILIV · LAB BUILDER — "Quanto tempo ti sta rubando il tuo business?"
   Workflow-style animated quiz (GHL-style). 3 domande.
   A ogni risposta si costruiscono blocchi e frecce animate dentro il canvas.
   Finale: workflow completo + form GHL.
   ========================================================================= */

const QUIZ = {
  steps: [
    {
      n: 1,
      q: "Quali di queste cose fai ancora a mano ogni settimana?",
      help: "Seleziona tutte quelle che ti rubano tempo. Ogni risposta costruirà un pezzo del tuo workflow.",
      mode: "multi",
      options: [
        {
          emoji: "💬",
          label: "Rispondere agli stessi messaggi 10 volte",
          desc: "WhatsApp, email, DM: le stesse domande di sempre",
          title: "Auto-risposta alle richieste",
          workflow: [
            { type: "trigger", icon: "💬", label: "Un cliente ti scrive", desc: "WhatsApp, DM Instagram, email, Google", tag: "Trigger" },
            { type: "action", icon: "🤖", label: "L'assistente risponde subito", desc: "Orari, prezzi, disponibilità, domande frequenti", tag: "Automatico" },
            { type: "action", icon: "📝", label: "Salva il contatto nella rubrica", desc: "Con nome, canale, richiesta, storico", tag: "Automatico" }
          ]
        },
        {
          emoji: "📞",
          label: "Confermare appuntamenti e prenotazioni",
          desc: "Richiami uno per uno per ricordare l'orario",
          title: "Appuntamenti senza dimenticanze",
          workflow: [
            { type: "trigger", icon: "📅", label: "Il cliente prenota online", desc: "Sceglie lui giorno e ora", tag: "Trigger" },
            { type: "action", icon: "📱", label: "Gli arriva conferma subito", desc: "WhatsApp + email con i dettagli", tag: "Automatico" },
            { type: "action", icon: "⏰", label: "Promemoria 24h e 2h prima", desc: "Meno no-show, agenda piena", tag: "Automatico" }
          ]
        },
        {
          emoji: "⭐",
          label: "Chiedere recensioni dopo il servizio",
          desc: "Uno per uno, quando ti ricordi",
          title: "Recensioni Google automatiche",
          workflow: [
            { type: "trigger", icon: "✅", label: "Servizio o vendita completata", desc: "Appuntamento chiuso, ordine consegnato", tag: "Trigger" },
            { type: "action", icon: "⏱️", label: "Aspetta 2 ore", desc: "Il cliente è ancora 'caldo'", tag: "Automatico" },
            { type: "action", icon: "⭐", label: "Arriva link recensione Google", desc: "Se risponde male, resta privato e ti avvisa", tag: "Automatico" }
          ]
        },
        {
          emoji: "💌",
          label: "Ricontattare i clienti che non tornano",
          desc: "Dovresti, ma non trovi il tempo",
          title: "Clienti dormienti riattivati",
          workflow: [
            { type: "trigger", icon: "🕐", label: "30 giorni senza visita/ordine", desc: "Il sistema se ne accorge da solo", tag: "Trigger" },
            { type: "action", icon: "💌", label: "Messaggio personalizzato", desc: "Con il nome e l'ultimo prodotto comprato", tag: "Automatico" },
            { type: "action", icon: "🎁", label: "Offerta dedicata", desc: "Solo per lui, tempo limitato", tag: "Automatico" }
          ]
        }
      ]
    },
    {
      n: 2,
      q: "Quante ore totali ci perdi a settimana?",
      help: "Stima onesta. Pensaci bene — sono ore tue.",
      mode: "single",
      options: [
        { emoji: "⏱️", label: "1–3 ore a settimana", desc: "\"Non è tantissimo… ma si sommano\"", hours: 2 },
        { emoji: "⏰", label: "4–8 ore a settimana", desc: "Mezza giornata lavorativa intera", hours: 6 },
        { emoji: "🕐", label: "Oltre 10 ore", desc: "Più di una giornata e mezza, ogni settimana", hours: 12 }
      ]
    },
    {
      n: 3,
      q: "Se te le restituissimo, cosa ci faresti?",
      help: "È la parte più importante. Quella che ti motiva davvero.",
      mode: "single",
      options: [
        { emoji: "💼", label: "Svilupperei nuovi clienti", desc: "Vendite, partnership, sviluppo", goalIcon: "💼", goalLabel: "Più tempo per far crescere il business" },
        { emoji: "👨‍👩‍👧", label: "Starei con la mia famiglia", desc: "Un'ora in più a tavola, il weekend libero", goalIcon: "👨‍👩‍👧", goalLabel: "Tempo per la tua vita" },
        { emoji: "🚀", label: "Migliorerei quello che offro", desc: "Cura, qualità, innovazione", goalIcon: "🚀", goalLabel: "Prodotto e servizio migliori" },
        { emoji: "😌", label: "Finalmente respirerei", desc: "Niente corse, niente to-do infinita", goalIcon: "😌", goalLabel: "Meno stress, più lucidità" }
      ]
    }
  ]
};

// ============================================================================
// STATE
// ============================================================================
const LabState = { step: 0, manual: [], hours: null, goal: null };

function openLab() {
  LabState.step = 0;
  LabState.manual = [];
  LabState.hours = null;
  LabState.goal = null;
  document.getElementById('labModal').classList.add('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderStep();
}

function closeLab() {
  document.getElementById('labModal').classList.remove('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ============================================================================
// RENDERING
// ============================================================================
function renderStep() {
  const step = QUIZ.steps[LabState.step];
  if (!step) { renderResult(); return; }

  const progressDots = QUIZ.steps.map((_, i) => {
    if (i < LabState.step) return '<div class="progress-dot done"></div>';
    if (i === LabState.step) return '<div class="progress-dot active"></div>';
    return '<div class="progress-dot"></div>';
  }).join('');

  let options = '';
  if (step.n === 1) {
    options = step.options.map((o, i) => `
      <button class="quiz-option ${LabState.manual.includes(i) ? 'selected' : ''}" onclick="toggleManual(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1">${o.label}</div>
          <div class="text-sm text-[#143d5c]/65 leading-snug">${o.desc}</div>
        </div>
      </button>
    `).join('');
  } else if (step.n === 2) {
    options = step.options.map((o, i) => `
      <button class="quiz-option ${LabState.hours === i ? 'selected' : ''}" onclick="selectHours(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1">${o.label}</div>
          <div class="text-sm text-[#143d5c]/65 leading-snug">${o.desc}</div>
        </div>
      </button>
    `).join('');
  } else {
    options = step.options.map((o, i) => `
      <button class="quiz-option ${LabState.goal === i ? 'selected' : ''}" onclick="selectGoal(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1">${o.label}</div>
          <div class="text-sm text-[#143d5c]/65 leading-snug">${o.desc}</div>
        </div>
      </button>
    `).join('');
  }

  const canvasHtml = buildCanvas();

  const canNext = step.n === 1 ? LabState.manual.length > 0
                 : step.n === 2 ? LabState.hours !== null
                 : LabState.goal !== null;
  const canBack = LabState.step > 0;
  const isLast = LabState.step === QUIZ.steps.length - 1;

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
      <span class="lab-badge">🧪 Costruisci il tuo workflow</span>
      <span class="text-xs text-[#143d5c]/50 font-semibold">${step.mode === "multi" ? "Selezione multipla" : "Una risposta"}</span>
    </div>
    <div class="flex items-center gap-2 mb-6">
      ${progressDots}
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">Domanda ${step.n} di ${QUIZ.steps.length}</span>
    </div>

    <div class="lab-split">
      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">${step.q}</h3>
        <p class="text-[#143d5c]/60 text-sm mb-5">${step.help}</p>
        <div class="space-y-3">${options}</div>
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#D4998D] dot"></span> Il tuo workflow live
        </p>
        ${canvasHtml}
      </div>
    </div>

    <div class="flex justify-between items-center mt-6 pt-6 border-t border-[#143d5c]/10">
      <button onclick="prevStep()" class="${canBack ? '' : 'invisible'} text-[#143d5c]/60 hover:text-[#143d5c] font-semibold text-sm flex items-center gap-1">
        ← Indietro
      </button>
      <button onclick="nextStep()" ${canNext ? '' : 'disabled'}
              class="btn-coral px-6 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2 ${canNext ? '' : 'opacity-40 cursor-not-allowed'}">
        ${isLast ? 'Vedi il risultato' : 'Prossima domanda'} <span>→</span>
      </button>
    </div>
  `;
}

// ============================================================================
// CANVAS BUILDER
// ============================================================================
function buildCanvas() {
  if (LabState.manual.length === 0 && LabState.hours === null && LabState.goal === null) {
    return `<div class="wf-canvas"><div class="wf-empty">↓ Il tuo workflow apparirà qui ↓<br><span class="text-xs opacity-60">mentre rispondi alle domande</span></div></div>`;
  }

  let html = '<div class="wf-canvas">';

  // Header con ore recuperate (D2)
  if (LabState.hours !== null) {
    const h = QUIZ.steps[1].options[LabState.hours].hours;
    const monthly = h * 4;
    const yearly = h * 52;
    const days = Math.round(yearly / 8);
    html += `<div class="wf-header">⏰ ${h}h/sett · ${monthly}h/mese · ${days} giornate/anno</div>`;
  }

  // Workflow selezionati (D1)
  let nodeIndex = 0;
  LabState.manual.forEach((optIdx, wfIdx) => {
    const wf = QUIZ.steps[0].options[optIdx].workflow;
    const title = QUIZ.steps[0].options[optIdx].title;
    if (wfIdx > 0) {
      const sepDelay = nodeIndex * 150;
      html += `<div class="wf-block"><div class="wf-node wf-node--sep" style="animation-delay:${sepDelay}ms">+ ${title}</div></div>`;
      nodeIndex++;
    } else if (wfIdx === 0) {
      html += `<div class="wf-block"><div class="wf-node wf-node--sep" style="animation-delay:0ms">${title}</div></div>`;
      nodeIndex++;
    }
    wf.forEach((node, i) => {
      const delay = nodeIndex * 150;
      html += `<div class="wf-arrow" style="animation-delay:${delay - 50}ms"></div>`;
      html += `
        <div class="wf-block">
          <div class="wf-node wf-node--${node.type}" style="animation-delay:${delay}ms">
            <span class="wf-icon">${node.icon}</span>
            <div class="wf-body">
              <div class="wf-label">${node.label}</div>
              ${node.desc ? `<div class="wf-desc">${node.desc}</div>` : ''}
            </div>
            <span class="wf-tag">${node.tag}</span>
          </div>
        </div>
      `;
      nodeIndex++;
    });
  });

  // Goal node (D3)
  if (LabState.goal !== null) {
    const goal = QUIZ.steps[2].options[LabState.goal];
    const delay = nodeIndex * 150;
    html += `<div class="wf-arrow" style="animation-delay:${delay - 50}ms"></div>`;
    html += `
      <div class="wf-block">
        <div class="wf-node wf-node--goal" style="animation-delay:${delay}ms">
          <span class="wf-icon">${goal.goalIcon}</span>
          <div class="wf-body">
            <div class="wf-label">${goal.goalLabel}</div>
            <div class="wf-desc" style="opacity:0.8;">${goal.desc}</div>
          </div>
          <span class="wf-tag">🎯 Il tuo obiettivo</span>
        </div>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

// ============================================================================
// SELECT HANDLERS
// ============================================================================
function toggleManual(i) {
  const idx = LabState.manual.indexOf(i);
  if (idx >= 0) LabState.manual.splice(idx, 1);
  else LabState.manual.push(i);
  renderStep();
}
function selectHours(i) { LabState.hours = i; renderStep(); }
function selectGoal(i) { LabState.goal = i; renderStep(); }

function nextStep() {
  const step = QUIZ.steps[LabState.step];
  const canNext = step.n === 1 ? LabState.manual.length > 0
                 : step.n === 2 ? LabState.hours !== null
                 : LabState.goal !== null;
  if (!canNext) return;
  LabState.step += 1;
  renderStep();
}

function prevStep() {
  if (LabState.step === 0) return;
  LabState.step -= 1;
  renderStep();
}

// ============================================================================
// FINAL RESULT
// ============================================================================
function renderResult() {
  const h = QUIZ.steps[1].options[LabState.hours].hours;
  const yearly = h * 52;
  const days = Math.round(yearly / 8);
  const goalOpt = QUIZ.steps[2].options[LabState.goal];
  const activeWorkflows = LabState.manual.length;

  const canvasHtml = buildCanvas();

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge" style="background:rgba(212,167,71,0.18);color:#9a7818;">✅ WORKFLOW COMPLETATO</span>
    </div>

    <h3 class="text-3xl md:text-4xl font-bold text-[#143d5c] leading-tight mb-3">
      Tu stai regalando <span class="headline-coral">~${h} ore</span> a settimana al lavoro manuale.
    </h3>
    <p class="text-[#143d5c]/75 text-lg leading-relaxed mb-6">
      Sono <strong>${yearly} ore all'anno</strong>. Circa <strong>${days} giornate lavorative</strong> perse a fare cose ripetitive che un sistema farebbe da solo.<br>
      Qui sotto ${activeWorkflows > 1 ? `i ${activeWorkflows} workflow` : 'il workflow'} che attiveremmo per te.
    </p>

    <div class="mb-6">
      <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2">Ecco cosa attiveremmo</p>
      ${canvasHtml}
    </div>

    <div class="bg-[#143d5c] text-white rounded-2xl p-6 mb-5">
      <p class="text-xs uppercase tracking-widest text-[#D4998D] font-bold mb-2">Il risultato per te</p>
      <p class="text-xl md:text-2xl font-bold leading-snug mb-2"><span class="text-[#D4998D]">${days} giornate all'anno</span> per: <em>${goalOpt.goalLabel.toLowerCase()}</em>.</p>
      <p class="text-white/80 text-sm leading-relaxed">
        Lasciaci 2 info qui sotto. <strong>In 24 ore</strong> ti mandiamo una proposta personalizzata con costi e tempi di attivazione — o ti diciamo onestamente se non siamo il fit giusto.
      </p>
    </div>

    <div style="height:560px;">
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/BurG4Q7fFt6liEwrBBuF"
        style="width:100%;height:100%;border:none;border-radius:12px"
        id="inline-lab-BurG4Q7fFt6liEwrBBuF"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-form-name="Form Sito ufficiale"
        data-form-id="BurG4Q7fFt6liEwrBBuF"
        title="Form proposta personalizzata">
      </iframe>
    </div>

    <div class="mt-5 flex justify-between items-center text-sm">
      <button onclick="openLab()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold flex items-center gap-1">
        🔄 Rifai il test
      </button>
      <button onclick="closeLab()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold">
        Chiudi
      </button>
    </div>
  `;

  if (typeof window.leadConnectorForms !== 'undefined' && window.leadConnectorForms.init) {
    try { window.leadConnectorForms.init(); } catch (e) {}
  }
}

// Chiudi con ESC o click fuori (con guard sul DOM)
function initLabListeners() {
  const modal = document.getElementById('labModal');
  if (!modal) return;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeLab();
  });
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'labModal') closeLab();
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLabListeners);
} else {
  initLabListeners();
}
