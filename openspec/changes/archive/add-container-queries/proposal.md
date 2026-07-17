# Add Container-Query Responsiveness

## Why
Brownfield embedding is the production story: a section dropped into a host page's slot must respond to its *container*, not the window. This is the modern-CSS half of the "read, not scrolled" philosophy.

## What changes
- `compile.ts`: each `section` gets `container-type: inline-size`; child min-sizes move to container-relative logic where beneficial.
- `text-wrap: pretty` on paragraphs (balance already on headlines).
- Optional `:has()` refinement: image-only sections (`section:has(figure):not(:has(p))`) tighten gap.
- Extend `test/smoke.mjs` to assert `container-type` and `text-wrap` appear in compiled CSS.

## Impact
- Affected specs: MODIFIED capability `layout-kernel`
- Affected code: `src/compile.ts`, `test/smoke.mjs`

## Completed
- 2026-07-18
