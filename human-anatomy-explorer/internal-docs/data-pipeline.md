# Geometry data pipeline

## Inputs and reproducibility

`scripts/fetch-sources.py` downloads pinned revisions of the upstream BodyParts3D and Z-Anatomy inputs into `.cache/`. It also selects supplemental BodyParts3D 4.3 OBJ meshes and records SHA-256 values in `data/source-hashes.json`.

The source revisions are constants in the fetch script. Changing any pin is a data-provenance change: document the reason, regenerate hashes, inspect the resulting coverage, and preserve upstream license obligations.

## Build flow

```text
Pinned upstream downloads
        ↓
.cache/ (raw archives, GLB, OBJ meshes)
        ↓  scripts/prepare.mjs
data/atlas.json + data/geometry.bin.gz
        ↓  scripts/build.mjs
release/head-atlas.html
```

`prepare.mjs` performs the following:

1. Filters BodyParts3D meshes to the head/upper-neck range and excludes selected duplicates/out-of-scope meshes.
2. Imports selected 4.3 OBJ nerves, veins, sinuses, and meningeal meshes.
3. Extracts facial-expression muscle primitives from Z-Anatomy and bakes their node transforms.
4. Assigns each part to the display hierarchy and group color category.
5. Packs positions and indices into one aligned binary buffer, records offsets/counts/bounds in the manifest, and gzips the buffer.

The manifest’s `coordinateNote` is the canonical summary of coordinate normalization. The assembled view preserves source relationships; only the exploded presentation normalizes group size and changes placement.

## Safe regeneration procedure

1. Ensure `.cache/` contains the required raw inputs. Run `python scripts/fetch-sources.py` only when source acquisition or refresh is intended.
2. Run `node scripts/prepare.mjs`.
3. Review `data/atlas.json` changes: part count, group distribution, coverage statement, source IDs, bounds, and `geometrySha256`.
4. Run `npm run build` and open `release/head-atlas.html` in a modern browser.
5. Smoke-test loading, search, selection, hierarchy navigation, labels, clipping, opacity, explode/assemble, reset, and PNG export.
6. Verify `data/source-hashes.json` matches the downloaded source set if inputs changed.

Never hand-edit `geometry.bin.gz`, manifest offsets, or checksums. Regenerate them as a set.

## Licensing and attribution

The project uses source geometry under distinct upstream terms:

- BodyParts3D 4.0: CC BY 4.0.
- Supplemental BodyParts3D 4.3 meshes: retain CC BY-SA 2.1 Japan notices.
- Z-Anatomy: CC BY-SA 4.0.

The UI and exported PNG include attribution. Do not remove it. Before redistributing a changed artifact, validate the applicable license text, attribution wording, and share-alike requirements against the upstream sources; this documentation is operational guidance, not legal advice.
