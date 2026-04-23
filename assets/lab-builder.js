/* ============================================================================
   AILIV · LAB BUILDER — Costruisci il tuo funnel, passo per passo
   Ogni bivio mostra ENTRAMBE le strade (manuale vs automatica):
   quella scelta resta piena, l'altra compare in trasparenza barrata.
   Mobile-first.
   ========================================================================= */

// Helper
const M = (icon, label, tag="Manuale") => ({ icon, label, type: "manual", tag });
const AU = (icon, label, tag="Automatico") => ({ icon, label, type: "auto", tag });
const TR = (icon, label) => ({ icon, label, type: "trigger", tag: "Inizio" });

// Labels universali per i 4 bivi
const BIVIO_LABELS = ["Primo contatto", "Conversione", "Pre-appuntamento", "Dopo il servizio"];

// ============================================================================
// 20 SETTORI — ognuno con trigger + 4 bivi + goalLabel
// ============================================================================
const SECTORS = {
  ristorante: {
    name: "Ristorante / Pizzeria", icon: "🍕",
    trigger: TR("💬", "Un cliente ti scrive per info / prenotazione"),
    steps: [
      { q: "Cosa succede quando arriva il messaggio?", options: [
        { emoji: "🤷", label: "Lo leggo quando posso (se me lo ricordo)", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Un assistente AI risponde entro 30 secondi", node: AU("🤖", "AI risponde subito") }
      ]},
      { q: "Il cliente vuole prenotare un tavolo. Come fa?", options: [
        { emoji: "📞", label: "Chiama, prendo io al telefono", node: M("👤", "Prenotazione a voce") },
        { emoji: "📅", label: "Gli mando un link e prenota da solo", node: AU("📅", "Prenotazione online") }
      ]},
      { q: "2 ore prima dell'orario del tavolo?", options: [
        { emoji: "😬", label: "Niente, speriamo si ricordi", node: M("❌", "Nessun promemoria") },
        { emoji: "⏰", label: "Promemoria automatico WhatsApp", node: AU("⏰", "Promemoria 2h prima") }
      ]},
      { q: "Dopo la cena?", options: [
        { emoji: "👋", label: "Niente, alla prossima", node: M("👤", "Fine corsa") },
        { emoji: "⭐", label: "Richiesta recensione Google automatica", node: AU("⭐", "Richiesta recensione") }
      ]}
    ],
    goalLabel: "Funnel dal primo messaggio alla recensione"
  },

  palestra: {
    name: "Palestra / Fitness", icon: "💪",
    trigger: TR("💬", "Qualcuno chiede info abbonamenti / corsi"),
    steps: [
      { q: "Come gestisci la richiesta info?", options: [
        { emoji: "🤷", label: "Rispondo io quando arrivo in palestra", node: M("👤", "Risposta a ore sparse") },
        { emoji: "🤖", label: "Bot invia listino + invito a prova gratuita", node: AU("🤖", "Info + trial auto") }
      ]},
      { q: "Come prenota un corso collettivo?", options: [
        { emoji: "📋", label: "Scrive al gruppo WhatsApp", node: M("👤", "Gestione caotica") },
        { emoji: "📅", label: "Prenota da solo sul calendario online", node: AU("📅", "Prenotazione self") }
      ]},
      { q: "Se disdice un posto 2h prima del corso?", options: [
        { emoji: "😬", label: "Il posto rimane vuoto", node: M("❌", "Posto sprecato") },
        { emoji: "🔄", label: "Lista d'attesa chiamata automaticamente", node: AU("🔄", "Auto-riallocazione") }
      ]},
      { q: "Iscritto che non viene da 2 settimane?", options: [
        { emoji: "🤷", label: "Lascio perdere, si rifarà vivo", node: M("👤", "Nessuna riattivazione") },
        { emoji: "💪", label: "Messaggio + sessione PT omaggio", node: AU("💪", "Riattivazione auto") }
      ]}
    ],
    goalLabel: "Funnel da info a retention abbonati"
  },

  estetica: {
    name: "Centro estetico", icon: "💆",
    trigger: TR("💬", "Cliente chiede info su trattamenti / prezzi"),
    steps: [
      { q: "Come rispondi?", options: [
        { emoji: "🤷", label: "Rispondo a più persone quando posso", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Assistente invia listino + foto risultati", node: AU("🤖", "Info + portfolio") }
      ]},
      { q: "Vuole prenotare una seduta?", options: [
        { emoji: "📞", label: "Al telefono, vedo sul registro", node: M("👤", "Prenotazione vocale") },
        { emoji: "💳", label: "Online con piccola caparra", node: AU("💳", "Booking + caparra") }
      ]},
      { q: "Prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Se si ricorda viene", node: M("❌", "Rischio salta") },
        { emoji: "⏰", label: "Promemoria 24h e 2h prima", node: AU("⏰", "Doppio promemoria") }
      ]},
      { q: "Dopo il trattamento?", options: [
        { emoji: "👋", label: "Buona giornata e basta", node: M("👤", "Nessun follow-up") },
        { emoji: "⭐", label: "Recensione + richiamo 45gg", node: AU("⭐", "Review + mantenimento") }
      ]}
    ],
    goalLabel: "Funnel dalla richiesta al mantenimento"
  },

  parrucchiere: {
    name: "Parrucchiere / Barber", icon: "💇",
    trigger: TR("💬", "Cliente scrive \"che disponibilità avete?\""),
    steps: [
      { q: "Come rispondi?", options: [
        { emoji: "🤷", label: "Guardo l'agenda e rispondo quando posso", node: M("👤", "Check manuale") },
        { emoji: "🤖", label: "Bot invia slot liberi + link prenotazione", node: AU("🤖", "Slot real-time") }
      ]},
      { q: "Prenotazione del taglio?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Prenotazione a voce") },
        { emoji: "💳", label: "Self-service con caparra", node: AU("💳", "Booking blindato") }
      ]},
      { q: "Poche ore prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Rischio buco") },
        { emoji: "⏰", label: "Promemoria 3h prima", node: AU("⏰", "Promemoria WA") }
      ]},
      { q: "Dopo il taglio?", options: [
        { emoji: "👋", label: "A presto!", node: M("👤", "Fine corsa") },
        { emoji: "⭐", label: "Recensione + richiamo dopo 30gg", node: AU("⭐", "Review + richiamo") }
      ]}
    ],
    goalLabel: "Funnel dal primo DM alla fedeltà"
  },

  dentista: {
    name: "Studio dentistico", icon: "🦷",
    trigger: TR("💬", "Paziente chiede preventivo / info cure"),
    steps: [
      { q: "Risposta info?", options: [
        { emoji: "🤷", label: "Segretaria risponde, spesso in ritardo", node: M("👤", "Segretaria manuale") },
        { emoji: "🤖", label: "Info + prequalifica caso auto", node: AU("🤖", "Pre-qualifica auto") }
      ]},
      { q: "Accetta il preventivo?", options: [
        { emoji: "🤷", label: "Ci pensa, magari richiama", node: M("👤", "Attesa") },
        { emoji: "🔄", label: "Follow-up educativo (video, FAQ)", node: AU("🔄", "Nurture auto") }
      ]},
      { q: "Giorno della visita?", options: [
        { emoji: "😬", label: "Se si ricorda viene", node: M("❌", "Cancella 1h prima") },
        { emoji: "⏰", label: "Promemoria 48h e 2h prima", node: AU("⏰", "Doppio promemoria") }
      ]},
      { q: "11 mesi dall'ultima visita?", options: [
        { emoji: "🤷", label: "Spero si ricordi del controllo", node: M("👤", "Speranza") },
        { emoji: "🦷", label: "Richiamo automatico controllo annuale", node: AU("🦷", "Richiamo annuale") }
      ]}
    ],
    goalLabel: "Funnel dal preventivo al controllo annuale"
  },

  medico: {
    name: "Studio medico / Fisio", icon: "🏥",
    trigger: TR("💬", "Paziente scrive per prima visita"),
    steps: [
      { q: "Come gestisci la richiesta?", options: [
        { emoji: "🤷", label: "Centralino al telefono, linee occupate", node: M("👤", "Centralino intasato") },
        { emoji: "🤖", label: "Bot info + triage iniziale", node: AU("🤖", "Info + triage") }
      ]},
      { q: "Prenotazione visita?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Telefonica") },
        { emoji: "📅", label: "Online con integrazione agenda", node: AU("📅", "Booking sincro") }
      ]},
      { q: "Prima della visita?", options: [
        { emoji: "😬", label: "Si presenta e basta", node: M("❌", "Niente prep") },
        { emoji: "⏰", label: "Istruzioni + link Meet se online", node: AU("⏰", "Prep automatica") }
      ]},
      { q: "Dopo la visita, pianifica la 2ª?", options: [
        { emoji: "🤷", label: "Se torna torna", node: M("👤", "Nessun follow") },
        { emoji: "📅", label: "Invito auto per seduta successiva", node: AU("📅", "Prosecuzione") }
      ]}
    ],
    goalLabel: "Funnel per aderenza al percorso clinico"
  },

  studio_pro: {
    name: "Avvocato / Commercialista", icon: "⚖️",
    trigger: TR("💬", "Potenziale cliente scrive per consulenza"),
    steps: [
      { q: "Risposta iniziale?", options: [
        { emoji: "🤷", label: "Rispondo via email dopo giorni", node: M("👤", "Email tardiva") },
        { emoji: "🤖", label: "Qualifica + info costi + booking", node: AU("🤖", "Qualifica + booking") }
      ]},
      { q: "Conferma appuntamento?", options: [
        { emoji: "📞", label: "Richiamo il giorno prima", node: M("👤", "Conferma a voce") },
        { emoji: "📋", label: "Lista documenti + promemoria 24h", node: AU("📋", "Pre-appuntamento") }
      ]},
      { q: "Pratica in corso, documenti mancanti?", options: [
        { emoji: "📧", label: "Sollecito a mano ogni tanto", node: M("👤", "Sollecito manuale") },
        { emoji: "🔄", label: "Promemoria auto fino al ricevimento", node: AU("🔄", "Solleciti auto") }
      ]},
      { q: "Dopo la pratica conclusa?", options: [
        { emoji: "👋", label: "Grazie, alla prossima", node: M("👤", "Nessun seguito") },
        { emoji: "⭐", label: "Recensione + check-up annuale", node: AU("⭐", "Review + rinnovo") }
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
        { emoji: "🤖", label: "Scheda + foto + qualifica budget", node: AU("🤖", "Qualifica auto") }
      ]},
      { q: "Fissare una visita?", options: [
        { emoji: "📞", label: "Al telefono", node: M("👤", "Appuntamento vocale") },
        { emoji: "📅", label: "Prenotazione online + mappa", node: AU("📅", "Booking + logistica") }
      ]},
      { q: "Prima della visita?", options: [
        { emoji: "😬", label: "Niente, ci vediamo lì", node: M("❌", "Rischio visita saltata") },
        { emoji: "⏰", label: "Promemoria 2h + contatto diretto", node: AU("⏰", "Promemoria") }
      ]},
      { q: "Lead che non compra entro 3 mesi?", options: [
        { emoji: "👋", label: "Lo perdo, cerca altrove", node: M("👤", "Lead perso") },
        { emoji: "🏠", label: "Invio auto 3 immobili compatibili", node: AU("🏠", "Rinurturing") }
      ]}
    ],
    goalLabel: "Funnel dall'annuncio al rogito"
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
        { emoji: "📅", label: "Online + ricevuta + auto sostitutiva", node: AU("📅", "Booking + logistica") }
      ]},
      { q: "Dopo il lavoro?", options: [
        { emoji: "👋", label: "Alla prossima", node: M("👤", "Fine") },
        { emoji: "⭐", label: "Recensione + check tagliando futuro", node: AU("⭐", "Review + pianifica") }
      ]},
      { q: "10 mesi dopo il tagliando?", options: [
        { emoji: "🤷", label: "Spero si ricordi", node: M("👤", "Speranza") },
        { emoji: "🔔", label: "Richiamo auto tagliando + slot", node: AU("🔔", "Richiamo tagliando") }
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
        { emoji: "🤖", label: "Foto + taglie + invito in negozio", node: AU("🤖", "Info + push store") }
      ]},
      { q: "Viene in negozio?", options: [
        { emoji: "👤", label: "Aspetto che arrivi", node: M("👤", "Attesa passiva") },
        { emoji: "📱", label: "\"Te lo metto da parte\" + promemoria", node: AU("📱", "Hold + promemoria") }
      ]},
      { q: "Dopo l'acquisto?", options: [
        { emoji: "👋", label: "Grazie!", node: M("👤", "Nessun seguito") },
        { emoji: "⭐", label: "Recensione + wishlist upsell", node: AU("⭐", "Review + upsell") }
      ]},
      { q: "Cliente fermo da 60 giorni?", options: [
        { emoji: "🤷", label: "Se torna bene", node: M("👤", "Dormiente") },
        { emoji: "🎁", label: "Invito preview nuova collezione", node: AU("🎁", "Riattivazione") }
      ]}
    ],
    goalLabel: "Funnel retail → cliente fedele"
  },

  ecommerce: {
    name: "E-commerce / Online", icon: "🛒",
    trigger: TR("🛒", "Visitatore aggiunge prodotto al carrello"),
    steps: [
      { q: "Esce senza comprare. Cosa succede?", options: [
        { emoji: "😬", label: "Niente, l'ho perso", node: M("❌", "Carrello perso") },
        { emoji: "📧", label: "Email recupero dopo 1 ora", node: AU("📧", "Recovery email #1") }
      ]},
      { q: "Dopo 24h ancora non compra?", options: [
        { emoji: "👋", label: "Pazienza, cliente perso", node: M("👤", "Abbandono") },
        { emoji: "💸", label: "Seconda email con coupon 10%", node: AU("💸", "Recovery + sconto") }
      ]},
      { q: "Dopo l'acquisto riuscito?", options: [
        { emoji: "👋", label: "Ordine spedito, fine", node: M("👤", "Nessuna review") },
        { emoji: "⭐", label: "Review auto 3gg dopo la consegna", node: AU("⭐", "Review post-consegna") }
      ]},
      { q: "Cliente non torna da 30gg?", options: [
        { emoji: "🤷", label: "Pazienza", node: M("👤", "One-shot") },
        { emoji: "🎁", label: "\"Potrebbe piacerti\" + coupon ritorno", node: AU("🎁", "Second order") }
      ]}
    ],
    goalLabel: "Funnel da carrello a cliente ricorrente"
  },

  hotel: {
    name: "Hotel / B&B", icon: "🏨",
    trigger: TR("💬", "Richiesta disponibilità soggiorno"),
    steps: [
      { q: "Risposta info?", options: [
        { emoji: "🤷", label: "Controllo booking manualmente", node: M("👤", "Risposta manuale") },
        { emoji: "🤖", label: "Disponibilità + sconto prenotazione diretta", node: AU("🤖", "Bypass OTA") }
      ]},
      { q: "Dopo la prenotazione?", options: [
        { emoji: "📧", label: "Email conferma generica", node: M("📧", "Email standard") },
        { emoji: "✉️", label: "Welcome + come arrivare + consigli city", node: AU("✉️", "Welcome esperienziale") }
      ]},
      { q: "Prima del check-in?", options: [
        { emoji: "🔑", label: "Check-in in reception all'arrivo", node: M("👤", "Coda reception") },
        { emoji: "🔑", label: "Check-in online 1 giorno prima", node: AU("🔑", "Check-in auto") }
      ]},
      { q: "Dopo il check-out?", options: [
        { emoji: "👋", label: "Fine, cambio camera", node: M("👤", "Ospite dimenticato") },
        { emoji: "⭐", label: "Recensione + offerta return", node: AU("⭐", "Review + return") }
      ]}
    ],
    goalLabel: "Funnel guest → return guest"
  },

  bar: {
    name: "Bar / Pasticceria", icon: "☕",
    trigger: TR("💬", "Richiesta ordine catering / torta"),
    steps: [
      { q: "Risposta all'ordine?", options: [
        { emoji: "🤷", label: "Al telefono quando posso", node: M("👤", "Tel intasato") },
        { emoji: "🤖", label: "Listino + disponibilità + qualifica", node: AU("🤖", "Qualifica auto") }
      ]},
      { q: "Conferma ordine?", options: [
        { emoji: "👤", label: "Parola data, vediamo", node: M("👤", "Senza garanzia") },
        { emoji: "💳", label: "Caparra 30% + conferma auto", node: AU("💳", "Ordine blindato") }
      ]},
      { q: "Prima del ritiro?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Ritiro dimenticato") },
        { emoji: "⏰", label: "Promemoria 48h e 2h prima", node: AU("⏰", "Promemoria ritiro") }
      ]},
      { q: "Dopo la consegna?", options: [
        { emoji: "👋", label: "Fine", node: M("👤", "Nessun ritorno") },
        { emoji: "⭐", label: "Foto + recensione + promo next order", node: AU("⭐", "Review + fidelity") }
      ]}
    ],
    goalLabel: "Funnel ordine → cliente fedele"
  },

  wedding: {
    name: "Wedding planner / Eventi", icon: "🎊",
    trigger: TR("💬", "Coppia chiede preventivo matrimonio"),
    steps: [
      { q: "Risposta iniziale?", options: [
        { emoji: "🤷", label: "Invio materiale quando riesco", node: M("👤", "Risposta tardiva") },
        { emoji: "🤖", label: "Pacchetti + portfolio + qualifica", node: AU("🤖", "Qualifica auto") }
      ]},
      { q: "Consulenza conoscitiva?", options: [
        { emoji: "📞", label: "Richiamo per fissare", node: M("👤", "Booking vocale") },
        { emoji: "📅", label: "Online + mood-board pre-call", node: AU("📅", "Booking + ispirazioni") }
      ]},
      { q: "Indecisi non prenotano?", options: [
        { emoji: "🤷", label: "Aspetto si facciano vivi", node: M("👤", "Attesa passiva") },
        { emoji: "🔄", label: "3 email nurture (testimonial, offerta)", node: AU("🔄", "Nurture sequence") }
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
        { emoji: "🤖", label: "Pacchetti + portfolio + qualifica auto", node: AU("🤖", "Qualifica auto") }
      ]},
      { q: "Conferma shooting?", options: [
        { emoji: "📞", label: "Parola data", node: M("👤", "Impegno orale") },
        { emoji: "💳", label: "Caparra + questionario stile", node: AU("💳", "Caparra + brief") }
      ]},
      { q: "Consegna foto?", options: [
        { emoji: "📧", label: "Upload e basta", node: M("👤", "Delivery semplice") },
        { emoji: "📧", label: "Gallery privata + feedback + tag social", node: AU("📧", "Gallery + engagement") }
      ]},
      { q: "A un anno dallo shooting?", options: [
        { emoji: "🤷", label: "Magari si fa vivo", node: M("👤", "One-shot") },
        { emoji: "📷", label: "Promemoria shooting annuale famiglia", node: AU("📷", "Ricorrenza") }
      ]}
    ],
    goalLabel: "Funnel da preventivo a cliente ricorrente"
  },

  psicologo: {
    name: "Psicologo / Counselor", icon: "🧠",
    trigger: TR("💬", "Prima richiesta info seduta"),
    steps: [
      { q: "Risposta delicata al primo contatto?", options: [
        { emoji: "🤷", label: "Rispondo quando libera, con calma", node: M("👤", "Manuale") },
        { emoji: "🤖", label: "Info approccio + primo colloquio gratuito", node: AU("🤖", "Accoglienza auto") }
      ]},
      { q: "Conferma seduta?", options: [
        { emoji: "📞", label: "Richiamo per confermare", node: M("👤", "Vocale") },
        { emoji: "📅", label: "Prenotazione online + link Meet", node: AU("📅", "Booking online") }
      ]},
      { q: "Paziente salta una seduta?", options: [
        { emoji: "🤷", label: "La richiamo più tardi", node: M("👤", "Recupero manuale") },
        { emoji: "❤️", label: "Messaggio delicato + riprogramma", node: AU("❤️", "Recupero empatico") }
      ]},
      { q: "Fine del percorso?", options: [
        { emoji: "👋", label: "Saluto e fine", node: M("👤", "Nessun follow") },
        { emoji: "💬", label: "Follow-up 3 mesi dopo", node: AU("💬", "Check-in post") }
      ]}
    ],
    goalLabel: "Funnel dal primo contatto all'aderenza"
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
        { emoji: "📝", label: "Modulo cartaceo/manuale", node: M("👤", "Manuale") },
        { emoji: "💳", label: "Form online con pagamento + welcome", node: AU("💳", "Iscrizione + onboarding") }
      ]},
      { q: "Studente non inizia il corso?", options: [
        { emoji: "🤷", label: "Addio, ho già il pagamento", node: M("👤", "Abbandono silenzioso") },
        { emoji: "📚", label: "Welcome + materiali + promemoria", node: AU("📚", "Onboarding proattivo") }
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
        { emoji: "🤖", label: "Pacchetti + testimonial + body check gratis", node: AU("🤖", "Qualifica + check") }
      ]},
      { q: "Prima sessione?", options: [
        { emoji: "📞", label: "Conferma a voce", node: M("👤", "Conferma vocale") },
        { emoji: "📅", label: "Prenotazione online + brief obiettivi", node: AU("📅", "Booking + brief") }
      ]},
      { q: "A metà percorso?", options: [
        { emoji: "🤷", label: "Se va bene va bene", node: M("👤", "Zero monitoraggio") },
        { emoji: "📊", label: "Misurazioni + foto + feedback", node: AU("📊", "Tracking progressi") }
      ]},
      { q: "Fine mese coaching?", options: [
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
        { emoji: "📞", label: "A voce", node: M("👤", "Informale") },
        { emoji: "💳", label: "Online con caparra", node: AU("💳", "Booking blindato") }
      ]},
      { q: "Dopo il servizio?", options: [
        { emoji: "👋", label: "Ciao e grazie", node: M("👤", "Fine servizio") },
        { emoji: "⭐", label: "Foto + recensione + sconto prossimo", node: AU("⭐", "Review + loyalty") }
      ]},
      { q: "Dopo 20-60 giorni?", options: [
        { emoji: "🤷", label: "Se torna torna", node: M("👤", "Disperso") },
        { emoji: "💅", label: "Richiamo auto mantenimento", node: AU("💅", "Periodico") }
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
        { emoji: "🤖", label: "Listino per razza + prenotazione", node: AU("🤖", "Info + booking") }
      ]},
      { q: "Prenotazione?", options: [
        { emoji: "📞", label: "A voce", node: M("👤", "Vocale") },
        { emoji: "📅", label: "Online + istruzioni pre-appuntamento", node: AU("📅", "Booking + istruzioni") }
      ]},
      { q: "Prima dell'appuntamento?", options: [
        { emoji: "😬", label: "Niente", node: M("❌", "Nessun promemoria") },
        { emoji: "⏰", label: "Promemoria 24h + 2h", node: AU("⏰", "Promemoria") }
      ]},
      { q: "Dopo il servizio?", options: [
        { emoji: "👋", label: "Arrivederci", node: M("👤", "Nessun ritorno") },
        { emoji: "📸", label: "Foto cucciolo + recensione + richiamo 5 sett", node: AU("📸", "Review + richiamo") }
      ]}
    ],
    goalLabel: "Funnel retention pet"
  }
};

