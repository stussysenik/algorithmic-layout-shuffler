import { shuffle, renderDocument } from '../dist/index.js'

const iframe = document.getElementById('preview')
const seedEl = document.getElementById('seed')
const moodEl = document.getElementById('mood')
const imagesEl = document.getElementById('images')
const reshuffleEl = document.getElementById('reshuffle')
const copyEl = document.getElementById('copy')
const stripEl = document.getElementById('strip')

const MOODS = new Set(['auto', 'gallery', 'editorial', 'zine'])
const THUMB_COUNT = 8

/** Deterministic thumbnail seeds from the current main seed. */
function derivedSeeds(seed) {
  return Array.from({ length: THUMB_COUNT }, (_, i) => seed * 31 + i)
}

/** Single source of truth. UI = f(state). */
const state = {
  seed: 1,
  mood: 'auto',
  withImages: true,
}

/** state → immutable render. GUI-only Math.random is fine; kernel stays pure. */
function render() {
  iframe.srcdoc = renderDocument(shuffle(state))
  renderStrip()
}

/** Deterministic thumbnail strip; reflects current mood/image options. */
function renderStrip() {
  stripEl.replaceChildren()
  for (const seed of derivedSeeds(state.seed)) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'thumb'
    btn.title = `seed ${seed}`
    btn.dataset.seed = String(seed)
    const box = document.createElement('div')
    box.className = 'thumb-box'
    const frame = document.createElement('iframe')
    frame.className = 'thumb-frame'
    frame.tabIndex = -1
    frame.setAttribute('aria-hidden', 'true')
    frame.srcdoc = renderDocument(shuffle({ ...state, seed }))
    box.append(frame)
    btn.append(box)
    btn.addEventListener('click', () => {
      state.seed = seed
      commit()
    })
    stripEl.append(btn)
  }
}

/** state → hash (`#s=42&m=zine&i=0`), shareable URL. */
function writeHash() {
  const params = new URLSearchParams({
    s: String(state.seed),
    m: state.mood,
    i: state.withImages ? '1' : '0',
  })
  history.replaceState(null, '', `#${params}`)
}

/** hash → state, on load. */
function readHash() {
  const params = new URLSearchParams(location.hash.slice(1))
  const s = Number(params.get('s'))
  if (Number.isFinite(s) && params.has('s')) state.seed = Math.trunc(s)
  const m = params.get('m')
  if (m && MOODS.has(m)) state.mood = m
  if (params.has('i')) state.withImages = params.get('i') !== '0'
}

/** state → controls. */
function syncControls() {
  seedEl.value = String(state.seed)
  moodEl.value = state.mood
  imagesEl.checked = state.withImages
}

function commit() {
  syncControls()
  writeHash()
  render()
}

seedEl.addEventListener('input', () => {
  const s = Number(seedEl.value)
  if (!Number.isFinite(s)) return
  state.seed = Math.trunc(s)
  writeHash()
  render()
})

moodEl.addEventListener('change', () => {
  state.mood = moodEl.value
  writeHash()
  render()
})

imagesEl.addEventListener('change', () => {
  state.withImages = imagesEl.checked
  writeHash()
  render()
})

reshuffleEl.addEventListener('click', () => {
  state.seed = Math.floor(Math.random() * 1e9)
  commit()
})

copyEl.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(iframe.srcdoc)
    copyEl.textContent = 'copied'
    copyEl.classList.add('copied')
    setTimeout(() => {
      copyEl.textContent = 'copy export'
      copyEl.classList.remove('copied')
    }, 1200)
  } catch {
    /* clipboard blocked (e.g. insecure context) — preview is unaffected */
  }
})

readHash()
commit()
