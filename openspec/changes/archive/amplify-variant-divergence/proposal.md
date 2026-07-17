# Amplify Variant Divergence

> **Completed 2026-07-18.** All three levers implemented and verified
> (`npx tsc && node test/smoke.mjs` green; 500-seed opener sweep + browser
> screenshots of the three moods). Delta merged into `specs/layout-kernel/spec.md`.

## Why

The product hook is a **diffing / elimination interaction**: the user is shown
several shuffled variants, visually diffs them, and keeps choosing until they
converge on one. That mechanic only works if variants read as *obviously
different at a glance*. Today they don't.

The divergence exists in the data — archetype sequences vary widely per seed —
but it never surfaces where the eye lands first:

1. **Every seed opens with the same `hero` recipe** (headline 55% + image 32%,
   row, space-between, ~85vh). A demo thumbnail is a 144×180 window onto a
   1500px frame at 0.12 scale, so it is dominated by that first screen. Identical
   first screens ⇒ variants look identical, regardless of what differs below.
2. **Moods are a light/dark binary in disguise.** `gallery` (#fafaf7) and
   `editorial` (#f6f2ea) are near-identical off-whites; only `zine` is dark. Two
   of three `auto` picks read the same.
3. **`accentHue` is invisible in a static render** — it paints only `::selection`
   and image gradients, so per-seed hue never registers without interaction.

Cargo Collective (the stated aesthetic target, `project.md`) ships templates that
are unmistakably distinct on sight. That is the bar: a viewer diffing two variants
should know *"okay, different"* immediately, before reading a word.

## What changes

Three independent levers, ordered by first-glance leverage. All randomness stays
seeded (locked decision #2); every new constraint lands in both the generator and
`validate()` (locked decision #3).

1. **Divergent openers** (`src/shuffle.ts`, `validate()`) — replace the fixed
   `hero`-first rule with an rng-picked opener drawn from the **headline-bearing**
   archetypes `{hero, stack, collage, masthead, offset-stack}`. These are the
   archetypes guaranteed to emit a `headline` child, so the opener still carries
   the page's sole `h1` (semantic-HTML convention preserved). Five structurally
   distinct first screens replace one.
2. **Distinct mood palettes** (`src/moods.ts`, data only) — retune the three moods
   so they are mutually distinguishable at a glance: `gallery` a cool bright paper,
   `editorial` a warm cream, `zine` the dark high-contrast sheet. No new mood
   (union stays 3; adding one is separate scope).
3. **Visible accent** (`src/compile.ts`, CSS) — let `accentHue` paint the default
   non-interactive render (kickers/rules/tints), so hue variance shows without hover.

## Impact

- Affected specs: MODIFIED capability `layout-kernel` (assembly-constraints
  opener rule; new opener, palette-distinctness, and visible-accent requirements)
- Affected code: `src/shuffle.ts` (opener selection + validate), `src/moods.ts`
  (palette values), `src/compile.ts` (accent CSS), `test/smoke.mjs` (opener +
  single-`h1` invariants)
- Estimated diff ≈ 55 LOC, under the 100-LOC atomic target. One commit per lever;
  each is independently shippable and can land in the tasks order below.
- **Determinism unaffected:** opener is `rng`-selected; same seed → byte-identical
  output still holds.
- **Follow-up (not this change):** the diffing/elimination demo interaction —
  present N variants, diff, eliminate to one — is a `demo-gui` capability change
  to be queued separately once the kernel produces visibly divergent variants.
