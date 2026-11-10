// Story, combat and effects. All state is local; saves from v1 remain valid.
let visualTime=0,scene=null,particles=[],slashFX=[],projectiles=[],shake=0,flash=0,reducedMotion=false;
const chapterStory=[
 ['Мисти','Тропа светится… Здесь прошёл тот, кто забрал Колокол Рассвета.'],
 ['Коди','Лес шепчет моё имя. Надеюсь, он просто хочет познакомиться.'],
 ['Гектор','Следы на черепице. Держимся вместе — город высоко, а мы маленькие.'],
 ['Коди','Море! Солёный ветер! И ни одной приличной рыбной лавки.'],
 ['Мисти','В снегу остались огромные следы. Богданус уже совсем близко.'],
 ['Гектор','Руны говорят: колокол открывается не силой, а согласием трёх сердец.'],
 ['Мисти','За этими воротами кончается ночь. Вернём нашему дому рассвет.']
];
const afterLines=[
 ['Коди','Первый шаг сделан! Если приключение пахнет рыбой — мы идём правильно.'],
 ['Мисти','Высота — это просто ещё одна дорога. Особенно с двумя прыжками.'],
 ['Гектор','Древний механизм проснулся. Кто-то оставил нам путь через ворота.'],
 ['Гектор','Даже маленький ящик может удержать большие ворота. Не всё решается мечом.'],
 ['Мисти','В траве я нашла герб Стражей Рассвета. Значит, легенда не выдумка.'],
 ['Коди','Мхи мягкие, мыши сердитые. У этого леса странное гостеприимство.'],
 ['Мисти','На верхних ветках есть метки. Они ведут к старой мельнице.'],
 ['Гектор','Ключ с лунным знаком. Береги его: такие двери не любят спешки.'],
 ['Коди','Сверху лес похож на зелёное море. Только плавать в нём колючее.'],
 ['Гектор','Мельница больше не крутится. Зато её тень указывает прямо на город.'],
 ['Мисти','Черепица тёплая. Здесь ещё помнят свет Колокола Рассвета.'],
 ['Коди','На чердаке — карта берега. И крошки. Очень древние, невкусные крошки.'],
 ['Гектор','Площадь пуста. Горожане спрятались, когда над башней погасло утро.'],
 ['Мисти','Часы остановились на рассвете. Богданус забрал не только колокол.'],
 ['Коди','Поезд ушёл. Хорошо, что у нас есть лапы и совершенно нет расписания.'],
 ['Коди','Ветер рассказал, где искать маяк. Или это чайка кричала про обед.'],
 ['Гектор','Острова разделены водой, но старые мосты ещё держат слово.'],
 ['Мисти','В маяке горит лунный огонь. Он указывает путь к снежным вершинам.'],
 ['Коди','Я чуть не стал летающим котом. Впрочем, выглядело наверняка великолепно.'],
 ['Гектор','За приливом открылась лестница в горы. Теперь только вверх.'],
 ['Мисти','Снег глушит шаги, но не надежду. Где-то впереди ждёт наш рассвет.'],
 ['Коди','Лёд трещал громче моей брони. Надо запомнить: не танцевать на льду.'],
 ['Гектор','Подъёмник работал на силе трёх стражей. Мы возвращаем старые чудеса.'],
 ['Мисти','В белой тишине я услышала колокол. Он зовёт из лунных руин.'],
 ['Гектор','Перевал позади. Впереди место, где началась история Богдануса.'],
 ['Мисти','На стене три маленьких рыцаря и большой кот. Когда-то они были друзьями.'],
 ['Гектор','Богданус охранял колокол. А потом решил, что только он достоин слышать его.'],
 ['Коди','Три рычага, три друга. Даже древним строителям нравилась наша команда.'],
 ['Мисти','Звёзды отражаются в камне. Они помнят, что страж не должен быть один.'],
 ['Гектор','Портал открыт. По ту сторону — замок и последний разговор.'],
 ['Коди','У ворот написано «Не беспокоить». Что ж, мы очень вежливо побеспокоим.'],
 ['Мисти','Тени здесь движутся сами. Но от света трёх клинков им не укрыться.'],
 ['Гектор','Последний ключ у нас. За дверью слышны тяжёлые шаги.'],
 ['Мисти','Он ждёт. Не забудьте: мы пришли вернуть рассвет, а не отнять чей-то дом.'],
 ['Богданус','Я боялся, что про меня забудут. А вы… всё равно пришли.']
];
const npcLines=[
 'Я — Сова Ори. Богданус унёс Колокол Рассвета в свой замок. Без него наше утро не наступит. J — взмах оружием. X — особый приём. Начни с тропы справа!',
 'Впереди мыши-разбойники. Прыгай им на голову или бей оружием на J. В воздухе у тебя есть второй прыжок — пробел ещё раз.',
 'Золотой рычаг любит внимательные лапы: встань рядом и нажми E. В бою не забывай отходить после удара.',
 'Зажми E и двигай ящик на золотую кнопку. Гектор толкает быстрее, но задача по силам каждому рыцарю.',
 'Звезда скрывает наряд! Он останется в гардеробе даже после возвращения на карту. Броня у тебя уже есть — шапочка сверху не помешает.'
];
function storyPages(kind){if(kind==='intro')return [
 ['Ори','В долине Лаполесья каждое утро начиналось с Колокола Рассвета. Пока однажды он не замолчал.'],
 ['Богданус','Я охранял его целую вечность! Теперь рассвет будет только в моём замке!'],
 ['Мисти','Тогда мы сами найдём дорогу к утру. Я пойду первой — по самым высоким крышам.'],
 ['Гектор','Я прикрою вас щитом. А если дорога закрыта — мы откроем её вместе.'],
 ['Коди','А я принесу хорошее настроение! И, если повезёт, немного рыбы. В путь, рыцари!']
 ];if(kind==='boss')return [['Богданус','Три крошечных рыцаря против меня? Вашим мечам не расколоть мою броню!'],['Гектор','Мы не хотим раскалывать твою броню. Просто верни колокол.'],['Мисти','Он бросается вперёд, а потом устаёт. В этот момент прыгай на голову или бей оружием.'],['Коди','План отличный. Главное — не оказаться под его лапами!']];return []}