// ============================================================================
// STATE
// ============================================================================
const LabState = {
  view: "sector",
  sector: null,
  stepIdx: 0,           // quale bivio stiamo presentando ORA
  chosenIndices: [],    // indici delle opzioni scelte negli step precedenti
  prevResolvedCount: 0  // per animazione delta (numero bivi resolti al precedente render)
};

function openLab() {
  LabState.view = "sector";
  LabState.sector = null;
  LabState.stepIdx = 0;
  LabState.chosenIndices = [];
  LabState.prevResolvedCount = 0;
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
      <div class="text-2xl md:text-3xl mb-2">${s.icon}</div>
      <div class="text-xs font-semibold text-[#143d5c] leading-tight">${s.name}</div>
    </button>
  `).join('');

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge">🧪 Costruisci il tuo funnel</span>
    </div>
    <h3 class="text-xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">Qual è il tuo business?</h3>
    <p class="text-[#143d5c]/60 text-sm mb-6">Scegli il tuo settore. Ti facciamo costruire il funnel giusto per te, un bivio alla volta.</p>
    <div class="sector-grid">${cards}</div>
  `;
}

function selectSector(key) {
  LabState.sector = key;
  LabState.view = "builder";
  LabState.stepIdx = 0;
  LabState.chosenIndices = [];
  LabState.prevResolvedCount = 0;
  renderView();
}

