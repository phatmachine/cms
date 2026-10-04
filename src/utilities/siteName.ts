// Single source of truth for the brand name used across meta titles and
// Open Graph tags (plugins/index.ts, generateMeta.ts, mergeOpenGraph.ts).
// Centralized after finding those three had drifted into two different
// hardcoded copies of the same string.
export const SITE_NAME = 'Rethink The Machine'
