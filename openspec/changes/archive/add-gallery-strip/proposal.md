# Add Gallery Strip

## Why
One preview hides the machine's range. A thumbnail strip makes the "infinite" claim visible and turns browsing seeds into the core interaction.

## What changes
- Row of 8 thumbnails in the demo under the control bar; seeds derived deterministically from the current seed (`seed * 31 + i`).
- Each thumbnail: a scaled iframe (`width:1200px; transform:scale(0.12); pointer-events:none`) inside a click button; clicking adopts that seed into main state.

## Impact
- Affected specs: MODIFIED capability `demo-gui`
- Affected code: `demo/` only
- Depends on: `add-demo-gui` (implement after it is archived)

## Completed
2026-07-18
