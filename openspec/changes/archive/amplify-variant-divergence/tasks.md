# Tasks — Amplify Variant Divergence

Implement in order; one commit per lever. Verify `npx tsc && node test/smoke.mjs`
green after each.

## 1. Divergent openers
- [x] In `src/shuffle.ts`, declare `HEADLINE_OPENERS: readonly Archetype[] =
      ['hero', 'stack', 'collage', 'masthead', 'offset-stack']` (the archetypes
      whose generators always emit a `headline` child).
- [x] Replace the hardcoded `[ARCHETYPES.hero(ctx)]` opener with an rng `pick`
      from `HEADLINE_OPENERS`, filtered by image mode (`collage` excluded when
      `!withImages`). Set `prev` to the chosen opener so adjacency still holds.
- [x] Remove the blanket `a !== 'hero'` pool filter; instead keep `hero`
      opener-only (exclude it from the non-opening rotation pool).
- [x] In `validate()`, replace the `first section must be a hero` check with:
      first section's archetype ∈ `HEADLINE_OPENERS` **and** section 0 contains at
      least one `headline` child (the sole `h1` host). Keep all other invariants.
- [x] In `test/smoke.mjs`, assert across the 500-seed sweep: section 0's archetype
      is in the opener set, and the compiled `html` contains exactly one `<h1`.

## 2. Distinct mood palettes
- [x] In `src/moods.ts`, retune `bg`/`fg` (and only if needed, the type scales) so
      the three moods are mutually distinguishable at a glance — `gallery` cool
      bright paper, `editorial` warm cream, `zine` dark. Data change only; no new
      `MoodName`.
- [x] Sanity-check contrast: each mood's `fg` on its `bg` remains legible
      (≥ WCAG AA for body text).

## 3. Visible accent
- [x] In `src/compile.ts`, use `var(--accent)` in the default render — e.g. color
      kickers/`.caption` and/or a hairline section rule — so `accentHue` is visible
      without interaction. Keep the existing `::selection` accent.
- [x] Confirm the accent reads against all three mood backgrounds.

## 4. Close out
- [x] `npx tsc && node test/smoke.mjs` green; rebuild `dist/`.
- [x] Regenerate `samples/*.html` so the committed samples reflect the new openers,
      palettes, and accent.
- [x] Merge the delta spec into `specs/layout-kernel/spec.md`, archive this change,
      stamp the completion date in `proposal.md`.
