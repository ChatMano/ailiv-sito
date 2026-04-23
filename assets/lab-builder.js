/* ============================================================================
   AILIV · LAB BUILDER
   Quiz profilato per settore (20 settori) + workflow animato stile GHL.
   Step 1 = settore · Step 2 = pain specifici · Step 3 = ore · Step 4 = goal
   I nodi appaiono progressivamente; i nodi già mostrati non si ri-animano.
   ========================================================================= */

// Shorthand per costruire i workflow
const T = (icon, label, desc="") => ({ icon, label, desc, type: "trigger", tag: "Trigger" });
const A = (icon, label, desc="") => ({ icon, label, desc, type: "action", tag: "Automatico" });

// ============================================================================
// 20 SETTORI — ogni task ha LABEL pain-forward
// ============================================================================
const SECTORS = {
  ristorante: {
    name: "Ristorante / Pizzeria", icon: "🍕",
    manualTasks: [
      { emoji: "💬", label: "Spiegare 100 volte menu, orari, celiaci, parcheggio", title: "Info automatica ai clienti", workflow: [
        T("💬", "Cliente chiede info", "WhatsApp · Instagram · Google"),
        A("🤖", "Assistente risponde subito", "Menu, orari, delivery, allergeni"),
        A("📝", "Salva contatto per promo future")
      ]},
      { emoji: "😱", label: "Il terrore del no-show (tavolo prenotato e saltato)", title: "Anti no-show", workflow: [
        T("📅", "Tavolo prenotato"),
        A("📱", "Conferma immediata WhatsApp"),
        A("⏰", "Promemoria 2h prima", "Meno no-show, sala piena")
      ]},
      { emoji: "⭐", label: "Il concorrente ha 300 recensioni Google, io 40", title: "Recensioni post-cena", workflow: [
        T("✅", "Cena completata / scontrino"),
        A("⏱️", "Attendi 2 ore"),
        A("⭐", "Link recensione Google", "Se negativa resta interna")
      ]},
      { emoji: "💔", label: "Clienti che provano una volta e non tornano", title: "Riattivazione clienti", workflow: [
        T("🕐", "30 giorni senza visita"),
        A("💌", "Messaggio col loro piatto preferito"),
        A("🎁", "Offerta dedicata", "Dessert omaggio, sconto coppia")
      ]}
    ]
  },
  palestra: {
    name: "Palestra / Fitness", icon: "💪",
    manualTasks: [
      { emoji: "💬", label: "Rispondere a 50 \"quanto costa l'abbonamento?\" al mese", title: "Info abbonamenti automatica", workflow: [
        T("💬", "Interessato scrive per info"),
        A("🤖", "Spiega abbonamenti + prova gratuita"),
        A("📝", "Salva interesse (pesi/yoga/corsi)")
      ]},
      { emoji: "🏃", label: "Posti corsi sprecati per disdette last-minute", title: "Gestione disdette corsi", workflow: [
        T("📅", "Iscritto prenota un corso"),
        A("📱", "Conferma + promemoria 2h prima"),
        A("🔄", "Se disdice, avvisa chi è in lista d'attesa")
      ]},
      { emoji: "⭐", label: "La palestra nuova in zona ha più recensioni di noi", title: "Recensioni Google", workflow: [
        T("🗓️", "30gg dall'iscrizione"),
        A("💬", "Come va l'allenamento?"),
        A("⭐", "Link recensione Google")
      ]},
      { emoji: "💔", label: "Iscritti che smettono di venire dopo 2 settimane", title: "Riattivazione iscritti", workflow: [
        T("🕐", "14gg senza check-in"),
        A("💪", "Ti aspettiamo + foto del tuo corso"),
        A("🎟️", "Sessione PT omaggio")
      ]}
    ]
  },
  estetica: {
    name: "Centro estetico", icon: "💆",
    manualTasks: [
      { emoji: "💬", label: "Rispiegare prezzi e come funziona il trattamento X", title: "Info trattamenti", workflow: [
        T("💬", "Cliente chiede info"),
        A("💆", "Listino + foto risultati"),
        A("🎁", "Propone consulenza viso gratuita")
      ]},
      { emoji: "😱", label: "Cliente che salta l'appuntamento senza avvisare", title: "Anti no-show", workflow: [
        T("📅", "Appuntamento fissato"),
        A("📋", "Conferma + consigli pre-trattamento"),
        A("⏰", "Promemoria 24h e 2h prima")
      ]},
      { emoji: "⭐", label: "Le clienti felici non mi lasciano la recensione", title: "Recensioni post-trattamento", workflow: [
        T("✨", "Trattamento completato"),
        A("⏱️", "Attendi 3 ore"),
        A("⭐", "Feedback + link Google")
      ]},
      { emoji: "💔", label: "Non tornano per il mantenimento del risultato", title: "Mantenimento risultati", workflow: [
        T("🕐", "45gg senza trattamento"),
        A("💆", "Mantieni il risultato: prenota il richiamo"),
        A("🎁", "Offerta fidelity trattamento preferito")
      ]}
    ]
  },
  parrucchiere: {
    name: "Parrucchiere / Barber", icon: "💇",
    manualTasks: [
      { emoji: "💬", label: "\"Quanto mi fai di mèches?\" su WhatsApp, 10 volte al giorno", title: "Info salone", workflow: [
        T("💬", "Cliente chiede info su WhatsApp/IG"),
        A("💇", "Listino + slot disponibili + foto look"),
        A("📆", "Link prenotazione diretta")
      ]},
      { emoji: "📅", label: "Buchi agenda a mezzogiorno nei giorni feriali", title: "Conferme + riempi buchi", workflow: [
        T("📅", "Taglio/colore prenotato"),
        A("📱", "Conferma + durata servizio + prezzo"),
        A("⏰", "Promemoria 3h prima")
      ]},
      { emoji: "⭐", label: "Il salone di fronte ha 400 recensioni Google", title: "Recensioni salone", workflow: [
        T("✂️", "Appuntamento concluso"),
        A("⏱️", "Attendi 2h"),
        A("⭐", "Come ti piace il look? + link")
      ]},
      { emoji: "💔", label: "Clienti che provano un altro salone e non tornano", title: "Richiamo taglio", workflow: [
        T("🕐", "30-45gg dall'ultimo taglio"),
        A("💇", "I tuoi capelli hanno bisogno di te"),
        A("🎁", "10% sul prossimo taglio")
      ]}
    ]
  },
  dentista: {
    name: "Studio dentistico", icon: "🦷",
    manualTasks: [
      { emoji: "💬", label: "Spiegare preventivi al telefono e non si decidono mai", title: "Info + qualifica", workflow: [
        T("💬", "Richiesta info / preventivo"),
        A("🦷", "Info consulenza gratuita + listino"),
        A("📋", "Pre-qualifica tipo di cura")
      ]},
      { emoji: "😱", label: "Pazienti che cancellano 1 ora prima (o non si presentano)", title: "Anti no-show", workflow: [
        T("📅", "Appuntamento fissato"),
        A("📋", "Istruzioni pre-cura"),
        A("⏰", "Promemoria 48h e 2h prima")
      ]},
      { emoji: "⭐", label: "I pazienti felici non scrivono mai su Google", title: "Feedback paziente", workflow: [
        T("✅", "Terapia completata"),
        A("⏱️", "Attendi 1 giorno"),
        A("⭐", "Feedback + link Google / Doctolib")
      ]},
      { emoji: "💔", label: "Nessuno si ricorda del controllo annuale", title: "Controllo periodico", workflow: [
        T("🕐", "11 mesi dall'ultima visita"),
        A("🦷", "È tempo del controllo semestrale"),
        A("📆", "Proponi slot disponibili")
      ]}
    ]
  },
  medico: {
    name: "Studio medico / Fisio", icon: "🏥",
    manualTasks: [
      { emoji: "💬", label: "Segretaria intasata di chiamate per info di base", title: "Info + triage automatico", workflow: [
        T("💬", "Paziente scrive"),
        A("🏥", "Info servizi + ticket + orari"),
        A("📋", "Pre-triage: problema specifico")
      ]},
      { emoji: "📅", label: "Pazienti che saltano le visite di controllo", title: "Conferme visite", workflow: [
        T("📅", "Visita fissata"),
        A("📋", "Istruzioni preparazione"),
        A("⏰", "Promemoria + link Meet se online")
      ]},
      { emoji: "⭐", label: "Pochissime recensioni su Doctolib/Google nonostante la qualità", title: "Feedback clinico", workflow: [
        T("✅", "Visita conclusa"),
        A("⏱️", "Attendi 4 ore"),
        A("⭐", "Questionario + link Doctolib/Google")
      ]},
      { emoji: "💔", label: "Pazienti che fanno 2 sedute e poi mollano il percorso", title: "Aderenza percorso", workflow: [
        T("🕐", "2 settimane senza sedute"),
        A("🏥", "Come stai andando? Serve supporto?"),
        A("📆", "Proponi prossimo slot")
      ]}
    ]
  },
  studio_pro: {
    name: "Avvocato / Commercialista", icon: "⚖️",
    manualTasks: [
      { emoji: "💬", label: "Spiegare la stessa cosa al potenziale cliente via mail 5 volte", title: "Qualifica nuovi clienti", workflow: [
        T("💬", "Potenziale cliente contatta"),
        A("⚖️", "Qualifica caso + info costi"),
        A("📆", "Propone appuntamento conoscitivo")
      ]},
      { emoji: "📋", label: "Clienti che non mandano mai i documenti in tempo", title: "Promemoria documenti", workflow: [
        T("📅", "Appuntamento / scadenza fissata"),
        A("📋", "Lista documenti con promemoria"),
        A("⏰", "Secondo sollecito se mancanti a 7gg")
      ]},
      { emoji: "⭐", label: "I clienti soddisfatti non mi fanno mai pubblicità", title: "Reputation Google", workflow: [
        T("✅", "Pratica conclusa"),
        A("⏱️", "Attendi 2 giorni"),
        A("⭐", "Richiesta recensione + LinkedIn")
      ]},
      { emoji: "💔", label: "Clienti che mi cercano solo in urgenza, poi spariscono", title: "Relazione continuativa", workflow: [
        T("🕐", "12 mesi senza contatto"),
        A("📰", "Aggiornamento normativo su misura"),
        A("📆", "Proponi check-up annuale")
      ]}
    ]
  },
  immobiliare: {
    name: "Agenzia immobiliare", icon: "🏠",
    manualTasks: [
      { emoji: "💬", label: "100 \"quanto vale questa casa?\" senza nemmeno vederla", title: "Qualifica lead annunci", workflow: [
        T("💬", "Lead su annuncio web"),
        A("🏠", "Scheda immobile + foto + disponibilità"),
        A("📋", "Qualifica budget ed esigenze")
      ]},
      { emoji: "📅", label: "Visite organizzate poi cancellate all'ultimo", title: "Conferme visite", workflow: [
        T("📅", "Visita fissata"),
        A("📍", "Indirizzo + mappa + dettagli"),
        A("⏰", "Promemoria 2h prima")
      ]},
      { emoji: "⭐", label: "Venduto il rogito, niente recensione", title: "Referenze post-vendita", workflow: [
        T("✅", "Compravendita conclusa"),
        A("⏱️", "Attendi 7 giorni"),
        A("⭐", "Richiesta recensione + storia casa")
      ]},
      { emoji: "💔", label: "Lead che spariscono per mesi, poi comprano dall'agenzia a fianco", title: "Follow-up lead freddi", workflow: [
        T("🕐", "3 mesi di silenzio"),
        A("🏠", "3 nuovi immobili compatibili"),
        A("📆", "Proponi visita")
      ]}
    ]
  },
  auto: {
    name: "Autosalone / Officina", icon: "🚗",
    manualTasks: [
      { emoji: "💬", label: "\"Quanto mi fai per un tagliando?\" senza vedere la macchina", title: "Info preventivi", workflow: [
        T("💬", "Info auto / tagliando"),
        A("🚗", "Preventivo + foto auto in stock"),
        A("📆", "Invito test drive / officina")
      ]},
      { emoji: "📅", label: "Officina mezza vuota il lunedì e il martedì", title: "Riempi officina", workflow: [
        T("📅", "Appuntamento officina"),
        A("🔧", "Stima tempi + costo"),
        A("⏰", "Promemoria + info auto sostitutiva")
      ]},
      { emoji: "⭐", label: "Nessuno scrive su Facebook della bella esperienza", title: "Feedback post-lavoro", workflow: [
        T("✅", "Lavoro completato"),
        A("⏱️", "Attendi 24h"),
        A("⭐", "Richiesta recensione + Facebook")
      ]},
      { emoji: "💔", label: "I clienti tornano solo quando si rompe qualcosa", title: "Richiamo tagliando", workflow: [
        T("🕐", "10 mesi dal tagliando"),
        A("🚗", "È tempo del tagliando"),
        A("🎁", "Offerta stagionale + slot officina")
      ]}
    ]
  },
  retail: {
    name: "Negozio / Retail", icon: "🛍️",
    manualTasks: [
      { emoji: "💬", label: "Gente che chiede info su IG ma non passa mai in negozio", title: "Info + invito in store", workflow: [
        T("💬", "Cliente chiede info su WhatsApp/IG"),
        A("🛍️", "Foto prodotto + taglie + prezzo"),
        A("📦", "\"Te lo metto da parte\" + slot visita")
      ]},
      { emoji: "📅", label: "Personal shopper prenotato, poi non si presenta", title: "Conferme consulenze", workflow: [
        T("📅", "Consulenza prenotata"),
        A("📋", "Questionario stile pre-visita"),
        A("⏰", "Promemoria con look consigliati")
      ]},
      { emoji: "⭐", label: "Clienti contenti ma nessuna recensione Google", title: "Recensioni post-acquisto", workflow: [
        T("🛒", "Vendita completata"),
        A("⏱️", "Attendi 3 giorni"),
        A("⭐", "Come ti sta? + link recensione")
      ]},
      { emoji: "💔", label: "Chi compra una volta non torna più", title: "Rilancio collezione", workflow: [
        T("🕐", "60gg senza visita"),
        A("👗", "Nuova collezione arrivata"),
        A("🎁", "Invito preview privata")
      ]}
    ]
  },
  ecommerce: {
    name: "E-commerce / Online", icon: "🛒",
    manualTasks: [
      { emoji: "💬", label: "Domande ripetitive (taglie, resi, spedizione) da gestire a mano", title: "Supporto cliente auto", workflow: [
        T("💬", "Domanda su chatbot/email"),
        A("🤖", "Risposta istantanea + consigli"),
        A("📝", "Se dubbi, coupon incentivo")
      ]},
      { emoji: "🛒", label: "50% dei carrelli abbandonati senza recupero", title: "Recupero carrelli", workflow: [
        T("🛒", "Carrello abbandonato 24h"),
        A("📧", "Promemoria + spedizione gratis"),
        A("💸", "Dopo 72h: coupon 10%")
      ]},
      { emoji: "⭐", label: "Tanti ordini, pochissime recensioni", title: "Review prodotto", workflow: [
        T("📦", "Pacco consegnato"),
        A("⏱️", "Attendi 3 giorni"),
        A("⭐", "Ti è piaciuto? + link Trustpilot")
      ]},
      { emoji: "💔", label: "Un acquisto, poi il cliente sparisce per sempre", title: "Second order", workflow: [
        T("🕐", "30gg dal primo ordine"),
        A("📧", "\"Abbiamo pensato a te\" + correlati"),
        A("🎁", "Coupon return customer")
      ]}
    ]
  },
  hotel: {
    name: "Hotel / B&B", icon: "🏨",
    manualTasks: [
      { emoji: "💬", label: "\"Avete disponibilità?\" 50 volte al giorno, su 4 canali", title: "Info + bypass OTA", workflow: [
        T("💬", "Info prezzi/date"),
        A("🏨", "Disponibilità + tariffe + foto"),
        A("💰", "Sconto prenotazione diretta (no Booking)")
      ]},
      { emoji: "🔑", label: "Check-in alle 22, ospiti stanchi, caos in reception", title: "Check-in pre-arrivo", workflow: [
        T("📅", "Prenotazione confermata"),
        A("✉️", "Welcome + come arrivare + consigli city"),
        A("🔑", "Check-in online 1gg prima")
      ]},
      { emoji: "⭐", label: "Voti alti su Booking, zero recensioni dirette Google", title: "Recensioni dirette", workflow: [
        T("🚪", "Check-out effettuato"),
        A("⏱️", "Attendi 4h"),
        A("⭐", "Grazie + link TripAdvisor/Google")
      ]},
      { emoji: "💔", label: "Ospiti del 2023 che non sono mai tornati", title: "Ospiti ricorrenti", workflow: [
        T("🗓️", "1 anno dal soggiorno"),
        A("📸", "Un anno fa eri qui... + foto"),
        A("🎁", "Offerta return ospite fedele")
      ]}
    ]
  },
  bar: {
    name: "Bar / Pasticceria", icon: "☕",
    manualTasks: [
      { emoji: "💬", label: "Ordini catering persi nel weekend (non rispondo al telefono)", title: "Info ordini speciali", workflow: [
        T("💬", "Richiesta torte/catering"),
        A("🎂", "Listino + foto + disponibilità"),
        A("📋", "Qualifica data, persone, stile")
      ]},
      { emoji: "📅", label: "Ordine da 200€ annullato all'ultimo (senza caparra)", title: "Ordini + caparra", workflow: [
        T("✍️", "Ordine torta/catering"),
        A("💳", "Conferma + caparra 30%"),
        A("⏰", "Promemoria 48h prima del ritiro")
      ]},
      { emoji: "⭐", label: "Clienti abituali, zero recensioni online", title: "Feedback post-evento", workflow: [
        T("🎉", "Ordine consegnato"),
        A("⏱️", "Attendi 1 giorno"),
        A("⭐", "Foto + link recensione")
      ]},
      { emoji: "💔", label: "Quello del cappuccino ogni mattina è sparito", title: "Riattivazione abituali", workflow: [
        T("🕐", "2 settimane senza colazione"),
        A("☕", "Il tuo cappuccino è pronto"),
        A("🎁", "Offerta brioche omaggio")
      ]}
    ]
  },
  wedding: {
    name: "Wedding planner / Eventi", icon: "🎊",
    manualTasks: [
      { emoji: "💬", label: "\"Quanto costa un matrimonio?\" ogni giorno sugli IG", title: "Qualifica preventivi", workflow: [
        T("💬", "Info nozze/evento"),
        A("💍", "Pacchetti base + portfolio"),
        A("📋", "Qualifica budget + data + stile")
      ]},
      { emoji: "📅", label: "Coppie che prenotano la consulenza e poi spariscono", title: "Consulenze serie", workflow: [
        T("📅", "Consulenza prenotata"),
        A("🎨", "Questionario ispirazioni pre-call"),
        A("⏰", "Promemoria con mood-board")
      ]},
      { emoji: "⭐", label: "Sposi felici, pubblicano su IG ma non fanno review Google", title: "Review post-evento", workflow: [
        T("🎉", "Matrimonio/evento concluso"),
        A("⏱️", "Attendi 3 giorni"),
        A("⭐", "Recensione + tag foto social")
      ]},
      { emoji: "💔", label: "Referral da amici degli sposi quasi zero", title: "Anniversario + referral", workflow: [
        T("🗓️", "6 mesi dall'evento"),
        A("💕", "Anniversario! Come sta andando?"),
        A("🎁", "Bonus per referral di amici")
      ]}
    ]
  },
  fotografo: {
    name: "Fotografo", icon: "📷",
    manualTasks: [
      { emoji: "💬", label: "Preventivi \"parcheggiati\" per mesi, poi boh", title: "Qualifica shooting", workflow: [
        T("💬", "Info matrimoni/ritratti"),
        A("📸", "Pacchetti + portfolio + disponibilità"),
        A("📋", "Qualifica tipo servizio + budget")
      ]},
      { emoji: "📅", label: "Shooting rinviato 3 volte, poi cancellato", title: "Conferme con caparra", workflow: [
        T("📅", "Shooting prenotato"),
        A("💳", "Caparra + brief creativo"),
        A("⏰", "Promemoria 48h + outfit consigliati")
      ]},
      { emoji: "⭐", label: "Consegno le foto, ringraziano, niente recensione", title: "Review post-consegna", workflow: [
        T("📦", "Foto consegnate"),
        A("⏱️", "Attendi 3 giorni"),
        A("⭐", "Recensione + tag social")
      ]},
      { emoji: "💔", label: "Clienti una tantum, mai tornano per foto famiglia", title: "Ritratti annuali", workflow: [
        T("🗓️", "1 anno dallo shooting"),
        A("👨‍👩‍👧", "I tuoi figli sono cresciuti"),
        A("🎁", "Offerta nuovo shooting familiare")
      ]}
    ]
  },
  psicologo: {
    name: "Psicologo / Counselor", icon: "🧠",
    manualTasks: [
      { emoji: "💬", label: "Primo contatto difficile: scrivono e poi spariscono", title: "Primo colloquio facilitato", workflow: [
        T("💬", "Richiesta info seduta"),
        A("🧠", "Info approccio + costi + modalità"),
        A("🎁", "Propone primo colloquio gratuito")
      ]},
      { emoji: "📅", label: "Pazienti che saltano sedute senza avvisare", title: "Conferme delicate", workflow: [
        T("📅", "Seduta fissata"),
        A("💻", "Link Meet o indirizzo studio"),
        A("⏰", "Promemoria 24h + possibilità rimando")
      ]},
      { emoji: "📊", label: "Non riesco a tenere traccia dell'evoluzione del percorso", title: "Monitoraggio percorso", workflow: [
        T("🗓️", "Ogni 10 sedute"),
        A("📋", "Questionario: come ti senti?"),
        A("📊", "Report privato per la discussione")
      ]},
      { emoji: "💔", label: "Chi finisce il percorso, non mi sa più niente", title: "Follow-up post-chiusura", workflow: [
        T("🕐", "3 mesi dalla fine del percorso"),
        A("💬", "Come stai?"),
        A("📆", "Se serve, nuova disponibilità")
      ]}
    ]
  },
  scuola: {
    name: "Scuola / Formazione", icon: "🎓",
    manualTasks: [
      { emoji: "💬", label: "1000 richieste info \"quando parte?\", \"quanto dura?\"", title: "Lead corsi automatica", workflow: [
        T("💬", "Richiesta info"),
        A("🎓", "Programma + prezzi + calendario"),
        A("🎁", "Lezione prova gratuita")
      ]},
      { emoji: "✍️", label: "Chi si iscrive ma non comincia il corso", title: "Onboarding studente", workflow: [
        T("✍️", "Iscrizione perfezionata"),
        A("📚", "Welcome + materiali + Classroom"),
        A("⏰", "Promemoria giornata iniziale")
      ]},
      { emoji: "⭐", label: "Fine corso, nessuno lascia feedback pubblico", title: "Review fine corso", workflow: [
        T("🎓", "Corso concluso"),
        A("⏱️", "Attendi 2 giorni"),
        A("⭐", "Questionario + link Google")
      ]},
      { emoji: "💔", label: "Ex-studenti che non passano al secondo livello", title: "Upsell continuità", workflow: [
        T("🕐", "3 mesi fine corso"),
        A("📚", "Continua col livello avanzato"),
        A("🎁", "Sconto ex-studente")
      ]}
    ]
  },
  coach: {
    name: "Personal trainer / Coach", icon: "🏃",
    manualTasks: [
      { emoji: "💬", label: "DM continui \"come funzionano i programmi?\"", title: "Info coaching auto", workflow: [
        T("💬", "Interesse percorso coaching"),
        A("🏃", "Pacchetti + testimonial"),
        A("🎁", "Body check o consulenza gratis")
      ]},
      { emoji: "📅", label: "No-show sessioni (salto personal pagati)", title: "Conferme allenamento", workflow: [
        T("📅", "Sessione prenotata"),
        A("📋", "Obiettivi del giorno"),
        A("⏰", "Promemoria + warm-up pre-sessione")
      ]},
      { emoji: "📊", label: "Clienti che mollano senza dirmi perché", title: "Monitoraggio cliente", workflow: [
        T("🗓️", "Fine mese di coaching"),
        A("📸", "Misurazioni + foto before/after"),
        A("⭐", "Se progressi, richiesta recensione")
      ]},
      { emoji: "💔", label: "Finito il mese di prova, non rinnovano", title: "Riattivazione percorso", workflow: [
        T("🕐", "15gg senza sessione"),
        A("💪", "Riprendi dove avevi lasciato"),
        A("🎁", "Piano a domicilio 7gg")
      ]}
    ]
  },
  nail_tatto: {
    name: "Nail / Tatuatore", icon: "💅",
    manualTasks: [
      { emoji: "💬", label: "DM continui \"quando sei libera?\", \"quanto costa?\"", title: "Info disponibilità", workflow: [
        T("💬", "Info e slot"),
        A("📸", "Portfolio + prezzi + slot liberi"),
        A("🎨", "Raccogli stile/riferimento desiderato")
      ]},
      { emoji: "📅", label: "Disdette 1 ora prima (lettera buco 2h)", title: "Caparra + conferme", workflow: [
        T("📅", "Appuntamento preso"),
        A("💳", "Caparra + istruzioni"),
        A("⏰", "Promemoria 24h + tips pre-sessione")
      ]},
      { emoji: "⭐", label: "Esce felice, niente recensione", title: "Review dopo servizio", workflow: [
        T("✅", "Servizio concluso"),
        A("⏱️", "Attendi 1 ora"),
        A("⭐", "Foto + recensione + sconto prossimo")
      ]},
      { emoji: "💔", label: "Va a farsi fare il ritocco da un'altra", title: "Richiamo mantenimento", workflow: [
        T("🕐", "20gg (nail) / 60gg (retouch)"),
        A("💅", "Pronta per la manutenzione?"),
        A("📆", "Slot prenotabili")
      ]}
    ]
  },
  pet: {
    name: "Toelettatura / Pet", icon: "🐾",
    manualTasks: [
      { emoji: "💬", label: "\"Quanto costa lavare il cane?\" ripetuto 10 volte al giorno", title: "Info servizi pet", workflow: [
        T("💬", "Cliente chiede info"),
        A("🐾", "Listino per razza + durata + prezzi"),
        A("📋", "Qualifica animale")
      ]},
      { emoji: "📅", label: "Padroni che dimenticano l'appuntamento", title: "Promemoria toelettatura", workflow: [
        T("📅", "Toelettatura prenotata"),
        A("📋", "Istruzioni pre-appuntamento"),
        A("⏰", "Promemoria 24h + 2h")
      ]},
      { emoji: "⭐", label: "Zero recensioni Google anche se il cane esce felice", title: "Review post-servizio", workflow: [
        T("✨", "Servizio concluso"),
        A("⏱️", "Attendi 3h"),
        A("📸", "Foto cucciolo + link recensione")
      ]},
      { emoji: "💔", label: "Padroni che cambiano toelettatore dopo qualche volta", title: "Richiamo periodico", workflow: [
        T("🕐", "5 sett (cane) / 8 sett (gatto)"),
        A("🐾", "È ora della toelettatura?"),
        A("🎁", "Slot + offerta fedeltà")
      ]}
    ]
  }
};

