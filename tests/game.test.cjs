const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=process.argv[2]||path.join(__dirname,'..');
const elements=new Map(),ctx=new Proxy({},{get:()=>()=>{}});const el=()=>({innerHTML:'',textContent:'',hidden:false,style:{},classList:{toggle(){}},append(){},getContext:()=>ctx,querySelector:()=>el(),lastChild:{append(){}},offsetTop:0});
const document={querySelector:s=>{if(!elements.has(s))elements.set(s,el());return elements.get(s)},querySelectorAll:()=>[],createElement:()=>el()};
let stored={hero:1,hat:2,unlocked:9,done:[1,2,3,4,5,6,7,8],outfits:[0,1,2],fish:42};
const sandbox={document,localStorage:{getItem:()=>JSON.stringify(stored),setItem:(k,v)=>stored=JSON.parse(v)},window:{addEventListener(){},scrollTo(){}},requestAnimationFrame(){},console,assert};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'levels.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'textures.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'adventure.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'game.js'),'utf8')+`
assert.equal(save.unlocked,9);assert.equal(save.hat,2);assert.equal(save.fish,42);
for(let n=1;n<=35;n++)for(selected=0;selected<3;selected++){
 start(n,false);assert.equal(mode,'play');assert.ok(L.platforms.every(b=>Number.isFinite(b.x)&&b.w>0));
 for(let i=0;i<120;i++)update(1/120);assert.ok(p.ground,'spawn grounded '+n);
 pressed.Space=true;update(1/120);assert.ok(p.vy<0);pressed.Space=true;update(1/120);assert.equal(p.jumps,2);
 for(const e of L.enemies)assert.ok(e.left<=e.x&&e.x<=e.right);
 render();
}
console.log('PASS: 105 level/hero starts, double jumps, enemy patrol bounds and rendering');
selected=0;start(3,false);p.x=L.switches[0].x;p.y=L.switches[0].y-p.h;pressed.KeyE=true;update(1/120);assert.ok(L.switches[0].on);
start(28,false);p.x=L.switches[0].x;p.y=L.switches[0].y-p.h;pressed.KeyE=true;update(1/120);assert.ok(L.switches[0].on);assert.ok(!L.switches[1].on,'distant lever stays off');
start(4,false);L.crates[0].x=L.plates[0].x;L.crates[0].y=L.plates[0].y-40;update(1/120);assert.ok(L.plates[0].on);
console.log('PASS: levers respect distance and height; crate activates pressure plate');
for(selected=0;selected<3;selected++){
 start(2,false);L.platforms=[{x:0,y:470,w:1500,h:200}];p.x=680;p.y=405;p.dir=1;
 const e={x:720,y:438,w:30,h:32,left:710,right:800,baseY:438,dir:1,hp:3,type:'guard',hit:0,dead:false,t:0};L.enemies=[e];
 melee();assert.equal(e.hp,selected===1?1:2);melee();assert.equal(e.hp,selected===1?1:2,'attack cooldown');
 p.attackCD=0;skill();assert.ok(p.cool>0);const cool=p.cool;skill();assert.equal(p.cool,cool);
 if(selected===0)assert.equal(projectiles.length,1);if(selected===1)assert.equal(p.shield,2);if(selected===2){assert.ok(p.dash>0);const x=p.x;update(1/120);assert.ok(p.x>x,'dash moves over multiple physics steps')}
}
console.log('PASS: three melee weapons, attack cooldowns, projectile / shield / sustained dash');
selected=0;start(2,false);const e=L.enemies[0];p.x=e.x;p.y=e.y-p.h-1;p.vy=180;update(1/60);assert.equal(e.hp,1);assert.ok(p.vy<0,'stomp bounces');
start(2,false);const contact=L.enemies[0];p.x=contact.x;p.y=contact.y;const health=p.hp;updateCombat(1/120,p.y);assert.equal(p.hp,health-1);updateCombat(1/120,p.y);assert.equal(p.hp,health-1,'hurt invulnerability');
start(2,false);p.y=L.height+200;p.hp=1;p.inv=1;update(1/120);assert.equal(p.hp,3);assert.ok(p.y<L.height,'fall always respawns even while invulnerable');
console.log('PASS: stomp, contact damage, invulnerability and fall recovery');
start(1,false);p.x=180;p.y=L.spawn.y-p.h;pressed.KeyE=true;update(1/120);assert.equal(mode,'story');assert.ok(!scene.cinematic);const before=p.x;updateStory(.2);renderStory();assert.equal(p.x,before);finishStory();assert.equal(mode,'play');
for(let n=1;n<=35;n++){start(n,false);complete();assert.equal(mode,'story');assert.ok(save.done.includes(n),'clear saved before scene');assert.ok(scene.pages.every(a=>a[0]&&a[1]),'nonempty scene '+n);renderStory();finishStory();assert.equal(mode,'win');assert.equal(scene,null);}
start(1,false);playScene(storyPages('intro'),null);advanceStory();assert.equal(scene.index,0,'first tap reveals text');advanceStory();assert.equal(scene.index,1);finishStory();assert.equal(mode,'play');assert.ok(Object.keys(keys).length===0);
console.log('PASS: NPC conversation freezes gameplay, all 35 outro scenes, intro advance/skip, cleared controls');
start(35,false);for(let i=0;i<6;i++){L.boss.stun=2;L.boss.cool=2;L.boss.phase=2;p.x=L.boss.x-25;p.y=L.boss.y-118-p.h;p.vy=100;p.inv=0;update(1/60)}assert.equal(L.boss,null);
start(35,false);L.boss.stun=2;L.boss.cool=2;p.x=L.boss.x-90;p.y=L.boss.y-p.h;p.dir=1;const hp=L.boss.hp;melee();assert.equal(L.boss.hp,hp-1);p.attackCD=0;melee();assert.equal(L.boss.hp,hp-1,'boss armour outside vulnerability window');
for(let i=0;i<100;i++)burst(0,0);assert.ok(particles.length<=220);updateEffects(2);assert.equal(particles.length,0);
console.log('PASS: boss stomps and melee vulnerability, bounded particles and cleanup');
start(28,false);L.switches[0].on=true;assert.ok(gateOpen(L.gates[0]));assert.ok(!gateOpen(L.gates[1]));L.switches[1].on=true;assert.ok(gateOpen(L.gates[1]));assert.ok(!gateOpen(L.gates[2]));
start(19,false);L.enemies=[];p.x=L.switches[0].x;p.y=L.switches[0].y-p.h;pressed.KeyE=true;update(1/120);assert.ok(L.switches[0].on);const first=L.switches[0].timer;update(1/120);assert.ok(L.switches[0].timer<first);L.switches[0].timer=.001;update(1/120);assert.ok(!L.switches[0].on);pressed.KeyE=true;update(1/120);assert.ok(L.switches[0].on,'timed lever restarts');
start(9,false);L.enemies=[];const lift=L.moving.find(m=>m.axis==='y');p.x=lift.x+20;p.y=lift.y-p.h;p.ground=true;const py=p.y;update(1/120);assert.ok(p.y!==py&&Math.abs(p.y+p.h-lift.y)<.01,'vertical platform carries rider');
start(22,false);L.enemies=[];const fragile=L.platforms.find(b=>b.crumble);p.x=fragile.x+30;p.y=fragile.y-p.h;p.ground=true;for(let i=0;i<115;i++)update(1/120);assert.ok(fragile.gone>0,'fragile ice breaks');p.x=L.spawn.x;p.y=L.spawn.y-p.h;for(let i=0;i<350;i++)update(1/120);assert.equal(fragile.gone,0,'fragile ice recovers');
start(7,false);assert.ok(camY>500,'camera begins at bottom of tower');p.y=250;p.x=1100;update(1/120);assert.ok(camY<100,'camera follows ascent');
start(1,false);const exit=L.exit;p.x=exit.x;p.y=100;update(1/120);assert.equal(mode,'play','exit requires correct elevation');p.x=exit.x;p.y=exit.y-p.h;update(1/120);assert.equal(mode,'story');
console.log('PASS: individually linked gates, timed reset, elevator carry, breakaway ice recovery, vertical camera, elevated exit');
selected=1;start(19,false);L.enemies=[];L.npc=null;p.x=L.switches[0].x;p.y=L.switches[0].y-p.h;pressed.KeyE=true;update(1/120);keys.KeyD=true;let crossed=false;
for(let i=0;i<8*120;i++){const support=L.platforms.find(b=>Math.abs(b.y-p.y-p.h)<4&&p.x+28>b.x&&p.x<b.x+b.w);if(p.ground&&support&&support.x+support.w-p.x<80)pressed.Space=true;else if(!p.ground&&p.jumps===1&&p.vy>0)pressed.Space=true;update(1/120);if(p.x>L.gates[0].x+30){assert.ok(L.switches[0].on);crossed=true;break}}
assert.ok(crossed,'slowest hero can clear the timed route without skill');console.log('PASS: actual game physics clears the timed gate with Hector inside eight seconds');
`,sandbox,{timeout:10000});


