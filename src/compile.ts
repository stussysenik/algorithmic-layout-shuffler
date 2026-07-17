import type { Blueprint, Child, FluidToken, Section } from './types.js'
import { MOODS } from './moods.js'

const clamp = (t: FluidToken): string => `clamp(${t.min}rem, ${t.vw}vw, ${t.max}rem)`

/** WCAG relative luminance of a #rrggbb hex — used to pick an accent lightness that reads on the mood's bg. */
const relLum = (hex: string): number => {
  const f = (v: number): number => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255)
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function childStyle(c: Child, display: 'flex' | 'grid'): string {
  const rules: string[] = []
  if (display === 'flex' && c.flex) rules.push(`flex:${c.flex}`)
  if (display === 'grid' && c.area) rules.push(`grid-area:${c.area}`)
  if (c.align) rules.push(`align-self:${c.align}`)
  if (c.z !== undefined) rules.push(`z-index:${c.z}`)
  return rules.length ? ` style="${rules.join(';')}"` : ''
}

function childHtml(c: Child, display: 'flex' | 'grid', headlineTag: 'h1' | 'h2'): string {
  const style = childStyle(c, display)
  switch (c.kind) {
    case 'headline':
      return `<${headlineTag} class="headline"${style}>${esc(c.content ?? '')}</${headlineTag}>`
    case 'paragraph':
      return `<p class="paragraph"${style}>${esc(c.content ?? '')}</p>`
    case 'caption':
      return `<p class="caption"${style}>${esc(c.content ?? '')}</p>`
    case 'spacer':
      return `<div class="spacer" aria-hidden="true"${style}></div>`
    case 'image': {
      const hue = c.hue ?? 200
      const ph =
        `<div class="ph" style="aspect-ratio:${c.aspect ?? '4 / 3'};` +
        `background:linear-gradient(135deg,hsl(${hue} 55% 72%),hsl(${(hue + 40) % 360} 65% 42%))"></div>`
      return `<figure${style}>${ph}<figcaption class="caption">${esc(c.content ?? '')}</figcaption></figure>`
    }
  }
}

function sectionCss(s: Section, i: number): string {
  const rules: string[] = [`gap:calc(var(--fluid-gap) * ${s.gapScale})`]
  if (s.display === 'grid') {
    rules.push('display:grid', 'grid-template-columns:repeat(6, 1fr)', 'grid-auto-rows:minmax(3rem, auto)')
  } else {
    rules.push('display:flex', 'flex-wrap:wrap')
    if (s.direction) rules.push(`flex-direction:${s.direction}`)
    if (s.justify) rules.push(`justify-content:${s.justify}`)
    if (s.align) rules.push(`align-items:${s.align}`)
  }
  if (s.minHeight) rules.push(`min-height:${s.minHeight}`)
  return `.s${i}{${rules.join(';')}}`
}

/** Compile a blueprint into a semantic HTML fragment + a standalone stylesheet. */
export function compile(bp: Blueprint): { html: string; css: string } {
  const mood = MOODS[bp.mood]
  // accent must read as a graphic element (≥3:1) on this mood's bg: dark accent on light papers, light on the dark sheet.
  const accentL = relLum(mood.bg) < 0.5 ? 62 : 32
  const sections = bp.sections
    .map((s, i) => {
      const headlineTag = i === 0 ? 'h1' : 'h2'
      const kids = s.children.map((c) => childHtml(c, s.display, headlineTag)).join('\n    ')
      return `  <section class="s${i}" data-archetype="${s.archetype}">\n    ${kids}\n  </section>`
    })
    .join('\n')
  const html = `<main class="shuffled">\n${sections}\n</main>`

  const css = [
    `:root{`,
    `  --fluid-space:${clamp(mood.space)};`,
    `  --fluid-gap:${clamp(mood.gap)};`,
    `  --font-display:${clamp(mood.display)};`,
    `  --font-body:${clamp(mood.body)};`,
    `  --bg:${mood.bg};--fg:${mood.fg};--accent:hsl(${bp.accentHue} 68% ${accentL}%);`,
    `}`,
    `*,*::before,*::after{box-sizing:border-box;margin:0}`,
    `body{background:var(--bg);color:var(--fg);font-family:${mood.bodyFont}}`,
    `.shuffled{display:flex;flex-direction:column}`,
    `.shuffled section{padding:var(--fluid-space);container-type:inline-size;border-block-start:2px solid var(--accent)}`,
    `.shuffled section[data-archetype="full-bleed"]{padding:0}`,
    `.shuffled section:has(figure):not(:has(p)){gap:calc(var(--fluid-gap) * 0.5)}`,
    `.headline{font:700 var(--font-display)/0.95 ${mood.displayFont};letter-spacing:-0.02em;` +
      `text-wrap:balance;min-inline-size:min(12ch, 100%);${mood.uppercase ? 'text-transform:uppercase;' : ''}}`,
    `.paragraph{font-size:var(--font-body);line-height:1.55;text-wrap:pretty;max-inline-size:62ch;min-inline-size:min(28ch, 100%)}`,
    `.caption{font-size:calc(var(--font-body) * 0.78);letter-spacing:0.08em;text-transform:uppercase;opacity:0.75}`,
    `figure{min-inline-size:min(14rem, 100%)}`,
    `figure .ph{inline-size:100%}`,
    `figure figcaption{padding-block-start:0.5em}`,
    `::selection{background:var(--accent);color:var(--bg)}`,
    bp.sections.map(sectionCss).join('\n'),
  ].join('\n')

  return { html, css }
}

/** Wrap a compiled blueprint as a standalone, dependency-free HTML document. */
export function renderDocument(bp: Blueprint): string {
  const { html, css } = compile(bp)
  const title = `Shuffled layout — seed ${bp.seed} (${bp.mood})`
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc(title)}</title>\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>\n`
}