// ============================================================================
// DOMANDE FISSE (Q3 e Q4)
// ============================================================================
const HOURS_OPTIONS = [
  { emoji: "⏱️", label: "1–3 ore a settimana", desc: "\"Non è tantissimo... ma si sommano\"", hours: 2 },
  { emoji: "⏰", label: "4–8 ore a settimana", desc: "Mezza giornata lavorativa intera", hours: 6 },
  { emoji: "🕐", label: "Oltre 10 ore", desc: "Più di una giornata e mezza, ogni settimana", hours: 12 }
];

const GOAL_OPTIONS = [
  { emoji: "💼", label: "Svilupperei nuovi clienti", desc: "Vendite, partnership, sviluppo", goalIcon: "💼", goalLabel: "Più tempo per far crescere il business" },
  { emoji: "👨‍👩‍👧", label: "Starei con la mia famiglia", desc: "Un'ora in più a tavola, il weekend libero", goalIcon: "👨‍👩‍👧", goalLabel: "Tempo per la tua vita" },
  { emoji: "🚀", label: "Migliorerei quello che offro", desc: "Cura, qualità, innovazione", goalIcon: "🚀", goalLabel: "Prodotto e servizio migliori" },
  { emoji: "😌", label: "Finalmente respirerei", desc: "Niente corse, niente to-do infinita", goalIcon: "😌", goalLabel: "Meno stress, più lucidità" }
];

