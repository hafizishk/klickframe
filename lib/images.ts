/**
 * Every photograph on the site routes through this one object. Swap a value
 * and the page re-skins — nothing else needs to change.
 *
 * When the client asset drop lands, point each key at a local file under
 * `/public/images` (e.g. "/images/wedding-01.jpg") and drop the picsum
 * remotePattern from next.config.ts.
 *
 * Pick for spread — a wedding, a boardroom, a product shot, a portrait — not
 * the eight best football ones. The site has to stand alone against a feed
 * that is ~80% sport.
 */
export const IMAGES = {
  /** Client-supplied: Malaysia v Singapore, centre circle. Portrait source. */
  hero: "/images/hero-match.jpg",
  wed: "https://picsum.photos/seed/kf-wed-07/1400/1800",
  corp: "https://picsum.photos/seed/kf-corp-11/1600/1200",
  prod: "https://picsum.photos/seed/kf-prod-04/1400/1400",
  stage: "https://picsum.photos/seed/kf-stage-09/1400/1800",
  sport: "/images/hero-match.jpg",
  port: "https://picsum.photos/seed/kf-port-06/1400/1400",
  food: "https://picsum.photos/seed/kf-food-03/1400/1000",
} as const;

export type ImageKey = keyof typeof IMAGES;

/**
 * Gradient fallback painted under every image field. If a photo fails to load
 * — or has not been supplied yet — the gradient is what shows, and the page
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
