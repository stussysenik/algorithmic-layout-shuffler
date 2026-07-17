import type { Blueprint } from './types.js';
/** Compile a blueprint into a semantic HTML fragment + a standalone stylesheet. */
export declare function compile(bp: Blueprint): {
    html: string;
    css: string;
};
/** Wrap a compiled blueprint as a standalone, dependency-free HTML document. */
export declare function renderDocument(bp: Blueprint): string;
