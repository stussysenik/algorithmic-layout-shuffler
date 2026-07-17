# Archetype Expansion Delta

## MODIFIED Requirements

### Requirement: Archetype registry
The registry SHALL additionally include `masthead`, `ledger`, `offset-stack`, and `full-bleed`, each composed from ingredient arrays and subject to the same rotation, adjacency, and image-mode rules as existing archetypes.

#### Scenario: Image-mode exclusion
- WHEN `shuffle({ withImages: false })` runs across 500 seeds
- THEN `full-bleed` never appears and `validate()` reports zero violations
