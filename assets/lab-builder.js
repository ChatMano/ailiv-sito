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
    trigger: TR("📱", "DM Instagram: \"avete posto stasera?\""),
    steps: [
      { q: "Arriva la richiesta in pieno servizio. Tu?", options: [
        { emoji: "😵", label: "Rispondo tra un tavolo e l'altro, se non mi sfugge", node: M("📵", "Messaggio perso", "DM ignorata") },
        { emoji: "⚡", label: "AI risponde in 30s: menù, allergeni, parcheggio", node: AU("💬", "Risposta immediata", "AI 24/7") }
      ]},
      { q: "Tavolo da 8 sabato sera. Come lo blocchi?", options: [
        { emoji: "📞", label: "A voce, segno sull'agenda e incrocio le dita", node: M("🎲", "Rischio no-show", "Agenda carta") },
        { emoji: "🔒", label: "Link prenotazione con acconto/carta a garanzia", node: AU("💳", "Coperti garantiti", "No-show -80%") }
      ]},
      { q: "Lunedì sera, sala mezza vuota. Che fai?", options: [
        { emoji: "🦗", label: "Niente, spero entri qualcuno dalla strada", node: M("🪑", "Sala vuota", "Zero traffico") },
        { emoji: "🎯", label: "WhatsApp agli affezionati: \"stasera -20% sul menù\"", node: AU("📲", "Riempi giorni morti", "Campagna WA") }
      ]},
      { q: "Il cliente ha pagato e se n'è andato. Poi?", options: [
        { emoji: "🤞", label: "Spero si ricordi di noi e lasci una recensione", node: M("👻", "Cliente sparito", "Zero follow-up") },
        { emoji: "⭐", label: "Richiesta Google automatica + coupon per farlo tornare", node: AU("🔁", "Recensione + ritorno", "Review funnel") }
      ]}
    ],
    goalLabel: "Dal DM alla recensione: coperti pieni, no-show zero"
  },

  palestra: {
    name: "Palestra / Fitness", icon: "💪",
    trigger: TR("💬", "Richiesta info abbonamento su WhatsApp"),
    steps: [
      { q: "Come gestisci la richiesta info in sala?", options: [
        { emoji: "📱", label: "Rispondo tra una scheda e l'altra, quando stacco dai soci", node: M("⏰", "Risposte a ore sparse", "Lead freddo") },
        { emoji: "🤖", label: "Bot manda listino 3/6/12 mesi e prenota prova gratuita", node: AU("🎟️", "Listino + trial auto", "Prova prenotata") }
      ]},
      { q: "Prova gratuita fatta: come la chiudi in abbonamento?", options: [
        { emoji: "🤞", label: "Gli dico \"fammi sapere\" e aspetto che torni lui", node: M("👻", "Trial che sparisce", "60% non firma") },
        { emoji: "📅", label: "Follow-up + body check + offerta 6 mesi entro 48h", node: AU("✍️", "Chiusura guidata", "Trial to member") }
      ]},
      { q: "Posto nel corso collettivo disdetto 2h prima?", options: [
        { emoji: "😬", label: "Sala mezza vuota, istruttore pagato uguale", node: M("🪑", "Posto bruciato", "Margine perso") },
        { emoji: "🔄", label: "Lista d'attesa avvisata in automatico, posto riempito", node: AU("⚡", "Riallocazione auto", "Sala piena") }
      ]},
      { q: "Iscritto pagante che non timbra da 3 settimane?", options: [
        { emoji: "🤷", label: "Lascio stare, paga lo stesso finché non disdice", node: M("💸", "Churn silenzioso", "Disdetta a 6 mesi") },
        { emoji: "💪", label: "Alert dormiente + sessione PT omaggio + rientro guidato", node: AU("🔥", "Riattivazione auto", "Retention salva") }
      ]}
    ],
    goalLabel: "Da richiesta info ad abbonato fidelizzato"
  },

  estetica: {
    name: "Centro estetico", icon: "💆",
    trigger: TR("💬", "Chiede prezzo trattamento su WhatsApp o Insta"),
    steps: [
      { q: "Chiede info su un protocollo?", options: [
        { emoji: "😮‍💨", label: "Rispondo a voce libera, tra una cabina e l'altra", node: M("📝", "Risposta a mano", "Tempo perso") },
        { emoji: "📲", label: "Listino + foto prima/dopo + invito a consulenza viso", node: AU("✨", "Scheda + portfolio", "Consulenza auto") }
      ]},
      { q: "Come blocca l'appuntamento?", options: [
        { emoji: "📓", label: "Telefonata e segno sull'agenda cartacea", node: M("☎️", "Agenda cartacea", "Rischio doppio") },
        { emoji: "💳", label: "Prenota online con caparra, niente cabina bloccata gratis", node: AU("🔒", "Booking + caparra", "No buchi") }
      ]},
      { q: "E se non si presenta in cabina?", options: [
        { emoji: "😤", label: "Sparisce senza avvisare, cabina ferma un'ora", node: M("🚪", "No-show in cabina", "Cabina vuota") },
        { emoji: "⏰", label: "Reminder 48h e 2h, recupero posto su lista attesa", node: AU("📤", "Reminder + waitlist", "Slot salvo") }
      ]},
      { q: "Dopo la seduta la fai rientrare?", options: [
        { emoji: "🤞", label: "Spero torni per il mantenimento, non richiamo", node: M("🍂", "Cliente sparita", "Pacchetto a metà") },
        { emoji: "🌿", label: "Richiamo mantenimento, recensione, auguri compleanno", node: AU("💖", "Fidelizza + review", "Ciclo chiuso") }
      ]}
    ],
    goalLabel: "Dalla richiesta Insta al ciclo di mantenimento completato"
  },

  parrucchiere: {
    name: "Parrucchiere / Barber", icon: "💇",
    trigger: TR("💬", "DM: \"quanto costa le mèches? oggi ce la fate?\""),
    steps: [
      { q: "Chi risponde al preventivo in DM?", options: [
        { emoji: "📱", label: "Titolare legge tra una tinta e l'altra, risponde a sera", node: M("📵", "DM a fine turno", "Lead freddo") },
        { emoji: "⚡", label: "Bot manda listino mèches + slot + caparra online", node: AU("💬", "Preventivo 24/7", "Risposta in 1 min") }
      ]},
      { q: "Cliente che molla per la catena low-cost?", options: [
        { emoji: "😤", label: "Te ne accorgi quando non torna per la ricrescita", node: M("🍂", "Fuga silenziosa", "Ricrescita altrove") },
        { emoji: "🎯", label: "Se salta 45gg parte WhatsApp col tuo nome", node: AU("📲", "Anti-Jean-Louis", "Richiamo 45gg") }
      ]},
      { q: "1h prima: \"scusa non posso venire\"", options: [
        { emoji: "😩", label: "Poltrona ferma 2h, stagista gira a vuoto", node: M("🪑", "Buco + stagista", "Fatturato perso") },
        { emoji: "🔒", label: "Caparra trattiene + lista d'attesa riempie lo slot", node: AU("💳", "Slot salvato", "Caparra + waitlist") }
      ]},
      { q: "Dopo piega e cofanetto, il richiamo?", options: [
        { emoji: "👋", label: "\"Ci vediamo!\" e speri che la ricrescita la riporti qui", node: M("🚪", "Addio alla porta", "Zero follow-up") },
        { emoji: "⭐", label: "Recensione Google + richiamo ritocco su scheda tecnica", node: AU("💇", "Review + ritocco", "Fidelity ricrescita") }
      ]}
    ],
    goalLabel: "Dalla DM \"quanto costa\" alla cliente fissa ogni 35gg"
  },

  dentista: {
    name: "Studio dentistico", icon: "🦷",
    trigger: TR("🦷", "Richiesta preventivo impianto o ortodonzia"),
    steps: [
      { q: "Chi risponde al primo contatto?", options: [
        { emoji: "📞", label: "Segretaria tra una poltrona e l'altra, spesso richiama tardi", node: M("⏰", "Richiamo in ritardo", "Lead perso") },
        { emoji: "🤖", label: "Risposta immediata + anamnesi base e filtro urgenze", node: AU("📋", "Triage anamnesi", "Qualifica auto") }
      ]},
      { q: "Il preventivo chirurgico che fine fa?", options: [
        { emoji: "💤", label: "Paziente \"ci penso\", preventivo nel cassetto per mesi", node: M("📂", "Preventivo fermo", "Nel cassetto") },
        { emoji: "🎥", label: "Nurture con video casi, FAQ odontofobia, finanziamento", node: AU("🔄", "Nurture educativo", "Scalda paziente") }
      ]},
      { q: "Poltrona libera ma paziente non arriva?", options: [
        { emoji: "😤", label: "Igienista ferma, utenze accese, buco da 200€", node: M("🪑", "Poltrona vuota", "200€ persi") },
        { emoji: "⏰", label: "Promemoria 48h + 2h con conferma e recupero slot", node: AU("✅", "Conferma + recupero", "Salva slot") }
      ]},
      { q: "Controllo periodico e profilassi annuale?", options: [
        { emoji: "🤞", label: "Spero se lo ricordi, altrimenti torna col dolore", node: M("👻", "Paziente perso", "Drop-out") },
        { emoji: "🦷", label: "Richiamo auto 6/12 mesi + richiesta recensione", node: AU("🔔", "Richiamo + review", "Fidelizza") }
      ]}
    ],
    goalLabel: "Dal preventivo accettato al controllo periodico ricorrente"
  },

  medico: {
    name: "Studio medico / Fisio", icon: "🏥",
    trigger: TR("🩹", "Paziente chiama per lombalgia, chiede prima visita"),
    steps: [
      { q: "Ti squilla il telefono durante una seduta. Cosa succede?", options: [
        { emoji: "😤", label: "Interrompo la tecar, rispondo io o salta la chiamata", node: M("📵", "Centralino intasato", "Paziente perso") },
        { emoji: "🤖", label: "Bot risponde, fa triage rosso/giallo/verde, prende dati", node: AU("📋", "Triage H24", "Qualifica auto") }
      ]},
      { q: "Come fissi la prima visita e il no-show?", options: [
        { emoji: "📋", label: "Segretaria su agenda cartacea, no-show 30-40%", node: M("📖", "Agenda carta", "Buchi slot") },
        { emoji: "📅", label: "Booking online + reminder SMS + caparra", node: AU("🔒", "Doctolib sync", "Conferma + caparra") }
      ]},
      { q: "Anamnesi e consensi prima che il paziente entri?", options: [
        { emoji: "📝", label: "Fogli in sala d'attesa, compila lì al momento", node: M("🖊️", "Anamnesi carta", "Tempo perso") },
        { emoji: "📲", label: "Modulo digitale pre-compilato + consenso firmato", node: AU("✅", "Scheda pronta", "Pre-consegna") }
      ]},
      { q: "Paziente fa 3 sedute su 10 prescritte e sparisce. Tu?", options: [
        { emoji: "🤷", label: "Se non richiama pazienza, ciclo interrotto", node: M("🍂", "Abbandono ciclo", "Drop 70%") },
        { emoji: "🔔", label: "Sequenza recall + controllo 6 mesi automatico", node: AU("🎯", "Aderenza ciclo", "Recall auto") }
      ]}
    ],
    goalLabel: "Aderenza al ciclo: da 3 sedute a protocollo completo"
  },

  studio_pro: {
    name: "Avvocato / Commercialista", icon: "⚖️",
    trigger: TR("📋", "Preventivo parcella: il cliente tentenna"),
    steps: [
      { q: "Preventivo parcella inviato, silenzio del cliente?", options: [
        { emoji: "💭", label: "Resta parcheggiato, non oso insistere", node: M("📂", "Preventivo nel limbo", "Parcella ferma") },
        { emoji: "📊", label: "Follow-up 3-7-14gg con FAQ e casi", node: AU("🔄", "Nurturing preventivo", "Cliente deciso") }
      ]},
      { q: "Documenti per la pratica (730, bilancio, atto)?", options: [
        { emoji: "📂", label: "Li chiedo a voce, arrivano sotto scadenza", node: M("⏰", "Rincorsa documenti", "Scadenza a rischio") },
        { emoji: "✅", label: "Checklist SPID + solleciti auto 48h", node: AU("📋", "Dossier in tempo", "Pratica senza ansia") }
      ]},
      { q: "Parcella emessa, cliente non salda?", options: [
        { emoji: "😤", label: "Telefonate imbarazzate, a volte lascio perdere", node: M("💸", "Insoluto che pesa", "Fatturato perso") },
        { emoji: "💰", label: "Solleciti graduali con link pagamento", node: AU("🔔", "Recupero crediti", "Incassi puliti") }
      ]},
      { q: "Pratica chiusa, e adesso?", options: [
        { emoji: "🤝", label: "Saluto, se serve mi richiamano", node: M("👋", "Cliente una tantum", "Solo urgenze") },
        { emoji: "⭐", label: "Recensione + scadenziario annuale", node: AU("🔔", "Cliente a vita", "Referral + rinnovo") }
      ]}
    ],
    goalLabel: "Da preventivo firmato a cliente per sempre"
  },

  immobiliare: {
    name: "Agenzia immobiliare", icon: "🏠",
    trigger: TR("📩", "Richiesta su annuncio Idealista/Immobiliare.it"),
    steps: [
      { q: "Lead dal portale: come qualifichi budget e mutuo?", options: [
        { emoji: "📞", label: "Richiamo io, se rispondono capisco", node: M("🤷", "Qualifica a naso", "80% curiosi") },
        { emoji: "🤖", label: "Form auto: budget, mutuo pre-approvato, tempi", node: AU("🎯", "Seri vs turisti", "Qualifica auto") }
      ]},
      { q: "Visita organizzata: come gestisci i 15 slot?", options: [
        { emoji: "📆", label: "Agenda cartacea, chiamo uno a uno", node: M("📖", "Ritardi e no-show", "Caos pianerottolo") },
        { emoji: "🗺️", label: "Booking online + mappa + conferma H-2", node: AU("✅", "Slot pieni", "APE già inviato") }
      ]},
      { q: "Proposta firmata ma cliente sparisce prima del compromesso?", options: [
        { emoji: "😰", label: "Chiamo, non risponde, va dal concorrente", node: M("👻", "Mandato perso", "Caparra svanita") },
        { emoji: "🔔", label: "Sequenza: perizia, mutuo, notaio, step chiari", node: AU("🗓️", "Cliente al rogito", "Step guidati") }
      ]},
      { q: "Dopo il rogito: recensione Google e referral?", options: [
        { emoji: "🤐", label: "Consegno chiavi, saluto, sparisce", node: M("🚪", "Zero review", "Zero passaparola") },
        { emoji: "⭐", label: "Auguri + richiesta review + referral ristrutt.", node: AU("🔗", "Review + referral", "Lead caldi") }
      ]}
    ],
    goalLabel: "Dal primo click al rogito (senza perderlo al concorrente)"
  },

  auto: {
    name: "Autosalone / Officina", icon: "🚗",
    trigger: TR("🔧", "Richiesta preventivo tagliando o distribuzione"),
    steps: [
      { q: "Cliente chiede preventivo distribuzione o frizione?", options: [
        { emoji: "📝", label: "Controllo listino casa madre e lo richiamo in giornata", node: M("⏰", "Preventivo a mano", "Risposta in sera") },
        { emoji: "⚡", label: "Preventivo cifrato subito + slot ponte libero", node: AU("🧾", "Preventivo lampo", "Ponte prenotato") }
      ]},
      { q: "Ok al lavoro. Come blocchi ponte e auto sostitutiva?", options: [
        { emoji: "📞", label: "Segno sul quadernone e spero non salti", node: M("📖", "Agenda cartacea", "Rischio salto") },
        { emoji: "🗓️", label: "Booking online, auto muletto, promemoria -24h", node: AU("🚗", "Ponte + muletto", "Logistica auto") }
      ]},
      { q: "Consegna auto. Il cliente riparte e poi?", options: [
        { emoji: "👋", label: "Grazie e alla prossima, se si ricorda", node: M("🚪", "Saluto e via", "Zero storico") },
        { emoji: "⭐", label: "Recensione Google + scheda tagliando futuro", node: AU("📋", "Review + storico", "Cliente fidato") }
      ]},
      { q: "Dopo 10 mesi dal tagliando o revisione in scadenza?", options: [
        { emoji: "🤞", label: "Spero torni prima che vada dal concorrente", node: M("👻", "Perso in catena", "Bosch Service") },
        { emoji: "🔔", label: "Richiamo automatico km + data, slot prenotabile", node: AU("🚙", "Retention officina", "Richiamo auto") }
      ]}
    ],
    goalLabel: "Retention cliente auto + riempimento ponti"
  },

  retail: {
    name: "Negozio / Retail", icon: "🛍️",
    trigger: TR("👗", "DM Instagram: \"c'è ancora? fai la 42?\""),
    steps: [
      { q: "Arriva la richiesta in DM: cosa fai?", options: [
        { emoji: "😮‍💨", label: "Rispondo tra un cliente e l'altro", node: M("📵", "Risposta a singhiozzo", "Cassa intasata") },
        { emoji: "📸", label: "Foto capo + taglie disponibili + invito prova", node: AU("🏬", "Scheda capo + invito", "DM in vetrina") }
      ]},
      { q: "Dice \"passo a vederlo\" ma non arriva mai?", options: [
        { emoji: "🤞", label: "Spero che si ricordi, io ho altro da fare", node: M("🍂", "Vendita persa", "Capo a stock") },
        { emoji: "🏷️", label: "Te lo tengo 48h + promemoria con foto", node: AU("🎁", "Hold + reminder", "Camerino prenotato") }
      ]},
      { q: "Dopo che esce dal camerino con il sacchetto?", options: [
        { emoji: "👋", label: "\"Grazie, a presto!\" e basta", node: M("🚪", "Scontrino e addio", "Zero ritorno") },
        { emoji: "⭐", label: "Recensione + consiglio abbinamento nuova collezione", node: AU("💎", "Review + upsell", "Cliente abituale") }
      ]},
      { q: "Cliente abituale sparito da 60 giorni?", options: [
        { emoji: "📉", label: "Sarà passato a Zalando, pazienza", node: M("🛒", "Perso online", "Tessera mai usata") },
        { emoji: "🎟️", label: "Preview nuova collezione prima dei saldi", node: AU("💌", "Anteprima VIP", "Riattivazione") }
      ]}
    ],
    goalLabel: "Dal DM al camerino al cliente fedele"
  },

  ecommerce: {
    name: "E-commerce / Online", icon: "🛒",
    trigger: TR("🛒", "Checkout abbandonato: carrello pieno, zero ordine"),
    steps: [
      { q: "Carrello fermo da 1 ora. Tu cosa fai?", options: [
        { emoji: "😤", label: "Niente, tanto il 70% non compra", node: M("📉", "Carrello perso", "CPA bruciato") },
        { emoji: "📧", label: "Email recupero con foto prodotto + CTA", node: AU("🔔", "Abandoned cart #1", "Recovery 1h") }
      ]},
      { q: "Passate 24h, ancora non ha pagato. Mossa?", options: [
        { emoji: "🤷", label: "Amen, CPA bruciato", node: M("💸", "Budget ads perso", "Click sprecato") },
        { emoji: "💸", label: "Email #2 con coupon -10% a scadenza", node: AU("⏳", "Recovery + urgency", "-10% 24h") }
      ]},
      { q: "Ordine consegnato. Poi il silenzio?", options: [
        { emoji: "📦", label: "Spedito, fine del rapporto", node: M("🚪", "Zero review", "Zero riacquisto") },
        { emoji: "⭐", label: "Richiesta review +3gg e tracking proattivo", node: AU("📬", "Post-delivery", "UGC + review") }
      ]},
      { q: "Cliente sparito da 45gg. Lo molli?", options: [
        { emoji: "👋", label: "Pazienza, one-shot buyer", node: M("📉", "LTV zero", "AOV basso") },
        { emoji: "🎁", label: "Cross-sell su top seller + coupon ritorno", node: AU("🔁", "Win-back", "Second order") }
      ]}
    ],
    goalLabel: "Da carrello abbandonato a cliente ricorrente (LTV su)"
  },

  hotel: {
    name: "Hotel / B&B", icon: "🏨",
    trigger: TR("📩", "Richiesta disponibilità via sito/WhatsApp"),
    steps: [
      { q: "Come rispondi alla richiesta di prenotazione?", options: [
        { emoji: "🐌", label: "Controllo PMS, rispondo a mano quando posso", node: M("⏰", "Risposta lenta", "Guest su Booking") },
        { emoji: "⚡", label: "Preventivo diretto + sconto vs OTA in 2 min", node: AU("💰", "Bypass OTA", "Prenotazione diretta") }
      ]},
      { q: "Cosa riceve il guest dopo aver prenotato?", options: [
        { emoji: "📧", label: "Email di conferma standard del gestionale", node: M("📝", "Conferma anonima", "Guest freddo") },
        { emoji: "🗺️", label: "Welcome kit: come arrivare, orari, tips locali", node: AU("✉️", "Pre-stay esperienziale", "Hype pre-arrivo") }
      ]},
      { q: "Check-in: come gestisci l'arrivo?", options: [
        { emoji: "🛎️", label: "Reception, documenti e chiavi all'arrivo", node: M("⏳", "Coda alle 22", "Staff stressato") },
        { emoji: "🔑", label: "Check-in online 24h prima + upsell camera/colazione", node: AU("⚡", "Self check-in", "ADR su, code zero") }
      ]},
      { q: "Dopo il check-out il guest è...", options: [
        { emoji: "👋", label: "Saluto e camera pronta per il prossimo", node: M("🚪", "Guest dimenticato", "Zero Google review") },
        { emoji: "⭐", label: "Review Google + offerta return guest personalizzata", node: AU("💎", "Review + return", "Contatto diretto") }
      ]}
    ],
    goalLabel: "Da guest OTA a return guest diretto"
  },

  bar: {
    name: "Bar / Pasticceria", icon: "☕",
    trigger: TR("🎂", "Richiesta torta o vassoio catering"),
    steps: [
      { q: "Squilla sabato mattina: torta comunione", options: [
        { emoji: "🤷", label: "Richiamo quando chiudo il bar", node: M("📵", "Preventivo perso", "Tel in rush") },
        { emoji: "📋", label: "Listino + foto torte + slot auto", node: AU("📸", "Richiesta qualificata", "Preventivo auto") }
      ]},
      { q: "Promette ma senza caparra", options: [
        { emoji: "🤝", label: "Parola data, la preparo lo stesso", node: M("🎂", "Torta in vetrina", "Se annulla perso") },
        { emoji: "💶", label: "Acconto 30% + conferma ritiro", node: AU("🔒", "Ordine blindato", "Caparra anti-fuga") }
      ]},
      { q: "Giorno prima del ritiro silenzio", options: [
        { emoji: "😰", label: "Spero si ricordi della torta", node: M("⏳", "Torta invenduta", "Rischio scarto") },
        { emoji: "⏰", label: "Promemoria 48h + 2h con orario", node: AU("📲", "Ritiro garantito", "Conferma auto") }
      ]},
      { q: "Cliente ritira e sparisce", options: [
        { emoji: "👋", label: "Arrivederci e grazie", node: M("🚪", "Mai più rivisto", "Zero ritorno") },
        { emoji: "⭐", label: "Foto torta + recensione + sconto next", node: AU("📸", "Cliente fidelizzato", "Review + sconto") }
      ]}
    ],
    goalLabel: "Da preventivo volatile a cliente ricorrente"
  },

  wedding: {
    name: "Wedding planner / Eventi", icon: "🎊",
    trigger: TR("💍", "Coppia chiede preventivo matrimonio"),
    steps: [
      { q: "Sposi scrivono: rispondi a caldo o a freddo?", options: [
        { emoji: "📨", label: "PDF pacchetti quando ho tempo", node: M("⏰", "Preventivo tardivo", "Coppia si raffredda") },
        { emoji: "⚡", label: "Brochure + mood-board + qualifica budget", node: AU("📋", "Qualifica auto", "Coppia pre-valutata") }
      ]},
      { q: "Call conoscitiva con la coppia?", options: [
        { emoji: "📞", label: "Li richiamo per fissare data", node: M("👤", "Booking a voce", "Ping-pong telefono") },
        { emoji: "📅", label: "Link calendario + questionario stile", node: AU("🎨", "Call + ispirazioni", "Mood-board pre-call") }
      ]},
      { q: "Coppia sparisce dopo il preventivo?", options: [
        { emoji: "🤷", label: "Aspetto, magari si rifanno vivi", node: M("👻", "Ghosting senza risposta", "Preventivo perso") },
        { emoji: "💌", label: "Nurture: testimonial, real wedding, caparra", node: AU("🔄", "Recupero indecisi", "Nurture 3-email") }
      ]},
      { q: "Sposi felici il giorno dopo le nozze?", options: [
        { emoji: "👰", label: "Grazie e tanti auguri", node: M("🚪", "Nessun referral", "Fine rapporto") },
        { emoji: "🥂", label: "Recensione + bonus referral + anniversario", node: AU("💕", "Referral engine", "Review + amici") }
      ]}
    ],
    goalLabel: "Da preventivo a referral amici e recensioni"
  },

  fotografo: {
    name: "Fotografo", icon: "📷",
    trigger: TR("💍", "Richiesta preventivo matrimonio via DM"),
    steps: [
      { q: "Arriva il DM: quanto per il mio matrimonio?", options: [
        { emoji: "🤷", label: "Rispondo tra uno shooting e l'altro", node: M("📵", "Preventivo a memoria", "DM freddo") },
        { emoji: "📋", label: "Listino + portfolio + data check auto", node: AU("📆", "Qualifica + data", "Pacchetti pronti") }
      ]},
      { q: "Come blocchi la data dello shooting?", options: [
        { emoji: "🤝", label: "Stretta di mano, tanto si fidano", node: M("🎲", "Nessuna caparra", "Se annulla perso") },
        { emoji: "💳", label: "Acconto 30% + contratto + mood board", node: AU("🎨", "Caparra + brief", "Data blindata") }
      ]},
      { q: "Galleria pronta dopo 2 mesi di editing:", options: [
        { emoji: "📧", label: "Link Pixieset e buona visione", node: M("📭", "Consegna e via", "Zero engagement") },
        { emoji: "🖼️", label: "Gallery privata + invito recensione + album", node: AU("⭐", "Delivery + review", "Upsell album") }
      ]},
      { q: "Un anno dopo il sì o il newborn:", options: [
        { emoji: "🌫️", label: "Se si ricordano tornano loro", node: M("👻", "Cliente one-shot", "Sparito") },
        { emoji: "🎂", label: "Promemoria anniversario + family update", node: AU("📷", "Ricorrenza annuale", "Ritratto famiglia") }
      ]}
    ],
    goalLabel: "Da DM a cliente che torna ogni anno"
  },

  psicologo: {
    name: "Psicologo / Counselor", icon: "🧠",
    trigger: TR("📩", "Arriva richiesta colloquio conoscitivo"),
    steps: [
      { q: "Come accogli chi scrive per la prima volta?", options: [
        { emoji: "🤲", label: "Rispondo quando riesco, tra una seduta e l'altra", node: M("📝", "Risposta a mano", "Paziente aspetta") },
        { emoji: "💬", label: "Messaggio accogliente + info patto terapeutico", node: AU("🌱", "Accoglienza etica", "Patto chiaro") }
      ]},
      { q: "Chi tentenna prima del primo colloquio?", options: [
        { emoji: "🌫️", label: "Se non si fa più sentire, lascio stare", node: M("👣", "Silenzio rispettoso", "Paziente perso") },
        { emoji: "🕊️", label: "Un promemoria delicato, senza pressione", node: AU("💌", "Promemoria gentile", "Senza forzare") }
      ]},
      { q: "Paziente salta una seduta e non risponde?", options: [
        { emoji: "📵", label: "Riprovo a chiamare nei giorni dopo", node: M("📞", "Richiamo a memoria", "Recupero manuale") },
        { emoji: "❤️‍🩹", label: "Messaggio non giudicante + spazio per tornare", node: AU("🤝", "Riaggancio empatico", "Spazio aperto") }
      ]},
      { q: "Percorso concluso, e dopo mesi?", options: [
        { emoji: "🚪", label: "Chiudo il percorso e lascio andare", node: M("👋", "Niente contatto", "Chiusura secca") },
        { emoji: "🌱", label: "Check-in a 6 mesi, se vorrà riaprire", node: AU("💚", "Cura long-term", "Porta aperta") }
      ]}
    ],
    goalLabel: "Accompagnare con rispetto dal primo contatto al dopo-percorso"
  },

  scuola: {
    name: "Scuola / Formazione", icon: "🎓",
    trigger: TR("📚", "Richiesta info corso / lezione prova"),
    steps: [
      { q: "Arriva richiesta info corso: come rispondi?", options: [
        { emoji: "🤷", label: "Mando brochure PDF quando trovo 10 minuti", node: M("📎", "Risposta a mano", "Lead freddo") },
        { emoji: "⚡", label: "Programma + calendario + prezzi + lezione prova", node: AU("🎁", "Info pack + trial", "Prova prenotata") }
      ]},
      { q: "Studente vuole iscriversi: come chiudi?", options: [
        { emoji: "📝", label: "Modulo cartaceo in segreteria + bonifico a rate", node: M("📄", "Iscrizione manuale", "Tempo perso") },
        { emoji: "💳", label: "Form online, pagamento retta + welcome kit auto", node: AU("📬", "Iscrizione digitale", "Onboarding auto") }
      ]},
      { q: "Studente salta le prime lezioni: cosa fai?", options: [
        { emoji: "😶", label: "Ho già incassato la retta, se sparisce sparisce", node: M("🪑", "No-show ignorato", "Drop-out") },
        { emoji: "🎯", label: "Check-in tutor + recupero + promemoria piattaforma", node: AU("🛟", "Anti drop-out", "Recupero studente") }
      ]},
      { q: "Fine corso base: come porti allo step successivo?", options: [
        { emoji: "👋", label: "Consegno certificato, saluto, sparisce per sempre", node: M("🎓", "Upsell persa", "Fine relazione") },
        { emoji: "🏆", label: "Review Google + sconto livello intermedio + open day", node: AU("📈", "Continuità + review", "Upsell avanzato") }
      ]}
    ],
    goalLabel: "Da info → iscritto → certificato → livello avanzato"
  },

  coach: {
    name: "Personal trainer / Coach", icon: "🏃",
    trigger: TR("💬", "DM IG: \"quanto costa il PT 1:1?\""),
    steps: [
      { q: "Nuova richiesta programma: come rispondi?", options: [
        { emoji: "⏰", label: "Rispondo la sera quando stacco", node: M("📵", "DM freddo", "Fredda in 6h") },
        { emoji: "🎯", label: "Body check gratis + listino pacchetti", node: AU("📋", "Qualifica + call", "Call fissata auto") }
      ]},
      { q: "Prima sessione: come la fissi?", options: [
        { emoji: "📞", label: "Ci sentiamo a voce, ti dico quando", node: M("🗓️", "Agenda a memoria", "Doppi booking") },
        { emoji: "📅", label: "Link calendario + brief obiettivi + anamnesi", node: AU("✅", "Onboarding in 5 min", "Brief pronto") }
      ]},
      { q: "Cliente sparisce dopo il primo mese: che fai?", options: [
        { emoji: "😮‍💨", label: "Aspetto che mi scriva lei per rinnovare", node: M("📉", "Drop mese 2", "Fatturato ballerino") },
        { emoji: "📸", label: "Check-in settimanale + foto + misure ricordate", node: AU("🔥", "Consistenza retention", "+60% retention") }
      ]},
      { q: "Pacchetto 12 sessioni non usate?", options: [
        { emoji: "🤷", label: "Se salta, salta: le perde lei", node: M("💔", "Cliente frustrata", "Niente rinnovo") },
        { emoji: "🔁", label: "Recupero auto + upsell transformation 3 mesi", node: AU("💪", "LTV triplicato", "Testimonial oro") }
      ]}
    ],
    goalLabel: "Retention coaching: da 1 mese a transformation"
  },

  nail_tatto: {
    name: "Nail / Tatuatore", icon: "💅",
    trigger: TR("📲", "DM IG: \"quando sei libera per un refill?\""),
    steps: [
      { q: "Rispondi alla DM o controlli l'agenda dopo?", options: [
        { emoji: "📵", label: "\"Stasera guardo agenda e ti dico\"", node: M("🌙", "Risposta a fine giornata", "Lead freddo") },
        { emoji: "⚡", label: "Slot liberi + listino refill/tattoo + portfolio", node: AU("📅", "Slot + portfolio", "Risposta in 1 min") }
      ]},
      { q: "Caparra per bloccare la seduta?", options: [
        { emoji: "🤞", label: "\"Fidati, ti aspetto\" senza acconto", node: M("🎲", "No-show a rischio", "Buco 2h") },
        { emoji: "💳", label: "Caparra online + promemoria 48h/24h/2h", node: AU("🔒", "Posto blindato", "Zero disdette") }
      ]},
      { q: "Dopo seduta unghie/tattoo?", options: [
        { emoji: "🙋", label: "Saluto, foto se ci pensa lei", node: M("📭", "Post servizio muto", "Zero portfolio") },
        { emoji: "📸", label: "Foto portfolio + recensione + cura post-ink/refill", node: AU("⭐", "Review + aftercare", "Portfolio live") }
      ]},
      { q: "Dopo 25-40 giorni (rifill/ritocco)?", options: [
        { emoji: "🌬️", label: "Se torna torna, sennò va dalla concorrente", node: M("👻", "Cliente persa", "Infedeltà") },
        { emoji: "🔁", label: "Richiamo auto: rifill/ritocco gratuito + slot", node: AU("💅", "Fidelizzazione ciclica", "Richiamo 30gg") }
      ]}
    ],
    goalLabel: "Agenda piena, zero no-show, cliente fedele"
  },

  pet: {
    name: "Toelettatura / Pet", icon: "🐾",
    trigger: TR("✂️", "\"Quanto costa bagno+taglio yorkshire?\""),
    steps: [
      { q: "DM razza/taglia: come rispondi?", options: [
        { emoji: "📱", label: "Rispondo io tra un cliente e l'altro", node: M("📵", "Risposta a mano", "Tempo perso") },
        { emoji: "💬", label: "Listino auto per razza/taglia/pelo", node: AU("📋", "Preventivo istantaneo", "Qualifica auto") }
      ]},
      { q: "Primo bagno cucciolo: come gestisci l'ansia?", options: [
        { emoji: "🤞", label: "Rassicuro al telefono, poi si vede", node: M("😟", "Padrone in ansia", "Dubbi trauma") },
        { emoji: "🐶", label: "Video-tutorial pre-visita + foto live", node: AU("📸", "Cucciolo sereno", "Padrone tranquillo") }
      ]},
      { q: "Il giorno prima dell'appuntamento?", options: [
        { emoji: "😮‍💨", label: "Spero si ricordino (spesso no)", node: M("🪑", "No-show frequenti", "Agenda bucata") },
        { emoji: "⏰", label: "Promemoria 24h + 2h + istruzioni pelo", node: AU("✅", "Agenda piena", "Promemoria auto") }
      ]},
      { q: "Cliente sparisce dopo 2-3 bagni: che fai?", options: [
        { emoji: "🥲", label: "Pazienza, sarà andata altrove", node: M("👻", "Infedeltà silenziosa", "Cliente persa") },
        { emoji: "📸", label: "Foto finale + review + richiamo 5 sett", node: AU("🐾", "Rientrano da soli", "Richiamo auto") }
      ]}
    ],
    goalLabel: "Stop infedeltà toelettatura"
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
