# Demo GUI Specification

As-built capability: `demo/index.html` + `demo/main.js`, a static dependency-free page over `dist/index.js`.

### Requirement: Live shuffling surface
The demo SHALL render `renderDocument(shuffle(state))` into an iframe and re-render on any control change (seed, mood, images).

#### Scenario: Reshuffle
- WHEN the reshuffle button is pressed
- THEN a new seed is chosen and the preview updates without console errors

### Requirement: Shareable state
The demo SHALL serialize seed, mood, and image toggle to `location.hash` and restore them on page load.

#### Scenario: URL round-trip
- WHEN a demo URL with `#s=42&m=zine&i=0` is opened
- THEN the preview shows exactly seed 42, zine mood, images off

### Requirement: Clean export
The copy-export action SHALL place the standalone document on the clipboard, byte-identical to the current preview's `srcdoc`.

#### Scenario: Paste elsewhere
- WHEN the export is saved as a bare `.html` file
- THEN it renders identically to the preview

### Requirement: Seed gallery
The demo SHALL show 8 thumbnail previews with seeds derived deterministically from the current seed, rendered with the current mood/image options.

#### Scenario: Adopt a thumbnail
- WHEN a thumbnail is clicked
- THEN the main preview and `location.hash` switch to that thumbnail's seed, reproducing it exactly full-size
