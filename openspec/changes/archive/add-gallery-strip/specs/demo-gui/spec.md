# Gallery Strip Delta

## ADDED Requirements

### Requirement: Seed gallery
The demo SHALL show 8 thumbnail previews with seeds derived deterministically from the current seed, rendered with the current mood/image options.

#### Scenario: Adopt a thumbnail
- WHEN a thumbnail is clicked
- THEN the main preview and `location.hash` switch to that thumbnail's seed, reproducing it exactly full-size