function renderBuilderView() {
  const sector = SECTORS[LabState.sector];
  if (!sector) { LabState.view = "sector"; return renderView(); }

  const stepsCount = sector.steps.length;
  const currentStep = sector.steps[LabState.stepIdx];
  const allDone = LabState.stepIdx >= stepsCount;

  const canvasHtml = buildCanvas();

  // pannello domanda
  let rightSide = '';
  if (allDone) {
    rightSide = `
      <div class="bg-gradient-to-br from-[#d4a747] to-[#e0c179] text-[#143d5c] rounded-2xl p-5 md:p-6">
        <p class="text-xs uppercase tracking-widest font-bold mb-2">🎉 Funnel costruito</p>
        <h4 class="text-xl md:text-2xl font-bold leading-snug mb-3">Bravo. Hai fatto il tuo funnel.</h4>
        <p class="text-sm leading-relaxed mb-4">Adesso la domanda vera: <strong>ti piacerebbe parlarne con noi?</strong> Valutiamo insieme se ha senso metterlo in produzione per la tua ${sector.name.toLowerCase()}.</p>
        <button onclick="LabState.view='result';renderView();" class="bg-[#143d5c] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0e2c43] transition w-full md:w-auto">
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
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#143d5c]/5 mb-3">
        <span class="text-xs font-bold text-[#143d5c]/60 uppercase tracking-wide">Bivio ${LabState.stepIdx + 1} — ${BIVIO_LABELS[LabState.stepIdx] || 'Step'}</span>
      </div>
      <h4 class="text-xl md:text-2xl font-bold text-[#143d5c] leading-tight mb-2">${currentStep.q}</h4>
      <p class="text-[#143d5c]/55 text-xs mb-5">Scegli la tua strada. L'altra resterà visibile nel funnel — così vedi cosa hai scartato.</p>
      <div class="space-y-3">${opts}</div>
    `;
  }

  const progress = `
    <div class="flex items-center gap-1.5 mb-5 flex-wrap">
      ${Array.from({length: stepsCount}, (_, i) => {
        if (i < LabState.stepIdx) return '<div class="progress-dot done"></div>';
        if (i === LabState.stepIdx && !allDone) return '<div class="progress-dot active"></div>';
        return '<div class="progress-dot"></div>';
      }).join('')}
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">
        ${allDone ? 'Funnel completato' : `${LabState.stepIdx + 1} di ${stepsCount}`}
      </span>
    </div>
  `;

  document.getElementById('labContent').innerHTML = `
    <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
      <span class="lab-badge">${sector.icon} ${sector.name}</span>
      <button onclick="resetBuilder()" class="text-xs text-[#143d5c]/50 hover:text-[#143d5c] font-semibold">↺ Ricomincia</button>
    </div>
    ${progress}

    <div class="lab-split">
      <div>
        ${rightSide}
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[#D4998D] dot"></span> Il tuo funnel live
        </p>
        ${canvasHtml}
      </div>
    </div>

    <div class="flex justify-between items-center mt-5 pt-5 border-t border-[#143d5c]/10">
      <button onclick="backBuilder()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold text-sm flex items-center gap-1">← Indietro</button>
      <span class="text-xs text-[#143d5c]/40">${LabState.chosenIndices.length}/${stepsCount} bivi risolti</span>
    </div>
  `;
}

