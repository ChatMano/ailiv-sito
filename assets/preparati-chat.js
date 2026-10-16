(function () {
  'use strict';
  var worker = 'https://ailiv-prequalifica.amanoamano.workers.dev';
  var msgs = document.getElementById('msgs');
  var inp = document.getElementById('inp');
  var send = document.getElementById('send');
  var status = document.getElementById('status');
  var c = new URLSearchParams(location.search).get('c') || '';
  var history = [], busy = false, retry = null, blocked = false;

  function requestId() { return crypto.randomUUID(); }
  function add(text, role) {
    var el = document.createElement('div'); el.className = 'msg ' + (role === 'user' ? 'me' : 'bot');
    if (role !== 'user') {
      var label = document.createElement('div'); label.className = 'who'; label.textContent = 'AILIV — assistente AI'; el.appendChild(label);
    }
    var content = document.createElement('span'); content.textContent = text; el.appendChild(content); msgs.appendChild(el);
    el.scrollIntoView({block:'nearest',behavior:'auto'});
  }
  function updateControls() { send.disabled = busy || blocked; inp.disabled = busy || blocked; }
  function notice(text, action, label) {
    status.replaceChildren(); status.appendChild(document.createTextNode(text));
    if (action) { var b = document.createElement('button'); b.type='button'; b.textContent=label; b.addEventListener('click',action); status.appendChild(b); }
  }
  async function attempt(payload, savingOnly) {
    if (busy) return;
    busy=true; updateControls(); notice(savingOnly?'Sto salvando le informazioni…':'Sto preparando la risposta…');
    var ctrl = new AbortController(); var timer = setTimeout(function(){ctrl.abort();},115000);
    var waitTimers=[];
    if(!savingOnly){
      waitTimers.push(setTimeout(function(){notice('La risposta è ancora in preparazione. Puoi attendere qui: non serve inviare di nuovo il messaggio.');},12000));
      waitTimers.push(setTimeout(function(){notice('Sta impiegando più del solito. La richiesta è ancora in corso; mantengo la conversazione aperta.');},35000));
    }
    try {
      var res=await fetch(worker+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});
      var data=await res.json();
      if (!res.ok || data.error) {
        var message=data.reply||'Non riesco a completare la richiesta. Puoi riprovare oppure scriverci a info@ailiv.it.';
        if(data.error==='limit_reached'||data.error==='bad_history'){blocked=true;notice(message);retry=null;return;}
        retry={payload:payload,savingOnly:savingOnly,newId:data.error==='ai_unavailable'||data.error==='request_interrupted'};blocked=true;
        notice(message,retryLast,data.error==='request_in_progress'?'Recupera risposta':retry.newId?'Richiedi una nuova risposta':'Riprova');return;
      }
      if(!savingOnly){
        if(typeof data.reply!=='string')throw new Error('Invalid response');
        history.push({role:'assistant',content:data.reply});add(data.reply,'assistant');
      }
      if(data.save_status==='pending'){
        blocked=true;retry={payload:payload,savingOnly:true,newId:false};
        notice('La risposta è pronta, ma non sono riuscito a salvare le informazioni per Andrea. Riprova il salvataggio: non rigenera la risposta.',retryLast,'Riprova salvataggio');
      }else{
        blocked=false;retry=null;
        notice(data.done?'Informazioni salvate per Andrea. Puoi aggiungere altro se serve.':'Informazioni salvate.');
        if(data.done)inp.placeholder='Aggiungi un dettaglio, se serve';
      }
    }catch(e){
      retry={payload:payload,savingOnly:savingOnly,newId:false};blocked=true;
      notice('La connessione si è interrotta. Riprova a recuperare la risposta, senza riscrivere il messaggio.',retryLast,'Recupera risposta');
    }finally{clearTimeout(timer);waitTimers.forEach(clearTimeout);busy=false;updateControls();}
  }
  function retryLast(){
    if(!retry||busy)return;var task=retry;
    if(task.newId)task.payload={...task.payload,request_id:requestId()};
    attempt(task.payload,task.savingOnly);
  }
  function sendMsg(){
    if(busy||blocked)return;var text=inp.value.trim();if(!text)return;
    inp.value='';history.push({role:'user',content:text});add(text,'user');
    attempt({c:c,history:history.slice(),request_id:requestId()},false);
  }
  send.addEventListener('click',sendMsg);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();sendMsg();}});
  if(!/^[A-Za-z0-9]{15,32}$/.test(c)){
    blocked=true;updateControls();notice('Apri il link personale ricevuto via email dopo la prenotazione. Se non lo trovi, scrivici a info@ailiv.it.');return;
  }
  fetch(worker+'/hello?c='+encodeURIComponent(c)).then(function(r){if(!r.ok)throw new Error('bad link');return r.json();}).then(function(data){
    var opening="Ciao! Sono l'assistente AI di AILIV. Ti faccio qualche domanda per aiutare Andrea a preparare il tuo check-up.\n\nDi cosa si occupa la tua attività?";
    history.push({role:'assistant',content:opening});add(opening,'assistant');
    if(data.appointment)notice('Appuntamento con Andrea: '+data.appointment+'.');
    blocked=false;updateControls();
  }).catch(function(){blocked=true;updateControls();notice('Non riesco ad aprire questa chat. Controlla il link nella tua email oppure scrivici a info@ailiv.it.');});
})();
