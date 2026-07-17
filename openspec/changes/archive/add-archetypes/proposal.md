# Add Four Archetypes

> Completed: 2026-07-18

## Why
The "infinite" claim grows with the combinatoric vocabulary. Four new registry entries widen range from portfolio-minimal to zine-chaotic without touching the engine.

## What changes
New `ARCHETYPES` entries in `src/shuffle.ts`, each composed from existing ingredient arrays (extend arrays only if an ingredient is genuinely missing):
- `masthead` — one giant word/kicker, interlude-scale whitespace
- `ledger` — definition-list rows (term/description pairs), baseline-aligned
- `offset-stack` — column whose children alternate `align-self` for a staggered read
- `full-bleed` — edge-to-edge image with a small caption; requires a per-section zero-padding override in `compile.ts`

Each archetype joins the rotation pool (image-dependent ones excluded when `withImages: false`) and passes `validate()` for 500 seeds.

## Impact
- Affected specs: MODIFIED capability `layout-kernel` (constraint list grows if new rules are introduced)
- Affected code: `src/shuffle.ts`, `src/types.ts` (Archetype union), `src/compile.ts` (full-bleed padding), `test/smoke.mjs`
- Note: one archetype per commit; each is independently shippable
