# Demo GUI Delta

## ADDED Requirements

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
