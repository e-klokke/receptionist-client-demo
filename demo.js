'use strict';
// Scripted test data only. This file never calls a booking, messaging, or phone API.
const FLOWS = {
  booking: {name: 'Marcus Lee', initials: 'ML', lang: 'en-US', kind: 'calendar', title: 'A visit, on the calendar.', service: 'Full detail · 3 hours · $180', date: 'Tuesday, November 3, 2026', slots: ['9:00 AM', '1:00 PM', '3:00 PM'], selected: '1:00 PM', steps: [
    {who:'receptionist', text:'Hello, thank you for calling Bayside Auto Detail. How can I help you today?', event:'Incoming demo call answered'},
    {who:'caller', text:'I’d like to book a full detail on Tuesday, November third.'},
    {who:'receptionist', text:'Of course. Let me check the available times.', event:'Sample calendar availability checked', state:'available'},
    {who:'receptionist', text:'Tuesday, November third has nine in the morning, one in the afternoon, or three in the afternoon. Which works for you?'},
    {who:'caller', text:'One in the afternoon, please.', event:'Caller chose 1:00 PM', state:'selected'},
    {who:'receptionist', text:'What name should I use for the booking?'},
    {who:'caller', text:'My name is Marcus Lee.'},
    {who:'receptionist', text:'Thank you. I’m booking that now.', event:'Simulated calendar write succeeded', state:'confirmed'},
    {who:'receptionist', text:'You’re booked for a full detail on Tuesday, November third, at one in the afternoon, under Marcus Lee. We look forward to seeing you.', event:'Booking confirmed to caller'}
  ]},
  sms: {name:'Jordan Morgan', initials:'JM', lang:'en-US', kind:'phone', title:'A link, when it’s convenient.', service:'Booking link · caller-confirmed number', steps:[
    {who:'receptionist', text:'Hello, thank you for calling Bayside Auto Detail. How can I help you today?', event:'Incoming demo call answered'},
    {who:'caller', text:'I’m busy right now. Could you text me a booking link?'},
    {who:'receptionist', text:'Absolutely. What number should I send it to?', event:'Requested a delivery number'},
    {who:'caller', text:'Two zero two, five five five, zero one zero four.'},
    {who:'receptionist', text:'I heard two zero two, five five five, zero one zero four. Is that correct?', event:'Number read back before use', state:'number'},
    {who:'caller', text:'Yes, that’s correct.', event:'Delivery number confirmed by caller', state:'selected'},
    {who:'receptionist', text:'I’ll send that now.', event:'Simulated SMS delivery succeeded', state:'sent'},
    {who:'receptionist', text:'The booking link has been sent. You can choose a time whenever it’s convenient. Have a great day!', event:'Delivery confirmed to caller'}
  ]},
  transfer: {name:'Alex Rivera', initials:'AR', lang:'en-US', kind:'transfer', title:'The right person, at the right time.', service:'Owner handoff · vehicle already in the shop', steps:[
    {who:'receptionist', text:'Hello, thank you for calling Bayside Auto Detail. How can I help you today?', event:'Incoming demo call answered'},
    {who:'caller', text:'My car is already in your shop. Can I speak with the owner about picking it up?'},
    {who:'receptionist', text:'Of course. I’ll connect you with the owner.', event:'Caller’s request for a person recognized', state:'selected'},
    {who:'receptionist', text:'Connecting you with the owner now.', event:'Transfer announced before handoff'},
    {who:'system', text:'Simulated handoff complete. The owner takes over the call.', event:'Simulated owner handoff completed', state:'transferred'}
  ]},
  spanish: {name:'Lucía Ramírez', initials:'LR', lang:'es-US', kind:'calendar', title:'La misma atención. En español.', service:'Exterior wash · 30 minutes · $40', date:'Wednesday, November 4, 2026', slots:['9:00 AM','9:30 AM','10:00 AM'], selected:'9:30 AM', steps:[
    {who:'caller', text:'Hola, quiero reservar un lavado exterior para el miércoles cuatro de noviembre.', event:'Spanish selected for the sample conversation'},
    {who:'receptionist', text:'Claro. El lavado exterior cuesta cuarenta dólares y dura treinta minutos. Voy a consultar los horarios.', event:'Sample calendar availability checked', state:'available'},
    {who:'receptionist', text:'El miércoles cuatro de noviembre tenemos las nueve, las nueve y media o las diez de la mañana. ¿Cuál le conviene?'},
    {who:'caller', text:'Las nueve y media de la mañana, por favor.', event:'Caller chose 9:30 AM', state:'selected'},
    {who:'receptionist', text:'¿A qué nombre hago la reserva?'},
    {who:'caller', text:'Me llamo Lucía Ramírez.'},
    {who:'receptionist', text:'Gracias. Estoy haciendo la reserva.', event:'Simulated calendar write succeeded', state:'confirmed'},
    {who:'receptionist', text:'Su lavado exterior está reservado para el miércoles cuatro de noviembre a las nueve y media de la mañana, a nombre de Lucía Ramírez. ¡Que tenga un buen día!', event:'Booking confirmed in Spanish'}
  ]}
};
const GUIDE = {
  booking: {
    intro:'Welcome to Bayside Auto Detail. This is a scripted client preview, not a live phone system. First, watch how a booking moves from a caller’s request to a clear confirmation. All calendar times and outcomes are sample data.',
    available:'The sample calendar returns specific times. The receptionist offers those choices instead of promising an appointment before it is booked.',
    confirmed:'In this simulation, the calendar write has succeeded. Now the receptionist can confirm the chosen service, date, time, and caller’s name.',
    close:'That is the booking experience: a clear choice, a named appointment, and a final confirmation. Next, we will follow a caller who cannot stay on the phone.'
  },
  sms: {
    intro:'When a caller is busy, a text follow-up gives them a next step at their convenience. This sample shows a booking link, not a payment link, and no real text will be sent.',
    number:'Notice the number read-back. The caller confirms the destination before the simulated text is sent.',
    sent:'The sample delivery event is now complete. A real deployment would need an approved messaging service and verified delivery; this screen illustrates that intended workflow.',
    close:'A short call can still end with a useful next step. Now, let us see how the receptionist hands a caller over to a person.'
  },
  transfer: {
    intro:'Some conversations need a person. Here, a caller whose vehicle is already in the shop asks for the owner. The receptionist recognizes the request and explains the handoff.',
    transferred:'The handoff is complete in this simulation. Announcing the transfer keeps the caller informed. This example assumes an available owner; a live service must also handle an unanswered destination.',
    close:'The goal is a clear path to the team when personal attention is needed. Finally, we will replay a booking conversation in Spanish.'
  },
  spanish: {
    intro:'The last example is a Spanish-language booking. Listen for a consistent language from the first request through the spoken prices, times, and confirmation. The guide speaks English; the sample conversation stays in Spanish.',
    confirmed:'The sample booking has succeeded. The receptionist confirms the exact appointment in Spanish, so the caller can leave with a clear understanding of the next step.',
    close:'You have seen four intended workflows: booking a visit, sending a booking link, reaching a person, and booking in Spanish. This demonstration uses fictional data and makes no real bookings, sends no messages, and transfers no calls. Thank you for watching.'
  }
};
for(const [key,flow] of Object.entries(FLOWS)){
  const original=flow.steps, guide=GUIDE[key];
  flow.steps=[{who:'narrator',lang:'en-US',text:guide.intro}];
  original.forEach(step=>{
    flow.steps.push(step);
    if(step.state&&guide[step.state])flow.steps.push({who:'narrator',lang:'en-US',text:guide[step.state]});
  });
  flow.steps.push({who:'narrator',lang:'en-US',text:guide.close});
  flow.steps.forEach((step,index)=>{step.audio=`audio/${key}-${index}.mp3`;});
}
const el = id => document.getElementById(id);
let flowKey='booking', index=-1, playing=false, finished=false, timer=null, activeSpeech=null, activeAudio=null, generation=0, outcomeState='ready', tourMode=true;
const voiceSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const audioSupported = 'Audio' in window;
function cancelTimer(){clearTimeout(timer);timer=null;}
function cancelVoice(){if(voiceSupported)window.speechSynthesis.cancel();activeSpeech=null;if(activeAudio){activeAudio.onended=null;activeAudio.onerror=null;activeAudio.pause();activeAudio=null;}}
function updateControls(){
  const total=FLOWS[flowKey].steps.length, complete=finished;
  el('play').textContent=playing?'Pause demo':complete?'Replay demo':'Play demo';
  el('step-count').textContent=`${Math.max(0,index+1)} / ${total}`;
  const progress=(index+1)/total*100;
  el('progress').setAttribute('aria-valuenow',Math.round(progress));
  el('progress').firstElementChild.style.width=`${progress}%`;
  el('wave').classList.toggle('active',playing&&!complete);
  el('call-status').textContent=complete?'Demo complete':playing?'Demo playing':'Paused';
  el('next').disabled=index===total-1;
}
function renderOutcome(){
  const f=FLOWS[flowKey], panel=el('outcome-content');
  panel.replaceChildren();
  const card=document.createElement('div');card.className='outcome-card';
  const add=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;card.append(e);return e;};
  add('div',f.kind==='calendar'?'SAMPLE APPOINTMENT':f.kind==='phone'?'SAMPLE TEXT MESSAGE':'SAMPLE OWNER HANDOFF','card-kicker');
  add('h2',f.title);add('p',f.service);
  if(f.kind==='calendar'){
    add('p',f.date+' · Eastern time');
    const slots=add('div','','slots');
    f.slots.forEach(time=>{const s=document.createElement('span');s.className='slot'+(['selected','confirmed'].includes(outcomeState)&&time===f.selected?' chosen':'');s.textContent=outcomeState==='ready'?'—':time;slots.append(s);});
    add('div',outcomeState==='confirmed'?`✓ Simulated booking confirmed · ${f.name}`:outcomeState==='selected'?'Time chosen · waiting for caller’s name':outcomeState==='available'?'Available times returned by the sample calendar':'Waiting for the sample availability check','confirmed');
  } else if(f.kind==='phone'){
    add('div',outcomeState==='ready'?'Waiting for a caller-confirmed number':'+1 (202) 555-0104 · fictional example number','phone-preview');
    if(outcomeState==='sent')add('div','Bayside Auto Detail: Your booking link is ready. [Example link]','phone-preview');
    add('div',outcomeState==='sent'?'✓ Simulated delivery complete · no SMS sent':outcomeState==='selected'?'✓ Number confirmed · ready for simulated delivery':outcomeState==='number'?'Read-back in progress · no delivery yet':'No text is sent before number confirmation','confirmed');
  } else {
    add('div',outcomeState==='transferred'?'Receptionist → Owner · simulated handoff':'Receptionist → Owner · awaiting handoff','phone-preview');
    add('div',outcomeState==='transferred'?'✓ Announcement complete · owner connected in simulation':outcomeState==='selected'?'Person requested · announce handoff before connecting':'Caller can reach a person when needed','confirmed');
  }
  panel.append(card);
}
function addStep(step){
  const message=document.createElement('div');message.className='message '+(step.who==='caller'?'caller':'receptionist');
  if(step.who==='narrator')message.className='message narrator';
  message.lang=step.lang||FLOWS[flowKey].lang;
  const label=document.createElement('div');label.className='message-label';label.textContent=step.who==='caller'?FLOWS[flowKey].name.toUpperCase():step.who==='system'?'DEMO EVENT':step.who==='narrator'?'TOUR GUIDE · SIMULATION':'BAYSIDE RECEPTIONIST';
  const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=step.text;message.append(label,bubble);el('transcript').append(message);el('transcript').scrollTop=el('transcript').scrollHeight;
  el('now-speaking').textContent=step.who==='caller'?'Sample caller':step.who==='system'?'Simulated handoff':step.who==='narrator'?'Tour guide':'Sample receptionist';
  if(step.who==='narrator')el('guide-caption').textContent=step.text;
  if(step.event){const event=document.createElement('li');const text=document.createElement('span');text.textContent=step.event;const time=document.createElement('time');time.textContent=`STEP ${index+1}`;event.append(text,time);el('events').append(event);el('events').scrollTop=el('events').scrollHeight;}
  if(step.state){outcomeState=step.state;renderOutcome();}
}
function schedule(delay){cancelTimer();if(playing)timer=setTimeout(advance,delay);}
function speak(step){
  if(!el('sound').checked)return false;
  if(!audioSupported)return speakBrowser(step);
  const token=generation,audio=new window.Audio(step.audio);activeAudio=audio;
  const current=()=>token===generation&&playing&&activeAudio===audio;
  const fallback=()=>{
    if(!current())return;
    audio.pause();activeAudio=null;cancelTimer();
    el('narration-status').textContent='Bundled audio could not play. Trying an available device voice; visible text remains available.';
    if(!speakBrowser(step))schedule(Math.max(2600,Math.min(13000,step.text.length*32)));
  };
  audio.onended=()=>{if(!current())return;activeAudio=null;schedule(650);};
  audio.onerror=fallback;
  audio.onloadedmetadata=()=>{if(current()&&Number.isFinite(audio.duration)){cancelTimer();timer=setTimeout(fallback,audio.duration*1000+8000);}};
  el('narration-status').textContent=step.who==='narrator'?'Guided narration · bundled audio':(step.lang||FLOWS[flowKey].lang).startsWith('es')?'Spanish conversation · bundled audio':'Sample conversation · bundled audio';
  cancelTimer();timer=setTimeout(fallback,Math.max(15000,step.text.length*100));
  try{audio.play().catch(fallback);}catch(error){fallback();}
  return true;
}
function speakBrowser(step){
  if(!voiceSupported||!el('sound').checked||step.who==='system')return false;
  const voices=window.speechSynthesis.getVoices();
  const language=step.lang||FLOWS[flowKey].lang;
  const voice=voices.find(v=>v.lang===language)||voices.find(v=>v.lang.startsWith(language.slice(0,2)));
  if(!voice){el('narration-status').textContent=`No ${language.startsWith('es')?'Spanish':'English'} device voice is available. This part continues with visible text.`;return false;}
  const token=generation;activeSpeech=new SpeechSynthesisUtterance(step.text);activeSpeech.lang=language;activeSpeech.rate=.98;activeSpeech.voice=voice;
  el('narration-status').textContent=step.who==='narrator'?'Guide narration · English':language.startsWith('es')?'Sample conversation · Spanish':'Sample conversation · English';
  const finish=()=>{if(token!==generation||!playing)return;activeSpeech=null;schedule(650);};
  activeSpeech.onend=finish;activeSpeech.onerror=()=>{if(token!==generation||!playing)return;el('narration-status').textContent='Audio could not play. The guided tour continues with visible text.';finish();};
  window.speechSynthesis.speak(activeSpeech);
  // Browsers may reject speech without firing an event; the visual demo still advances.
  cancelTimer();timer=setTimeout(()=>{if(token!==generation||!playing)return;el('narration-status').textContent='Audio is unavailable or stalled. The guided tour continues with visible text.';advance();},Math.max(8000,step.text.length*100));return true;
}
function advance(){
  cancelTimer();cancelVoice();
  const f=FLOWS[flowKey];if(index>=f.steps.length-1){
    const keys=Object.keys(FLOWS), nextKey=keys[keys.indexOf(flowKey)+1];
    if(tourMode&&nextKey&&playing){reset(nextKey,true,true);return;}
    playing=false;finished=true;el('now-speaking').textContent=tourMode?'All four flows complete · replay the tour':'Scenario complete · choose another flow';updateControls();return;
  }
  index++;const step=f.steps[index];addStep(step);updateControls();
  if(playing&&!speak(step))schedule(Math.max(2600,Math.min(step.who==='narrator'?13000:6200,step.text.length*32)));
}
function reset(key,autoplay=true,allFlows=false){
  generation++;cancelTimer();cancelVoice();flowKey=key;index=-1;playing=autoplay;finished=false;outcomeState='ready';tourMode=allFlows;
  el('transcript').replaceChildren();el('events').replaceChildren();
  const f=FLOWS[key];el('caller').textContent=f.name;document.querySelector('.avatar').textContent=f.initials;el('language').textContent=f.lang.startsWith('es')?'ESPAÑOL':'ENGLISH';el('transcript').lang=f.lang;
  document.querySelectorAll('[data-flow]').forEach(button=>{const selected=button.dataset.flow===key;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',selected);});
  renderOutcome();updateControls();advance();
}
document.querySelectorAll('[data-flow]').forEach(button=>button.addEventListener('click',()=>reset(button.dataset.flow)));
el('play').addEventListener('click',()=>{
  if(finished){reset(tourMode?'booking':flowKey,true,tourMode);return;}
  playing=!playing;generation++;cancelTimer();cancelVoice();updateControls();
  if(playing){el('now-speaking').textContent='Demo resumed';if(!speak(FLOWS[flowKey].steps[index]))schedule(600);}else el('now-speaking').textContent='Paused · transcript stays visible';
});
el('restart').addEventListener('click',()=>reset(tourMode?'booking':flowKey,true,tourMode));
el('tour').addEventListener('click',()=>reset('booking',true,true));
el('narrated').addEventListener('click',()=>{
  el('sound').checked=audioSupported||voiceSupported;el('sound-note').textContent=audioSupported?'Bundled audio on':voiceSupported?'Device voice on':'Text tour';
  el('narration-status').textContent=audioSupported?'Starting guided narration using bundled audio.':voiceSupported?'Starting guided narration. Available device voices are used.':'Audio is unavailable in this browser. The complete guided text tour will play.';
  reset('booking',true,true);
});
el('next').addEventListener('click',()=>{playing=false;generation++;advance();updateControls();});
el('sound').addEventListener('change',()=>{generation++;cancelVoice();el('sound-note').textContent=el('sound').checked?audioSupported?'Bundled audio on':'Device voice on':'Optional';el('narration-status').textContent=el('sound').checked?'Narration enabled.':'Narration off. The tour continues with visible text.';if(playing)schedule(700);});
if(!voiceSupported&&!audioSupported){el('sound').disabled=true;el('sound-note').textContent='Unavailable in this browser';el('narrated').textContent='▶ Start guided text demo';}
reset('booking',true,true);
