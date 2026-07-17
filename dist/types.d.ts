/** A fluid value compiled to `clamp(min rem, vw vw, max rem)`. */
export interface FluidToken {
    min: number;
    vw: number;
    max: number;
}
export type MoodName = 'gallery' | 'editorial' | 'zine';
export interface Mood {
    name: MoodName;
    space: FluidToken;
    gap: FluidToken;
    display: FluidToken;
    body: FluidToken;
    displayFont: string;
    bodyFont: string;
    uppercase: boolean;
    bg: string;
    fg: string;
}
export type ChildKind = 'headline' | 'paragraph' | 'caption' | 'image' | 'spacer';
export interface Child {
    kind: ChildKind;
    /** flex shorthand, e.g. "1 1 55%" (flex sections only) */
    flex?: string;
    /** grid-area placement, e.g. "1 / 1 / 4 / 5" (grid sections only) */
    area?: string;
    z?: number;
    /** per-child align-self override (flex sections), e.g. staggered offset-stack reads */
    align?: string;
    content?: string;
    /** image placeholders: aspect ratio + deterministic gradient hue */
    aspect?: string;
    hue?: number;
}
export type Archetype = 'hero' | 'split' | 'stack' | 'strip' | 'collage' | 'interlude' | 'masthead' | 'ledger' | 'offset-stack' | 'full-bleed';
export interface Section {
    archetype: Archetype;
    display: 'flex' | 'grid';
    direction?: 'row' | 'row-reverse' | 'column';
    justify?: string;
    align?: string;
    /** multiplier applied to --fluid-gap */
    gapScale: number;
    minHeight?: string;
    children: Child[];
}
export interface Blueprint {
    seed: number;
    mood: MoodName;
    withImages: boolean;
    accentHue: number;
    sections: Section[];
}
export interface ShuffleOptions {
    seed?: number;
    mood?: MoodName | 'auto';
    withImages?: boolean;
    /** number of sections; defaults to 4–7 chosen by the rng */
    sections?: number;
}
