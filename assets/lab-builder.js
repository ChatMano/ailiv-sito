/* ============================================================================
   AILIV · LAB BUILDER
   Modal-based quiz engine. 3 scenari × 3 domande. Timeline progressiva.
   Risultato finale: diagnosi + iframe form GHL per prenotare call.
   ========================================================================= */

const QUIZ = {
  automazione: {
    title: "🤖 Costruisci la tua prima automazione AI",
    subtitle: "3 domande per capire quale processo automatizzare per primo.",
    timeline: ["Problema", "Pattern", "Delivery"],
    steps: [
      {
        n: 1,
        q: "Dove perdi più tempo ogni giorno?",
        help: "Pensa a cosa ti blocca dal lavorare \"sul\" business invece che \"nel\" business.",
        options: [
          { emoji: "📞", label: "Rispondere ai clienti", desc: "WhatsApp, mail, telefono — lead qualificati, prenotazioni, domande ripetute.", slot: "Risposta clienti" },
          { emoji: "📊", label: "Controllare i numeri", desc: "Cassa, ordini, KPI, alert — report a mano, Excel incrociati.", slot: "Numeri & operations" },
          { emoji: "📧", label: "Follow-up e nurture", desc: "Lead che si raffreddano, clienti dormienti, recensioni che non arrivano.", slot: "Follow-up commerciali" }
        ]
      },
      {
        n: 2,
        q: "Chi dovrebbe gestire l'aiuto AI?",
        help: "Quanto controllo vuoi mantenere sulla decisione finale?",
        options: [
          { emoji: "🤖", label: "Piena automazione", desc: "Il sistema risponde, decide, chiude. Tu guardi i KPI.", slot: "Full-auto" },
          { emoji: "👥", label: "Human-in-the-loop", desc: "Il sistema prepara tutto, tu schiacci \"invio\".", slot: "Approvazione umana" },
          { emoji: "📊", label: "Solo reportistica", desc: "Alert e briefing, le decisioni le prendi tu.", slot: "Solo report" }
        ]
      },
      {
        n: 3,
        q: "Entro quando vuoi vedere il primo risultato concreto?",
        help: "Non \"la cosa finita\" — il primo segnale che il sistema funziona.",
        options: [
          { emoji: "⚡", label: "7 giorni", desc: "MVP veloce, si rifinisce in corsa. Fit per Start o Grow.", slot: "7 giorni (MVP)" },
          { emoji: "📐", label: "30 giorni", desc: "Progetto fatto bene, integrazioni pulite. Fit Grow.", slot: "30 giorni (full)" },
          { emoji: "🏗️", label: "60-90 giorni", desc: "Sistema perfetto, multi-processo. Fit Scale.", slot: "90 giorni (Scale)" }
        ]
      }
    ],
    result: (answers) => {
      const [p, pat, d] = answers;
      const problemMap = {
        0: "un chatbot AI per clienti su WhatsApp/sito",
        1: "un report giornaliero + dashboard real-time",
        2: "un workflow di nurture + riattivazione clienti"
      };
      const intent = problemMap[p];
      return {
        title: "La tua prima automazione AI",
        teaser: `Sulla base delle tue risposte, la scelta più efficiente è <strong>${intent}</strong>, con livello di autonomia <strong>"${QUIZ.automazione.steps[1].options[pat].label.toLowerCase()}"</strong> e delivery in <strong>${QUIZ.automazione.steps[2].options[d].slot.toLowerCase()}</strong>.`,
        verdict: "✅ Strategia definita",
        color: "#D4998D"
      };
    }
  }
};

// ============================================================================
// STATE
// ============================================================================
const LabState = { current: null, step: 0, answers: [] };

