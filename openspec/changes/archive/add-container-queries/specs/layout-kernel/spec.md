# Container Query Delta

## MODIFIED Requirements

### Requirement: Fluid semantic compilation
`compile(bp)` SHALL additionally make every section a size container (`container-type: inline-size`) so embedded sections respond to their slot rather than the viewport, and SHALL apply `text-wrap: pretty` to paragraphs.

#### Scenario: Embedded in a narrow host slot
- WHEN a compiled section is placed in a 400px-wide host container on a wide viewport
- THEN its layout breaks by container width, not window width
