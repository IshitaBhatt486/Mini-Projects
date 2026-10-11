import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {Matrix4,Vector3,Quaternion} from 'three';
const read=n=>fs.readFileSync(new URL('../.cache/'+n,import.meta.url));
const atlas=JSON.parse(read('atlas.json'));
const parts=[]; const chunks=atlas.chunks.map((_,i)=>zlib.gunzipSync(read(`body-${i}.bin.gz`)));
const extra=fs.readdirSync(new URL('../.cache/obj43/',import.meta.url)).sort();
const newNames=new Set(extra.map(n=>n.split('_').slice(3).join('_').replace('.obj','').toLowerCase()));
function add(p,pos,ind){
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<pos.length;i++) { min[i%3]=Math.min(min[i%3],pos[i]);max[i%3]=Math.max(max[i%3],pos[i]); }
 parts.push({...p,pos,ind,bounds:[min,max]});
}
for(const p of atlas.parts){
 if(p.bounds[0][1]<1.49 || p.bounds[1][1]>1.85)continue;
 if(/hair of head|eyebrow|central canal/.test(p.name.toLowerCase()))continue;
 if(newNames.has(p.name.toLowerCase()))continue;
 const b=chunks[p.chunk];
 add({id:p.id,name:p.name,conceptId:p.conceptId,source:'BodyParts3D 4.0',system:p.system},new Float32Array(b.buffer,b.byteOffset+p.positions,p.vertexCount*3).slice(),new Uint32Array(b.buffer,b.byteOffset+p.indices,p.indexCount).slice());
}
for(const file of extra){
 const lines=read('obj43/'+file).toString().split(/\r?\n/);const pos=[],ind=[];
 for(const l of lines){if(l.startsWith('v ')){const [x,y,z]=l.split(/\s+/).slice(1).map(Number);pos.push(x*.001,z*.001+.0781112,-y*.001-.1);}else if(l.startsWith('f ')){const f=l.split(/\s+/).slice(1).map(s=>Number(s.split('/')[0])-1);for(let i=1;i<f.length-1;i++)ind.push(f[0],f[i],f[i+1]);}}
 const [id,bp,conceptId,...nm]=file.replace('.obj','').split('_');const name=nm.join('_');
 if(!pos.length)throw Error('Missing geometry '+file);
 // Tentorium from 4.0 is already present; retain one nonduplicated source representation.
 if(/tentorium/i.test(name))continue;
 add({id,name,conceptId,source:'BodyParts3D 4.3',system:/dura/i.test(name)?'membranes':/vein|sinus|bulb/i.test(name)?'venous':'nerves'},Float32Array.from(pos),Uint32Array.from(ind));
}
// Bake original glTF node transforms; do not reposition individual facial muscles.
const glb=read('z-anatomy-1.4.0-full-body.glb');const jl=glb.readUInt32LE(12);const g=JSON.parse(glb.subarray(20,20+jl));const bin=glb.subarray(28+jl);
function accessor(i){const a=g.accessors[i],v=g.bufferViews[a.bufferView],n={SCALAR:1,VEC3:3,VEC4:4}[a.type],T={5126:Float32Array,5125:Uint32Array,5123:Uint16Array}[a.componentType];return new T(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*n);}
for(const n of g.nodes){if(!n.name.startsWith('facial-expression-muscles-'))continue;
 const m=new Matrix4().compose(new Vector3(...(n.translation||[0,0,0])),new Quaternion(...(n.rotation||[0,0,0,1])),new Vector3(...(n.scale||[1,1,1])));
 const pr=g.meshes[n.mesh].primitives[0],p=Float32Array.from(accessor(pr.attributes.POSITION)),v=new Vector3();
 for(let i=0;i<p.length;i+=3){v.fromArray(p,i).applyMatrix4(m);v.toArray(p,i);}
 const indices=Uint32Array.from(accessor(pr.indices));if(m.determinant()<0)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const raw=n.extras.sourceName;const name=raw.endsWith('.l')?'Left '+raw.slice(0,-2):raw.endsWith('.r')?'Right '+raw.slice(0,-2):raw;
 add({id:n.extras.anatomyId,name,source:'Z-Anatomy',sourceName:raw,system:'muscular'},p,indices);
}
const brainIds=new Set(atlas.concepts.find(x=>x.id==='FMA50801').elements);
const groups=['Brain','Skull','Teeth','Facial & supporting muscles','Eyes','Cranial nerves','Arteries','Veins & sinuses','Membranes & support'];
function path(p){const n=p.name.toLowerCase(),side=/left/.test(n)?'Left':/right/.test(n)?'Right':'Midline';
 if(/dura|tentorium/.test(n))return [groups[8],'Meninges'];
 if(p.system==='venous'||/\bvein\b|sinus confluence|sagittal sinus/.test(n))return [groups[7],/sinus/.test(n)?'Dural sinuses':side+' veins'];
 if(p.system==='arterial')return [groups[6],side+' arteries'];
 if(/nerve|ciliary ganglion/.test(n)||p.system==='nerves')return [groups[5],side+' nerves'];
 if(brainIds.has(p.id)||p.system==='nervous'||/pineal|pituitary/.test(n)){
  if(/cerebell/.test(n))return [groups[0],'Cerebellum'];
  if(/pons|medulla|midbrain|colliculus|peduncle|interpeduncular/.test(n))return [groups[0],'Brainstem'];
  if(/ventric|aqueduct/.test(n))return [groups[0],'Ventricular system'];
  if(/gyrus|lobule|lobe|insula|hemisphere/.test(n)){
   const region=/frontal|precentral|orbital gyrus/.test(n)?'Frontal lobe':/temporal|fusiform|hippocamp/.test(n)?'Temporal lobe':/parietal|postcentral|angular|supramarginal/.test(n)?'Parietal lobe':/occipital/.test(n)?'Occipital lobe':/insula/.test(n)?'Insula':'Limbic & white matter';
   return [groups[0],'Cerebrum',side+' hemisphere',region];
  }return [groups[0],'Deep structures & connections'];
 }
 if(/tooth|gingiva/.test(n))return [groups[2],/upper/.test(n)?'Upper jaw':'Lower jaw'];
 if(p.source==='Z-Anatomy')return [groups[3],'Facial expression',side+' face'];
 if(p.system==='sensory'||/rectus|oblique|palpebrae/.test(n)&&/FJ1[23]/.test(p.id))return [groups[4],side+' orbit'];
 if(p.system==='muscular')return [groups[3],/pharyn|palati|gloss|uvular/.test(n)?'Oral & pharyngeal':'Jaw & upper neck'];
 if(p.system==='skeletal'&&!/disk|vertebra|atlas|axis|hyoid/.test(n))return [groups[1],/maxilla|mandible|nasal|zygomatic|palatine|lacrimal|vomer|concha/.test(n)?'Facial skeleton':'Cranium'];
 return [groups[8],/ligament|tendon|tarsal|raphe/.test(n)?'Ligaments & connective tissue':'Supporting structures'];
}
const nodes={head:{id:'head',name:'Head',parent:null,children:[],parts:[]}}; const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const buffers=[];let bytes=0;function pack(a){const pad=(4-bytes%4)%4;if(pad){buffers.push(Buffer.alloc(pad));bytes+=pad;}const off=bytes;const b=Buffer.from(a.buffer,a.byteOffset,a.byteLength);buffers.push(b);bytes+=b.length;return off;}
for(const p of parts){p.path=path(p);p.group=p.path[0];let parent='head';nodes.head.parts.push(p.id);
 for(const label of p.path){const id=parent+'/'+slug(label);if(!nodes[id]){nodes[id]={id,name:label,parent,children:[],parts:[]};nodes[parent].children.push(id);}nodes[id].parts.push(p.id);parent=id;}
 p.parent=parent;nodes[parent].children.push(p.id);nodes[p.id]={id:p.id,name:p.name,parent,children:[],parts:[p.id]};
 p.positions=pack(p.pos);p.indices=pack(p.ind);p.vertexCount=p.pos.length/3;p.indexCount=p.ind.length;delete p.pos;delete p.ind;
}
const blob=Buffer.concat(buffers);const manifest={version:1,parts,nodes,groups,count:parts.length,triangles:parts.reduce((a,p)=>a+p.indexCount/3,0),geometrySha256:crypto.createHash('sha256').update(blob).digest('hex'),coordinateNote:'Original mesh relationships retained. BodyParts3D mm Z-up mapped to shared meter Y-up reference: (x/1000, z/1000+0.0781112, -y/1000-0.1). Z-Anatomy node transforms baked unchanged. Display uses one global translation and scale.',coverage:'Selected head and upper-neck structures. Mesh segments may share anatomical names. Not every cranial branch or paired vein is available. No anatomy synthesized.'};
fs.writeFileSync(new URL('../data/atlas.json',import.meta.url),JSON.stringify(manifest));fs.writeFileSync(new URL('../data/geometry.bin.gz',import.meta.url),zlib.gzipSync(blob,{level:9}));
console.log(JSON.stringify({parts:manifest.count,triangles:manifest.triangles,bytes,gzip:zlib.gzipSync(blob).length,groups:Object.fromEntries(groups.map(g=>[g,parts.filter(p=>p.group===g).length]))},null,2));
