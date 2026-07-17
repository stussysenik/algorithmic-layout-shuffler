# Layout Kernel — Delta: Amplify Variant Divergence

## MODIFIED Requirements

### Requirement: Assembly constraints
Generated sections SHALL satisfy: the first section's archetype is one of the
**headline-bearing openers** and that section contains at least one `headline`
child; no two adjacent sections share an archetype; every section has children;
`column` direction with text children never uses `align-items: stretch`, and no
text child in a `column` uses per-child `align-self: stretch`.

#### Scenario: Bulk validation
- WHEN 500 seeds are generated in both image modes
- THEN `validate()` returns zero violations for every blueprint

#### Scenario: Opener carries the sole h1
- WHEN any seed is compiled with `compile(shuffle({ seed }))`
- THEN the `html` contains exactly one `<h1`, located in the first section

## ADDED Requirements

### Requirement: Divergent openers
`shuffle` SHALL choose the opening section by `rng` from the headline-bearing
archetype set `{hero, stack, collage, masthead, offset-stack}` — the archetypes
whose generators always emit a `headline` child — rather than always emitting a
`hero`. `collage` SHALL be excluded from the opener set when `withImages` is
false. `hero` SHALL appear only as an opener (excluded from the non-opening
rotation pool). The opener remains subject to the adjacency rule (the second
section SHALL differ in archetype from the opener).

#### Scenario: Openers vary across seeds
- WHEN openers are collected across 500 seeds with images enabled
- THEN more than one distinct opener archetype occurs, and every opener is a member
  of the headline-bearing set

#### Scenario: Opener respects image mode
- WHEN `shuffle({ withImages: false })` runs across 500 seeds
- THEN `collage` never appears as the opener and `validate()` reports zero violations

### Requirement: Distinct mood palettes
The three moods `gallery`, `editorial`, and `zine` SHALL be mutually
distinguishable at a glance: no two moods SHALL share a near-identical background,
and each mood's foreground SHALL remain legible on its background (WCAG AA for body
text). Adding or removing a `MoodName` is out of scope for this requirement.

#### Scenario: No two off-whites
- WHEN the `bg` values of `gallery`, `editorial`, and `zine` are compared
- THEN each pair is visibly distinct (not two near-identical off-whites plus a dark)

### Requirement: Visible accent
`compile(bp)` SHALL make `accentHue` visible in the default, non-interactive render
(e.g. kicker/caption color or a section rule), not only via `::selection`. The
accent SHALL read against all three mood backgrounds.

#### Scenario: Accent visible without interaction
- WHEN a document is rendered and viewed without any text selection or hover
- THEN the value derived from `accentHue` is visible in the layout
