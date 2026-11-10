const fs=require('node:fs'),zlib=require('node:zlib'),path=require('node:path');const out=path.resolve(__dirname,'../assets/textures');fs.mkdirSync(out,{recursive:true});
const palettes={meadow:['#78614b','#8c7457','#594d40','#9b8766'],forest:['#594c3e','#776349','#3e3d32','#928064'],roof:['#8c5c56','#ab7464','#61474a','#c18b75'],coast:['#b69e75','#d1b98b','#8c8065','#dfc89a'],snow:['#8c9eae','#b1c1ce','#61798d','#dce5e8'],ruins:['#686478','#868094','#484958','#a7a2ac'],castle:['#555968','#737783','#383e4e','#96959c'],wood:['#876647','#a9865b','#574b38','#c3a174'],iron:['#65767f','#91a2a6','#3c4b59','#c5d2cb'],bark:['#65503c','#8d6e4c','#403b32','#ad8e63']};
function rgb(h){return h.match(/\w\w/g).map(x=>parseInt(x,16))}
function crc(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1}return(c^0xffffffff)>>>0}
function chunk(type,data){const t=Buffer.from(type),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([len,t,data,sum])}
function png(data){const raw=Buffer.alloc(128*(128*4+1));for(let y=0;y<128;y++)data.copy(raw,y*513+1,y*512,y*512+512);const head=Buffer.alloc(13);head.writeUInt32BE(128,0);head.writeUInt32BE(128,4);head[8]=8;head[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))])}
for(const [name,colors]of Object.entries(palettes)){const pix=Buffer.alloc(128*128*4),c=colors.map(rgb);let seed=417;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);function fill(x,y,w,h,col){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let i=(((yy+128)%128)*128+(xx+128)%128)*4;pix[i]=col[0];pix[i+1]=col[1];pix[i+2]=col[2];pix[i+3]=255}}
 fill(0,0,128,128,c[0]);
 if(['wood','bark'].includes(name)){for(let x=0;x<128;x+=16){fill(x,0,2,128,c[2]);fill(x+2,0,1,128,c[3]);for(let i=0;i<14;i++){let y=Math.floor(rnd()*64)*2;fill(x+5+Math.floor(rnd()*3)*2,y,2,8+Math.floor(rnd()*15),rnd()>.5?c[1]:c[2])}}}
 else if(name==='roof'){for(let y=0;y<128;y+=16)for(let x=-32;x<160;x+=32){const off=(y/16%2)*16;fill(x+off,y,31,15,c[0]);fill(x+off,y,31,2,c[1]);fill(x+off,y+13,32,3,c[2]);fill(x+off+2,y+2,2,10,c[3]);}}
 else if(['meadow','forest','coast','snow'].includes(name)){
 for(let i=0;i<220;i++){const x=Math.floor(rnd()*64)*2,y=Math.floor(rnd()*64)*2;fill(x,y,2+Math.floor(rnd()*4)*2,2+Math.floor(rnd()*2)*2,c[rnd()>.5?1:2])}
 for(let y=0;y<128;y+=32)for(let x=0;x<128;x+=32){const xx=x+3+Math.floor(rnd()*5),yy=y+5+Math.floor(rnd()*6),w=12+Math.floor(rnd()*10),h=8+Math.floor(rnd()*7);fill(xx+3,yy,w-6,h,c[2]);fill(xx,yy+3,w,h-6,c[2]);fill(xx+3,yy+2,w-7,h-4,c[1]);fill(xx+4,yy+2,w-8,2,c[3]);}
 if(name==='forest')for(let x=14;x<128;x+=45){for(let y=0;y<128;y+=8){const dx=Math.round(Math.sin(y*.08)*5);fill(x+dx,y,3,9,c[2]);fill(x+dx+3,y,1,7,c[1])}}
 if(name==='coast')for(let y=15;y<128;y+=27)for(let x=0;x<128;x+=8)fill(x,y+Math.round(Math.sin(x*.07)*3),8,2,c[3]);
 if(name==='snow')for(let y=0;y<128;y+=48){fill(0,y,128,3,c[3]);for(let x=8;x<128;x+=27)fill(x,y,4,8,c[3])}
 }
 else{for(let y=0;y<128;y+=32)for(let x=-32;x<160;x+=64){const off=(y/32%2)*32;fill(x+off,y,63,31,c[0]);fill(x+off+1,y+1,61,2,c[1]);fill(x+off+1,y+3,2,25,c[1]);fill(x+off,y+29,64,3,c[2]);fill(x+off+61,y,3,32,c[2]);for(let i=0;i<5;i++){const xx=x+off+8+Math.floor(rnd()*20)*2,yy=y+7+Math.floor(rnd()*8)*2;fill(xx,yy,4+Math.floor(rnd()*6)*2,2,c[rnd()>.5?1:2]);}}}
 // Sparse hand-sized chips: fine pixel work, not full-screen noise.
 for(let i=0;i<75;i++){const x=Math.floor(rnd()*64)*2,y=Math.floor(rnd()*64)*2;fill(x,y,2,1,c[rnd()>.4?1:3])}
 fs.writeFileSync(path.join(out,name+'.png'),png(pix));
}
console.log('Created '+Object.keys(palettes).length+' original 128×128 RGBA texture PNGs.');
