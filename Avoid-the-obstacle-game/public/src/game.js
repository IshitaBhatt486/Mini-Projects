(()=>{'use strict';
// All geometry, shading and sound are generated here. No network requests.
const $=id=>document.getElementById(id),canvas=$('scene');
const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
if(!gl){$('error').style.display='grid';return;}
const vs=`attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uVP;uniform mat4 uModel;varying vec3 vNormal;varying vec3 vWorld;void main(){vec4 w=uModel*vec4(aPosition,1.);vWorld=w.xyz;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uVP*w;}`;
const fs=`precision mediump float;uniform vec3 uColor;uniform float uAlpha;uniform float uUnlit;varying vec3 vNormal;varying vec3 vWorld;void main(){vec3 n=normalize(vNormal);float light=.67+.30*max(0.,dot(n,normalize(vec3(-.65,1.,1.4))))+.10*max(0.,dot(n,vec3(.7,.1,-.7)));vec3 c=uColor*mix(light,1.,uUnlit);float fog=clamp((-vWorld.z-7.)/49.,0.,.76);c=mix(c,vec3(.78,.82,.71),fog);gl_FragColor=vec4(c,uAlpha);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);
const loc={};for(const n of ['aPosition','aNormal'])loc[n]=gl.getAttribLocation(program,n);for(const n of ['uVP','uModel','uColor','uAlpha','uUnlit'])loc[n]=gl.getUniformLocation(program,n);
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
const C={body:[1,.67,.24],light:[1,.86,.51],cream:[1,.96,.79],wing:[1,.81,.40],dark:[.12,.28,.27],tower:[.25,.52,.47],cap:[.38,.63,.55],edge:[.65,.76,.59],water:[.40,.66,.62],far:[.48,.65,.57],foam:[.78,.85,.71],coral:[.81,.49,.33]};
function mesh(p,n){let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(p),gl.STATIC_DRAW);let nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(n),gl.STATIC_DRAW);return{b,nb,count:p.length/3};}
function sphere(rows=14,cols=22){let p=[],n=[];const v=(i,j)=>{let a=i/rows*Math.PI,b=j/cols*Math.PI*2;return[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)]};for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=v(i,j),b=v(i+1,j),c=v(i+1,j+1),d=v(i,j+1);for(const q of [a,b,c,a,c,d]){p.push(...q);n.push(...q)}}return mesh(p,n);}
function cylinder(sides=10,top=.9){let p=[],n=[];function tri(a,b,c,normal){p.push(...a,...b,...c);n.push(...normal,...normal,...normal)}for(let i=0;i<sides;i++){let a=i/sides*2*Math.PI,b=(i+1)/sides*2*Math.PI;const A=[Math.cos(a),-.5,Math.sin(a)],B=[Math.cos(b),-.5,Math.sin(b)],D=[Math.cos(a)*top,.5,Math.sin(a)*top],E=[Math.cos(b)*top,.5,Math.sin(b)*top],N=[Math.cos((a+b)/2),1-top,Math.sin((a+b)/2)];tri(A,B,E,N);tri(A,E,D,N);tri([0,.5,0],D,E,[0,1,0]);tri([0,-.5,0],B,A,[0,-1,0]);}return mesh(p,n);}
function ring(){let p=[],n=[];for(let i=0;i<64;i++){let a=i/64*Math.PI*2,b=(i+1)/64*Math.PI*2;for(const v of [[Math.cos(a),0,Math.sin(a)],[Math.cos(b),0,Math.sin(b)],[.975*Math.cos(b),0,.975*Math.sin(b)],[Math.cos(a),0,Math.sin(a)],[.975*Math.cos(b),0,.975*Math.sin(b)],[.975*Math.cos(a),0,.975*Math.sin(a)]]){p.push(...v);n.push(0,1,0)}}return mesh(p,n);}
const ball=sphere(),rock=sphere(6,9),column=cylinder(10,1),taper=cylinder(7,.72),ripple=ring();
const mat=new Float32Array(16);
function draw(m,x,y,z,sx,sy,sz,col,rz=0,rx=0,alpha=1,unlit=0){const c=Math.cos(rz),s=Math.sin(rz),a=Math.cos(rx),b=Math.sin(rx);mat.set([c*sx,s*sx,0,0,-s*a*sy,c*a*sy,b*sy,0,s*b*sz,-c*b*sz,a*sz,0,x,y,z,1]);gl.uniformMatrix4fv(loc.uModel,false,mat);gl.uniform3fv(loc.uColor,col);gl.uniform1f(loc.uAlpha,alpha);gl.uniform1f(loc.uUnlit,unlit);gl.bindBuffer(gl.ARRAY_BUFFER,m.b);gl.vertexAttribPointer(loc.aPosition,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.aPosition);gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.vertexAttribPointer(loc.aNormal,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.aNormal);gl.drawArrays(gl.TRIANGLES,0,m.count);}
let W,H,halfX,halfY=6.4,dpr,view=new Float32Array(16);
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);gl.viewport(0,0,canvas.width,canvas.height);halfY=W/H>1.8?5.7:6.4;halfX=halfY*W/H;const tilt=.10,c=Math.cos(tilt),s=Math.sin(tilt);view.set([1/halfX,0,0,0,0,c/halfY,-s/70,0,0,-s/halfY,-c/70,0,0,0,0,1]);gl.uniformMatrix4fv(loc.uVP,false,view);}
addEventListener('resize',resize);resize();
let mode='intro',time=0,elapsed=0,score=0,best=0,speed=2.8,spawn=0,deathTime=0,flapAge=1,shake=0,acc=0,last=performance.now(),pausedFrom='playing';
let bird={x:0,y:0,v:0,angle:0},obstacles=[],particles=[],trail=[],lastTrail=0,worldDistance=0;
const bounds={floor:-4.75,ceiling:5.7},gap=3.45,radius=.29;
try{best=Number(localStorage.getItem('luma-best'))||0;}catch(e){}
function updateBest(){$('footerBest').textContent='Best  '+String(best).padStart(2,'0');}updateBest();
let audio=null,sound=false;
function tone(freq,dur,volume,type='sine',end=freq){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(end,audio.currentTime+dur);g.gain.setValueAtTime(.001,audio.currentTime);g.gain.exponentialRampToValueAtTime(volume,audio.currentTime+.01);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+dur+.02);}catch(e){}}
function flap(){if(mode!=='playing')return;bird.v=4.65;flapAge=0;tone(490,.10,.045,'sine',760);for(let i=0;i<4;i++)particles.push({x:bird.x-.2,y:bird.y-.15,z:.2,vx:-1-Math.random(),vy:-.5-Math.random(),life:.45,max:.45,size:.04+Math.random()*.035});}
function playerX(){return -Math.min(halfX*.36,3.1);}
function start(){mode='playing';document.body.className='playing';$('intro').hidden=true;$('endScreen').hidden=true;$('pauseScreen').hidden=true;$('score').textContent='0';score=0;elapsed=0;speed=2.8;spawn=0;deathTime=0;bird={x:playerX(),y:0,v:0,angle:0};obstacles=[];particles=[];trail=[];addObstacle(bird.x+Math.max(6,halfX+1),0);flap();$('flightHint').style.opacity='1';}
function addObstacle(x,center){obstacles.push({x,center,passed:false,seed:Math.random()*10});}
function die(){if(mode!=='playing')return;mode='dying';deathTime=0;shake=.13;$('flightHint').style.opacity='0';tone(190,.24,.065,'triangle',55);const oldBest=best;best=Math.max(best,score);try{localStorage.setItem('luma-best',best);}catch(e){}updateBest();$('finalScore').textContent=score;$('bestScore').textContent=best;$('endEyebrow').textContent=score>oldBest?'A new personal best':'A moment in the sky';$('endEyebrow').classList.toggle('new-best',score>oldBest);$('endTitle').textContent=score===0?'Finding your wings.':score>=15?'Made for the sky.':'A lovely little flight.';$('endMessage').textContent=score===0?'Small, steady taps. You’ll find your rhythm.':'The ocean has room for another.';for(let i=0;i<16;i++)particles.push({x:bird.x,y:bird.y,z:.6,vx:(Math.random()-.5)*3,vy:(Math.random()-.3)*4,life:.6+Math.random()*.5,max:1,size:.06});}
function pause(){if(mode==='playing'){pausedFrom=mode;mode='paused';$('pauseScreen').hidden=false;$('pauseButton').setAttribute('aria-label','Resume game');}else if(mode==='paused'){mode=pausedFrom;$('pauseScreen').hidden=true;$('pauseButton').setAttribute('aria-label','Pause game');last=performance.now();acc=0;}}
function action(){if(mode==='intro')start();else if(mode==='playing')flap();else if(mode==='ended'&&deathTime>1)start();}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();action();});$('startButton').onclick=start;$('retryButton').onclick=start;$('pauseButton').onclick=pause;$('resumeButton').onclick=pause;
addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();if(!e.repeat){if(mode==='paused')pause();else action();}}else if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();pause();}});
$('soundButton').onclick=()=>{sound=!sound;$('soundButton').setAttribute('aria-pressed',String(sound));$('soundButton').setAttribute('aria-label',sound?'Mute sound':'Enable sound');$('soundWaves').setAttribute('d',sound?'M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14':'m16 9 6 6m0-6-6 6');tone(660,.12,.05);};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});addEventListener('blur',()=>{if(mode==='playing')pause();});
function step(dt){if(mode==='paused')return;time+=dt;flapAge+=dt;shake=Math.max(0,shake-dt);if(mode==='intro'){bird.x=playerX();bird.y=-.85+Math.sin(time*1.7)*.18;bird.angle=Math.sin(time*1.7)*.07;worldDistance+=dt*.35;}if(mode==='playing'){
  elapsed+=dt;speed=Math.min(3.7,2.8+score*.025);worldDistance+=speed*dt;bird.x=playerX();bird.v-=13.5*dt;bird.y+=bird.v*dt;bird.angle+=(Math.max(-1.05,Math.min(.42,bird.v*.10))-bird.angle)*Math.min(1,dt*12);
  if(elapsed>3)$('flightHint').style.opacity='0';
  for(const o of obstacles){o.x-=speed*dt;const dx=Math.abs(o.x-bird.x),bottom=o.center-gap/2,top=o.center+gap/2;if(dx<.81+radius&&(bird.y-radius<bottom||bird.y+radius>top))die();if(mode==='playing'&&!o.passed&&o.x+.81<bird.x-radius){o.passed=true;score++;$('score').textContent=score;$('score').classList.remove('bump');void $('score').offsetWidth;$('score').classList.add('bump');tone(740,.16,.05);setTimeout(()=>tone(1110,.22,.035),75);}}
  if(bird.y-radius<bounds.floor||bird.y+radius>bounds.ceiling)die();
  const tail=obstacles[obstacles.length-1];if(tail&&tail.x<halfX+1){const c=Math.max(-1.7,Math.min(1.8,tail.center+(Math.random()-.5)*2.8));addObstacle(tail.x+5.7,c);}
  obstacles=obstacles.filter(o=>o.x>Math.min(-halfX-2,bird.x-3));lastTrail+=dt;if(lastTrail>.055){lastTrail=0;trail.push({x:bird.x-.30,y:bird.y,z:-.15,life:.5});}
}else if(mode==='dying'||mode==='ended'){deathTime+=dt;if(mode==='dying'){bird.v-=12*dt;bird.y=Math.max(bounds.floor-.3,bird.y+bird.v*dt);bird.angle-=dt*3;if(deathTime>.8){mode='ended';document.body.className='ended';$('endScreen').hidden=false;}}}
for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=dt*2;}particles=particles.filter(p=>p.life>0);for(const p of trail){p.life-=dt;p.x-=speed*dt;}trail=trail.filter(p=>p.life>0);
}
function tower(o){const bottom=o.center-gap/2,top=o.center+gap/2,base=-6.8;
  // Broad, chamfered stone columns, their pale inset rims make the gap legible.
  draw(column,o.x,(base+bottom)/2,0,.69,bottom-base,.65,C.tower);
  draw(column,o.x,bottom-.20,0,.81,.38,.77,C.cap);
  draw(column,o.x,bottom-.02,0,.79,.065,.75,C.edge);
  draw(column,o.x,bottom-.49,0,.715,.08,.68,C.dark,0,0,.35);
  draw(column,o.x,(top+11)/2,0,.69,11-top,.65,C.tower);
  draw(column,o.x,top+.20,0,.81,.38,.77,C.cap);
  draw(column,o.x,top+.02,0,.79,.065,.75,C.edge);
  draw(column,o.x,top+.49,0,.715,.08,.68,C.dark,0,0,.35);
  // Thin recessed vertical seams and an amber inlay on each facing surface.
  draw(column,o.x,bottom-.85,.659,.028,.40,.025,C.edge);
  draw(rock,o.x,bottom-.82,.697,.085,.12,.035,C.light,0,0,1);
  draw(rock,o.x,top+.82,.697,.085,.12,.035,C.light,0,0,1);
  draw(rock,o.x,-5.45,.08,1.15,.26,.93,C.cap);
  draw(ripple,o.x,-5.18,.1,1.45,1,1.1,C.foam,0,0,.45,1);
}
function creature(){const bx=bird.x,by=bird.y,bz=.6,a=bird.angle;const c=Math.cos(a),s=Math.sin(a);function part(m,x,y,z,sx,sy,sz,color,rot=0,rx=0){draw(m,bx+x*c-y*s,by+x*s+y*c,bz+z,sx,sy,sz,color,a+rot,rx);}
  const wing=mode==='intro'?Math.sin(time*6):Math.sin(Math.min(flapAge, .32)/.32*Math.PI)*1.3;
  part(ball,-.13,.02,-.28,.44,.11,.35,C.wing,-.30-wing*.6);
  part(rock,-.45,-.05,0,.29,.10,.14,C.light,-.35);
  part(ball,0,0,0,.47,.38,.31,C.body);
  part(ball,.16,-.08,.21,.28,.26,.13,C.light,-.15);
  part(ball,-.12,-.02,.30,.33,.10,.16,C.wing,-.35-wing*.85);
  part(ball,.23,.11,.285,.123,.145,.052,C.cream);
  part(ball,.267,.113,.33,.059,.080,.027,C.dark);
  part(ball,.285,.142,.351,.016,.021,.01,C.cream);
  part(rock,.46,-.01,.10,.15,.085,.09,C.coral,-.1);
  part(ball,-.10,.37,0,.08,.18,.075,C.light,-.55);
  part(ball,.035,.38,-.02,.055,.13,.05,C.wing,-.05);
  part(ball,.22,-.075,.326,.064,.031,.015,C.coral,-.18);
}
function render(){gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(shake>0){view[12]=(Math.random()-.5)*shake*.13;view[13]=(Math.random()-.5)*shake*.13;}else{view[12]=0;view[13]=0;}gl.uniformMatrix4fv(loc.uVP,false,view);
  // Warm sun and concentric atmospheric halos; all geometry is procedural.
  gl.depthMask(false);draw(ball,halfX*.62,3.8,-26,2.6,2.6,.1,[1,.92,.70],0,0,.18,1);draw(ball,halfX*.62,3.8,-25,2.16,2.16,.1,[1,.94,.76],0,0,.32,1);draw(ball,halfX*.62,3.8,-24,1.78,1.78,.1,[1,.95,.80],0,0,.85,1);gl.depthMask(true);
  // Distant sea stacks drift more slowly than the course, giving true depth.
  for(let i=0;i<10;i++){const span=Math.max(42,halfX*2+12),x=((i*7.37-worldDistance*.15+span*20)%span)-span/2,z=-18-(i%3)*8,h=1.0+(Math.sin(i*8.1)+1)*1.9;draw(taper,x,-5+h/2,z,1.3,h,1.2,C.far,Math.sin(i)*.08);draw(rock,x,-5+h,z,1,.20,.9,C.edge);}
  // The sea meets a hazy horizon; layered elliptical contours catch the light.
  draw(column,0,-6.05,-9,120,1,55,C.water);
  gl.depthMask(false);for(let i=0;i<26;i++){let x=((i*5.73-worldDistance*.4+150)%60)-30,z=-2-(i%6)*6;draw(ripple,x,-5.51+Math.sin(time*.6+i)*.015,z,1.2+(i%4)*.8,1,.32+(i%3)*.17,C.foam,0,0,.15+.07*Math.sin(time+i),1);}gl.depthMask(true);
  // Small flocks near the horizon.
  for(let i=0;i<5;i++){let x=((i*1.2+time*.17+12)%26)-13,y=2.2+Math.sin(i*4)*.3,z=-20;draw(ball,x,y,z,.16,.022,.04,C.far,Math.sin(time*2+i)*.3);draw(ball,x+.24,y,z,.16,.022,.04,C.far,-Math.sin(time*2+i)*.3);}
  if(mode==='intro'){tower({x:halfX*.77+ .55,center:.05});}else for(const o of obstacles)tower(o);
  gl.depthMask(false);draw(ball,bird.x,-5.47,.3,.58,.012,.35,C.dark,0,0,.12);for(const p of trail)draw(ball,p.x,p.y,p.z,.042*p.life/.5,.042*p.life/.5,.04,C.cream,0,0,p.life*.65,1);gl.depthMask(true);
  creature();gl.depthMask(false);for(const p of particles)draw(rock,p.x,p.y,p.z,p.size,p.size,p.size,C.cream,time*2,0,Math.min(1,p.life/p.max),1);gl.depthMask(true);
  $('flash').style.opacity=shake>0?String(shake*.85):'0';
}
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;acc+=dt;while(acc>=1/120){step(1/120);acc-=1/120;}render();requestAnimationFrame(frame);}requestAnimationFrame(frame);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(mode==='playing')pause();$('error').style.display='grid';});canvas.addEventListener('webglcontextrestored',()=>location.reload());
})();
