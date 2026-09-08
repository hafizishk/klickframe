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
 * Where each one lands (the rail is defined by WORK in lib/content.ts, so this
 * list follows it rather than the other way round):
 *   hero   full-viewport hero. Portrait crops fine (biased to `center 38%`).
 *          Needs a dark lower third or the white headline stops holding.
 *   prod   work rail 01 — Puma Ultimate 9 x Weston Corp
 *   stage  work rail 02 — ASEAN Shopee Trophy
 *   sport  work rail 03 — Tibia by Picklebones
 *   hsbc   work rail 04 — HSBC netball
 *   wed    work rail 05 — wedding film, landscape and shown small
 *   iwl    FAS Island Wide League, the season-long live broadcast
 *   corp   unused — no boardroom still yet
 *   port   unused — no portrait still yet
 *   food   unused
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
  /** HSBC netball. No stills supplied, so this falls straight to the reel. */
  hsbc: "/images/hsbc.jpg",
  /**
   * FAS Island Wide League — the live broadcast. Frames off the stream carry
   * the FAS and Island Wide League bugs and KlickFrame's own KTV mark, which
   * is the on-screen-graphics claim shown rather than stated.
   */
  iwl: "/images/iwl.jpg",
} as const;

export type ImageKey = keyof typeof IMAGES;

/**
 * Reels, as silent looping video. Same keys as IMAGES: a key with a file here
 * renders motion in that slot, and one without falls back to the photograph,
 * which falls back to the gradient. Three tiers, so any mix of what exists
 * still looks finished.
 *
 * These are the strongest thing in their feed, and a live multi-camera cut is
 * a claim far better shown than described.
 *
 * Do NOT drop a raw Instagram download in here. Run `npm run media` — it
 * strips the audio (nothing autoplays with sound, and it sidesteps any
 * question about the music on the original post), caps the height, moves the
 * moov atom to the front so playback starts before the file finishes loading,
 * and writes the poster frame each entry below points at.
 */
export const VIDEOS = {
  hero: "/videos/hero.mp4",
  wed: "/videos/wedding.mp4",
  corp: "/videos/corporate.mp4",
  prod: "/videos/brand.mp4",
  stage: "/videos/live.mp4",
  sport: "/videos/sport.mp4",
  port: "/videos/portrait.mp4",
  food: "/videos/food.mp4",
  hsbc: "/videos/hsbc.mp4",
  iwl: "/videos/iwl.mp4",
} as const;

/** Poster frame written next to each video by `npm run media`. */
export function posterFor(video: string) {
  return video.replace(/\.mp4$/, "-poster.jpg");
}

/**
 * VP9/WebM sibling, offered ahead of the MP4. Chrome and Firefox take it at
 * roughly two thirds the bytes; Safari ignores it and takes the MP4, which is
 * the only one it will play.
 */
export function webmFor(video: string) {
  return video.replace(/\.mp4$/, ".webm");
}

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
