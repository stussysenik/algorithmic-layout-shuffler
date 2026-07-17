# Add Demo GUI

## Why
The kernel is invisible without a surface. The demo is the investor-facing artifact and the manual test bench.

## What changes
- New `demo/index.html` + `demo/main.js`: static page over `dist/index.js`, no framework, no extra build step.
- Control bar: seed input, reshuffle button (GUI may use `Math.random()`; kernel may not), mood select (`auto|gallery|editorial|zine`), images checkbox, copy-export button.
- Full-viewport `<iframe>` preview via `srcdoc = renderDocument(shuffle(state))`.
- State serialized to `location.hash` (`#s=42&m=zine&i=0`) and restored on load — a layout is a shareable URL.

## Impact
- Affected specs: ADDED capability `demo-gui`
- Affected code: `demo/` only; zero kernel edits

## Completed
2026-07-18