function chooseOption(optIdx) {
  LabState.chosenIndices.push(optIdx);
  LabState.stepIdx += 1;
  renderView();
}

function backBuilder() {
  if (LabState.stepIdx === 0) {
    LabState.view = "sector";
    LabState.chosenIndices = [];
    LabState.prevResolvedCount = 0;
    renderView();
    return;
  }
  LabState.stepIdx -= 1;
  LabState.chosenIndices.pop();
  renderView();
}

function resetBuilder() {
  LabState.stepIdx = 0;
  LabState.chosenIndices = [];
  LabState.prevResolvedCount = 0;
  renderView();
}

// ============================================================================
// CANVAS (bivi con strade visibili + frecce SVG curve tra i nodi)
// ============================================================================

// Costruisce una freccia SVG curva da fromX a toX (percentuali 0-100 su asse x)
// Se isNew, anima la stroke (effetto "disegno"); altrimenti statica.
function arrowSvg(fromX, toX, isNew, delay) {
  const pathStyle = isNew
    ? `animation-delay:${Math.max(0, delay)}ms`
    : 'animation:none;stroke-dashoffset:0;';
  const tipStyle = isNew
    ? `animation-delay:${Math.max(0, delay) + 500}ms`
    : 'animation:none;opacity:1;';
  // Bezier verticale: parte in (fromX, 2), arriva in (toX, 34), con control points che creano una S-curve morbida
  const d = `M ${fromX} 2 C ${fromX} 18, ${toX} 20, ${toX} 32`;
  return `
    <svg class="wf-arrow-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path class="wf-arrow-path" d="${d}" style="${pathStyle}"/>
      <polygon class="wf-arrow-tip" points="${toX-5},30 ${toX+5},30 ${toX},38" style="${tipStyle}"/>
    </svg>
  `;
}

