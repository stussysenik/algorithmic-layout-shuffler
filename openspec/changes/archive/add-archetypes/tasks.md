# Tasks

- [x] 1.1 `masthead`: generator + Archetype union entry; smoke green
- [x] 1.2 `ledger`: generator emitting term/description child pairs; decide child kinds (reuse caption/paragraph before inventing new kinds); smoke green
- [x] 1.3 `offset-stack`: generator with alternating `align-self` (needs per-child align support in `Child` + `compile.ts`); smoke green
- [x] 1.4 `full-bleed`: generator + zero-padding section override in `compile.ts`; excluded when `withImages: false`; smoke green
- [x] 1.5 Update `validate()` for any new invariants; bump smoke seed count if generation cost allows
- [x] 1.6 Regenerate `samples/` and visually confirm each archetype appears across a seed sweep