// ============================================================================
// RENDERING
// ============================================================================
function openLab(key) {
  LabState.current = key;
  LabState.step = 0;
  LabState.answers = [];
  document.getElementById('labModal').classList.add('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderStep();
}

function closeLab() {
  document.getElementById('labModal').classList.remove('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  LabState.current = null;
}

function renderStep() {
  const quiz = QUIZ[LabState.current];
  if (!quiz) return;

  // risultati finali
  if (LabState.step >= quiz.steps.length) {
    renderResult();
    return;
  }

  const step = quiz.steps[LabState.step];
  const progressDots = quiz.steps.map((_, i) => {
    if (i < LabState.step) return '<div class="progress-dot done"></div>';
    if (i === LabState.step) return '<div class="progress-dot active"></div>';
    return '<div class="progress-dot"></div>';
  }).join('');

  const options = step.options.map((opt, i) => `
    <button class="quiz-option ${LabState.answers[LabState.step] === i ? 'selected' : ''}"
            onclick="selectOption(${i})">
      <span class="text-3xl leading-none flex-shrink-0">${opt.emoji}</span>
      <div class="min-w-0">
        <div class="font-semibold text-[#143d5c] text-base mb-1">${opt.label}</div>
        <div class="text-sm text-[#143d5c]/65 leading-snug">${opt.desc}</div>
      </div>
    </button>
  `).join('');

  const timeline = quiz.timeline.map((t, i) => {
    const filled = i < LabState.step || (i === LabState.step && LabState.answers[i] !== undefined);
    const value = LabState.answers[i] !== undefined ? quiz.steps[i].options[LabState.answers[i]].slot : '—';
    return `
      <div class="timeline-step ${filled ? 'filled' : ''}">
        <div class="label">${t}</div>
        <div class="value">${value}</div>
      </div>
    `;
  }).join('<div class="flex items-center text-[#D4998D] font-bold text-lg">→</div>');

  const isLast = LabState.step === quiz.steps.length - 1;
  const hasAnswer = LabState.answers[LabState.step] !== undefined;
  const canBack = LabState.step > 0;

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge">${quiz.title}</span>
    </div>
    <div class="flex items-center gap-2 mb-6">
      ${progressDots}
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">Domanda ${step.n} di ${quiz.steps.length}</span>
    </div>

    <h3 class="text-2xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">${step.q}</h3>
    <p class="text-[#143d5c]/60 text-sm mb-6">${step.help}</p>

    <div class="space-y-3 mb-6">
      ${options}
    </div>

    <div class="bg-[#fafaf7] border border-[#143d5c]/8 rounded-2xl p-4 mb-6">
      <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-3">La tua strategia in costruzione</p>
      <div class="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
        ${timeline}
      </div>
    </div>

    <div class="flex justify-between items-center">
      <button onclick="prevStep()"
              class="${canBack ? '' : 'invisible'} text-[#143d5c]/60 hover:text-[#143d5c] font-semibold text-sm flex items-center gap-1">
        ← Indietro
      </button>
      <button onclick="nextStep()"
              ${hasAnswer ? '' : 'disabled'}
              class="btn-coral px-6 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2 ${hasAnswer ? '' : 'opacity-40 cursor-not-allowed'}">
        ${isLast ? 'Vedi i risultati' : 'Prossima domanda'} <span>→</span>
      </button>
    </div>
  `;
}

function selectOption(i) {
  LabState.answers[LabState.step] = i;
  renderStep();
}

function nextStep() {
  if (LabState.answers[LabState.step] === undefined) return;
  LabState.step += 1;
  renderStep();
}

function prevStep() {
  if (LabState.step === 0) return;
  LabState.step -= 1;
  renderStep();
}

function renderResult() {
  const quiz = QUIZ[LabState.current];
  const result = quiz.result(LabState.answers);

  const timeline = quiz.timeline.map((t, i) => `
    <div class="timeline-step filled">
      <div class="label">${t}</div>
      <div class="value">${quiz.steps[i].options[LabState.answers[i]].slot}</div>
    </div>
  `).join('<div class="flex items-center text-[#D4998D] font-bold text-lg">→</div>');

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge" style="background:${result.color}15;color:${result.color};">🧪 DIAGNOSI COMPLETATA</span>
    </div>

    <h3 class="text-3xl md:text-4xl font-bold text-[#143d5c] leading-tight mb-2">${result.title}</h3>
    <p class="text-[#143d5c]/75 text-base leading-relaxed mb-6">${result.teaser}</p>

    <div class="bg-[#fafaf7] border border-[#143d5c]/8 rounded-2xl p-4 mb-6">
      <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-3">Il tuo percorso</p>
      <div class="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
        ${timeline}
      </div>
    </div>

    <div class="bg-[#143d5c] text-white rounded-2xl p-6 mb-5">
      <p class="text-xs uppercase tracking-widest text-[#D4998D] font-bold mb-2">💡 Le tue risposte, trasformate in azione</p>
      <p class="text-lg font-semibold leading-snug mb-1">Vuoi che la rendiamo una strategia vera?</p>
      <p class="text-white/75 text-sm leading-relaxed">
        Compila il form. Analisi gratuita di 30 minuti per trasformare le tue risposte in un sistema AI profittevole — con numeri, tempi, costi chiari.
      </p>
    </div>

    <div style="height:560px;">
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/BurG4Q7fFt6liEwrBBuF"
        style="width:100%;height:100%;border:none;border-radius:12px"
        id="inline-lab-BurG4Q7fFt6liEwrBBuF-${LabState.current}"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-form-name="Form Sito ufficiale"
        data-height="512"
        data-form-id="BurG4Q7fFt6liEwrBBuF"
        title="Form analisi gratuita">
      </iframe>
    </div>

    <div class="mt-5 flex justify-between items-center text-sm">
      <button onclick="restartQuiz()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold flex items-center gap-1">
        🔄 Rifai il quiz
      </button>
      <button onclick="closeLab()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold">
        Chiudi
      </button>
    </div>
  `;

  // Re-inizializza il loader GHL se è già stato caricato
  if (typeof window.leadConnectorForms !== 'undefined' && window.leadConnectorForms.init) {
    try { window.leadConnectorForms.init(); } catch (e) {}
  }
}

function restartQuiz() {
  LabState.step = 0;
  LabState.answers = [];
  renderStep();
}

// Chiudi modal con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('labModal').classList.contains('active')) {
    closeLab();
  }
});

// Chiudi cliccando fuori
document.getElementById('labModal').addEventListener('click', (e) => {
  if (e.target.id === 'labModal') closeLab();
});
