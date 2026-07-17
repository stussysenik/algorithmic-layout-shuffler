export type Rng = () => number;
/** mulberry32 — tiny deterministic PRNG so a seed is a shareable layout. */
export declare function mulberry32(seed: number): Rng;
export declare function pick<T>(rng: Rng, arr: readonly T[]): T;
export declare function int(rng: Rng, min: number, max: number): number;
export declare function chance(rng: Rng, p: number): boolean;