function playScene(pages,onEnd,cinematic=true,label='ЛЕГЕНДА О КОЛОКОЛЕ РАССВЕТА'){
 scene={pages,index:0,elapsed:0,total:0,onEnd,cinematic,label};mode='story';keys={};pressed={};acc=0;
 $('#overlay').hidden=true;$('#story').hidden=false;$('#story').classList.toggle('dialogue',!cinematic);
 $('#storyNext').onclick=advanceStory;$('#storySkip').onclick=finishStory;setStoryPage();
}
function setStoryPage(){scene.elapsed=0;const [who]=scene.pages[scene.index];$('#storyName').textContent=who;$('#storyLabel').textContent=scene.label+' · '+(scene.index+1)+' / '+scene.pages.length;$('#storyText').textContent='';$('#storyNext').textContent=scene.index===scene.pages.length-1?'В путь →':'Дальше →';}
function advanceStory(){if(!scene)return;const text=scene.pages[scene.index][1];if(scene.elapsed*42<text.length){scene.elapsed=text.length/42+1;$('#storyText').textContent=text;return}scene.index++;tone(420,.04);if(scene.index>=scene.pages.length)finishStory();else setStoryPage()}
function finishStory(){if(!scene)return;const done=scene.onEnd;scene=null;$('#story').hidden=true;keys={};pressed={};acc=0;mode='play';done?.();}
function updateStory(dt){if(!scene)return;visualTime+=dt;scene.elapsed+=dt;scene.total+=dt;const text=scene.pages[scene.index][1];$('#storyText').textContent=text.slice(0,Math.floor(scene.elapsed*42));}
function renderStory(){if(!scene)return;const speaker=scene.pages[scene.index][0],id=heroes.findIndex(h=>h.name===speaker);const pc=$('#storyPortrait').getContext('2d');pc.clearRect(0,0,100,100);rect('#263342',0,0,100,100,pc);if(id>=0)cat(pc,50,93,1.15,id,hat,1,0);else if(speaker==='Богданус')cat(pc,50,97,1.3,1,3,-1,0);else owl(pc,50,76,1.5);if(!scene.cinematic){render();return}background();rect('#151c3544',0,0,W,H);rect('#7d846c',0,326,W,214);rect('#b8bc8e',0,324,W,5);
 // Distant citadel and stolen bell.
 rect('#42475b',650,190,155,267);for(let i=0;i<3;i++){rect('#42475b',625+i*82,155,35,300);rect('#cbbba4',620+i*82,148,45,9)}rect('#d5b576',709,265,26,37);rect('#ffe4a0',705,300,34,7);
 for(let i=0;i<3;i++){const progress=reducedMotion?1:Math.min(1,scene.total*.45);cat(g,180+i*115+(1-progress)*-220,323,1.65,i,i===0?1:i===1?0:7,1,progress<1?visualTime*9:0);}
 
 rect('#172438',0,0,W,34);rect('#172438',0,H-34,W,34);g.fillStyle='#d5c7a4';g.font='12px Nunito';g.fillText(scene.label,28,22);
}
function opening(n){if(n===1&&!save.introSeen){playScene(storyPages('intro'),()=>{save.introSeen=true;persist()})}else if(n===35){playScene(storyPages('boss'),null,true,'ПОСЛЕДНИЙ СТРАЖ')}else if((n-1)%5===0){playScene([chapterStory[L.world]],null,true,'ГЛАВА '+(L.world+1)+' · '+worlds[L.world][0].toUpperCase())}}
function ending(next){const line=afterLines[level-1],pages=[line];if(level%5===0&&level<35)pages.push(['Ори',['За лесом ждёт город крыш. Колокол оставил след в каждом сердце.','За городом шумит море. Ищите свет старого маяка.','Звёздная тропа ведёт к берегу, а оттуда — в горы.','Не бойтесь холода: друзья согреют даже самые снежные вершины.','Лунные руины хранят тайну одинокого стража.','Замок близко. Помните: иногда храбрость — это протянуть лапу.'][Math.floor(level/5)-1]||'Тропа ведёт дальше.']);if(level===35)pages.push(['Гектор','Страж не обязан быть один. Пойдём с нами. Места у очага хватит всем.'],['Коди','И на завтрак хватит! Наверное. Если Мисти не съест мою порцию.'],['Ори','Колокол зазвенел вновь. Но главное чудо случилось раньше — когда три маленьких рыцаря выбрали дружбу.']);playScene(pages,next,true,level===35?'ЭПИЛОГ · ДОРОГА ДОМОЙ':'ПОСЛЕ ПУТИ · '+titles[level-1].toUpperCase())}
function owl(ctx,x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const r=(c,a,b,w,h)=>rect(c,a,b,w,h,ctx);r('#5b5063',-17,-35,34,34);r('#b6a28e',-15,-37,30,30);r('#6d687a',-20,-24,7,25);r('#6d687a',13,-24,7,25);r('#e9dbb0',-13,-32,11,13);r('#e9dbb0',3,-32,11,13);r('#39374d',-9,-29,5,7);r('#39374d',6,-29,5,7);r('#d6a869',-2,-20,5,7);r('#e2d7bd',-7,-10,14,10);r('#d6a869',-10,0,8,3);r('#d6a869',5,0,8,3);r('#7d72a5',-22,-39,43,4);r('#7d72a5',-11,-49,22,10);ctx.restore()}
function spawnEnemies(){L.enemies=[];if(level===35)return;L.platforms.filter(b=>b.type==='ground'&&b.x>=620&&b.w>150).forEach((b,i)=>{if(level===1||i%2&&level<6||b.x<1700&&b.x>1150)return;const type=level>=20&&i%3===0?'guard':level>=8&&i%3===1?'bat':'mouse';L.enemies.push({x:b.x+Math.min(80,b.w/2),y:b.y-(type==='bat'?130:32),w:30,h:type==='bat'?24:32,left:b.x+10,right:b.x+b.w-42,baseY:b.y-(type==='bat'?130:32),dir:-1,hp:type==='guard'?3:type==='bat'?1:2,type,hit:0,dead:false,t:0})});L.npc={x:190,y:470};}
function burst(x,y,color='#ebcf8b',count=12){if(reducedMotion)return;for(let i=0;i<count&&particles.length<220;i++){const a=Math.random()*Math.PI*2,v=35+Math.random()*110;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-50,life:.3+Math.random()*.35,max:.7,c:color,size:2+Math.floor(Math.random()*3)})}}
function hitEnemy(e,amount=1){if(e.dead||e.hit>0)return;e.hp-=amount;e.hit=.25;burst(e.x+15,e.y+15,e.type==='bat'?'#a9b3e0':'#ecc78b');tone(e.hp<=0?260:160,.08);if(e.hp<=0){e.dead=true;L.collected+=2;notify('+2 рыбки · противник отступил')}}
function melee(){if(p.attackCD>0)return;p.attack=.22;p.attackCD=selected===1?.5:.32;slashFX.push({x:p.x+14+p.dir*28,y:p.y+28,dir:p.dir,life:.2,c:['#c1b3ef','#f4d79a','#a5ddd0'][selected]});tone(selected===1?150:520,.09);const box={x:p.dir>0?p.x+p.w-5:p.x-62,y:p.y-8,w:67,h:p.h+15};L.enemies.forEach(e=>{if(overlap(box,e))hitEnemy(e,selected===1?2:1)});if(L.boss&&L.boss.stun>0&&overlap(box,{x:L.boss.x-45,y:352,w:90,h:118})){L.boss.hp--;L.boss.stun=0;burst(L.boss.x,400,'#f1cf8b',24);shake=.2;if(L.boss.hp<=0){L.boss=null;notify('Богданус опускает оружие…')}}}
function skill(){if(p.cool>0)return;if(selected===0){projectiles.push({x:p.x+14,y:p.y+24,vx:p.dir*430,life:1.6,w:16,h:16});p.cool=2.5;if(p.ground){p.vy=-610;p.ground=false;p.jumps=1}burst(p.x,p.y+50,'#bbacf0');tone(790,.18);notify('Лунный клинок · волна + прыжок')}else if(selected===1){p.inv=2;p.shield=2;p.cool=5;L.enemies.forEach(e=>{if(Math.abs(e.x-p.x)<150&&Math.abs(e.y-p.y)<100)hitEnemy(e,2)});slashFX.push({x:p.x+14,y:p.y+40,life:.5,ring:true,c:'#f1d39b'});burst(p.x+14,p.y+40,'#edcc90',24);shake=.16;tone(170,.2);notify('Удар стража · щит на 2 секунды')}else{p.dash=.22;p.dashDir=p.dir;p.inv=Math.max(p.inv,.3);p.vy=Math.min(p.vy,-90);p.cool=2;burst(p.x,p.y+30,'#a4d8c4');tone(600,.14);notify('Рывок лиса · прорыв сквозь врагов')}}
function updateCombat(dt,oldY){p.attack=Math.max(0,p.attack-dt);p.attackCD=Math.max(0,p.attackCD-dt);p.shield=Math.max(0,p.shield-dt);if(pressed.KeyJ)melee();if(pressed.KeyX)skill();
 for(const e of L.enemies){if(e.dead)continue;e.t+=dt;e.hit=Math.max(0,e.hit-dt);const speed=e.type==='guard'?34:e.type==='bat'?70:48+level;e.x+=e.dir*speed*dt;if(e.x<e.left){e.x=e.left;e.dir=1}if(e.x>e.right){e.x=e.right;e.dir=-1}if(e.type==='bat')e.y=e.baseY+Math.sin(e.t*3)*24;
 if(p.dash>0&&overlap(p,e)){hitEnemy(e,2);continue}if(overlap(p,e)){if(p.vy>0&&oldY+p.h<=e.y+13){hitEnemy(e,1);p.vy=-370;p.jumps=1}else damage()}}
 for(const bolt of projectiles){bolt.x+=bolt.vx*dt;bolt.life-=dt;for(const e of L.enemies){if(!e.dead&&overlap(bolt,e)){hitEnemy(e,1);bolt.life=0;break}}if(L.boss&&L.boss.stun>0&&overlap(bolt,{x:L.boss.x-45,y:352,w:90,h:118})){L.boss.hp--;L.boss.stun=0;bolt.life=0;burst(L.boss.x,400);if(L.boss.hp<=0)L.boss=null;}}
 projectiles=projectiles.filter(b=>b.life>0);L.enemies=L.enemies.filter(e=>!e.dead);if(L.npc&&pressed.KeyE&&Math.abs(p.x-L.npc.x)<60&&Math.abs(p.y+p.h-L.npc.y)<70){const lines=level<=5?[['Ори',npcLines[level-1]]]:[['Ори',chapterStory[L.world][1]], [heroes[selected].name,selected===1?'Я прикрою друзей. Ни один страж не останется один.':selected===0?'Проверю верхнюю дорогу. Секреты часто прячутся над головой.':'Блестящие рыбки, злые мышки… обычный вторник рыцаря!']];playScene(lines,null,false,'РАЗГОВОР У ТРОПЫ')}
}
function updateEffects(dt){visualTime+=dt;shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);for(const a of particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=210*dt}particles=particles.filter(a=>a.life>0);slashFX.forEach(s=>s.life-=dt);slashFX=slashFX.filter(s=>s.life>0)}
function drawEnemies(){for(const e of L.enemies){if(e.x<cam-60||e.x>cam+W+60)continue;g.save();g.translate(Math.round(e.x+15),Math.round(e.y+e.h));g.scale(e.dir,1);const r=(c,x,y,w,h)=>rect(e.hit>0?'#f5dfba':c,x,y,w,h);if(e.type==='bat'){const wing=Math.sin(visualTime*15)*8;r('#6a617d',-22,-20-wing,17,6);r('#9a89ad',7,-20-wing,17,6);r('#524860',-9,-24,18,22);r('#d6c198',-5,-18,4,4);r('#d6c198',3,-18,4,4)}else{r('#765e62',-13,-27,25,24);r('#a293a0',-11,-29,21,21);r('#ad8b94',-13,-35,10,10);r('#ad8b94',5,-35,10,10);r('#ddbdab',-10,-32,4,4);r('#ddbdab',8,-32,4,4);r('#413946',4,-23,3,4);r('#e4baa2',11,-17,4,3);r('#6d5964',-12,-8,25,8);r('#3f4254',-11,-1,8,3);r('#3f4254',5,-1,8,3);r('#bda788',17,-26,3,26);r('#e1cbb1',13,-29,10,4);if(e.type==='guard'){r('#5a6d7b',-14,-15,27,11);r('#c0c4bb',-14,-36,28,6);r('#597083',-19,-24,12,20);r('#ddc18c',-18,-23,10,2)}}g.restore();if(e.hp>1){rect('#263445',e.x,e.y-10,30,3);rect('#cd9c92',e.x,e.y-10,e.hp*10,3)}}
 if(L.npc){owl(g,L.npc.x,L.npc.y,1);if(Math.abs(p.x-L.npc.x)<100){g.fillStyle='#fff0cc';g.font='bold 12px Nunito';g.textAlign='center';g.fillText('E · поговорить',L.npc.x,L.npc.y-65);g.textAlign='left'}}}
