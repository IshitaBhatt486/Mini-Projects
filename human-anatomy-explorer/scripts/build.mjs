import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
const root=new URL('../',import.meta.url);
const result=await build({absWorkingDir:fileURLToPath(root),entryPoints:['src/main.js'],bundle:true,write:false,minify:true,format:'iife',target:'es2022',legalComments:'inline'});
let html=fs.readFileSync(new URL('src/index.html',root),'utf8');
html=html.replace('/*CSS*/',()=>fs.readFileSync(new URL('src/style.css',root),'utf8')).replace('/*DATA*/',()=>`window.ATLAS=${fs.readFileSync(new URL('data/atlas.json',root),'utf8')};window.GEOMETRY="${fs.readFileSync(new URL('data/geometry.bin.gz',root)).toString('base64')}";`).replace('/*APP*/',()=>result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script'));
fs.mkdirSync(new URL('release/',root),{recursive:true});fs.writeFileSync(new URL('release/head-atlas.html',root),html);console.log(`Standalone HTML: ${(Buffer.byteLength(html)/1e6).toFixed(2)} MB`);
