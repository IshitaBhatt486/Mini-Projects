"""Download pinned public source geometry. Python 3.11+, no packages required."""
import urllib.request, urllib.parse, json, csv, pathlib, concurrent.futures, hashlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache'
CACHE.mkdir(exist_ok=True)
Z_COMMIT = '8185b3fa46a1dbefdd907390918c57954fd9b816'
BP_COMMIT = '1c38bf35c254a891200d3cedecfd57abebe83d8d'
NEW_COMMIT = 'fd527e6f4daf732fd814314d9257df5877b844bc'
def get(url, path):
    if not path.exists():
        urllib.request.urlretrieve(url, path)
    return path
get(f'https://raw.githubusercontent.com/ashemag/human-atlas/{BP_COMMIT}/public/models/atlas.json', CACHE/'atlas.json')
get(f'https://raw.githubusercontent.com/vixotic/Vanatome/{Z_COMMIT}/public/models/z-anatomy-1.4.0-full-body.glb', CACHE/'z-anatomy-1.4.0-full-body.glb')
get(f'https://raw.githubusercontent.com/vixotic/Vanatome/{Z_COMMIT}/public/models/z-anatomy-1.4.0-manifest.json', CACHE/'z-anatomy-1.4.0-manifest.json')
get(f'https://api.github.com/repos/olivercase/body_parts_3d_api/git/trees/{NEW_COMMIT}?recursive=1', CACHE/'tree43.json')
tree=json.loads((CACHE/'tree43.json').read_text())
chosen=[]
for x in tree['tree']:
    name=x['path']
    if not name.startswith('meshes/'): continue
    fj=name.split('/')[-1].split('_')[0]
    num=int(fj[2:].rstrip('M'))
    low=name.lower()
    if 3889<=num<=4042 and not any(t in low for t in ['recurrent laryngeal','vagus','accessory nerve']): chosen.append(x)
    elif num>=4700 and any(t in low for t in ['sinus','cerebral vein','facial vein','ophthalmic vein','superior bulb']) and 'carotid sinus' not in low: chosen.append(x)
(CACHE/'selected43.json').write_text(json.dumps(chosen))
(CACHE/'obj43').mkdir(exist_ok=True)
jobs=[]
for i in range(15): jobs.append((f'https://raw.githubusercontent.com/ashemag/human-atlas/{BP_COMMIT}/public/models/body-{i}.bin.gz',CACHE/f'body-{i}.bin.gz'))
for x in chosen: jobs.append((f'https://media.githubusercontent.com/media/olivercase/body_parts_3d_api/{NEW_COMMIT}/'+urllib.parse.quote(x['path']),CACHE/'obj43'/pathlib.Path(x['path']).name))
def run(job):
    get(*job)
    print(job[1].name,flush=True)
with concurrent.futures.ThreadPoolExecutor(10) as pool: list(pool.map(run,jobs))
hashes={str(p.relative_to(CACHE)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for _,p in jobs}
for n in ['atlas.json','z-anatomy-1.4.0-full-body.glb','z-anatomy-1.4.0-manifest.json']: hashes[n]=hashlib.sha256((CACHE/n).read_bytes()).hexdigest()
(ROOT/'data'/'source-hashes.json').write_text(json.dumps(hashes,indent=2))
