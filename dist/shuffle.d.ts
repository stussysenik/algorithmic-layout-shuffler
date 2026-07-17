import type { Archetype, Blueprint, Section, ShuffleOptions } from './types.js';
import { type Rng } from './rng.js';
interface Ctx {
    rng: Rng;
    withImages: boolean;
    hue: number;
}
type Generator = (ctx: Ctx) => Section;
/** Extension point: register a new archetype = new combination of ingredients. */
export declare const ARCHETYPES: Record<Archetype, Generator>;
export declare function shuffle(opts?: ShuffleOptions): Blueprint;
/** Independent re-check of the assembly constraints. Returns human-readable violations. */
export declare function validate(bp: Blueprint): string[];
export {};
