(() => {
  'use strict';
  // Bei dieser Songsekunde wieder von vorne starten. null = ganzen Song spielen.
  const SONG_RESTART_AT_SECONDS = 50;
  const $ = id => document.getElementById(id);
  const body = document.body, audio = $('audio'), canvas = $('paper-rain'), ctx = canvas.getContext('2d');
  let calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let amount = 65, applications = 0, coffeeCount = 0, width, height, particles = [], frame = 0, last = 0;
  let pointerFrame = 0, pointerX = 0, pointerY = 0, trailTime = 0, speechTimer, objectUrl;
  const sayings = ['Haben Sie das auch in unnötig kompliziert?', 'Dafür bin ich emotional nicht zuständig.', 'Ihr Antrag wurde erfolgreich ignoriert.', 'Bitte ziehen Sie eine Nummer. Oder aus.', 'Das Internet ist für uns alle ein Wartezimmer.', 'Ich arbeite nicht langsam. Ich puffere.', 'Ohne Passierschein A–38½ geht hier gar nichts.', 'Wir digitalisieren gerade das Faxgerät.'];
  const stamps = ['GENEHMIGT', 'VÖLLIG EGAL', 'ABGELEHNT', 'QUAK.'];
  const sprites = stamps.map((label, index) => {
    const c = document.createElement('canvas'); c.width=240; c.height=90;
    const p=c.getContext('2d'); p.fillStyle='#f7f4e9';p.fillRect(0,0,240,90);
    p.strokeStyle=index%2?'#6546a0':'#ba4023';p.lineWidth=4;p.strokeRect(7,7,226,76);
    p.font='bold 25px monospace';p.textAlign='center';p.textBaseline='middle';p.fillStyle=p.strokeStyle;p.fillText(label,120,45);return c;
  });
  function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function say(text){$('speech').textContent=text;$('speech').classList.add('show');clearTimeout(speechTimer);speechTimer=setTimeout(()=>$('speech').classList.remove('show'),4300);}
  function emit(x,y,total,papers=false){
    if(calm)return;
    for(let i=0;i<total;i++){const angle=Math.random()*Math.PI*2,speed=2+Math.random()*(3+amount/14);particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-2,life:70+Math.random()*65,angle,spin:(Math.random()-.5)*.1,size:papers?50+Math.random()*35:3+Math.random()*5,paper:papers,sprite:sprites[Math.floor(Math.random()*sprites.length)]});}
    if(particles.length>140)particles.splice(0,particles.length-140);
    if(!frame){last=0;frame=requestAnimationFrame(draw);}
  }
  function draw(time){const dt=last?Math.min((time-last)/16.67,2):1;last=time;ctx.clearRect(0,0,width,height);const space=body.classList.contains('space');particles=particles.filter(p=>p.life>0&&p.y<height+100);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(space?-.025:.12)*dt;p.life-=dt;p.angle+=p.spin*dt;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=Math.min(1,p.life/20);if(p.paper)ctx.drawImage(p.sprite,-p.size/2,-p.size*.1875,p.size,p.size*.375);else{ctx.fillStyle='#ed632b';ctx.fillRect(0,0,p.size,p.size);}ctx.restore();}frame=particles.length&&!calm?requestAnimationFrame(draw):0;if(!frame)ctx.clearRect(0,0,width,height);}
  function burst(element=$('bird')){const r=element.getBoundingClientRect();emit(r.x+r.width/2,r.y+r.height/2,Math.round(15+amount*.4),true);}
  function apply(){applications++;$('ticket').textContent=String(applications).padStart(3,'0');const decision=stamps[(applications-1)%stamps.length];$('approval-stamp').innerHTML=`AMTLICH<br><strong>${decision==='GENEHMIGT'?'DRÜBER.':decision}</strong><small>AKTE ${String(applications).padStart(3,'0')} / PARADOX</small>`;$('ticket-message').textContent=`Antrag ${applications}: ${decision}. Bitte bleiben Sie unvernünftig.`;say(sayings[applications%sayings.length]);burst($('stamp'));}
  function setCalm(value){calm=value;body.classList.toggle('calm',calm);body.classList.toggle('motion-enabled',!calm);$('quiet').setAttribute('aria-pressed',String(calm));$('quiet').textContent=calm?'Bewegung aktivieren ◉':'Bewegung reduzieren ◉';if(calm){particles=[];cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height);}}
  $('quiet').addEventListener('click',()=>setCalm(!calm));
  window.addEventListener('pointermove',e=>{pointerX=e.clientX;pointerY=e.clientY;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=$('bureau').getBoundingClientRect();$('scene').style.setProperty('--mx',Math.max(-1,Math.min(1,(pointerX-r.x-r.width/2)/250)));$('scene').style.setProperty('--my',Math.max(-1,Math.min(1,(pointerY-r.y-r.height/2)/250)));});const now=performance.now();if(e.pointerType==='mouse'&&now-trailTime>65&&amount>20){emit(e.clientX,e.clientY,1);trailTime=now;}},{passive:true});
  $('bird').addEventListener('click',()=>{say(sayings[Math.floor(Math.random()*sayings.length)]);burst();});
  $('coffee').addEventListener('click',()=>{coffeeCount++;say(coffeeCount<3?`Kaffee ${coffeeCount}. Meine Motivation ist weiterhin im Urlaub.`:'ICH KANN JETZT FARBEN HÖREN.');burst($('coffee'));});
  $('stamp').addEventListener('click',apply);
  $('reason').addEventListener('change',()=>say('Begründung zur Kenntnis genommen. Mit den Augen gerollt.'));
  $('intensity').addEventListener('input',e=>{amount=Number(e.target.value);$('level').textContent=`${amount}%`;document.documentElement.style.setProperty('--orbit',`${8-amount*.05}s`);if(amount===100)say('Das ist selbst uns zu behördlich.');});
  $('gravity').addEventListener('click',()=>{const active=body.classList.toggle('space');$('gravity').setAttribute('aria-pressed',String(active));$('gravity-label').innerHTML=active?'Dienstreise beenden. <b>↓</b>':'Schwerkraft abmelden. <b>↑</b>';say(active?'Dienstreise genehmigt. Ziel: außerhalb meiner Zuständigkeit.':'Willkommen zurück. Es hat sich nichts verbessert.');});
  $('start').addEventListener('click',()=>{const active=body.classList.toggle('escalated');$('start').setAttribute('aria-pressed',String(active));$('start').innerHTML=active?'ZURÜCK IN DEN DIENST <span>↙</span>':'ESKALATION BEANTRAGEN <span>↗</span>';$('office-status').textContent=active?'KONTROLLVERLUST GENEHMIGT':'DIENST NACH VORSCHRIFT';apply();if(audio.paused)play();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setCalm(true);return;}if(/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(e.target.tagName)||e.target.isContentEditable||e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;if(e.code==='Space'){e.preventDefault();apply();}if(e.key.toLowerCase()==='g')$('gravity').click();});
  audio.volume=.55;
  function updatePlayer(){body.classList.toggle('playing',!audio.paused);$('play').textContent=audio.paused?'▶':'Ⅱ';$('play').setAttribute('aria-label',audio.paused?'Musik abspielen':'Musik pausieren');}
  async function play(){try{await audio.play();$('music-status').textContent='Die Warteschleife eskaliert ordnungsgemäß.';}catch(error){if(error.name!=='AbortError')$('music-status').textContent=error.name==='NotAllowedError'?'Bitte den Play-Button drücken.':'Song unter music/track.mp3 ablegen oder rechts auswählen.';}updatePlayer();}
  $('play').addEventListener('click',()=>{if(audio.paused)play();else{audio.pause();$('music-status').textContent='Musikalische Mittagspause.';}});
  audio.addEventListener('play',updatePlayer);audio.addEventListener('pause',updatePlayer);
  audio.addEventListener('error',()=>{$('music-status').textContent='Audiodatei fehlt oder ist nicht lesbar. Bitte Song auswählen.';updatePlayer();});
  audio.addEventListener('timeupdate',()=>{if(Number.isFinite(SONG_RESTART_AT_SECONDS)&&SONG_RESTART_AT_SECONDS>0&&!audio.paused&&audio.currentTime>=SONG_RESTART_AT_SECONDS)audio.currentTime=0;});
  $('volume').addEventListener('input',e=>{audio.volume=Number(e.target.value);});
  $('choose').addEventListener('click',()=>$('file').click());
  $('file').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;audio.pause();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);audio.src=objectUrl;$('track-name').textContent=file.name;audio.load();play();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);frame=pointerFrame=0;particles=[];ctx.clearRect(0,0,width,height);}});
  window.addEventListener('resize',resize);resize();setCalm(calm);
})();
