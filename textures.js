// Every material is a real 128×128 PNG. Patterns are cached once per rendering context.
const MATERIALS=['meadow','forest','roof','coast','snow','ruins','castle'];
const textureImages={},texturePatterns=new WeakMap();
if(typeof Image!=='undefined')for(const name of [...MATERIALS,'wood','iron','bark']){const img=new Image();img.src='assets/textures/'+name+'.png';textureImages[name]=img;}
function materialPattern(ctx,name){const img=textureImages[name];if(!img||!img.complete||!img.naturalWidth)return null;let cache=texturePatterns.get(ctx);if(!cache){cache={};texturePatterns.set(ctx,cache)}return cache[name]||=ctx.createPattern(img,'repeat')}
function texturedBlock(b){if(b.gone>0)return;const name=b.type==='moving'?'wood':MATERIALS[L.world],pattern=materialPattern(g,name);g.save();if(b.crumble&&b.stand>0)g.globalAlpha=.55+Math.sin(visualTime*30)*.2;g.fillStyle=pattern||worlds[L.world][4];g.fillRect(b.x,b.y,b.w,b.h);rect('#20273566',b.x,b.y+b.h-5,b.w,5);const caps=['#9caf70','#789562','#d0a18b','#e4ce9a','#e6eff0','#b5aac5','#969aa3'];rect(caps[L.world],b.x,b.y,b.w,5);rect('#f4efd033',b.x,b.y,b.w,2);if(L.world<2){for(let x=b.x+5;x<b.x+b.w-5;x+=17){rect(caps[L.world],x,b.y-3,4,4);rect('#b6c58e',x+5,b.y+5,3,5)}}if(b.crumble){g.strokeStyle='#5e7994';g.lineWidth=2;for(let x=b.x+18;x<b.x+b.w;x+=40){g.beginPath();g.moveTo(x,b.y+3);g.lineTo(x+7,b.y+9);g.lineTo(x+2,b.y+16);g.stroke()}}g.restore()}
function drawArchitecture(){
 const theme=L.world;g.save();g.globalAlpha=.35;const far=worlds[theme][3];
 if([7,14,18,23].includes(level)){const x=level===7?580:level===23?760:700,h=L.height;rect(far,x,110,210,h);if(level===7){g.fillStyle=materialPattern(g,'bark')||far;g.fillRect(x,110,210,h);}rect('#e0d9ad22',x+16,110,10,h);for(let y=160;y<h;y+=110){rect('#e9d7a244',x+45,y,45,60);rect(far,x-25,y-18,260,12)}if(level===7){g.fillStyle='#5a7957';for(let i=0;i<6;i++){g.beginPath();g.ellipse(x+90+(i%2?130:-130),180+i*160,220,65,0,0,7);g.fill()}}}
 if(theme===2||theme===6){for(const b of L.platforms.filter(a=>a.type==='ground'&&a.w>180)){rect(far,b.x+16,b.y+12,b.w-32,L.height-b.y);for(let x=b.x+40;x<b.x+b.w-40;x+=80){rect('#ead7aa66',x,b.y+45,18,29);rect('#353e5266',x+8,b.y+45,2,29)}}}
 if(theme===3){for(let y=520;y<L.height;y+=240){rect('#79b6bd33',0,y,L.len,120);for(let x=0;x<L.len;x+=130)rect('#e9e5c333',x+20,y+40,70,3)}}
 g.restore();
 for(const cp of L.checkpoints){rect('#e3d9b8',cp.x,cp.y-70,3,70);rect(cp.active?'#efd38a':'#839e99',cp.x+3,cp.y-70,27,17);}
 // Signs mark the actual fork or mechanism instead of decorative dead ends.
 for(const s of L.switches){g.fillStyle=s.on?'#d9ebae':'#f0dab0';g.font='bold 10px Nunito';g.textAlign='center';g.fillText(s.duration?(s.on?Math.ceil(s.timer)+'с':'E · '+s.duration+'с'):'E',s.x,s.y-54);g.textAlign='left'}
}
function drawRouteMap(){const x=774,y=14,w=170,h=76;g.save();rect('#1d2c3cbb',x,y,w,h);g.fillStyle='#bec6b6';for(const b of L.platforms){const px=x+6+b.x/L.len*(w-12),py=y+5+b.y/L.height*(h-10);g.fillRect(px,py,Math.max(2,b.w/L.len*(w-12)),2)}const dot=(xx,yy,c)=>rect(c,x+5+xx/L.len*(w-12),y+3+yy/L.height*(h-10),4,4);dot(L.exit.x,L.exit.y,'#efc879');if(L.key&&!L.key.taken)dot(L.key.x,L.key.y,'#f3e1ae');dot(p.x,p.y+p.h,'#a7e2d2');g.restore()}
