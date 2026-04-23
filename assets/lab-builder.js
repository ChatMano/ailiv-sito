/* ============================================================================
   AILIV · LAB BUILDER — Costruisci il tuo funnel, passo per passo
   L'utente sceglie settore -> parte il trigger iniziale nel canvas ->
   a ogni domanda sceglie un bivio (manuale vs automatico) che AGGIUNGE 1 nodo.
   Nessun workflow pre-fatto: tutto si costruisce cliccando.
   ========================================================================= */

// Helper
const M = (icon, label, tag="Manuale") => ({ icon, label, type: "manual", tag });
const AU = (icon, label, tag="Automatico") => ({ icon, label, type: "auto", tag });
const TR = (icon, label) => ({ icon, label, type: "trigger", tag: "Inizio" });

// ============================================================================
// 20 SETTORI — ognuno con trigger + 4 bivi + goal
// ============================================================================
const SECTORS = {
  ristorante: {
    name: "Ristorante / Pizzeria", icon: "🍕",
    trigger: TR("💬", "Un cliente ti scrive per info / prenotazione"),
    steps: [
      { q: "Cosa succede quando arriva il messaggio?", options: [
        { emoji: "🤷", label: "Lo leggo quando posso (se me lo ricordo)", node: M("👤", "Risposta manuale quando riesco", "Ritardo variabile") },
        { emoji: "🤖", label: "Un assistente AI risponde entro 30 secondi", node: AU("🤖", "Assistente AI risponde subito", "24/7") }
      ]},
      { q: "Il cliente vuole prenotare un tavolo. Come fa?", options: [
        { emoji: "📞", label: "Chiama, prendo io al telefono", node: M("👤", "Prenotazione a voce, scritta su agenda") },
        { emoji: "📅", label: "Gli mando un link e prenota da solo", node: AU("📅", "Prenotazione online + conferma istantanea") }
      ]},
      { q: "2 ore prima dell'orario del tavolo?", options: [
        { emoji: "😬", label: "Niente, speriamo si ricordi", node: M("❌", "Nessun promemoria", "Rischio no-show alto") },
        { emoji: "⏰", label: "Promemoria automatico WhatsApp", node: AU("⏰", "Promemoria 2h prima", "Riduce no-show ~60%") }
      ]},
      { q: "Dopo la cena, cosa mandi al cliente?", options: [
        { emoji: "👋", label: "Niente, \"alla prossima\"", node: M("👤", "Addio cliente", "Nessun ritorno indotto") },
        { emoji: "⭐", label: "Richiesta recensione Google automatica", node: AU("⭐", "Richiesta recensione 2h dopo") }
      ]}
    ],
    goalLabel: "Funnel completo: dal primo messaggio alla recensione Google"
  },

  palestra: {
    name: "Palestra / Fitness", icon: "💪",
    trigger: TR("💬", "Qualcuno chiede info abbonamenti / corsi"),
    steps: [
      { q: "Come gestisci la richiesta info?", options: [
        { emoji: "🤷", label: "Rispondo io quando arrivo in palestra", node: M("👤", "Risposta a ore sparse") },
        { emoji: "🤖", label: "Bot invia listino + invito a prova gratuita", node: AU("🤖", "Info + trial automatico") }
      ]},
      { q: "Come prenota un corso collettivo?", options: [
        { emoji: "📋", label: "Scrive al gruppo WhatsApp della palestra", node: M("👤", "Gestione caotica via chat") },
        { emoji: "📅", label: "Prenota da solo sul calendario online", node: AU("📅", "Prenotazione self-service") }
      ]},
      { q: "Se disdice un posto 2h prima del corso?", options: [
        { emoji: "😬", label: "Il posto rimane vuoto", node: M("❌", "Posto sprecato") },
        { emoji: "🔄", label: "Lista d'attesa chiamata automaticamente", node: AU("🔄", "Auto-riallocazione posto") }
      ]},
      { q: "Iscritto che non viene da 2 settimane?", options: [
        { emoji: "🤷", label: "Lascio perdere, si rifarà vivo", node: M("👤", "Nessuna riattivazione") },
        { emoji: "💪", label: "Messaggio \"ti aspettiamo\" + sessione PT omaggio", node: AU("💪", "Riattivazione automatica") }
      ]}
    ],
    goalLabel: "Funnel da info a retention abbonati"
  },

  estetica: {
    name: "Centro estetico", icon: "💆",
    trigger: TR("💬", "Cliente chiede info su trattamenti / prezzi"),
    steps: [
      { q: "Come rispondi alla richiesta?", options: [
        { emoji: "🤷", label: "Rispondo a più persone alla volta quando posso", node: M("👤", "Risposta manuale multipla") },
        { emoji: "🤖", label: "Assistente AI invia listino + foto risultati", node: AU("🤖", "Info + portfolio automatico") }
      ]},
      { q: "Vuole prenotare una seduta?", options: [
        { emoji: "📞", label: "Al telefono, vedo io sul registro", node: M("👤", "Prenotazione a voce") },
        { emoji: "💳", label: "Online con piccola caparra (evita no-show)", node: AU("💳", "Prenotazione online + caparra") }
      ]},
      { q: "Prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Se si ricorda viene", node: M("❌", "Nessun promemoria") },
        { emoji: "⏰", label: "Promemoria 24h e 2h prima su WA", node: AU("⏰", "Doppio promemoria") }
      ]},
      { q: "Dopo il trattamento?", options: [
        { emoji: "👋", label: "\"Buona giornata!\"", node: M("👤", "Nessun follow-up") },
        { emoji: "⭐", label: "Richiesta recensione + richiamo in 45gg per mantenimento", node: AU("⭐", "Review + richiamo auto 45gg") }
      ]}
    ],
    goalLabel: "Funnel dalla richiesta al mantenimento"
  },

  parrucchiere: {
    name: "Parrucchiere / Barber", icon: "💇",
    trigger: TR("💬", "Cliente scrive \"che disponibilità avete?\""),
    steps: [
      { q: "Come rispondi?", options: [
        { emoji: "🤷", label: "Guardo l'agenda, rispondo quando posso", node: M("👤", "Check agenda manuale") },
        { emoji: "🤖", label: "Bot invia slot liberi + link prenotazione", node: AU("🤖", "Slot liberi in tempo reale") }
      ]},
      { q: "Prenotazione del taglio?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Prenotazione a voce") },
        { emoji: "💳", label: "Self-service con caparra (blocca i no-show)", node: AU("💳", "Self-booking + caparra") }
      ]},
      { q: "Poche ore prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Rischio salta il posto") },
        { emoji: "⏰", label: "Promemoria 3h prima", node: AU("⏰", "Promemoria WhatsApp") }
      ]},
      { q: "Dopo il taglio?", options: [
        { emoji: "👋", label: "\"A presto!\"", node: M("👤", "Fine corsa") },
        { emoji: "⭐", label: "Richiesta recensione + richiamo dopo 30gg per ritocco", node: AU("⭐", "Review + richiamo 30gg") }
      ]}
    ],
    goalLabel: "Funnel dal primo DM alla fidelizzazione"
  },

  dentista: {
    name: "Studio dentistico", icon: "🦷",
    trigger: TR("💬", "Paziente chiede preventivo / info cure"),
    steps: [
      { q: "Risposta info?", options: [
        { emoji: "🤷", label: "Segretaria risponde, spesso con ritardo", node: M("👤", "Risposta segretaria manuale") },
        { emoji: "🤖", label: "Info automatiche + prequalifica caso", node: AU("🤖", "Pre-qualifica automatica") }
      ]},
      { q: "Accetta il preventivo?", options: [
        { emoji: "🤷", label: "Ci pensa, magari richiama", node: M("👤", "Attesa decisione") },
        { emoji: "🔄", label: "Follow-up educativo (video, FAQ, testimonianze)", node: AU("🔄", "Nurture automatico fino alla scelta") }
      ]},
      { q: "Giorno della visita?", options: [
        { emoji: "😬", label: "Se si ricorda viene", node: M("❌", "Rischio cancellazione 1h prima") },
        { emoji: "⏰", label: "Promemoria 48h e 2h prima", node: AU("⏰", "Doppio promemoria") }
      ]},
      { q: "11 mesi dall'ultima visita?", options: [
        { emoji: "🤷", label: "Spero si ricordi del controllo", node: M("👤", "Richiamo manuale o niente") },
        { emoji: "🦷", label: "Richiamo automatico controllo annuale + slot", node: AU("🦷", "Richiamo annuale automatico") }
      ]}
    ],
    goalLabel: "Funnel dal preventivo al controllo annuale"
  },

  medico: {
    name: "Studio medico / Fisio", icon: "🏥",
    trigger: TR("💬", "Paziente scrive per prima visita"),
    steps: [
      { q: "Come gestisci la richiesta?", options: [
        { emoji: "🤷", label: "Segretaria al telefono, linee occupate", node: M("👤", "Centralino intasato") },
        { emoji: "🤖", label: "Bot: info costi, orari, ticket + triage iniziale", node: AU("🤖", "Info + triage automatico") }
      ]},
      { q: "Prenotazione visita?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Prenotazione telefonica") },
        { emoji: "📅", label: "Online con integrazione agenda", node: AU("📅", "Booking online sincronizzato") }
      ]},
      { q: "Prima della visita?", options: [
        { emoji: "😬", label: "Si presenta e basta", node: M("❌", "Niente preparazione") },
        { emoji: "⏰", label: "Istruzioni + link Meet se online", node: AU("⏰", "Preparazione automatica") }
      ]},
      { q: "Dopo la visita, pianifica la 2ª seduta?", options: [
        { emoji: "🤷", label: "Se torna torna", node: M("👤", "Nessun follow-up") },
        { emoji: "📅", label: "Invito automatico per seduta successiva", node: AU("📅", "Prosecuzione percorso") }
      ]}
    ],
    goalLabel: "Funnel per aderenza al percorso clinico"
  },

  studio_pro: {
    name: "Avvocato / Commercialista", icon: "⚖️",
    trigger: TR("💬", "Potenziale cliente scrive per consulenza"),
    steps: [
      { q: "Risposta iniziale?", options: [
        { emoji: "🤷", label: "Rispondo via email, spesso dopo giorni", node: M("👤", "Email in ritardo") },
        { emoji: "🤖", label: "Qualifica caso + info costi + prenota", node: AU("🤖", "Qualifica + booking") }
      ]},
      { q: "Conferma appuntamento?", options: [
        { emoji: "📞", label: "Richiamo il giorno prima", node: M("👤", "Conferma a voce") },
        { emoji: "📋", label: "Invio lista documenti + promemoria 24h", node: AU("📋", "Pre-appuntamento guidato") }
      ]},
      { q: "Pratica in corso, documenti mancanti?", options: [
        { emoji: "📧", label: "Sollecito a mano, una volta ogni tanto", node: M("👤", "Sollecito manuale") },
        { emoji: "🔄", label: "Promemoria automatici fino al ricevimento", node: AU("🔄", "Solleciti auto") }
      ]},
      { q: "Dopo la pratica conclusa?", options: [
        { emoji: "👋", label: "\"Grazie, alla prossima\"", node: M("👤", "Nessun seguito") },
        { emoji: "⭐", label: "Recensione + check-up annuale programmato", node: AU("⭐", "Review + rinnovo relazione") }
      ]}
    ],
    goalLabel: "Funnel da lead a cliente a vita"
  },

  immobiliare: {
    name: "Agenzia immobiliare", icon: "🏠",
    trigger: TR("💬", "Lead chiede info su un immobile"),
    steps: [
      { q: "Prima risposta?", options: [
        { emoji: "🤷", label: "Richiamo quando riesco", node: M("👤", "Richiamo manuale") },
        { emoji: "🤖", label: "Scheda immobile + foto + qualifica budget", node: AU("🤖", "Qualifica automatica") }
      ]},
      { q: "Fissare una visita?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Appuntamento a voce") },
        { emoji: "📅", label: "Prenotazione online + indirizzo + mappa", node: AU("📅", "Booking + logistica") }
      ]},
      { q: "Prima della visita?", options: [
        { emoji: "😬", label: "Niente, ci vediamo lì", node: M("❌", "Rischio visita saltata") },
        { emoji: "⏰", label: "Promemoria 2h + contatto diretto agente", node: AU("⏰", "Promemoria con contatto") }
      ]},
      { q: "Lead che non compra entro 3 mesi?", options: [
        { emoji: "👋", label: "Lo perdo, cerca altrove", node: M("👤", "Lead perso") },
        { emoji: "🏠", label: "Invio automatico 3 nuovi immobili compatibili", node: AU("🏠", "Rinurturing immobili") }
      ]}
    ],
    goalLabel: "Funnel dall'annuncio al rogito (incl. lead freddi)"
  },

  auto: {
    name: "Autosalone / Officina", icon: "🚗",
    trigger: TR("💬", "Richiesta preventivo / tagliando"),
    steps: [
      { q: "Risposta al preventivo?", options: [
        { emoji: "🤷", label: "Calcolo e richiamo quando posso", node: M("👤", "Preventivo manuale") },
        { emoji: "🤖", label: "Preventivo istantaneo + slot officina", node: AU("🤖", "Preventivo + booking") }
      ]},
      { q: "Accetta l'appuntamento?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Conferma verbale") },
        { emoji: "📅", label: "Online con ricevuta + info auto sostitutiva", node: AU("📅", "Booking + logistica auto") }
      ]},
      { q: "Dopo il lavoro?", options: [
        { emoji: "👋", label: "\"Alla prossima\"", node: M("👤", "Fine corsa") },
        { emoji: "⭐", label: "Richiesta recensione + check tagliando futuro", node: AU("⭐", "Review + pianifica tagliando") }
      ]},
      { q: "10 mesi dopo il tagliando?", options: [
        { emoji: "🤷", label: "Spero si ricordi", node: M("👤", "Speranza") },
        { emoji: "🔔", label: "Richiamo auto tagliando + slot + offerta stagionale", node: AU("🔔", "Richiamo tagliando") }
      ]}
    ],
    goalLabel: "Funnel retention cliente auto"
  },

  retail: {
    name: "Negozio / Retail", icon: "🛍️",
    trigger: TR("💬", "Cliente chiede info su prodotto (IG/WA)"),
    steps: [
      { q: "Risposta?", options: [
        { emoji: "🤷", label: "Rispondo quando ho un attimo", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Foto + taglie + invito in negozio", node: AU("🤖", "Info + push in-store") }
      ]},
      { q: "Viene in negozio?", options: [
        { emoji: "👤", label: "Aspetto che arrivi", node: M("👤", "Attesa passiva") },
        { emoji: "📱", label: "\"Te lo metto da parte\" + promemoria visita", node: AU("📱", "Hold + promemoria") }
      ]},
      { q: "Dopo l'acquisto?", options: [
        { emoji: "👋", label: "\"Grazie!\"", node: M("👤", "Nessun seguito") },
        { emoji: "⭐", label: "Recensione + wishlist upsell", node: AU("⭐", "Review + upsell mirato") }
      ]},
      { q: "Cliente fermo da 60 giorni?", options: [
        { emoji: "🤷", label: "Se torna bene, sennò pace", node: M("👤", "Cliente dormiente") },
        { emoji: "🎁", label: "Invito preview privata nuova collezione", node: AU("🎁", "Riattivazione retail") }
      ]}
    ],
    goalLabel: "Funnel retail → cliente fedele"
  },

  ecommerce: {
    name: "E-commerce / Online", icon: "🛒",
    trigger: TR("🛒", "Visitatore aggiunge prodotto al carrello"),
    steps: [
      { q: "Esce dal sito senza acquistare. Cosa succede?", options: [
        { emoji: "😬", label: "Niente, l'ho perso", node: M("❌", "Carrello perso") },
        { emoji: "📧", label: "Email recupero dopo 1 ora", node: AU("📧", "Recovery email #1") }
      ]},
      { q: "Dopo 24h ancora non compra?", options: [
        { emoji: "👋", label: "Pazienza, cliente perso", node: M("👤", "Abbandono definitivo") },
        { emoji: "💸", label: "Seconda email con coupon 10%", node: AU("💸", "Recovery email #2 + sconto") }
      ]},
      { q: "Dopo l'acquisto riuscito?", options: [
        { emoji: "👋", label: "Ordine spedito, fine", node: M("👤", "Nessuna review") },
        { emoji: "⭐", label: "Review automatica 3 giorni dopo la consegna", node: AU("⭐", "Review post-consegna") }
      ]},
      { q: "Cliente che non torna da 30 giorni?", options: [
        { emoji: "🤷", label: "Pazienza", node: M("👤", "One-shot customer") },
        { emoji: "🎁", label: "Proposta \"potrebbe piacerti\" + coupon ritorno", node: AU("🎁", "Second order trigger") }
      ]}
    ],
    goalLabel: "Funnel da carrello a cliente ricorrente"
  },

  hotel: {
    name: "Hotel / B&B", icon: "🏨",
    trigger: TR("💬", "Richiesta disponibilità per soggiorno"),
    steps: [
      { q: "Risposta info?", options: [
        { emoji: "🤷", label: "Controllo booking manualmente", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Disponibilità + sconto prenotazione diretta", node: AU("🤖", "Bypass OTA automatico") }
      ]},
      { q: "Dopo la prenotazione?", options: [
        { emoji: "📧", label: "Email di conferma generica", node: M("📧", "Email standard") },
        { emoji: "✉️", label: "Welcome + come arrivare + consigli city", node: AU("✉️", "Welcome esperienziale") }
      ]},
      { q: "Prima del check-in?", options: [
        { emoji: "🔑", label: "Check-in in reception al loro arrivo", node: M("👤", "Coda in reception") },
        { emoji: "🔑", label: "Check-in online 1 giorno prima", node: AU("🔑", "Check-in automatico") }
      ]},
      { q: "Dopo il check-out?", options: [
        { emoji: "👋", label: "Fine, cambio camera", node: M("👤", "Ospite dimenticato") },
        { emoji: "⭐", label: "Recensione diretta (bypass Booking) + offerta return", node: AU("⭐", "Review + return guest") }
      ]}
    ],
    goalLabel: "Funnel guest → return guest (con bypass OTA)"
  },

  bar: {
    name: "Bar / Pasticceria", icon: "☕",
    trigger: TR("💬", "Richiesta ordine catering o torta su misura"),
    steps: [
      { q: "Risposta all'ordine?", options: [
        { emoji: "🤷", label: "Al telefono quando posso (weekend perso)", node: M("👤", "Telefono intasato") },
        { emoji: "🤖", label: "Listino + disponibilità + qualifica ordine", node: AU("🤖", "Qualifica automatica") }
      ]},
      { q: "Conferma ordine?", options: [
        { emoji: "👤", label: "Parola data, vediamo", node: M("👤", "Nessuna garanzia") },
        { emoji: "💳", label: "Caparra 30% + conferma automatica", node: AU("💳", "Ordine blindato") }
      ]},
      { q: "Prima del ritiro?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Rischio ritiro dimenticato") },
        { emoji: "⏰", label: "Promemoria 48h e 2h prima", node: AU("⏰", "Promemoria ritiro") }
      ]},
      { q: "Dopo la consegna?", options: [
        { emoji: "👋", label: "Fine", node: M("👤", "Nessun ritorno") },
        { emoji: "⭐", label: "Foto + recensione + promo prossimo ordine", node: AU("⭐", "Review + fidelity") }
      ]}
    ],
    goalLabel: "Funnel ordine → cliente fidelizzato"
  },

  wedding: {
    name: "Wedding planner / Eventi", icon: "🎊",
    trigger: TR("💬", "Coppia chiede preventivo matrimonio"),
    steps: [
      { q: "Risposta iniziale?", options: [
        { emoji: "🤷", label: "Invio materiale quando riesco", node: M("👤", "Risposta tardiva") },
        { emoji: "🤖", label: "Pacchetti + portfolio + qualifica budget/data", node: AU("🤖", "Qualifica automatica") }
      ]},
      { q: "Consulenza conoscitiva?", options: [
        { emoji: "📞", label: "Richiamo per fissare", node: M("👤", "Booking a voce") },
        { emoji: "📅", label: "Prenotazione online + mood-board pre-call", node: AU("📅", "Booking + ispirazioni") }
      ]},
      { q: "Dopo consulenza, indecisi non prenotano?", options: [
        { emoji: "🤷", label: "Aspetto che si facciano vivi", node: M("👤", "Attesa passiva") },
        { emoji: "🔄", label: "3 email nurture (portfolio, testimonial, offerta)", node: AU("🔄", "Nurture sequence") }
      ]},
      { q: "Dopo il matrimonio?", options: [
        { emoji: "👋", label: "Alla prossima", node: M("👤", "Nessun referral") },
        { emoji: "💕", label: "Anniversario + bonus referral amici", node: AU("💕", "Referral engine") }
      ]}
    ],
    goalLabel: "Funnel da preventivo a referral amici"
  },

  fotografo: {
    name: "Fotografo", icon: "📷",
    trigger: TR("💬", "Richiesta info shooting"),
    steps: [
      { q: "Come rispondi?", options: [
        { emoji: "🤷", label: "Invio portfolio quando riesco", node: M("👤", "Risposta a mano") },
        { emoji: "🤖", label: "Pacchetti + portfolio + qualifica automatica", node: AU("🤖", "Qualifica auto") }
      ]},
      { q: "Conferma shooting?", options: [
        { emoji: "📞", label: "Parola data, vediamo", node: M("👤", "Impegno orale") },
        { emoji: "💳", label: "Caparra + questionario stile", node: AU("💳", "Caparra + brief creativo") }
      ]},
      { q: "Consegna foto?", options: [
        { emoji: "📧", label: "Upload e basta", node: M("👤", "Semplice delivery") },
        { emoji: "📧", label: "Gallery privata + feedback + tag social", node: AU("📧", "Gallery + engagement") }
      ]},
      { q: "A un anno dallo shooting?", options: [
        { emoji: "🤷", label: "Magari si fa vivo", node: M("👤", "Cliente one-shot") },
        { emoji: "📷", label: "Promemoria shooting annuale famiglia", node: AU("📷", "Ricorrenza annuale") }
      ]}
    ],
    goalLabel: "Funnel da preventivo a cliente ricorrente"
  },

  psicologo: {
    name: "Psicologo / Counselor", icon: "🧠",
    trigger: TR("💬", "Prima richiesta info seduta"),
    steps: [
      { q: "Risposta delicata al primo contatto?", options: [
        { emoji: "🤷", label: "Rispondo quando libera, con calma", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Info approccio + primo colloquio gratuito", node: AU("🤖", "Accoglienza automatica") }
      ]},
      { q: "Conferma seduta?", options: [
        { emoji: "📞", label: "Richiamo per confermare", node: M("👤", "Conferma vocale") },
        { emoji: "📅", label: "Prenotazione online + link Meet", node: AU("📅", "Booking online") }
      ]},
      { q: "Paziente salta una seduta?", options: [
        { emoji: "🤷", label: "Lo richiamo più tardi", node: M("👤", "Recupero manuale") },
        { emoji: "❤️", label: "Messaggio delicato + possibilità di riprogrammare", node: AU("❤️", "Recupero empatico") }
      ]},
      { q: "Fine del percorso?", options: [
        { emoji: "👋", label: "Saluto e fine", node: M("👤", "Nessun follow-up") },
        { emoji: "💬", label: "Follow-up 3 mesi dopo per supporto", node: AU("💬", "Check-in post-percorso") }
      ]}
    ],
    goalLabel: "Funnel da primo contatto ad aderenza al percorso"
  },

  scuola: {
    name: "Scuola / Formazione", icon: "🎓",
    trigger: TR("💬", "Richiesta info corsi / calendario"),
    steps: [
      { q: "Risposta?", options: [
        { emoji: "🤷", label: "Email quando posso", node: M("👤", "Email manuali") },
        { emoji: "🤖", label: "Programma + prezzi + lezione prova", node: AU("🤖", "Info + trial") }
      ]},
      { q: "Iscrizione?", options: [
        { emoji: "📝", label: "Modulo cartaceo/manuale", node: M("👤", "Iscrizione manuale") },
        { emoji: "💳", label: "Form online con pagamento + welcome", node: AU("💳", "Iscrizione + onboarding") }
      ]},
      { q: "Studente non inizia il corso?", options: [
        { emoji: "🤷", label: "Addio, ho già il pagamento", node: M("👤", "Abbandono silenzioso") },
        { emoji: "📚", label: "Welcome + materiali + promemoria partenza", node: AU("📚", "Onboarding proattivo") }
      ]},
      { q: "Dopo il corso?", options: [
        { emoji: "👋", label: "Congratulazioni", node: M("👤", "Fine relazione") },
        { emoji: "🎓", label: "Review + proposta livello avanzato", node: AU("🎓", "Upsell continuità") }
      ]}
    ],
    goalLabel: "Funnel info → iscrizione → continuità"
  },

  coach: {
    name: "Personal trainer / Coach", icon: "🏃",
    trigger: TR("💬", "DM \"come funzionano i programmi?\""),
    steps: [
      { q: "Risposta?", options: [
        { emoji: "🤷", label: "Rispondo quando libera", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Pacchetti + testimonial + body check gratis", node: AU("🤖", "Qualifica + check gratis") }
      ]},
      { q: "Prima sessione?", options: [
        { emoji: "📞", label: "Conferma a voce", node: M("👤", "Conferma vocale") },
        { emoji: "📅", label: "Prenotazione online + obiettivi pre-sessione", node: AU("📅", "Booking + brief") }
      ]},
      { q: "A metà percorso?", options: [
        { emoji: "🤷", label: "Se va bene va bene", node: M("👤", "Zero monitoraggio") },
        { emoji: "📊", label: "Misurazioni + foto + feedback mensile", node: AU("📊", "Tracking progressi") }
      ]},
      { q: "Fine mese di coaching?", options: [
        { emoji: "🤷", label: "Se vuole rinnova", node: M("👤", "Passivo") },
        { emoji: "💪", label: "Rinnovo + proposta upgrade", node: AU("💪", "Retention proattiva") }
      ]}
    ],
    goalLabel: "Funnel retention coaching"
  },

  nail_tatto: {
    name: "Nail / Tatuatore", icon: "💅",
    trigger: TR("💬", "DM \"quando sei libera?\""),
    steps: [
      { q: "Risposta?", options: [
        { emoji: "🤷", label: "Controllo agenda e rispondo", node: M("👤", "Check manuale") },
        { emoji: "🤖", label: "Slot disponibili + portfolio + prezzi", node: AU("🤖", "Slot + portfolio") }
      ]},
      { q: "Prenotazione?", options: [
        { emoji: "📞", label: "A voce", node: M("👤", "Prenotazione informale") },
        { emoji: "💳", label: "Online con caparra (riduce disdette)", node: AU("💳", "Booking blindato") }
      ]},
      { q: "Dopo il servizio?", options: [
        { emoji: "👋", label: "Ciao e grazie", node: M("👤", "Fine servizio") },
        { emoji: "⭐", label: "Foto + recensione + sconto prossimo", node: AU("⭐", "Review + loyalty") }
      ]},
      { q: "Dopo 20-60 giorni?", options: [
        { emoji: "🤷", label: "Se torna torna", node: M("👤", "Cliente disperso") },
        { emoji: "💅", label: "Richiamo automatico mantenimento", node: AU("💅", "Richiamo periodico") }
      ]}
    ],
    goalLabel: "Funnel cliente fedele"
  },

  pet: {
    name: "Toelettatura / Pet", icon: "🐾",
    trigger: TR("💬", "Info prezzi toelettatura"),
    steps: [
      { q: "Risposta?", options: [
        { emoji: "🤷", label: "Rispondo quando ho tempo", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Listino per razza + durata + prenotazione", node: AU("🤖", "Info + booking") }
      ]},
      { q: "Prenotazione?", options: [
        { emoji: "📞", label: "A voce", node: M("👤", "Prenotazione vocale") },
        { emoji: "📅", label: "Online + istruzioni pre-appuntamento", node: AU("📅", "Booking con istruzioni") }
      ]},
      { q: "Prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Nessun promemoria") },
        { emoji: "⏰", label: "Promemoria 24h + 2h + istruzioni", node: AU("⏰", "Promemoria + istruzioni") }
      ]},
      { q: "Dopo il servizio?", options: [
        { emoji: "👋", label: "Arrivederci", node: M("👤", "Nessun ritorno") },
        { emoji: "📸", label: "Foto cucciolo + recensione + richiamo 5 sett", node: AU("📸", "Review + richiamo auto") }
      ]}
    ],
    goalLabel: "Funnel retention pet"
  }
};

