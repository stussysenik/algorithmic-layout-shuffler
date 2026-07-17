# Layout Kernel Specification

As-built capability: `src/` compiled to `dist/`, exercised by `test/smoke.mjs`.

### Requirement: Seeded blueprint generation
`shuffle(opts)` SHALL derive all randomness from `mulberry32(seed)` and return a `Blueprint` honoring explicit `mood`, `withImages`, and `sections` options.

#### Scenario: Options honored
- WHEN `shuffle({ seed: 7, mood: 'zine', withImages: false, sections: 5 })` runs
- THEN the blueprint has mood `zine`, 5 sections, and zero image children

### Requirement: Deterministic output
The kernel SHALL produce byte-identical documents for identical inputs, and different documents for different seeds.

#### Scenario: Same seed twice
- WHEN `renderDocument(shuffle({ seed: 42 }))` runs twice
- THEN both strings are identical; seed 43 produces a different string

### Requirement: Assembly constraints
Generated sections SHALL satisfy: the first section's archetype is one of the **headline-bearing openers** and that section contains at least one `headline` child; no two adjacent sections share an archetype; every section has children; `column` direction with text children never uses `align-items: stretch`, and no text child in a `column` uses per-child `align-self: stretch`.

#### Scenario: Bulk validation
- WHEN 500 seeds are generated in both image modes
- THEN `validate()` returns zero violations for every blueprint

#### Scenario: Opener carries the sole h1
- WHEN any seed is compiled with `compile(shuffle({ seed }))`
- THEN the `html` contains exactly one `<h1`, located in the first section

### Requirement: Archetype registry
New layout types SHALL be added as generator entries in `ARCHETYPES`, composed from the ingredient arrays in `src/shuffle.ts`; existing generators SHALL NOT grow behavior flags. The registry SHALL include `masthead`, `ledger`, `offset-stack`, and `full-bleed`, each composed from ingredient arrays and subject to the same rotation, adjacency, and image-mode rules as existing archetypes.

#### Scenario: Extension
- WHEN a new archetype is registered
- THEN `shuffle` includes it in the rotation pool without engine edits

#### Scenario: Image-mode exclusion
- WHEN `shuffle({ withImages: false })` runs across 500 seeds
- THEN `full-bleed` never appears and `validate()` reports zero violations

### Requirement: Fluid semantic compilation
`compile(bp)` SHALL emit semantic HTML (`h1` only in the first section, `figure/figcaption` for images, `section[data-archetype]`) and CSS whose spacing/typography tokens are `clamp()` expressions from the blueprint's mood; `renderDocument(bp)` SHALL wrap this as a standalone dependency-free document. `compile(bp)` SHALL additionally make every section a size container (`container-type: inline-size`) so embedded sections respond to their slot rather than the viewport, and SHALL apply `text-wrap: pretty` to paragraphs.

#### Scenario: Standalone export
- WHEN the rendered document is saved as a bare `.html` file
- THEN it renders identically with no network requests or scripts

#### Scenario: Embedded in a narrow host slot
- WHEN a compiled section is placed in a 400px-wide host container on a wide viewport
- THEN its layout breaks by container width, not window width

### Requirement: Divergent openers
`shuffle` SHALL choose the opening section by `rng` from the headline-bearing archetype set `{hero, stack, collage, masthead, offset-stack}` — the archetypes whose generators always emit a `headline` child — rather than always emitting a `hero`. `collage` SHALL be excluded from the opener set when `withImages` is false. `hero` SHALL appear only as an opener (excluded from the non-opening rotation pool). The opener remains subject to the adjacency rule (the second section SHALL differ in archetype from the opener).

#### Scenario: Openers vary across seeds
- WHEN openers are collected across 500 seeds with images enabled
- THEN more than one distinct opener archetype occurs, and every opener is a member of the headline-bearing set

#### Scenario: Opener respects image mode
- WHEN `shuffle({ withImages: false })` runs across 500 seeds
- THEN `collage` never appears as the opener and `validate()` reports zero violations

### Requirement: Distinct mood palettes
The three moods `gallery`, `editorial`, and `zine` SHALL be mutually distinguishable at a glance: no two moods SHALL share a near-identical background, and each mood's foreground SHALL remain legible on its background (WCAG AA for body text). Adding or removing a `MoodName` is out of scope for this requirement.

#### Scenario: No two off-whites
- WHEN the `bg` values of `gallery`, `editorial`, and `zine` are compared
- THEN each pair is visibly distinct (not two near-identical off-whites plus a dark)

### Requirement: Visible accent
`compile(bp)` SHALL make `accentHue` visible in the default, non-interactive render (e.g. kicker/caption color or a section rule), not only via `::selection`. The accent SHALL read against all three mood backgrounds.

#### Scenario: Accent visible without interaction
- WHEN a document is rendered and viewed without any text selection or hover
- THEN the value derived from `accentHue` is visible in the layout
