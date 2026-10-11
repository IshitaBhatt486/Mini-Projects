# Internal documentation

This folder is for maintainers of Forma, not end users.

| Document | Use it for |
| --- | --- |
| [architecture.md](architecture.md) | Understanding the browser app, state model, and build boundary. |
| [data-pipeline.md](data-pipeline.md) | Refreshing source inputs, rebuilding geometry, provenance, and safety checks. |
| [development.md](development.md) | Local workflow, verification, debugging, and release handoff. |

## Maintainer principles

- Keep the app offline after build: the release artifact must not fetch geometry or dependencies at runtime.
- Treat source geometry as licensed data. Preserve source IDs, attribution, checksums, and applicable share-alike obligations.
- Keep assembled geometry in shared reference coordinates. The exploded view is a presentation layout, not an anatomical claim.
- Do not represent display clipping as imaging, diagnosis, or clinically validated anatomy.