// ============================================================================
// STATE
// ============================================================================
const LabState = {
  view: "sector",   // "sector" | "builder" | "result"
  sector: null,
  stepIdx: 0,       // quale bivio stiamo presentando
  chosenNodes: [],  // nodi scelti finora (per canvas)
  prevCount: 0      // quanti nodi erano presenti al precedente render (per animazione delta)
};

function openLab() {
  LabState.view = "sector";
  LabState.sector = null;
  LabState.stepIdx = 0;
  LabState.chosenNodes = [];
  LabState.prevCount = 0;
  document.getElementById('labModal').classList.add('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderView();
}

function closeLab() {
  document.getElementById('labModal').classList.remove('active');
  document.getElementById('labModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ============================================================================
// VIEWS
// ============================================================================
function renderView() {
  if (LabState.view === "sector") return renderSectorView();
  if (LabState.view === "result") return renderResult();
  return renderBuilderView();
}

function renderSectorView() {
  const cards = Object.entries(SECTORS).map(([key, s]) => `
    <button onclick="selectSector('${key}')" class="sector-card">
      <div class="text-3xl mb-2">${s.icon}</div>
      <div class="text-xs font-semibold text-[#143d5c] leading-tight">${s.name}</div>
    </button>
  `).join('');

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge">🧪 Costruisci il tuo funnel</span>
    </div>

    <h3 class="text-2xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">Qual è il tuo business?</h3>
    <p class="text-[#143d5c]/60 text-sm mb-6">Costruiamo insieme il funnel giusto per te. Un passo alla volta — scegli tu cosa automatizzare.</p>

    <div class="sector-grid">${cards}</div>
  `;
}

function selectSector(key) {
  LabState.sector = key;
  LabState.view = "builder";
  LabState.stepIdx = 0;
  // Il primo nodo visibile nel canvas è il trigger
  LabState.chosenNodes = [SECTORS[key].trigger];
  LabState.prevCount = 0; // il trigger sarà "nuovo" alla prima render
  renderView();
}

function renderBuilderView() {
  const sector = SECTORS[LabState.sector];
  if (!sector) { LabState.view = "sector"; return renderView(); }

  const stepsCount = sector.steps.length;
  const currentStep = sector.steps[LabState.stepIdx];
  const allDone = LabState.stepIdx >= stepsCount;

  const canvasHtml = buildCanvas();

  // pannello delle scelte (o CTA finale)
  let rightSide = '';
  if (allDone) {
    rightSide = `
      <div class="bg-gradient-to-br from-[#d4a747] to-[#e0c179] text-[#143d5c] rounded-2xl p-6">
        <p class="text-xs uppercase tracking-widest font-bold mb-3">🎉 Funnel costruito</p>
        <h4 class="text-xl md:text-2xl font-bold leading-snug mb-3">Bravo. Hai fatto il tuo funnel.</h4>
        <p class="text-sm leading-relaxed mb-4">Adesso la domanda vera: <strong>ti piacerebbe parlarne con noi?</strong> Lo valutiamo insieme. Se ha senso per il tuo business, te lo mettiamo in produzione.</p>
        <button onclick="LabState.view='result';renderView();" class="bg-[#143d5c] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0e2c43] transition">
          Parliamone →
        </button>
      </div>
    `;
  } else {
    const opts = currentStep.options.map((o, i) => `
      <button class="quiz-option" onclick="chooseOption(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1 leading-snug">${o.label}</div>
          <div class="text-xs uppercase tracking-wide font-semibold ${o.node.type === 'auto' ? 'text-[#D4998D]' : 'text-[#143d5c]/40'}">
            ${o.node.type === 'auto' ? '✨ Automatizzato' : '👤 Manuale'}
          </div>
        </div>
      </button>
    `).join('');

    rightSide = `
      <h4 class="text-xl md:text-2xl font-bold text-[#143d5c] leading-tight mb-2">${currentStep.q}</h4>
      <p class="text-[#143d5c]/55 text-xs mb-5">Scegli come vuoi gestirlo. Ogni scelta aggiunge un nodo al tuo funnel.</p>
      <div class="space-y-3">${opts}</div>
    `;
  }

  const progress = `
    <div class="flex items-center gap-2 mb-6">
      ${Array.from({length: stepsCount + 1}, (_, i) => {
        const done = i < LabState.stepIdx + 1 || allDone;
        const active = !allDone && i === LabState.stepIdx + 1;
        if (allDone || i <= LabState.stepIdx) return '<div class="progress-dot done"></div>';
        if (active) return '<div class="progress-dot active"></div>';
        return '<div class="progress-dot"></div>';
      }).join('')}
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">
        ${allDone ? 'Funnel completato' : `Bivio ${LabState.stepIdx + 1} di ${stepsCount}`}
      </span>
    </div>
  `;

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
      <span class="lab-badge">${sector.icon} ${sector.name}</span>
      <button onclick="resetBuilder()" class="text-xs text-[#143d5c]/50 hover:text-[#143d5c] font-semibold">↺ Ricomincia</button>
    </div>
    ${progress}

    <div class="lab-split">
      <div>
        <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#D4998D] dot"></span> Il tuo funnel live
        </p>
        ${canvasHtml}
      </div>
      <div>
        ${rightSide}
      </div>
    </div>

    <div class="flex justify-between items-center mt-6 pt-6 border-t border-[#143d5c]/10">
      <button onclick="backBuilder()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold text-sm flex items-center gap-1">← Indietro</button>
      <span class="text-xs text-[#143d5c]/40">${LabState.chosenNodes.length} ${LabState.chosenNodes.length === 1 ? 'nodo' : 'nodi'} nel funnel</span>
    </div>
  `;
}

function chooseOption(optIdx) {
  const sector = SECTORS[LabState.sector];
  const step = sector.steps[LabState.stepIdx];
  const choice = step.options[optIdx];
  LabState.chosenNodes.push(choice.node);
  LabState.stepIdx += 1;
  renderView();
}

function backBuilder() {
  if (LabState.stepIdx === 0) {
    // torna allo step settore
    LabState.view = "sector";
    LabState.chosenNodes = [];
    LabState.prevCount = 0;
    renderView();
    return;
  }
  LabState.stepIdx -= 1;
  LabState.chosenNodes.pop();
  renderView();
}

function resetBuilder() {
  const sector = SECTORS[LabState.sector];
  LabState.stepIdx = 0;
  LabState.chosenNodes = [sector.trigger];
  LabState.prevCount = 0;
  renderView();
}

// ============================================================================
// CANVAS (ogni click aggiunge 1 nodo animato, i vecchi non si ri-animano)
// ============================================================================
function buildCanvas() {
  const sector = SECTORS[LabState.sector];
  if (!sector) return '';
  const nodes = LabState.chosenNodes;
  const goalAdded = LabState.stepIdx >= sector.steps.length;

  if (nodes.length === 0) {
    return `<div class="wf-canvas"><div class="wf-empty">↓ Il tuo funnel apparirà qui ↓</div></div>`;
  }

  let html = '<div class="wf-canvas">';
  const prev = LabState.prevCount;

  nodes.forEach((node, i) => {
    const isNew = i >= prev;
    const animStyle = isNew ? `animation-delay:${(i - prev) * 150}ms` : 'animation:none;opacity:1;transform:translateY(0);';
    const arrowStyle = isNew ? `animation-delay:${(i - prev) * 150 - 50}ms` : 'animation:none;opacity:1;';

    if (i > 0) {
      html += `<div class="wf-arrow" style="${arrowStyle}"></div>`;
    }
    html += `
      <div class="wf-block">
        <div class="wf-node wf-node--${node.type}" style="${animStyle}">
          <span class="wf-icon">${node.icon}</span>
          <div class="wf-body">
            <div class="wf-label">${node.label}</div>
          </div>
          <span class="wf-tag">${node.tag}</span>
        </div>
      </div>
    `;
  });

  // Goal finale se funnel completo
  if (goalAdded) {
    const goalIsNew = prev < nodes.length + 1;
    const goalDelay = goalIsNew ? (nodes.length - prev) * 150 : 0;
    const goalAnim = goalIsNew ? `animation-delay:${goalDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);';
    html += `<div class="wf-arrow" style="${goalIsNew ? `animation-delay:${goalDelay - 50}ms` : 'animation:none;opacity:1;'}"></div>`;
    html += `
      <div class="wf-block">
        <div class="wf-node wf-node--goal" style="${goalAnim}">
          <span class="wf-icon">🎯</span>
          <div class="wf-body">
            <div class="wf-label">${sector.goalLabel}</div>
          </div>
          <span class="wf-tag">Obiettivo</span>
        </div>
      </div>
    `;
  }

  html += '</div>';
  LabState.prevCount = nodes.length + (goalAdded ? 1 : 0);
  return html;
}

// ============================================================================
// FINAL RESULT (mostra funnel completo + form GHL)
// ============================================================================
function renderResult() {
  const sector = SECTORS[LabState.sector];
  const autoCount = LabState.chosenNodes.filter(n => n.type === 'auto').length;
  const manualCount = LabState.chosenNodes.filter(n => n.type === 'manual').length;

  // forza ri-render canvas con tutti i nodi visibili (nessuna animazione)
  LabState.prevCount = LabState.chosenNodes.length + 1;
  const canvasHtml = buildCanvas();

  let verdict;
  if (autoCount >= 3) {
    verdict = `<strong>Ottima scelta.</strong> Il tuo funnel è quasi tutto automatizzato: ti libera dalle mansioni ripetitive e crea un flusso di clienti che cresce da solo.`;
  } else if (autoCount >= 2) {
    verdict = `Ci sei quasi. Il tuo funnel ha <strong>${autoCount} automazioni</strong> e ${manualCount} passaggi ancora manuali: possiamo migliorarlo per farti risparmiare più tempo.`;
  } else {
    verdict = `Il tuo funnel è ancora molto manuale. <strong>Ecco perché il tempo non basta mai</strong>: quasi tutto dipende dalle tue mani. Si può cambiare.`;
  }

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge" style="background:rgba(212,167,71,0.18);color:#9a7818;">✅ FUNNEL COMPLETATO</span>
    </div>

    <h3 class="text-3xl md:text-4xl font-bold text-[#143d5c] leading-tight mb-3">
      ${sector.icon} Hai costruito il funnel della tua <span class="headline-coral">${sector.name.toLowerCase()}</span>.
    </h3>
    <p class="text-[#143d5c]/75 text-lg leading-relaxed mb-6">
      ${verdict}
    </p>

    <div class="mb-6">
      <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2">Il funnel che hai disegnato</p>
      ${canvasHtml}
    </div>

    <div class="bg-[#143d5c] text-white rounded-2xl p-6 mb-5">
      <p class="text-xs uppercase tracking-widest text-[#D4998D] font-bold mb-2">E adesso?</p>
      <p class="text-xl md:text-2xl font-bold leading-snug mb-3">Ti piacerebbe parlarne con noi per mettere in produzione <em>davvero</em> questo funnel?</p>
      <p class="text-white/80 text-sm leading-relaxed">
        Lasciaci 2 info qui sotto. In 24 ore ti diciamo se ha senso per il tuo business, quanto costa e in quanto tempo lo attiviamo. Se non siamo il fit giusto te lo diciamo noi.
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
        🔄 Rifai il funnel (altro settore?)
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

// ============================================================================
// DOM listeners
// ============================================================================
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
