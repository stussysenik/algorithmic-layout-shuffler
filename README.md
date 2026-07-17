# Algorithmic Layout Shuffler

Infinite Cargo-style editorial layout machine. Seeded shuffle → JSON blueprint → semantic HTML + fluid `clamp()` CSS. Zero runtime dependencies.

```ts
import { shuffle, renderDocument } from './dist/index.js'

const bp = shuffle({ seed: 42, mood: 'editorial', withImages: true })
const html = renderDocument(bp) // standalone document, paste anywhere
```

- `npm run build` — strict TS compile to `dist/`
- `npm test` — 1,000-blueprint constraint + determinism smoke test
- `samples/` — pre-generated documents, open directly in a browser
- `openspec/` — planning workflow: `AGENTS.md` (parent/student agent roles), `project.md` (locked decisions), `changes/` (implementable proposals)

Same seed → byte-identical layout. New layout moves are added by registering archetype generators in `src/shuffle.ts`, not by editing the engine.