function buildCanvas() {
  const sector = SECTORS[LabState.sector];
  if (!sector) return '';
  const resolvedCount = LabState.chosenIndices.length;
  const goalAdded = LabState.stepIdx >= sector.steps.length;

  let html = '<div class="wf-canvas">';

  // Trigger sempre visibile
  const triggerNew = LabState.prevResolvedCount === 0;
  const triggerStyle = triggerNew ? 'animation-delay:0ms' : 'animation:none;opacity:1;transform:translateY(0);';
  html += `
    <div class="wf-block">
      <div class="wf-node wf-node--trigger" style="${triggerStyle}">
        <span class="wf-icon">${sector.trigger.icon}</span>
        <div class="wf-body"><div class="wf-label">${sector.trigger.label}</div></div>
        <span class="wf-tag">Inizio</span>
      </div>
    </div>
  `;

  // Traccia "da dove esce" il nodo precedente: 50 (centro), 25 (left-path), 75 (right-path)
  let lastExitX = 50; // trigger esce centrato

  // Bivi risolti
  LabState.chosenIndices.forEach((chosenIdx, i) => {
    const step = sector.steps[i];
    const isNew = i >= LabState.prevResolvedCount;
    const delay = isNew ? (i - LabState.prevResolvedCount) * 250 : 0;
    const arrowDelay = delay;
    const cardDelay = delay + 300; // card appare dopo che la freccia si è disegnata

    const fromX = lastExitX;
    const toX = 50; // entra centrata nel bivio
    html += arrowSvg(fromX, toX, isNew, arrowDelay);

    const cardStyle = isNew ? `animation-delay:${cardDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);';

    const optA = step.options[0];
    const optB = step.options[1];
    const aChosen = chosenIdx === 0;
    const bChosen = chosenIdx === 1;

    html += `
      <div class="wf-choice" style="${cardStyle}">
        <div class="wf-choice-header">
          <span class="wf-choice-num">Bivio ${i + 1}</span>
          <span class="wf-choice-title">${BIVIO_LABELS[i] || 'Step'}</span>
        </div>
        <div class="wf-choice-paths">
          <div class="wf-choice-path ${aChosen ? 'chosen chosen--' + optA.node.type : 'notchosen'}">
            <span class="wf-choice-icon">${optA.node.icon}</span>
            <span class="wf-choice-label">${optA.node.label}</span>
            <span class="wf-choice-tag">${aChosen ? '✓ ' : ''}${optA.node.tag}</span>
          </div>
          <div class="wf-choice-divider">vs</div>
          <div class="wf-choice-path ${bChosen ? 'chosen chosen--' + optB.node.type : 'notchosen'}">
            <span class="wf-choice-icon">${optB.node.icon}</span>
            <span class="wf-choice-label">${optB.node.label}</span>
            <span class="wf-choice-tag">${bChosen ? '✓ ' : ''}${optB.node.tag}</span>
          </div>
        </div>
      </div>
    `;

    // Il bivio "esce" dal lato del path scelto
    lastExitX = chosenIdx === 0 ? 25 : 75;
  });

  // Goal
  if (goalAdded) {
    const goalIsNew = LabState.prevResolvedCount < resolvedCount + 1;
    const goalDelay = goalIsNew ? (resolvedCount - LabState.prevResolvedCount) * 250 : 0;
    const goalCardDelay = goalDelay + 300;

    html += arrowSvg(lastExitX, 50, goalIsNew, goalDelay);

    const goalStyle = goalIsNew ? `animation-delay:${goalCardDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);';
    html += `
      <div class="wf-block">
        <div class="wf-node wf-node--goal" style="${goalStyle}">
          <span class="wf-icon">🎯</span>
          <div class="wf-body"><div class="wf-label">${sector.goalLabel}</div></div>
          <span class="wf-tag">Obiettivo</span>
        </div>
      </div>
    `;
  }

  html += '</div>';

  LabState.prevResolvedCount = resolvedCount;
  return html;
}

// ============================================================================
// FINAL RESULT
// ============================================================================
function renderResult() {
  const sector = SECTORS[LabState.sector];
  let autoCount = 0;
  LabState.chosenIndices.forEach((c, i) => {
    if (sector.steps[i].options[c].node.type === 'auto') autoCount++;
  });
  const manualCount = LabState.chosenIndices.length - autoCount;

  // forza render completo senza animazione
  LabState.prevResolvedCount = LabState.chosenIndices.length + 1;
  const canvasHtml = buildCanvas();

  let verdict;
  if (autoCount >= 3) {
    verdict = `<strong>Ottima scelta.</strong> Hai un funnel quasi tutto automatizzato: ti libera dalle cose ripetitive e crea clienti che tornano senza che tu ci metta tempo.`;
  } else if (autoCount >= 2) {
    verdict = `Ci sei quasi. <strong>${autoCount} scelte automatiche</strong>, ${manualCount} ancora manuali — con piccoli ritocchi il tuo funnel diventa una macchina.`;
  } else {
    verdict = `Il tuo funnel è ancora quasi tutto manuale. <strong>Ecco perché il tempo non basta mai</strong>: tutto passa dalle tue mani. Possiamo cambiare molto.`;
  }

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge" style="background:rgba(212,167,71,0.18);color:#9a7818;">✅ FUNNEL COMPLETATO</span>
    </div>

    <h3 class="text-2xl md:text-4xl font-bold text-[#143d5c] leading-tight mb-3">
      ${sector.icon} Hai costruito il funnel della tua <span class="headline-coral">${sector.name.toLowerCase()}</span>.
    </h3>
    <p class="text-[#143d5c]/75 text-base md:text-lg leading-relaxed mb-6">${verdict}</p>

    <div class="mb-6">
      <p class="text-xs uppercase tracking-widest text-[#143d5c]/50 font-bold mb-2">Il funnel che hai disegnato</p>
      ${canvasHtml}
    </div>

    <div class="bg-[#143d5c] text-white rounded-2xl p-5 md:p-6 mb-5">
      <p class="text-xs uppercase tracking-widest text-[#D4998D] font-bold mb-2">E adesso?</p>
      <p class="text-lg md:text-2xl font-bold leading-snug mb-3">Ti piacerebbe parlarne per mettere <em>davvero</em> in produzione questo funnel?</p>
      <p class="text-white/80 text-sm leading-relaxed">
        Lasciaci 2 info qui sotto. In 24 ore ti diciamo se ha senso, quanto costa, quanto ci mettiamo. Se non siamo il fit giusto, te lo diciamo noi.
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
        title="Form proposta">
      </iframe>
    </div>

    <div class="mt-5 flex justify-between items-center text-sm flex-wrap gap-2">
      <button onclick="openLab()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold flex items-center gap-1">
        🔄 Rifai (altro settore?)
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