function drawEffects(){for(const b of projectiles){rect('#ad9adf66',b.x-Math.sign(b.vx)*18,b.y+2,28,12);rect('#e3dcff',b.x,b.y,10,16);rect('#fff5d9',b.x+3,b.y+3,3,10)}for(const s of slashFX){g.save();g.strokeStyle=s.c;g.lineWidth=s.ring?4:5;g.globalAlpha=Math.min(1,s.life*5);g.beginPath();if(s.ring)g.arc(s.x,s.y,20+(1-s.life/.5)*125,0,7);else g.arc(s.x,s.y,32+(1-s.life/.2)*20,s.dir>0?-1.3:1.8,s.dir>0?1.3:4.5);g.stroke();g.restore()}if(p.shield>0){g.strokeStyle='#f2d697';g.lineWidth=2;g.beginPath();g.ellipse(p.x+14,p.y+32,30,43,0,0,7);g.stroke()}for(const a of particles){g.globalAlpha=Math.min(1,a.life/a.max);rect(a.c,a.x,a.y,a.size,a.size)}g.globalAlpha=1;}
function animateMenu(){const canvases=document.querySelectorAll('.card canvas');canvases.forEach((canvas,i)=>{const c=canvas.getContext('2d');c.clearRect(0,0,260,110);rect('#d2dbc8',75,103,110,3,c);cat(c,130,104,1.3,i,hat,1,0)})}
