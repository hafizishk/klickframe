/**
 * Every photograph on the site routes through this one object.
 *
 * These are filenames, not a to-do list. Drop a JPG into `public/images/` with
 * the matching name and it appears on the page — no code change, no rebuild
 * step to remember. Leave one out and the gradient fallback shows instead,
 * which is a designed state, not a broken one. So the site is presentable at
 * every stage of filling it in.
 *
 * Nothing here is stock. A random stock landscape in the work rail reads as
 * filler and undercuts the pitch; a gradient reads as art direction.
 *
 * Where each one lands:
 *   hero   full-viewport hero. Portrait crops fine (biased to `center 38%`).
 *          Needs a dark lower third or the white headline stops holding.
 *   corp   work rail 01, landscape 4:3
 *   wed    work rail 02, portrait 3:4
 *   prod   work rail 03, landscape 4:3
 *   stage  work rail 04, portrait 3:4
 *   sport  work rail 05, landscape 4:3
 *   port   work rail 06, portrait 3:4
 *   food   sector hover peek only — the one key with no work-rail slot
 *
 * Every sector row also peeks its matching key on hover.
 */
export const IMAGES = {
  /** Client-supplied: Malaysia v Singapore, centre circle. The one real asset. */
  hero: "/images/hero-match.jpg",
  wed: "/images/wedding.jpg",
  corp: "/images/corporate.jpg",
  prod: "/images/brand.jpg",
  stage: "/images/live.jpg",
  sport: "/images/hero-match.jpg",
  port: "/images/portrait.jpg",
  food: "/images/food.jpg",
} as const;

export type ImageKey = keyof typeof IMAGES;

/**
 * Gradient fallback painted under every image field. If a photo fails to load
 * — or has not been dropped in yet — the gradient is what shows, and the page
 * still reads as designed rather than as a broken grid.
 */
export type FieldTone =
  | "f-wed"
  | "f-corp"
  | "f-sport"
  | "f-prod"
  | "f-stage"
  | "f-port"
  | "f-food"
  | "f-night";
