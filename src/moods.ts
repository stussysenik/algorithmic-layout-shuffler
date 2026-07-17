import type { Mood, MoodName } from './types.js'

export const MOODS: Record<MoodName, Mood> = {
  gallery: {
    name: 'gallery',
    space: { min: 2, vw: 6, max: 8 },
    gap: { min: 1.5, vw: 4, max: 6 },
    display: { min: 2.25, vw: 6, max: 8 },
    body: { min: 1, vw: 1.1, max: 1.2 },
    displayFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    bodyFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    uppercase: false,
    // cool bright paper — a faint blue-gray, distinct from editorial's warm cream
    bg: '#e6ebf0',
    fg: '#151a1f',
  },
  editorial: {
    name: 'editorial',
    space: { min: 1.5, vw: 5, max: 6 },
    gap: { min: 1, vw: 3, max: 4 },
    display: { min: 2.5, vw: 8, max: 11 },
    body: { min: 1, vw: 1.2, max: 1.25 },
    displayFont: 'Georgia, "Times New Roman", serif',
    bodyFont: 'Georgia, "Times New Roman", serif',
    uppercase: false,
    // warm cream — clearly yellower/deeper than gallery's cool paper
    bg: '#f4e6cb',
    fg: '#2a2110',
  },
  zine: {
    name: 'zine',
    space: { min: 0.75, vw: 2.5, max: 3 },
    gap: { min: 0.25, vw: 1, max: 1.25 },
    display: { min: 3, vw: 11, max: 14 },
    body: { min: 0.95, vw: 1.1, max: 1.1 },
    displayFont: '"Arial Narrow", "Helvetica Neue", Arial, sans-serif',
    bodyFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    uppercase: true,
    // dark high-contrast sheet — the third pole, unmistakable against the two light papers
    bg: '#111114',
    fg: '#f4f1ea',
  },
}
