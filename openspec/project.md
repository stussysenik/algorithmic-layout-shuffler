# Project Context

## Purpose

Infinite Cargo Collective-style editorial layout machine: seeded shuffle → JSON `Blueprint` → semantic HTML + fluid `clamp()` CSS. Philosophy: the viewport is a continuous sheet — **pages are read, not scrolled-and-squished**. Rows break via `flex-wrap` into vertical page segments; nothing scales into illegibility. Long-term positioning (game UIs, spatial/visionOS) is served by keeping the kernel a pure, hardware-agnostic function over JSON — not by building those runtimes now.

## Tech stack

- Strict TypeScript (`tsc`, no bundler), ESM, **zero runtime dependencies**
- Static demo pages (no framework); Lit/Astro are future *consumers* of the kernel
- Verification: `npx tsc && node test/smoke.mjs` (1,000-blueprint constraint + determinism test)

## Locked decisions (do not re-litigate; parent agent may amend here only)

1. Kernel language is strict TS. Haxe/Nim ports are blocked until a concrete non-web target is named; the kernel's pure-function surface (`shuffle`, `compile`, `renderDocument`, `validate`, `MOODS`) + JSON types are the port contract.
2. Determinism is a feature: same seed → byte-identical output. All kernel randomness flows from `mulberry32(seed)`; `Math.random()` is forbidden in `src/`.
3. Constraint rules are correct-by-construction inside archetype generators AND independently re-checked in `validate()`. Every new rule lands in both places.
4. Extension model: new layouts = new entries in the `ARCHETYPES` registry composed from ingredient arrays (`src/shuffle.ts`). Never add behavior flags to an existing generator (SRP).

## Conventions

- Atomic diffs, <100 LOC target per change; surgical edits only
- Semantic HTML output (`h1/h2`, `figure/figcaption`, `section[data-archetype]`)
- Fluid tokens only (`clamp()`); no media-query ladders
- No success claims without green terminal proof
