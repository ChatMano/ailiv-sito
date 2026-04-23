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
    trigger: TR("📱", "Cliente prenota via WhatsApp, Instagram o Google"),
    steps: [
      { q: "Quando il cliente prenota, cosa salvi del contatto?", options: [
        { emoji: "📓", label: "Nome e orario sull'agenda, nient'altro", node: M("👤", "Nome su agenda", "Zero storico") },
        { emoji: "💾", label: "Scheda cliente: numero, coperti, preferenze, allergeni, compleanno", node: AU("🗂️", "Rubrica clienti attiva", "Dati che restano") }
      ]},
      { q: "Lunedì sera la sala è mezza vuota. Cosa fai?", options: [
        { emoji: "🦗", label: "Accetto: i lun-gio sono così, vivo di venerdì-domenica", node: M("📉", "Settimana al 40%", "Solo weekend") },
        { emoji: "📲", label: "WhatsApp ai già-clienti: \"stasera -20% carbonara\" — rubrica segmentata", node: AU("🎯", "Riempi giorni morti", "Usa la rubrica") }
      ]},
      { q: "Cliente che non torna da 45 giorni?", options: [
        { emoji: "🤷", label: "Se ha voglia torna, io non lo so nemmeno", node: M("👻", "Cliente dormiente", "Non lo tracci") },
        { emoji: "💌", label: "Timer a 45gg: parte \"ci manchi, tavolo giovedì?\" col suo piatto preferito", node: AU("🔁", "Richiamo automatico", "Timer + scheda") }
      ]},
      { q: "Compleanno del cliente abituale?", options: [
        { emoji: "🤐", label: "Non lo so, non l'ho mai chiesto", node: M("🎂", "Occasione persa", "Zero dati") },
        { emoji: "🎁", label: "Il sistema sa la data: auguri + tavolo omaggio per 2 in automatico", node: AU("🎂", "Trigger compleanno", "Evento auto") }
      ]}
    ],
    goalLabel: "Lavorare tutta la settimana, non solo dal venerdì alla domenica"
  },

  palestra: {
    name: "Palestra / Fitness", icon: "💪",
    trigger: TR("💬", "Cliente interessato chiede info sull'abbonamento"),
    steps: [
      { q: "Prova gratuita prenotata. Cosa salva il sistema?", options: [
        { emoji: "📝", label: "Annoto nome e giorno su un foglio", node: M("👤", "Zero dati", "Solo nome e ora") },
        { emoji: "🎯", label: "Scheda trial: obiettivo (dimagrire/tonificare), età, infortuni, contatto", node: AU("📋", "Profilo completo", "Dati per chiudere") }
      ]},
      { q: "Trial fatto, non ha firmato entro 48h. Cosa accade?", options: [
        { emoji: "🤞", label: "Aspetto che mi chiami lui, intanto altri entrano", node: M("👻", "Trial fantasma", "60% non firma") },
        { emoji: "📲", label: "WA mirato: \"Marco, com'è andata? Se firmi entro oggi -15% sul 6 mesi\"", node: AU("🔥", "Chiusura guidata", "Trigger 48h") }
      ]},
      { q: "Iscritto che non timbra da 21 giorni?", options: [
        { emoji: "🤷", label: "Paga lo stesso, non me ne accorgo", node: M("💸", "Churn silenzioso", "Disdice a 6 mesi") },
        { emoji: "🚨", label: "Alert dormiente + sessione PT omaggio automatica + rientro guidato", node: AU("💪", "Retention salva", "Alert timer") }
      ]},
      { q: "Abbonamento annuale in scadenza tra 30 giorni?", options: [
        { emoji: "📞", label: "Lo cerco al telefono, se riesco, prima che scada", node: M("⏰", "Rinnovi a singhiozzo", "Corri sul filo") },
        { emoji: "🔁", label: "Timer -30/-15/-7: rinnovo anticipato + sconto fedeltà + upsell PT", node: AU("✅", "Rinnovo auto", "Sequenza programmata") }
      ]}
    ],
    goalLabel: "Ogni iscritto rinnova da solo: abbonamenti annuali la norma, zero churn"
  },

  estetica: {
    name: "Centro estetico", icon: "💆",
    trigger: TR("💆", "Cliente finisce un trattamento (ceretta, laser, viso…)"),
    steps: [
      { q: "La cliente esce dalla cabina. Cosa salva il sistema?", options: [
        { emoji: "📓", label: "Segno sul quadernone cassa, se mi ricordo", node: M("👤", "Niente storico", "Dati persi") },
        { emoji: "💾", label: "Scheda: trattamento fatto, data, ciclo teorico richiamo (ceretta 28gg, viso 45gg)", node: AU("🗂️", "Scheda + timer", "Dati che parlano") }
      ]},
      { q: "5 giorni prima del prossimo ciclo teorico?", options: [
        { emoji: "🤞", label: "Spero che si ricordi lei, altrimenti niente", node: M("🍂", "Mantenimento perso", "Pacchetto a metà") },
        { emoji: "📲", label: "Timer parte: WA custom \"è ora della prossima ceretta gambe, ho giovedì ore 15\"", node: AU("⏰", "Richiamo auto", "Timer + slot") }
      ]},
      { q: "Non ha riprenotato entro 3 giorni dal richiamo?", options: [
        { emoji: "🤷", label: "Pazienza, se non risponde lei niente", node: M("👻", "Cliente persa", "Passa ad altra") },
        { emoji: "💌", label: "Secondo WA: \"ti penso, slot liberi + piccolo sconto questa settimana\"", node: AU("🎁", "Recupero soft", "Seconda mano") }
      ]},
      { q: "Compleanno o cliente VIP pacchetto 10?", options: [
        { emoji: "🤐", label: "Non lo so, non raccolgo queste cose", node: M("🎂", "Zero trigger emotivi", "Nessuna cura") },
        { emoji: "💖", label: "Regalo trattamento flash automatico + auguri personalizzati", node: AU("🎁", "Evento auto", "Fidelity trigger") }
      ]}
    ],
    goalLabel: "Ogni cliente torna al prossimo ciclo senza che io debba chiamare nessuna"
  },

  parrucchiere: {
    name: "Parrucchiere / Barber", icon: "💇",
    trigger: TR("💇", "Cliente finisce taglio/colore e paga alla cassa"),
    steps: [
      { q: "La cliente esce dal salone. Cosa salva il sistema?", options: [
        { emoji: "📓", label: "Solo la ricevuta, niente scheda cliente", node: M("👤", "Zero tracking", "Cliente anonima") },
        { emoji: "💾", label: "Scheda tecnica: colore 7.0 con 10vol, taglio medio, data, ricrescita teorica 28gg", node: AU("🗂️", "Scheda + formula", "Dati tecnici salvi") }
      ]},
      { q: "28 giorni dopo: è ora della ricrescita", options: [
        { emoji: "🤞", label: "Spero torni lei, altrimenti se la fa in zona", node: M("🍂", "Cliente persa", "Ricrescita altrove") },
        { emoji: "📲", label: "WA auto: \"ciao! la tua ricrescita chiama, mercoledì ho slot 10-14\"", node: AU("⏰", "Richiamo 28gg", "Timer su scheda") }
      ]},
      { q: "Un buco di 2 ore martedì pomeriggio?", options: [
        { emoji: "😩", label: "Poltrona ferma, stagista gira a vuoto", node: M("🪑", "Buco + stipendio", "Fatturato zero") },
        { emoji: "⚡", label: "Flash WA alle 20 clienti in scadenza ricrescita: \"offerta slot oggi -15%\"", node: AU("🎯", "Riempi buchi al volo", "Broadcast scheda") }
      ]},
      { q: "Cliente 60gg silenzio, non ha riprenotato?", options: [
        { emoji: "😤", label: "Sarà passata da un'altra, va così", node: M("👻", "Fuga silenziosa", "Jean-Louis David") },
        { emoji: "💌", label: "Sequenza recupero: \"mi manchi\" + foto ultimo look + offerta prossima volta", node: AU("🔁", "Win-back auto", "Fidelity reclaim") }
      ]}
    ],
    goalLabel: "Ogni cliente torna ogni 28-35 giorni: agenda piena a rotazione automatica"
  },

  dentista: {
    name: "Studio dentistico", icon: "🦷",
    trigger: TR("🦷", "Paziente chiede preventivo impianto o ortodonzia"),
    steps: [
      { q: "Preventivo 4.500€ inviato. Cosa salva il sistema?", options: [
        { emoji: "📄", label: "PDF mandato via email, fine", node: M("📂", "Preventivo volante", "Zero tracking") },
        { emoji: "🗂️", label: "Preventivo in pipeline: stato \"inviato\", timer follow-up 3/7/14/30gg, valore 4.500€", node: AU("📊", "Pipeline attiva", "Ogni preventivo tracciato") }
      ]},
      { q: "Paziente \"ci penso\" dopo 7 giorni. E dopo?", options: [
        { emoji: "💤", label: "Lo lascio riflettere, non oso insistere", node: M("📂", "Cassetto per mesi", "Preventivo morto") },
        { emoji: "🎥", label: "Nurture auto: video paziente reale + FAQ odontofobia + opzione finanziamento", node: AU("🔄", "Nurture educativo", "Scalda preventivo") }
      ]},
      { q: "Paziente firma e inizia le cure. 11 mesi dopo?", options: [
        { emoji: "🤞", label: "Spero si ricordi del controllo, altrimenti lo rivedo col dolore", node: M("👻", "Controllo saltato", "Paziente sparito") },
        { emoji: "🔔", label: "Timer 11 mesi: \"è ora del controllo + igiene, slot a settembre\"", node: AU("🦷", "Richiamo annuale", "Trigger automatico") }
      ]},
      { q: "Paziente soddisfatto + sorriso nuovo?", options: [
        { emoji: "🤐", label: "Lo saluto, se mi manda qualcuno è grasso che cola", node: M("👋", "Zero passaparola", "Recensioni scarse") },
        { emoji: "⭐", label: "Richiesta review Google + foto before/after + referral familiari", node: AU("🔗", "Review + referral", "Engine organico") }
      ]}
    ],
    goalLabel: "Ogni preventivo si chiude, ogni paziente torna al controllo senza che io lo chiami"
  },

  medico: {
    name: "Studio medico / Fisio", icon: "🏥",
    trigger: TR("🩹", "Paziente prenota prima visita (fisio, specialista)"),
    steps: [
      { q: "Prima visita fatta. Cosa salva il sistema?", options: [
        { emoji: "📋", label: "Cartella cartacea in armadio, fattura da stampare a mano", node: M("📂", "Cartella carta", "Dati isolati") },
        { emoji: "💾", label: "Anamnesi digitale + piano 10 sedute + timer ogni controllo", node: AU("🗂️", "Cartella + protocollo", "Piano tracciato") }
      ]},
      { q: "Paziente ha fatto 3 sedute su 10 e non si è più prenotato?", options: [
        { emoji: "🤷", label: "Se non richiama amen, ciclo interrotto", node: M("🍂", "Abbandono 70%", "Ciclo perso") },
        { emoji: "📲", label: "Alert: \"come va la lombalgia? mancano 7 sedute, ho martedì alle 10\"", node: AU("🔁", "Aderenza auto", "Recupero percorso") }
      ]},
      { q: "Ciclo completato: cosa succede dopo 6 mesi?", options: [
        { emoji: "🤞", label: "Se sta bene non torna, se sta male sì", node: M("👻", "Paziente perso", "Controllo zero") },
        { emoji: "🔔", label: "Timer 6 mesi: \"check di controllo preventivo, slot riservati\"", node: AU("📅", "Check periodico", "Trigger 6 mesi") }
      ]},
      { q: "Paziente soddisfatto? Review Doctolib/Google?", options: [
        { emoji: "🤐", label: "Non la chiedo, mi imbarazza", node: M("😶", "Zero reputation", "Nuovi lead scarsi") },
        { emoji: "⭐", label: "Richiesta review auto 48h post-ciclo + link Doctolib/Google", node: AU("🌟", "Reputation attiva", "Organic leads") }
      ]}
    ],
    goalLabel: "Ogni paziente completa il ciclo e torna per il controllo senza perdersi"
  },

  studio_pro: {
    name: "Avvocato / Commercialista", icon: "⚖️",
    trigger: TR("📋", "Cliente firma preventivo, la pratica entra nello studio"),
    steps: [
      { q: "Cliente firmato. Sistema cosa fa?", options: [
        { emoji: "📂", label: "Apro una cartella sul Drive e annoto scadenze a memoria", node: M("🗂️", "Pratica disordinata", "Scadenze a rischio") },
        { emoji: "🗃️", label: "Pratica in pipeline + timer scadenze fiscali + checklist documenti", node: AU("📊", "Pratica tracciata", "Deadline automatiche") }
      ]},
      { q: "Scadenza 730 tra 30gg, il cliente non ha ancora mandato i documenti?", options: [
        { emoji: "📧", label: "Lo chiamo a voce quando mi ricordo", node: M("⏰", "Rincorsa doc", "Multa a rischio") },
        { emoji: "🔔", label: "3 solleciti auto (-30/-15/-7gg) con checklist SPID + upload diretto", node: AU("✅", "Dossier in tempo", "Zero ansia") }
      ]},
      { q: "Parcella emessa, 45 giorni passano: cliente non salda?", options: [
        { emoji: "😤", label: "Telefonate imbarazzate, a volte lascio andare", node: M("💸", "Insoluto che pesa", "Fatturato perso") },
        { emoji: "💰", label: "3 solleciti graduali + link pagamento + proposta piano rateale", node: AU("🔁", "Recupero crediti soft", "Incassi puliti") }
      ]},
      { q: "Pratica chiusa. L'anno prossimo il cliente si ricorda di te?", options: [
        { emoji: "🤷", label: "Se gli serve mi richiama, altrimenti va altrove", node: M("👋", "Solo in urgenza", "Relazione intermittente") },
        { emoji: "📅", label: "Scadenziario annuale: 730, IMU, bilancio + aggiornamenti normativi personalizzati", node: AU("🔄", "Cliente a vita", "Relazione sistematica") }
      ]}
    ],
    goalLabel: "Parcelle pagate in 30gg, zero scadenze saltate, clienti che non vanno più altrove"
  },

  immobiliare: {
    name: "Agenzia immobiliare", icon: "🏠",
    trigger: TR("📩", "Lead scrive su annuncio Idealista/Immobiliare.it"),
    steps: [
      { q: "Lead dal portale. Cosa salva il sistema?", options: [
        { emoji: "📞", label: "Chiamo io, se risponde prendo appunti", node: M("📝", "Qualifica a naso", "80% curiosi") },
        { emoji: "🎯", label: "Form auto qualifica: budget, mutuo pre-approvato, zone, tempi, priorità", node: AU("📊", "Seri vs turisti", "Lead in pipeline") }
      ]},
      { q: "Lead qualificato ha visto 3 immobili e tentenna?", options: [
        { emoji: "🤞", label: "Attendo che mi richiami, magari ha cambiato idea", node: M("👻", "Lead freddo", "Compra altrove") },
        { emoji: "🏠", label: "Nurture: 3 nuovi immobili compatibili + simulazione mutuo + urgenza mercato", node: AU("🔄", "Rinurturing", "Lead caldo mantenuto") }
      ]},
      { q: "Proposta firmata: fino al rogito quanti step?", options: [
        { emoji: "📞", label: "Lo accompagno a voce, a step, speriamo ricordi tutto", node: M("😰", "Rogito a rischio", "Cliente disperso") },
        { emoji: "🗓️", label: "Timeline automatica: perizia → mutuo → preliminare → notaio, con promemoria e documenti", node: AU("✅", "Cliente al rogito", "Zero perdite") }
      ]},
      { q: "Dopo il rogito: recensione + referral?", options: [
        { emoji: "🤐", label: "Chiavi consegnate, saluto, sparisce", node: M("🚪", "Review zero", "Passaparola zero") },
        { emoji: "🔗", label: "Trigger rogito+7gg: auguri + review + offerta ristrutturazione/arredamento partner + referral", node: AU("⭐", "Referral engine", "Lead caldi da clienti") }
      ]}
    ],
    goalLabel: "Ogni lead del portale arriva al rogito, zero perdite al concorrente"
  },

  auto: {
    name: "Autosalone / Officina", icon: "🚗",
    trigger: TR("🔧", "Cliente porta l'auto per tagliando / riparazione"),
    steps: [
      { q: "Auto in ponte, lavoro finito. Cosa salva il sistema?", options: [
        { emoji: "📄", label: "Fattura stampata, archivio cartaceo in ufficio", node: M("🗃️", "Zero scheda auto", "Storico perso") },
        { emoji: "💾", label: "Scheda auto targa+telaio: km attuali, interventi, gomme, prossimo tagliando a 15.000km", node: AU("🚙", "Scheda auto viva", "Storico digitale") }
      ]},
      { q: "Ottobre, inizia la stagione gomme invernali?", options: [
        { emoji: "📬", label: "Volantino generico in officina, chi entra lo vede", node: M("🪧", "Marketing a pioggia", "Conversione bassa") },
        { emoji: "🎯", label: "WA mirato: \"La tua Panda targa XY chiede le gomme M+S, promo 299€ montate\"", node: AU("📲", "Targeting personale", "Upsell stagionale") }
      ]},
      { q: "10 mesi dal tagliando, km stimati vicini alla soglia?", options: [
        { emoji: "🤞", label: "Spero torni prima di andare da un concorrente", node: M("👻", "Perso in catena", "Bosch / Norauto") },
        { emoji: "🔔", label: "Timer km+data: \"tagliando in scadenza, slot lunedì 10:00, auto muletto disponibile\"", node: AU("⚡", "Richiamo auto", "Trigger km") }
      ]},
      { q: "Revisione in scadenza per la sua auto?", options: [
        { emoji: "🤷", label: "Dovrebbe saperlo lui, è sul libretto", node: M("📚", "Occasione persa", "Va dal primo") },
        { emoji: "🗓️", label: "Timer revisione -60/-30gg: \"prenota qui, evita multa\"", node: AU("✅", "Revisione guidata", "Calendar auto") }
      ]}
    ],
    goalLabel: "Ogni auto che è passata qui torna per tagliando, gomme, revisione: retention al 90%"
  },

  retail: {
    name: "Negozio / Retail", icon: "🛍️",
    trigger: TR("🛍️", "Cliente acquista in negozio o chiede info su IG"),
    steps: [
      { q: "Cliente acquista: cosa salva il sistema?", options: [
        { emoji: "🧾", label: "Scontrino, fine. Nemmeno il nome", node: M("👤", "Cliente anonimo", "Acquisto isolato") },
        { emoji: "💾", label: "Scheda: taglia, marche preferite, colore, budget, occasioni (matrimoni, regali)", node: AU("🗂️", "Profilo gusto", "Dati per targeting") }
      ]},
      { q: "DM IG: \"c'è ancora quel vestito in 42?\"", options: [
        { emoji: "😮‍💨", label: "Rispondo a voce, tra un cliente e l'altro", node: M("📵", "Risposta lenta", "Spesso persa") },
        { emoji: "📸", label: "Foto capo + taglie + \"te lo metto da parte 48h, vieni a provarlo giovedì\"", node: AU("🏬", "DM in vetrina", "Hold + reminder") }
      ]},
      { q: "Nuova collezione in arrivo?", options: [
        { emoji: "📣", label: "Post IG generico per tutti", node: M("📢", "Conversione bassa", "Risposta tiepida") },
        { emoji: "💌", label: "Anteprima privata ai clienti VIP filtrata per taglia/stile + sneak peek 48h prima", node: AU("🎟️", "Preview VIP", "Segmentazione scheda") }
      ]},
      { q: "Cliente abituale sparita da 60gg?", options: [
        { emoji: "🤷", label: "Sarà passata a Zalando, pazienza", node: M("📉", "Cliente persa", "LTV fermo") },
        { emoji: "🔁", label: "Win-back: \"capo perfetto per te appena arrivato + sconto VIP 15%\"", node: AU("🎁", "Riattivazione mirata", "Basata su gusti") }
      ]}
    ],
    goalLabel: "Ogni cliente che compra una volta torna a ogni cambio di stagione"
  },

  ecommerce: {
    name: "E-commerce / Online", icon: "🛒",
    trigger: TR("🛒", "Visitatore aggiunge prodotto al carrello"),
    steps: [
      { q: "Esce dal sito senza pagare. Cosa accade?", options: [
        { emoji: "😤", label: "Niente, il 70% abbandona, è statistica", node: M("📉", "Carrello perso", "CPA bruciato") },
        { emoji: "📧", label: "Dopo 1h: email recovery #1 con foto prodotti + checkout diretto", node: AU("🔔", "Recovery auto 1h", "Trigger abbandono") }
      ]},
      { q: "24h passano, ancora non compra?", options: [
        { emoji: "🤷", label: "Abbandono definitivo, passo al prossimo", node: M("💸", "Click ads perso", "Budget bruciato") },
        { emoji: "⏳", label: "Email #2: coupon -10% scadenza 24h + urgency + social proof", node: AU("🎯", "Recovery + urgency", "Sequenza 24h") }
      ]},
      { q: "Ordine consegnato: fine o inizio?", options: [
        { emoji: "📦", label: "Spedito, rapporto finito", node: M("🚪", "Cliente one-shot", "LTV minimo") },
        { emoji: "⭐", label: "+3gg: tracking proattivo + review auto + UGC incentivato", node: AU("📬", "Post-delivery attivo", "Review + content") }
      ]},
      { q: "Cliente ha comprato una volta, 45gg di silenzio?", options: [
        { emoji: "👋", label: "Pazienza, compra altrove", node: M("📉", "Zero second order", "AOV piatto") },
        { emoji: "🎁", label: "Win-back AI: cross-sell top seller basato su acquisto + coupon ritorno", node: AU("🔁", "Second order auto", "LTV triplicato") }
      ]}
    ],
    goalLabel: "Ogni cliente compra 3 volte invece di una: LTV triplicato, CPA dimezzato"
  },

  hotel: {
    name: "Hotel / B&B", icon: "🏨",
    trigger: TR("🏨", "Ospite prenota via Booking / Expedia / sito"),
    steps: [
      { q: "Guest prenotato da Booking: cosa fa il sistema?", options: [
        { emoji: "📧", label: "Email conferma generica del PMS, fine", node: M("📝", "Guest anonimo", "100% di Booking") },
        { emoji: "📲", label: "Recupera email reale dall'ospite + salva in rubrica + tag sorgente OTA", node: AU("🗂️", "Rubrica guest attiva", "Contatto mio, non di OTA") }
      ]},
      { q: "72h prima del check-in?", options: [
        { emoji: "🔕", label: "Niente, arriva quando arriva", node: M("🛎️", "Arrivo freddo", "Coda reception 22:00") },
        { emoji: "✉️", label: "Welcome kit: itinerario city, orari colazione, upsell transfer/parking/late-checkout", node: AU("🗺️", "Pre-stay esperienziale", "ADR +15%") }
      ]},
      { q: "Dopo il check-out: come catturi review e return?", options: [
        { emoji: "👋", label: "Saluto e camera si pulisce per il prossimo", node: M("🚪", "Guest sparito", "Solo review Booking") },
        { emoji: "⭐", label: "+4h: review Google diretto + codice sconto 10% per tornare diretto (no OTA)", node: AU("💎", "Review + win-back", "Bypass commissione") }
      ]},
      { q: "1 anno dopo il soggiorno: come torni a parlarci?", options: [
        { emoji: "🤐", label: "Niente, se si ricorda torna", node: M("🍂", "Return guest = 0", "Ricomincia da Booking") },
        { emoji: "🎂", label: "Timer anniversario: \"un anno fa eri qui, tariffa riservata + colazione omaggio\"", node: AU("💕", "Return guest diretto", "Trigger stagionale") }
      ]}
    ],
    goalLabel: "50% delle prenotazioni diretto sul sito (addio commissione Booking)"
  },

  bar: {
    name: "Bar / Pasticceria", icon: "☕",
    trigger: TR("🎂", "Cliente chiede torta comunione/matrimonio o catering"),
    steps: [
      { q: "Ordine da 300€ in arrivo: cosa blinda il sistema?", options: [
        { emoji: "🤝", label: "Parola data a voce, preparo lo stesso", node: M("🎲", "Rischio annullamento", "Lavoro perso") },
        { emoji: "💳", label: "Caparra 30% online + conferma auto + scheda evento (data, persone, stile)", node: AU("🔒", "Ordine blindato", "Impegno vero") }
      ]},
      { q: "Cliente colazione abituale non si vede da 2 settimane?", options: [
        { emoji: "🤷", label: "Forse ha cambiato lavoro, pace", node: M("☕", "Cappuccino mensile perso", "Mai più rivisto") },
        { emoji: "📲", label: "Rubrica fedeli + WA: \"il tuo cappuccino di sempre + brioche omaggio oggi\"", node: AU("💌", "Riattivazione abituale", "Timer 14gg") }
      ]},
      { q: "Ordine consegnato per comunione/matrimonio?", options: [
        { emoji: "👋", label: "Arrivederci e grazie, fine", node: M("📦", "Evento chiuso", "Zero visibilità") },
        { emoji: "📸", label: "+24h: foto torta + richiesta review + codice amico 10% per referral", node: AU("⭐", "Review + referral", "Amici della sposa") }
      ]},
      { q: "Eventi stagionali (Natale, Pasqua, Festa della mamma)?", options: [
        { emoji: "🪧", label: "Vetrina con esposizione + chi entra vede", node: M("🚪", "Campagna passiva", "Incasso piatto") },
        { emoji: "🎁", label: "WA ai clienti catering: \"prenotazioni panettoni/colombe aperte, listino + early bird\"", node: AU("🎯", "Pre-order stagionale", "Forecast produzione") }
      ]}
    ],
    goalLabel: "Ordini catering blindati + abituali che tornano ogni mattina senza saltare"
  },

  wedding: {
    name: "Wedding planner / Eventi", icon: "🎊",
    trigger: TR("💍", "Coppia chiede preventivo matrimonio"),
    steps: [
      { q: "Coppia appena fidanzata scrive. Cosa fa il sistema?", options: [
        { emoji: "📨", label: "Invio PDF pacchetti quando trovo tempo", node: M("⏰", "Preventivo tardivo", "Si raffreddano") },
        { emoji: "🎨", label: "Qualifica: data, budget, stile, numero invitati → portfolio mirato + caparra consulenza", node: AU("📋", "Qualifica automatica", "Solo sposi seri") }
      ]},
      { q: "Consulenza fatta, 7gg di silenzio dalla coppia?", options: [
        { emoji: "🤞", label: "Aspetto che si facciano vivi, non voglio essere pressante", node: M("👻", "Ghosting", "Preventivo perso") },
        { emoji: "💌", label: "Nurture 3 email in 14gg: real wedding + testimonial + urgenza data", node: AU("🔄", "Recupero indecisi", "Sequenza auto") }
      ]},
      { q: "Contratto firmato: 12 mesi fino al matrimonio. Come li gestisci?", options: [
        { emoji: "📞", label: "Chiamate periodiche quando mi ricordo", node: M("🗓️", "Organizzazione caotica", "Sposi ansiosi") },
        { emoji: "✅", label: "Timeline milestones: -12/-6/-3/-1 mese con checklist fornitori + update sposi", node: AU("📋", "Timeline automatica", "Sposi sereni") }
      ]},
      { q: "Dopo il matrimonio: referral amici e nuovi eventi?", options: [
        { emoji: "👰", label: "Grazie, auguri, a volte mandano una coppia amica", node: M("🚪", "Referral sporadico", "Un wedding a volta") },
        { emoji: "💕", label: "Anniversario 1 anno + bonus referral coppie amiche + proposta battesimo/compleanni", node: AU("🔗", "Referral engine", "Cliente a vita eventi") }
      ]}
    ],
    goalLabel: "Sposi felici = referral amici = agenda piena 18 mesi avanti"
  },

  fotografo: {
    name: "Fotografo", icon: "📷",
    trigger: TR("💍", "Sposi chiedono preventivo matrimonio via DM"),
    steps: [
      { q: "Sposi firmano contratto. Cosa salva il sistema?", options: [
        { emoji: "📝", label: "Caparra su bonifico, data annotata sul calendario Google", node: M("📓", "Poco strutturato", "Cliente one-shot") },
        { emoji: "🗂️", label: "Scheda coppia: data nozze, anniversario, location, stile, +1 anno promemoria famiglia", node: AU("💍", "Cliente a vita", "Dati ricorrenti") }
      ]},
      { q: "2 mesi di editing dopo le nozze, sposi in attesa?", options: [
        { emoji: "🔕", label: "Silenzio, consegno quando finisco", node: M("⏳", "Sposi ansiosi", "Engagement zero") },
        { emoji: "📸", label: "Sneak peek 15gg: 5 foto teaser + cover + social tag strategici", node: AU("✨", "Engagement vivo", "Hype pre-gallery") }
      ]},
      { q: "Gallery consegnata: upsell album e stampe?", options: [
        { emoji: "📭", label: "Link Pixieset e buona visione, fine", node: M("🚪", "Zero upsell", "LTV bloccato") },
        { emoji: "📖", label: "Gallery privata + review + proposta album fine art 800€ entro 30gg", node: AU("💎", "Upsell album", "Review + vendita") }
      ]},
      { q: "1 anno dopo: anniversario, gravidanza, newborn?", options: [
        { emoji: "🌫️", label: "Se si ricordano mi chiamano loro", node: M("👻", "Cliente perso", "One-shot") },
        { emoji: "🎂", label: "Timer annuale: auguri anniversario + proposta family shooting + newborn package", node: AU("🔁", "Cliente ricorrente", "Famiglia che cresce") }
      ]}
    ],
    goalLabel: "Sposi oggi, famiglia domani, nonni tra 10 anni: cliente per la vita"
  },

  psicologo: {
    name: "Psicologo / Counselor", icon: "🧠",
    trigger: TR("📩", "Persona scrive per primo colloquio"),
    steps: [
      { q: "Primo contatto: cosa fa il sistema (rispettoso)?", options: [
        { emoji: "🤲", label: "Rispondo quando riesco, con calma, tra una seduta e l'altra", node: M("📝", "Risposta a mano", "Paziente in ansia") },
        { emoji: "💬", label: "Accoglienza immediata + info approccio + scheda privata cifrata", node: AU("🌱", "Accoglienza etica", "Privacy-first") }
      ]},
      { q: "Primo colloquio fissato: cosa salva il sistema?", options: [
        { emoji: "📓", label: "Nota mentale + calendario personale", node: M("🗃️", "Dati sparsi", "Zero continuità") },
        { emoji: "🔒", label: "Cartella clinica digitale (GDPR) + patto terapeutico firmato + piano sedute", node: AU("📋", "Cartella sicura", "Tutto in un posto") }
      ]},
      { q: "Paziente salta una seduta e tace?", options: [
        { emoji: "📵", label: "Lo richiamo dopo qualche giorno, se mi ricordo", node: M("📞", "Recupero manuale", "A volte lo dimentico") },
        { emoji: "❤️‍🩹", label: "Messaggio delicato non giudicante + spazio aperto + slot riservato", node: AU("🤝", "Riaggancio empatico", "Nessuna pressione") }
      ]},
      { q: "Percorso concluso: e dopo 6 mesi?", options: [
        { emoji: "🚪", label: "Chiudo, lascio la persona al suo cammino", node: M("👋", "Porta chiusa", "Zero cura long-term") },
        { emoji: "🌱", label: "Check-in gentile a 6-12 mesi: \"come stai? qui se serve\"", node: AU("💚", "Porta aperta", "Cura nel tempo") }
      ]}
    ],
    goalLabel: "Ogni paziente accompagnato con rispetto, dal primo \"scusi...\" al ritorno quando serve"
  },

  scuola: {
    name: "Scuola / Formazione", icon: "🎓",
    trigger: TR("📚", "Studente si iscrive al corso base"),
    steps: [
      { q: "Iscrizione firmata: cosa salva il sistema?", options: [
        { emoji: "📝", label: "Cartaceo in segreteria + bonifico da incassare", node: M("📄", "Tempi lunghi", "Studente aspetta") },
        { emoji: "🗂️", label: "Scheda studente: obiettivo, livello, preferenze, pagamento + welcome kit auto", node: AU("📬", "Onboarding digitale", "Studente pronto") }
      ]},
      { q: "Prime 2 lezioni: studente è poco attivo?", options: [
        { emoji: "😶", label: "Già incassata la retta, se sparisce non mi accorgo", node: M("🪑", "Drop-out invisibile", "Review negativa") },
        { emoji: "🚨", label: "Alert tutor + check-in studente + materiali extra + buddy system", node: AU("🛟", "Anti drop-out", "Recupero mirato") }
      ]},
      { q: "Metà corso: studente è in difficoltà o indietro?", options: [
        { emoji: "🤷", label: "Se chiede aiuto rispondo, altrimenti vado avanti", node: M("🌫️", "Frustrazione silente", "Non finisce") },
        { emoji: "📈", label: "Progress tracker + feedback tutor + tutoring individuale se pattern in peggioramento", node: AU("🎯", "Attenzione precoce", "Recupero in tempo") }
      ]},
      { q: "Fine corso base: come porto al livello avanzato?", options: [
        { emoji: "👋", label: "Certificato, saluto, ex-studente a vita", node: M("🎓", "Upsell 0%", "Relazione finita") },
        { emoji: "🏆", label: "Review Google + sconto early bird livello intermedio + open day avanzato", node: AU("📈", "Continuità naturale", "Upsell 40-60%") }
      ]}
    ],
    goalLabel: "Retention 80%: ogni studente finisce il corso e si iscrive al livello successivo"
  },

  coach: {
    name: "Personal trainer / Coach", icon: "🏃",
    trigger: TR("🏁", "Cliente firma primo mese di coaching"),
    steps: [
      { q: "Cliente partito: cosa salva il sistema dal giorno 1?", options: [
        { emoji: "📋", label: "Appunti su block-notes, peso di base su foglio", node: M("📝", "Dati sparsi", "Zero tracking") },
        { emoji: "🗂️", label: "Scheda: obiettivo, peso, misure, foto, infortuni, date sessioni, timer check-in", node: AU("📊", "Tracciamento vivo", "Base scientifica") }
      ]},
      { q: "2 settimane dentro, cliente poco presente / demotivato?", options: [
        { emoji: "😮‍💨", label: "Aspetto la prossima sessione, vedo come va", node: M("📉", "Drop silenzioso", "Niente rinnovo") },
        { emoji: "📲", label: "Alert: \"ciao! vediamoci 10 min mercoledì, piccolo cambio piano\" + audio motivazionale", node: AU("🔥", "Recupero motivazione", "Pattern detection") }
      ]},
      { q: "Fine primo mese: come chiudi il rinnovo?", options: [
        { emoji: "🤞", label: "Se le va continua, altrimenti amen", node: M("💔", "Churn mese 2", "Cliente instabile") },
        { emoji: "📈", label: "Report progressi (foto/misure/grafico) + proposta 3 mesi transformation -15%", node: AU("💪", "Chiusura guidata", "LTV triplicato") }
      ]},
      { q: "Cliente con trasformazione visibile: come lo trasformi in testimonial?", options: [
        { emoji: "🤐", label: "Non la chiedo, non mi piace pressare", node: M("🫥", "Testimonial zero", "Referral zero") },
        { emoji: "✨", label: "Auto-pack foto before/after + consenso + referral bonus amici + post social", node: AU("🎯", "Testimonial oro", "Engine referral") }
      ]}
    ],
    goalLabel: "Ogni cliente arriva alla transformation 3 mesi + diventa testimonial + porta amici"
  },

  nail_tatto: {
    name: "Nail / Tatuatore", icon: "💅",
    trigger: TR("💅", "Cliente finisce seduta unghie / tatuaggio"),
    steps: [
      { q: "Cliente paga e va via. Cosa salva il sistema?", options: [
        { emoji: "📓", label: "Segno sul quaderno a cassa", node: M("👤", "Zero scheda", "Portfolio muto") },
        { emoji: "💾", label: "Scheda: tipo servizio (refill gel / tattoo grande), data, timer mantenimento 25/40gg, foto", node: AU("📸", "Scheda + foto + timer", "Portfolio auto") }
      ]},
      { q: "25gg dopo nail / 40gg dopo tattoo ritocco?", options: [
        { emoji: "🤞", label: "Se torna torna, altrimenti pace", node: M("🌬️", "Infedeltà silente", "Va da altra") },
        { emoji: "📲", label: "Timer: \"è ora del rifill/ritocco, ho giovedì ore 15 - solo per te\"", node: AU("⏰", "Richiamo custom", "Fedeltà ciclica") }
      ]},
      { q: "Un buco di 2 ore improvviso in agenda?", options: [
        { emoji: "😩", label: "Lavoro perso, agenda vuota = fatturato vuoto", node: M("🪑", "Ora buca", "Zero incasso") },
        { emoji: "⚡", label: "Flash WA alle 20 clienti in \"scadenza mantenimento\": \"slot oggi, -15%\"", node: AU("🎯", "Riempi buchi", "Broadcast mirato") }
      ]},
      { q: "Compleanno cliente fedele?", options: [
        { emoji: "🤐", label: "Non lo so, non raccolgo le date", node: M("🎂", "Zero trigger", "Occasione persa") },
        { emoji: "🎁", label: "Timer data nascita: auguri + manicure/ritocco omaggio entro il mese", node: AU("💝", "Evento auto", "Fidelity emotiva") }
      ]}
    ],
    goalLabel: "Agenda piena 3 settimane avanti + clienti che non vanno più da un'altra artist"
  },

  pet: {
    name: "Toelettatura / Pet", icon: "🐾",
    trigger: TR("🐾", "Cliente porta il cane per bagno + taglio"),
    steps: [
      { q: "Fine servizio, padrone ritira il cane. Cosa salva il sistema?", options: [
        { emoji: "📓", label: "Ricevuta e basta, niente scheda animale", node: M("👤", "Zero scheda", "Cliente anonimo") },
        { emoji: "🗂️", label: "Scheda: nome cane, razza, taglia, data, tipo pelo, timer bagno 5 sett, foto finale", node: AU("📋", "Scheda animale", "Richiamo automatico") }
      ]},
      { q: "5 settimane dopo il bagno?", options: [
        { emoji: "🤞", label: "Spero che il padrone si ricordi, spesso non succede", node: M("👻", "Padrone sparito", "Dopo 2-3 bagni va altrove") },
        { emoji: "📲", label: "Timer: \"Luna chiede il suo bagno, giovedì ho slot ore 10 - solo per voi\"", node: AU("⏰", "Richiamo auto", "Fidelizzazione") }
      ]},
      { q: "Primo bagno di un cucciolo (padrone in ansia)?", options: [
        { emoji: "🤷", label: "Rassicuro a voce, speriamo vada bene", node: M("😟", "Padrone in ansia", "Fiducia fragile") },
        { emoji: "🎥", label: "Pre-visita: video what-to-expect + foto live durante bagno + video del taglio", node: AU("📸", "Padrone tranquillo", "Onboarding emotivo") }
      ]},
      { q: "Compleanno cane o Natale?", options: [
        { emoji: "🤐", label: "Non lo raccolgo, non saprei", node: M("🎂", "Occasione zero", "Generico") },
        { emoji: "🎁", label: "Timer compleanno cane: auguri + biscottino omaggio + pettinata gratis", node: AU("🐶", "Evento emotivo", "Fidelity pet owner") }
      ]}
    ],
    goalLabel: "Ogni cane che entra qui ritorna ogni 5 settimane come un orologio"
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
