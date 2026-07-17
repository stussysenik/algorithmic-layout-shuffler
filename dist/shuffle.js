import { mulberry32, pick, int, chance } from './rng.js';
import { HEADLINES, PARAGRAPHS, CAPTIONS, KICKERS } from './content.js';
/**
 * Ingredient arrays — the combinatoric vocabulary. Constraint rules live in the
 * generators so every emitted section is correct by construction; validate()
 * re-checks the invariants independently.
 */
const ROW_JUSTIFY = ['space-between', 'flex-start', 'flex-end', 'center'];
/** never 'stretch' next to text — stretched text blocks are the squished look we exist to avoid */
const ROW_ALIGN_TEXT = ['flex-end', 'baseline', 'flex-start', 'center'];
const COLUMN_ALIGN = ['flex-start', 'center', 'flex-end'];
const IMAGE_ASPECTS = ['4 / 3', '3 / 4', '1 / 1', '16 / 10', '2 / 3'];
const GAP_SCALES = [0.5, 1, 1, 1.5, 2];
function headline(rng, flex) {
    return { kind: 'headline', flex, content: pick(rng, HEADLINES) };
}
function paragraph(rng, flex) {
    return { kind: 'paragraph', flex, content: pick(rng, PARAGRAPHS) };
}
function caption(rng, flex) {
    return { kind: 'caption', flex, content: pick(rng, CAPTIONS) };
}
function image(ctx, flex) {
    return {
        kind: 'image',
        flex,
        aspect: pick(ctx.rng, IMAGE_ASPECTS),
        hue: (ctx.hue + int(ctx.rng, -30, 50) + 360) % 360,
        content: pick(ctx.rng, CAPTIONS),
    };
}
/** Extension point: register a new archetype = new combination of ingredients. */
export const ARCHETYPES = {
    hero({ rng, withImages, hue }) {
        const kids = [headline(rng, '1 1 55%')];
        if (withImages)
            kids.push(image({ rng, withImages, hue }, '0 1 32%'));
        else
            kids.push(caption(rng, '0 1 20%'));
        if (chance(rng, 0.5))
            kids.unshift({ kind: 'caption', flex: '1 1 100%', content: pick(rng, KICKERS) });
        return {
            archetype: 'hero',
            display: 'flex',
            direction: 'row',
            justify: 'space-between',
            align: pick(rng, ['flex-end', 'baseline']),
            gapScale: 1,
            minHeight: `${int(rng, 78, 92)}vh`,
            children: kids,
        };
    },
    split(ctx) {
        const { rng, withImages } = ctx;
        const reverse = chance(rng, 0.4);
        const kids = [paragraph(rng, '1 1 34%')];
        kids.push(withImages && chance(rng, 0.7) ? image(ctx, '1 1 46%') : headline(rng, '1 1 46%'));
        return {
            archetype: 'split',
            display: 'flex',
            direction: reverse ? 'row-reverse' : 'row',
            justify: pick(rng, ROW_JUSTIFY),
            align: pick(rng, ROW_ALIGN_TEXT),
            gapScale: pick(rng, GAP_SCALES),
            children: kids,
        };
    },
    stack({ rng }) {
        const kids = [headline(rng, '0 1 auto')];
        for (let i = int(rng, 1, 2); i > 0; i--)
            kids.push(paragraph(rng, '0 1 auto'));
        return {
            archetype: 'stack',
            display: 'flex',
            direction: 'column',
            justify: 'flex-start',
            // rule: column + text present → align is never 'stretch'
            align: pick(rng, COLUMN_ALIGN),
            gapScale: pick(rng, GAP_SCALES),
            children: kids,
        };
    },
    strip(ctx) {
        const { rng } = ctx;
        const kids = [];
        for (let i = int(rng, 3, 5); i > 0; i--)
            kids.push(image(ctx, `1 1 ${int(rng, 16, 26)}%`));
        if (chance(rng, 0.6))
            kids.push(caption(rng, '1 1 100%'));
        return {
            archetype: 'strip',
            display: 'flex',
            direction: 'row',
            justify: 'flex-start',
            align: 'flex-start',
            gapScale: pick(rng, [0.5, 1]),
            children: kids,
        };
    },
    collage(ctx) {
        const { rng } = ctx;
        const img = image(ctx, '');
        img.area = `1 / 1 / ${int(rng, 4, 5)} / ${int(rng, 4, 6)}`;
        img.z = 1;
        const head = headline(rng, '');
        head.area = `${int(rng, 2, 3)} / 3 / 5 / 7`;
        head.z = 2;
        const cap = caption(rng, '');
        cap.area = '5 / 1 / 6 / 3';
        return {
            archetype: 'collage',
            display: 'grid',
            gapScale: 1,
            minHeight: '70vh',
            children: [img, head, cap],
        };
    },
    interlude({ rng }) {
        return {
            archetype: 'interlude',
            display: 'flex',
            direction: 'column',
            justify: 'center',
            align: pick(rng, COLUMN_ALIGN),
            gapScale: 1,
            minHeight: `${int(rng, 38, 60)}vh`,
            children: [caption(rng, '0 1 auto'), ...(chance(rng, 0.5) ? [paragraph(rng, '0 1 45ch')] : [])],
        };
    },
    // one giant word/kicker over interlude-scale whitespace
    masthead({ rng }) {
        return {
            archetype: 'masthead',
            display: 'flex',
            direction: 'column',
            justify: 'center',
            align: pick(rng, COLUMN_ALIGN),
            gapScale: pick(rng, [1, 1.5, 2]),
            minHeight: `${int(rng, 40, 60)}vh`,
            children: [{ kind: 'caption', flex: '1 1 100%', content: pick(rng, KICKERS) }, headline(rng, '0 1 auto')],
        };
    },
    // definition-list rows: term (caption) / description (paragraph) pairs, baseline-aligned
    ledger({ rng }) {
        const kids = [];
        for (let i = int(rng, 3, 5); i > 0; i--) {
            kids.push(caption(rng, '0 1 22%'), paragraph(rng, '1 1 60%'));
        }
        return {
            archetype: 'ledger',
            display: 'flex',
            direction: 'row',
            justify: 'space-between',
            align: 'baseline',
            gapScale: pick(rng, GAP_SCALES),
            children: kids,
        };
    },
    // column whose children alternate align-self for a staggered read
    'offset-stack'({ rng }) {
        const kids = [];
        const n = int(rng, 3, 4);
        for (let i = 0; i < n; i++) {
            const c = i === 0 ? headline(rng, '0 1 auto') : paragraph(rng, '0 1 auto');
            c.align = i % 2 === 0 ? 'flex-start' : 'flex-end';
            kids.push(c);
        }
        return {
            archetype: 'offset-stack',
            display: 'flex',
            direction: 'column',
            justify: 'flex-start',
            align: pick(rng, COLUMN_ALIGN),
            gapScale: pick(rng, GAP_SCALES),
            children: kids,
        };
    },
    // edge-to-edge image (section padding zeroed in compile) with its small figcaption
    'full-bleed'(ctx) {
        return {
            archetype: 'full-bleed',
            display: 'flex',
            direction: 'column',
            justify: 'flex-start',
            align: 'stretch',
            gapScale: 0.5,
            minHeight: `${int(ctx.rng, 60, 80)}vh`,
            children: [image(ctx, '1 1 100%')],
        };
    },
};
const TEXT_KINDS = new Set(['headline', 'paragraph', 'caption']);
const IMAGE_ARCHETYPES = new Set(['strip', 'collage', 'full-bleed']);
/** Archetypes whose generators always emit a `headline` child — the only ones fit to open (they host the sole h1). */
const HEADLINE_OPENERS = ['hero', 'stack', 'collage', 'masthead', 'offset-stack'];
export function shuffle(opts = {}) {
    const seed = opts.seed ?? 1;
    const rng = mulberry32(seed);
    const mood = !opts.mood || opts.mood === 'auto' ? pick(rng, ['gallery', 'editorial', 'zine']) : opts.mood;
    const withImages = opts.withImages ?? true;
    const hue = int(rng, 0, 359);
    const ctx = { rng, withImages, hue };
    // hero is opener-only: kept out of the rotation pool, offered only in the opener set.
    let pool = Object.keys(ARCHETYPES).filter((a) => a !== 'hero');
    let openers = HEADLINE_OPENERS;
    if (!withImages) {
        pool = pool.filter((a) => !IMAGE_ARCHETYPES.has(a));
        openers = openers.filter((a) => !IMAGE_ARCHETYPES.has(a));
    }
    const opener = pick(rng, openers);
    const count = opts.sections ?? int(rng, 4, 7);
    const sections = [ARCHETYPES[opener](ctx)];
    let prev = opener;
    while (sections.length < count) {
        const candidates = pool.filter((a) => a !== prev);
        const next = pick(rng, candidates);
        sections.push(ARCHETYPES[next](ctx));
        prev = next;
    }
    return { seed, mood, withImages, accentHue: hue, sections };
}
/** Independent re-check of the assembly constraints. Returns human-readable violations. */
export function validate(bp) {
    const errors = [];
    if (bp.sections.length === 0)
        errors.push('blueprint has no sections');
    const first = bp.sections[0];
    if (first && !HEADLINE_OPENERS.includes(first.archetype))
        errors.push(`first section must be a headline-bearing opener, got ${first.archetype}`);
    if (first && !first.children.some((c) => c.kind === 'headline'))
        errors.push('first section must contain a headline (the sole h1 host)');
    bp.sections.forEach((s, i) => {
        if (s.children.length === 0)
            errors.push(`section ${i} (${s.archetype}) has no children`);
        const hasText = s.children.some((c) => TEXT_KINDS.has(c.kind));
        if (s.direction === 'column' && hasText && s.align === 'stretch')
            errors.push(`section ${i} (${s.archetype}): column + text must not use align-items: stretch`);
        if (s.direction === 'column')
            s.children.forEach((c, j) => {
                if (TEXT_KINDS.has(c.kind) && c.align === 'stretch')
                    errors.push(`section ${i} (${s.archetype}) child ${j}: column text must not use align-self: stretch`);
            });
        if (!bp.withImages && s.children.some((c) => c.kind === 'image'))
            errors.push(`section ${i} (${s.archetype}): image child despite withImages=false`);
        if (i > 0 && bp.sections[i - 1]?.archetype === s.archetype)
            errors.push(`sections ${i - 1} and ${i} repeat archetype ${s.archetype}`);
    });
    return errors;
}
