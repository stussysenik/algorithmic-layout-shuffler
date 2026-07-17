import { shuffle, validate, compile, renderDocument } from '../dist/index.js'

let failures = 0
const fail = (msg) => {
  failures++
  console.error(`FAIL: ${msg}`)
}

const HEADLINE_OPENERS = new Set(['hero', 'stack', 'collage', 'masthead', 'offset-stack'])

for (let seed = 1; seed <= 500; seed++) {
  for (const withImages of [true, false]) {
    const bp = shuffle({ seed, withImages })
    const errors = validate(bp)
    if (errors.length) fail(`seed ${seed} images=${withImages}: ${errors.join('; ')}`)
    if (!HEADLINE_OPENERS.has(bp.sections[0]?.archetype))
      fail(`seed ${seed} images=${withImages}: opener ${bp.sections[0]?.archetype} not in headline-opener set`)
    if (!withImages && bp.sections[0]?.archetype === 'collage')
      fail(`seed ${seed}: collage opener despite withImages=false`)
    const { html, css } = compile(bp)
    if ((html.match(/<h1/g) ?? []).length !== 1) fail(`seed ${seed} images=${withImages}: html must contain exactly one <h1`)
    if (!html.includes('<section')) fail(`seed ${seed}: html has no sections`)
    if (!css.includes('--fluid-space')) fail(`seed ${seed}: css missing fluid tokens`)
    if (!css.includes('clamp(')) fail(`seed ${seed}: css missing clamp()`)
    if (!css.includes('container-type')) fail(`seed ${seed}: css missing container-type`)
    if (!css.includes('text-wrap')) fail(`seed ${seed}: css missing text-wrap`)
    if (!withImages && bp.sections.some((s) => s.archetype === 'full-bleed'))
      fail(`seed ${seed}: full-bleed present despite withImages=false`)
  }
}

// invariant: validate() independently rejects per-child align-self:stretch on column text
const bad = {
  seed: 0,
  mood: 'gallery',
  withImages: true,
  accentHue: 0,
  sections: [
    { archetype: 'hero', display: 'flex', direction: 'row', gapScale: 1, children: [{ kind: 'headline', content: 'x' }] },
    {
      archetype: 'offset-stack',
      display: 'flex',
      direction: 'column',
      gapScale: 1,
      children: [{ kind: 'paragraph', align: 'stretch', content: 'x' }],
    },
  ],
}
if (!validate(bad).some((e) => e.includes('align-self: stretch')))
  fail('validate() did not reject column text with align-self:stretch')

// determinism: same seed → byte-identical document
const a = renderDocument(shuffle({ seed: 42 }))
const b = renderDocument(shuffle({ seed: 42 }))
if (a !== b) fail('seed 42 is not deterministic')
const c = renderDocument(shuffle({ seed: 43 }))
if (a === c) fail('seeds 42 and 43 produced identical documents')

// explicit options are honored
const bp = shuffle({ seed: 7, mood: 'zine', withImages: false, sections: 5 })
if (bp.mood !== 'zine') fail('mood option ignored')
if (bp.sections.length !== 5) fail('sections option ignored')
if (bp.sections.some((s) => s.children.some((k) => k.kind === 'image'))) fail('withImages=false leaked images')

if (failures) {
  console.error(`${failures} failure(s)`)
  process.exit(1)
}
console.log('smoke: 1000 blueprints valid, deterministic, options honored')
