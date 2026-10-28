(function(){
var DAYS=10,BMAX=12,NEED={o2:2,food:2,heat:1,shield:1},EV={5:'dust',6:'dust',8:'flare',9:'hiccup'};
var SYS=[{k:'o2',n:'Oxygen',i:'🫧'},{k:'food',n:'Greenhouse',i:'🌿'},{k:'heat',n:'Heat',i:'🌡️'},{k:'shield',n:'Shield',i:'🛡️'}];
var S,log,auto=false,tm=null,lastCard=null;
function $(i){return document.getElementById(i)}
function cl(v,a,b){return Math.max(a,Math.min(b,v))}
function inc(d){return EV[d]==='dust'?2:6}
function spent(){var a=S.alloc;return a.o2+a.food+a.heat+a.shield}
function avail(){return S.batt+inc(S.day)}
function newGame(){clearTimeout(tm);auto=false;S={day:1,batt:4,o2:100,food:100,heat:100,dose:0,alloc:{o2:2,food:2,heat:1,shield:1},over:false};log=[];lastCard=null;$('end').classList.remove('on');beginDay()}
function beginDay(){var o=['o2','heat','food','shield'],t=spent(),a=avail(),i=0;while(t>a&&i<40){var k=o[i%4];if(S.alloc[k]>0){S.alloc[k]--;t--}i++}render()}
function today(){var e=EV[S.day];
 if(e==='dust')return{t:'Dust Storm',s:'Solar income reduced by 2/3.',ic:'🌪️',bad:1};
 if(e==='flare')return{t:'Solar Flare!',s:'High radiation levels.',ic:'⚠️',bad:1};
 if(e==='hiccup')return{t:'Equipment Trouble',s:'Something may trip.',ic:'🔧',bad:1};
 return{t:'Clear Sky',s:'Good solar income.',ic:'☀️'}}
function tomorrow(){var n=EV[S.day+1];
 if(S.day>=DAYS)return{t:'Last day',s:'Almost there!',ic:'🏁'};
 if(n==='dust')return{t:'Dust Storm',s:'Income -2/3',ic:'🌪️',bad:1};
 if(n==='flare')return{t:'Solar Flare',s:'Radiation will spike',ic:'☀️',bad:1};
 return{t:'Clear Sky',s:'Good solar income',ic:'🌤️'}}
function mood(){if(S.over&&S.failed)return'dead';var w=Math.min(S.o2,S.food,S.heat,100-S.dose);return w>60?(EV[S.day]==='dust'?'worried':'happy'):w>30?'worried':'scared'}
function say(){var m=mood(),e=EV[S.day],n=EV[S.day+1];
 if(m==='dead')return'';if(S.o2<40)return'It is hard to breathe...';if(S.food<40)return'My tummy is rumbling...';if(S.heat<40)return'Brrr! So cold!';if(S.dose>65)return'I feel funny... too much radiation.';
 if(e==='dust')return'It\'s so dusty... Let\'s hold on!';if(e==='flare')return'Shield up! The Sun is angry!';if(n==='dust')return'Dust storm tomorrow. Save coins!';if(n==='flare')return'A flare is coming. Shield up!';return'Everything looks good!'}
function render(){
 $('dayT').textContent='Day '+S.day;$('coinT').textContent=avail()-spent();
 var T=today(),N=tomorrow();
 $('fcT').className=T.bad?'bad':'';$('fcT').innerHTML='<div style="display:flex;gap:10px;align-items:center"><span class="ic">'+T.ic+'</span><div><b>Today: '+T.t+'</b><small>'+T.s+'</small></div></div>';
 $('fcN').className=N.bad?'bad':'';$('fcN').innerHTML='<span class="ic">'+N.ic+'</span><div><b>Tomorrow: '+N.t+'</b><small>'+N.s+'</small></div>';
 var b=$('banner');if(T.bad&&EV[S.day]!=='hiccup'){b.style.display='block';b.innerHTML=T.t+'<small>'+T.s+'</small>'}else b.style.display='none';
 var sp=spent(),left=avail()-sp,save=Math.min(BMAX,left);
 var M={o2:S.o2,food:S.food,heat:S.heat,shield:100-S.dose},h='';
 SYS.forEach(function(s){var v=S.alloc[s.k],m=M[s.k],c=m>60?'#3fbf4f':m>30?'#ffb21a':'#e5483d';
  h+='<div class="cd"><div class="n"><span>'+s.i+'</span>'+s.n+'</div><div class="mt"><i style="width:'+cl(m,0,100)+'%;background:'+c+'"></i></div><div class="ctl"><button class="m" data-k="'+s.k+'" data-d="-1" aria-label="Less '+s.n+'"'+(v<=0?' disabled':'')+'>−</button><span class="v">'+v+'</span><button class="p" data-k="'+s.k+'" data-d="1" aria-label="More '+s.n+'"'+(left<=0||v>=3?' disabled':'')+'>+</button></div></div>'});
 h+='<div class="cd" style="grid-column:span 2"><div class="n"><span>🔋</span>Battery</div><div class="batt"><i style="width:'+Math.round(save/BMAX*100)+'%"></i></div><div class="bv">'+save+'</div><div style="font-size:12px;opacity:.7">saved for tomorrow (max '+BMAX+')'+(left>save?' · '+(left-save)+' wasted':'')+'</div></div>';
 $('cards').innerHTML=h;
 scene();
}
function scene(){var m=mood(),e=EV[S.day],E=$('eyes'),P=$('pip');
 var f={happy:'<path d="M-24 0 q8 -12 16 0 M8 0 q8 -12 16 0"/><path d="M-7 14 q7 7 14 0" stroke-width="4"/>',
  worried:'<circle cx="-14" cy="2" r="5" fill="#37e3ff" stroke="none"/><circle cx="14" cy="2" r="5" fill="#37e3ff" stroke="none"/><path d="M-22 -9 l16 5 M22 -9 l-16 5 M-7 17 q7 -7 14 0" stroke-width="3.5"/>',
  scared:'<circle cx="-14" cy="2" r="8" stroke-width="3"/><circle cx="14" cy="2" r="8" stroke-width="3"/><path d="M-7 19 q7 -9 14 0" stroke-width="3.5"/>',
  dead:'<path d="M-22 -6 l12 12 M-10 -6 l-12 12 M10 -6 l12 12 M22 -6 l-12 12" stroke-width="3.5" stroke="#9fb0d8"/>'};
 E.innerHTML=f[m];
 P.setAttribute('transform',m==='dead'?'translate(130,248) rotate(-85)':'translate(210,150)');
 var bu=$('bubble'),t=say();bu.style.display=t?'block':'none';bu.textContent=t;
 $('veil').setAttribute('opacity',e==='dust'?'.42':'0');$('red').setAttribute('opacity',e==='flare'?'.18':'0');
 $('sun').setAttribute('opacity',e==='dust'?'.25':'.9');$('sun').setAttribute('r',e==='flare'?'70':'46');
 var g=$('sp');g.innerHTML='';var n=e==='dust'?34:e==='flare'?20:6,col=e==='flare'?'#ffe27a':'#ffd7a8';
 for(var i=0;i<n;i++){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',Math.random()*800);c.setAttribute('cy',20+Math.random()*290);c.setAttribute('r',(1+Math.random()*2.5).toFixed(1));c.setAttribute('fill',col);c.setAttribute('class','sp');c.style.setProperty('--dx',((Math.random()-.2)*140).toFixed(0)+'px');c.style.setProperty('--dy',((Math.random()-.5)*50).toFixed(0)+'px');c.style.setProperty('--t',(2+Math.random()*3).toFixed(1)+'s');c.style.animationDelay=(-Math.random()*4).toFixed(1)+'s';g.appendChild(c)}
 var p=$('post');if(lastCard){p.style.display='block';p.innerHTML='<b>Postcard · Day '+lastCard.d+'</b><svg viewBox="0 0 190 70" width="100%" style="border-radius:4px;display:block"><rect width="190" height="70" fill="#e58a4c"/><path d="M0 50 L50 25 L90 45 L140 20 L190 48 V70H0Z" fill="#a8461f"/><path d="M60 62 a22 22 0 0 1 44 0Z" fill="#efe0cc"/><path d="M112 62 a26 24 0 0 1 52 0Z" fill="#bfeff0"/></svg><p>'+lastCard.t+'</p>'}else p.style.display='none'}
function card(d,e){var L;
 if(e==='dust')L=['The sky turned orange today. Pip is staying strong. We need to be ready for brighter days ahead!'];
 else if(e==='flare')L=['The Sun sneezed! We hid behind the shield and counted every coin.'];
 else if(e==='hiccup')L=['The heater tripped. Pip is wearing three pairs of socks.'];
 else if(S.food<40)L=['Pip dreams about tomatoes. The greenhouse is hungry.'];
 else if(S.o2<40)L=['The air feels thin. Pip is breathing slowly.'];
 else if(S.heat<40)L=['Brr! Pip hugged the heater all day.'];
 else if(S.batt>=8)L=['The battery is full. Pip feels ready for anything!'];
 else L=['Quiet day on Mars. Pip watered the plants and waved at the Sun.'];
 return{d:d,t:L[0]}}
function endDay(){if(S.over)return;
 var a=S.alloc,d=S.day,e=EV[d]||null,r={day:d,income:inc(d),batt:S.batt,alloc:{o2:a.o2,food:a.food,heat:a.heat,shield:a.shield},ev:e};
 S.batt=Math.min(BMAX,S.batt+inc(d)-spent());
 S.o2+=(a.o2-NEED.o2)*15;S.food+=(a.food-NEED.food)*10;S.heat+=(a.heat-NEED.heat)*15;S.dose+=Math.max(0,8-3*a.shield);
 if(e==='flare')S.dose+=Math.max(0,36-12*a.shield);if(e==='hiccup')S.heat-=20;
 S.o2=Math.min(100,S.o2);S.food=Math.min(100,S.food);S.heat=Math.min(100,S.heat);
 var fk=null;if(S.dose>=100){fk='dose';S.dose=100}else if(S.o2<=0){fk='o2';S.o2=0}else if(S.heat<=0){fk='heat';S.heat=0}else if(S.food<=0){fk='food';S.food=0}
 log.push(r);var st=$('stage');st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake');
 lastCard=card(d,e);
 if(fk){S.over=true;S.failed=true;render();setTimeout(function(){showFail(fk,d)},auto?1200:1300);return}
 if(d>=DAYS){S.over=true;render();setTimeout(showWin,1200);return}
 S.day++;setTimeout(beginDay,450)}
function bb(key,dF){var sk=key==='dose'?'shield':key,nm={o2:'Oxygen',food:'Greenhouse',heat:'Heat',shield:'Shield'},ic={o2:'🫧',food:'🌿',heat:'🌡️',dose:'☢️'};
 var dust=log.filter(function(l){return l.ev==='dust'}),fl=log.filter(function(l){return l.ev==='flare'})[0],hi=log.filter(function(l){return l.ev==='hiccup'})[0];
 var low=log.filter(function(l){return l.alloc[sk]<NEED[sk]}),ch=[];
 if(key==='dose'){ch.push({i:'☀️',t:fl?'Solar flare hit the base on Day '+fl.day+'.':'Radiation built up every day.'});
  ch.push({i:'🛡️',t:fl?'Shield had '+(fl.alloc.shield===0?'zero':fl.alloc.shield)+' coin'+(fl.alloc.shield===1?'':'s')+'.':'Shield stayed low for most days.'});
  ch.push({i:'☢️',t:'Radiation reached a dangerous level.'})}
 else{var dd=dust.length&&dust[0].day<dF;
  ch.push({i:dd?'🌪️':hi&&hi.day<=dF?'🔧':'📉',t:dd?'Dust storm cut Sun income to 2 coins (Days '+dust[0].day+' to '+dust[dust.length-1].day+').':hi&&hi.day<=dF?'Equipment trouble hit on Day '+hi.day+'.':'Everyday spending drained the base.'});
  if(dd)ch.push({i:'🔋',t:'Battery held only '+dust[0].batt+' coin'+(dust[0].batt===1?'':'s')+' when the storm began.'});
  ch.push({i:'🪙',t:nm[sk]+' got too little on '+low.length+' day'+(low.length===1?'':'s')+' (needs '+NEED[sk]+' a day).'});
  ch.push({i:ic[key],t:{o2:'Oxygen ran out.',food:'The crops ran out.',heat:'The base froze.'}[key]+' (Day '+dF+')'})}
 return ch}
function showFail(k,d){var c=bb(k,d);
 $('endM').innerHTML='<h2>Black Box Replay</h2><ul class="chain">'+c.map(function(x){return'<li><span class="i">'+x.i+'</span>'+x.t+'</li>'}).join('')+'</ul><div class="lesson">Pip didn\'t fail because of the Sun.<br>Pip failed because of a decision made days earlier.</div><p class="mini">You practiced: power budgeting · protection vs power · cause and effect</p><button class="go" id="retry" style="width:100%;margin-top:14px">Try again</button>';
 $('end').classList.add('on');$('retry').onclick=newGame}
function showWin(){var av=log.reduce(function(s,l){return s+l.alloc.shield},0)/log.length,p=S.dose<40&&av>=1.5?'Careful Guardian':S.batt>=8?'Efficient Planner':'Daring Cadet';
 $('endM').innerHTML='<h2>Mission complete!</h2><p>Pip survived all 10 days on Mars. 🎉</p><div class="patch">'+p+'</div><p style="font-size:15px;opacity:.85">Battery left: '+S.batt+' · Radiation: '+Math.round(S.dose)+' of 100</p><p class="mini">You practiced: power budgeting · protection vs power · cause and effect</p><button class="go" id="again" style="width:100%;margin-top:10px">Play again</button>';
 $('end').classList.add('on');$('again').onclick=newGame}
function runAuto(){newGame();auto=true;$('title').classList.remove('on');
 (function step(){if(!auto||S.over)return;S.alloc={o2:2,food:2,heat:1,shield:0};beginDay();tm=setTimeout(function(){endDay();tm=setTimeout(step,1300)},1000)})()}
$('cards').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||S.over||auto)return;var k=b.getAttribute('data-k'),d=+b.getAttribute('data-d'),n=S.alloc[k]+d;if(n<0||n>3)return;if(d>0&&spent()>=avail())return;S.alloc[k]=n;render()});
$('endBtn').onclick=function(){if(!auto)endDay()};
$('playBtn').onclick=function(){$('title').classList.remove('on')};
function how(){$('how').classList.add('on')}
$('howBtn').onclick=how;$('howBtn2').onclick=how;$('howClose').onclick=function(){$('how').classList.remove('on')};
$('demoBtn').onclick=runAuto;
$('title').classList.add('on');newGame();
})();
