const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const root=path.join(__dirname,'..'),box={};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'levels.js'),'utf8')+';this.designs=LEVELS;this.build=authoredLevel;',box);
const hit=(a,b)=>a.x<b.x+b.w&&a.x+28>b.x&&a.y<b.y+b.h&&a.y+65>b.y;
function canJump(source,target,solids,speed,jump){
 if(source===target)return true;const diff=source.y-target.y;if(diff>155)return false;
 let sx=source.x,ex=source.x+source.w-28;for(const b of solids){if(b===source||b.y>=source.y||b.y+b.h<=source.y-65)continue;if(b.x>sx&&b.x<ex+28)ex=Math.min(ex,b.x-28);else if(b.x<=sx&&b.x+b.w>sx)sx=Math.max(sx,b.x+b.w)}if(sx>ex)return false;const tx=target.x,te=target.x+target.w-28;
 if(Math.max(sx,tx)<=Math.min(ex,te)&&Math.abs(diff)<2)return true;
 const side=target.x+target.w/2>source.x+source.w/2?1:-1;
 const launches=[side>0?ex:sx,Math.max(sx,Math.min(ex,side>0?tx-100:te+100)),Math.max(sx,Math.min(ex,side>0?tx-165:te+165)),Math.max(sx,Math.min(ex,(tx+te)/2))];
 for(const launch of launches){if(Math.min(Math.abs(tx-launch),Math.abs(te-launch))>420)continue;
 for(const second of [-1,.2,.32,.45,.57]){let p={x:launch,y:source.y-65},vy=-jump;
 for(let i=0;i<230;i++){const t=i/120;if(Math.abs(t-second)<1/240)vy=-jump*.88;let dir=target.x+target.w/2>p.x+14?1:-1;let dx=Math.abs(target.x+target.w/2-p.x-14)<speed/120?0:dir*speed/120;p.x+=dx;
 for(const b of solids)if(hit(p,b))p.x=dx>0?b.x-28:b.x+b.w;
 const old=p.y;vy+=1400/120;p.y+=vy/120;let landed=null;
 for(const b of solids)if(hit(p,b)){if(vy>=0&&old+65<=b.y+5){p.y=b.y-65;vy=0;landed=b}else if(vy<0&&old>=b.y+b.h-4){p.y=b.y+b.h;vy=30}}
 if(landed){if(landed===target)return true;break}if(p.y>1800)break;
 }
 }}return false;
}
let failures=[];for(let n=1;n<=35;n++){const l=box.build(n),solids=[...l.platforms,...l.moving];for(const [name,speed,jump] of [['Мисти',250,535],['Гектор',205,490],['Коди',230,500]]){
 for(const spawn of [l.spawn,...l.checkpoints]){const start=solids.find(b=>spawn.x+28>b.x&&spawn.x<b.x+b.w&&spawn.y===b.y);assert.ok(start,'spawn '+n);const reachable=new Set([start]),queue=[start];while(queue.length){const from=queue.shift();for(const dest of solids){if(reachable.has(dest)||Math.min(Math.abs(dest.x-from.x-from.w),Math.abs(from.x-dest.x-dest.w))>420&&!(dest.x<from.x+from.w&&dest.x+dest.w>from.x))continue;if(canJump(from,dest,solids,speed,jump)){reachable.add(dest);queue.push(dest)}}}
 const targets=[['exit',l.exit.x,l.exit.y],['secret',l.secret.x,l.secret.y+35],...l.switches.map((s,i)=>['lever'+i,s.x,s.y]),...(l.key?[['key',l.key.x,l.key.y+35]]:[])];
 for(const [kind,x,y]of (spawn===l.spawn?targets:[targets[0]])){const support=solids.filter(b=>x>=b.x-28&&x<=b.x+b.w&&Math.abs(b.y-y)<8);if(!support.some(b=>reachable.has(b)))failures.push(n+' '+name+' '+kind+' ['+x+','+y+'] reached '+reachable.size+'/'+solids.length)}
 }}}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log('PASS: jump-physics graph reaches exit, every key, lever and secret in 35 stages × 3 heroes (moving platforms at rest; gates open).');
// Validate true asset dimensions, not enlarged CSS rectangles.
for(const name of fs.readdirSync(path.join(root,'assets/textures'))){const b=fs.readFileSync(path.join(root,'assets/textures',name));assert.equal(b.readUInt32BE(16),128);assert.equal(b.readUInt32BE(20),128)}console.log('PASS: all material PNGs are native 128×128.');