// ============================================================================
// STATE
// ============================================================================
const LabState = {
  step: 0,
  sector: null,
  manual: [],
  hours: null,
  goal: null,
  prevManual: [],
  prevHours: null,
  prevGoal: null,
  prevSector: null
};

function openLab() {
  LabState.step = 0;
  LabState.sector = null;
  LabState.manual = [];
  LabState.hours = null;
  LabState.goal = null;
  LabState.prevManual = [];
  LabState.prevHours = null;
  LabState.prevGoal = null;
  LabState.prevSector = null;
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
  if (LabState.step === 0) return renderSectorStep();
  return renderWorkflowStep();
}

function renderSectorStep() {
  const cards = Object.entries(SECTORS).map(([key, s]) => `
    <button onclick="selectSector('${key}')" class="sector-card ${LabState.sector === key ? 'selected' : ''}">
      <div class="text-3xl mb-2">${s.icon}</div>
      <div class="text-xs font-semibold text-[#143d5c] leading-tight">${s.name}</div>
    </button>
  `).join('');

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
      <span class="lab-badge">🧪 Costruisci il tuo workflow</span>
      <span class="text-xs text-[#143d5c]/50 font-semibold">1 di 4</span>
    </div>
    <div class="flex items-center gap-2 mb-5">
      <div class="progress-dot active"></div>
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">Partiamo dal tuo business</span>
    </div>

    <h3 class="text-2xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">Qual è il tuo business?</h3>
    <p class="text-[#143d5c]/60 text-sm mb-6">Seleziona il settore più vicino al tuo. Le prossime domande saranno specifiche al tuo pain.</p>

    <div class="sector-grid">${cards}</div>
  `;
}

function selectSector(key) {
  LabState.sector = key;
  LabState.step = 1;
  if (LabState.prevSector !== key) {
    LabState.manual = [];
    LabState.prevManual = [];
  }
  LabState.prevSector = key;
  renderStep();
}

function renderWorkflowStep() {
  const sector = SECTORS[LabState.sector];
  if (!sector) { LabState.step = 0; return renderStep(); }

  let q, help, options, canNext, mode;

  if (LabState.step === 1) {
    q = `Cosa ti toglie il sonno nella tua <em class="text-[#D4998D]">${sector.name.toLowerCase()}</em>?`;
    help = "Seleziona tutti i dolori che ti suonano familiari. Il workflow si costruirà davanti ai tuoi occhi.";
    mode = "Selezione multipla";
    options = sector.manualTasks.map((t, i) => `
      <button class="quiz-option ${LabState.manual.includes(i) ? 'selected' : ''}" onclick="toggleManual(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${t.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1 leading-snug">${t.label}</div>
          <div class="text-xs text-[#D4998D] font-semibold uppercase tracking-wide">→ ${t.title}</div>
        </div>
      </button>
    `).join('');
    canNext = LabState.manual.length > 0;
  } else if (LabState.step === 2) {
    q = "Quante ore ci perdi a settimana?";
    help = "Stima onesta. Sono ore tue.";
    mode = "Una risposta";
    options = HOURS_OPTIONS.map((o, i) => `
      <button class="quiz-option ${LabState.hours === i ? 'selected' : ''}" onclick="selectHours(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1">${o.label}</div>
          <div class="text-sm text-[#143d5c]/65 leading-snug">${o.desc}</div>
        </div>
      </button>
    `).join('');
    canNext = LabState.hours !== null;
  } else {
    q = "Se te le restituissimo, cosa ci faresti?";
    help = "La parte più importante. Quella che ti motiva davvero.";
    mode = "Una risposta";
    options = GOAL_OPTIONS.map((o, i) => `
      <button class="quiz-option ${LabState.goal === i ? 'selected' : ''}" onclick="selectGoal(${i})">
        <span class="text-3xl leading-none flex-shrink-0">${o.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-[#143d5c] mb-1">${o.label}</div>
          <div class="text-sm text-[#143d5c]/65 leading-snug">${o.desc}</div>
        </div>
      </button>
    `).join('');
    canNext = LabState.goal !== null;
  }

  const progressDots = [0, 1, 2, 3].map(i => {
    if (i < LabState.step) return '<div class="progress-dot done"></div>';
    if (i === LabState.step) return '<div class="progress-dot active"></div>';
    return '<div class="progress-dot"></div>';
  }).join('');

  const canvasHtml = buildCanvas();
  const isLast = LabState.step === 3;

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
      <span class="lab-badge">${sector.icon} ${sector.name}</span>
      <span class="text-xs text-[#143d5c]/50 font-semibold">${mode}</span>
    </div>
    <div class="flex items-center gap-2 mb-6">
      ${progressDots}
      <span class="text-xs font-semibold text-[#143d5c]/60 ml-2">${LabState.step + 1} di 4</span>
    </div>

    <div class="lab-split">
      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-[#143d5c] leading-tight mb-2">${q}</h3>
        <p class="text-[#143d5c]/60 text-sm mb-5">${help}</p>
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
      <button onclick="prevStep()" class="text-[#143d5c]/60 hover:text-[#143d5c] font-semibold text-sm flex items-center gap-1">← Indietro</button>
      <button onclick="nextStep()" ${canNext ? '' : 'disabled'}
              class="btn-coral px-6 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2 ${canNext ? '' : 'opacity-40 cursor-not-allowed'}">
        ${isLast ? 'Vedi il risultato' : 'Prossima'} <span>→</span>
      </button>
    </div>
  `;
}

// ============================================================================
// CANVAS BUILDER (animazione solo sui nodi NUOVI)
// ============================================================================
function buildCanvas() {
  const sector = SECTORS[LabState.sector];
  if (!sector) return '';
  if (LabState.manual.length === 0 && LabState.hours === null && LabState.goal === null) {
    return `<div class="wf-canvas"><div class="wf-empty">↓ Il tuo workflow apparirà qui ↓<br><span class="text-xs opacity-60">a ogni risposta</span></div></div>`;
  }

  let html = '<div class="wf-canvas">';
  const STEP_DELAY = 280;
  let newIndex = 0;

  // Header ore
  if (LabState.hours !== null) {
    const isNew = LabState.prevHours !== LabState.hours;
    const h = HOURS_OPTIONS[LabState.hours].hours;
    const monthly = h * 4;
    const yearly = h * 52;
    const days = Math.round(yearly / 8);
    if (isNew) newIndex++;
    const delay = isNew ? 0 : -1;
    html += `<div class="wf-header" style="${delay >= 0 ? `animation-delay:${delay}ms` : 'animation:none;opacity:1;transform:scale(1);'}">⏰ ${h}h/sett · ${monthly}h/mese · ${days} giornate/anno</div>`;
  }

  // Workflow selezionati
  LabState.manual.forEach((optIdx, wfIdx) => {
    const task = sector.manualTasks[optIdx];
    const isNewTask = !LabState.prevManual.includes(optIdx);

    const sepDelay = isNewTask ? (newIndex * STEP_DELAY) : -1;
    if (isNewTask) newIndex++;
    html += `<div class="wf-block"><div class="wf-node wf-node--sep" style="${sepDelay >= 0 ? `animation-delay:${sepDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);'}">${wfIdx === 0 ? task.title : '+ ' + task.title}</div></div>`;

    task.workflow.forEach((node) => {
      const nodeDelay = isNewTask ? (newIndex * STEP_DELAY) : -1;
      if (isNewTask) newIndex++;
      html += `<div class="wf-arrow" style="${nodeDelay >= 0 ? `animation-delay:${nodeDelay - 40}ms` : 'animation:none;opacity:1;'}"></div>`;
      html += `
        <div class="wf-block">
          <div class="wf-node wf-node--${node.type}" style="${nodeDelay >= 0 ? `animation-delay:${nodeDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);'}">
            <span class="wf-icon">${node.icon}</span>
            <div class="wf-body">
              <div class="wf-label">${node.label}</div>
              ${node.desc ? `<div class="wf-desc">${node.desc}</div>` : ''}
            </div>
            <span class="wf-tag">${node.tag}</span>
          </div>
        </div>
      `;
    });
  });

  // Goal
  if (LabState.goal !== null) {
    const isNewGoal = LabState.prevGoal !== LabState.goal;
    const goal = GOAL_OPTIONS[LabState.goal];
    const goalDelay = isNewGoal ? (newIndex * STEP_DELAY) : -1;
    if (isNewGoal) newIndex++;
    html += `<div class="wf-arrow" style="${goalDelay >= 0 ? `animation-delay:${goalDelay - 40}ms` : 'animation:none;opacity:1;'}"></div>`;
    html += `
      <div class="wf-block">
        <div class="wf-node wf-node--goal" style="${goalDelay >= 0 ? `animation-delay:${goalDelay}ms` : 'animation:none;opacity:1;transform:translateY(0);'}">
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

  LabState.prevManual = [...LabState.manual];
  LabState.prevHours = LabState.hours;
  LabState.prevGoal = LabState.goal;

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
  if (LabState.step === 0 && !LabState.sector) return;
  if (LabState.step === 1 && LabState.manual.length === 0) return;
  if (LabState.step === 2 && LabState.hours === null) return;
  if (LabState.step === 3) { renderResult(); return; }
  LabState.step += 1;
  renderStep();
}

function prevStep() {
  if (LabState.step === 0) { closeLab(); return; }
  LabState.step -= 1;
  renderStep();
}

// ============================================================================
// FINAL RESULT
// ============================================================================
function renderResult() {
  const sector = SECTORS[LabState.sector];
  const h = HOURS_OPTIONS[LabState.hours].hours;
  const yearly = h * 52;
  const days = Math.round(yearly / 8);
  const goalOpt = GOAL_OPTIONS[LabState.goal];
  const activeWorkflows = LabState.manual.length;

  LabState.prevManual = [...LabState.manual];
  LabState.prevHours = LabState.hours;
  LabState.prevGoal = LabState.goal;
  const canvasHtml = buildCanvas();

  document.getElementById('labContent').innerHTML = `
    <div class="mb-4">
      <span class="lab-badge" style="background:rgba(212,167,71,0.18);color:#9a7818;">✅ WORKFLOW COMPLETATO</span>
    </div>

    <h3 class="text-3xl md:text-4xl font-bold text-[#143d5c] leading-tight mb-3">
      ${sector.icon} La tua ${sector.name.toLowerCase()} ti sta rubando <span class="headline-coral">~${h} ore</span> a settimana.
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
        Lasciaci 2 info qui sotto. <strong>In 24 ore</strong> ti mandiamo una proposta su misura per la tua ${sector.name.toLowerCase()} — o ti diciamo onestamente se non siamo il fit giusto.
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
