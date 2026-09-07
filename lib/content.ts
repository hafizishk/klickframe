import type { FieldTone, ImageKey } from "./images";

/**
 * All site copy lives here so the client can be walked through one file.
 *
 * Anything marked UNCONFIRMED is placeholder written for the mock and has NOT
 * been agreed with KlickFrame SG. It must be confirmed before launch — see
 * CONTENT_HOLDS at the bottom of this file for the full list.
 */

export const STUDIO = {
  name: "KlickFrame SG",
  legalName: "KlickFrame SG Pte Ltd",
  city: "Singapore",
  whatsapp: "+65 8092 3828",
  whatsappUrl: "https://wa.me/6580923828",
  instagram: "@klickframesg",
  instagramUrl: "https://www.instagram.com/klickframesg/",
  youtube: "KlickFrameSG",
  youtubeUrl: "https://www.youtube.com/@KlickframeSGTV",
  // UNCONFIRMED — studio address and email are not known.
  address: null,
  email: null,
} as const;

/**
 * True while this is a pitch concept rather than KlickFrame's live site.
 *
 * Keep it true until they have actually commissioned the build and signed off
 * the copy. The page carries their real WhatsApp number alongside claims they
 * have never agreed to (see CONTENT_HOLDS), so a shared link needs to say
 * plainly that it is a concept — otherwise a prospect can find it, read the
 * turnaround promises as commitments, and message KlickFrame about them.
 */
export const IS_CONCEPT = true;

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Sectors", href: "#sectors" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const HERO = {
  /** Rises line by line, once, on load. */
  headline: ["We shoot what", "you can't do", "twice."],
  standfirst:
    "A Singapore photo, film and live production studio. Weddings, boardrooms, brands, stages and stadiums — one crew, from first call to final grade.",
  slate: "Singapore · Est. KlickFrame SG",
  image: "hero" as ImageKey,
  tone: "f-night" as FieldTone,
  /** Real: HSBC x On race day. Falls back to the match photograph. */
  motion: true,
} as const;

export const STATEMENT = {
  slate: "The studio",
  headline:
    "Most of what we film happens once, in front of people who will remember it. That is the whole job.",
  points: [
    // UNCONFIRMED — kit ownership and mark-up claim.
    "We own the kit. Cameras, audio, lighting, switcher and encoder — nothing gets rented in at the last minute, and nothing gets marked up on your invoice.",
    // UNCONFIRMED — in-house edit claim.
    "We cut in house. The person who shot your day is the person who edits it, so nothing gets lost in a handover to an editor who wasn't there.",
    // UNCONFIRMED — same-night turnaround promise.
    "We deliver on the night. A preview set goes out before you get home, because the day after is when people are still looking.",
  ],
} as const;

/**
 * The work rail — every card a real, named project with the reel shot for it.
 * The two placeholder cards are gone, so nothing here is invented any more.
 *
 * `portrait` is per card rather than derived from position, because the crop
 * has to follow the footage: the reels are 9:16 and belong in a 3:4 card, but
 * the wedding film is a 636x360 landscape that a portrait card would reduce to
 * a letterbox of its own middle.
 *
 * `small` narrows a card. The wedding film is genuinely low resolution, so it
 * is shown at a size that flatters it rather than one that exposes it.
 *
 * Captions name the brand and the event rather than the sport: Puma, Weston,
 * Shopee and HSBC are what the work was for, and naming them is what makes
 * football, pickleball and netball footage read as brand work.
 */
export const WORK = [
  {
    index: "01",
    kicker: "Brand",
    // Real: product film for Puma Ultimate 9, with Weston Corp and Flair.
    // Title is Hafiz's wording — keep the "x" as written.
    title: "Puma Ultimate 9 x Weston Corp",
    meta: ["Product film", "On location"],
    image: "prod" as ImageKey,
    tone: "f-prod" as FieldTone,
    portrait: true,
    motion: true,
  },
  {
    index: "02",
    kicker: "Live",
    // Real: coverage of the ASEAN Shopee Trophy.
    title: "ASEAN Shopee Trophy",
    meta: ["Event film", "Activation"],
    image: "stage" as ImageKey,
    tone: "f-stage" as FieldTone,
    portrait: true,
    motion: true,
    // The banner sits left of centre in frame; nudge the framing right.
    focus: 0.03,
  },
  {
    index: "03",
    kicker: "Sport",
    // Real: highlight film for Tibia by Picklebones.
    title: "Tibia by Picklebones",
    meta: ["Highlight film", "Multi-sport"],
    image: "sport" as ImageKey,
    tone: "f-sport" as FieldTone,
    portrait: true,
    motion: true,
  },
  {
    index: "04",
    // "Live" rather than "Sport": this is match coverage, and live multi-camera
    // is the differentiator the whole site is built to sell.
    kicker: "Live",
    // Real: HSBC netball.
    title: "HSBC Netball",
    meta: ["Match coverage", "Highlights"],
    image: "hsbc" as ImageKey,
    tone: "f-sport" as FieldTone,
    portrait: true,
    motion: true,
  },
  {
    index: "05",
    kicker: "Wedding",
    // Real. Low resolution, hence `small` — see the note above. Last by
    // request, and the only landscape source in the set.
    title: "Wedding film",
    meta: ["Photo, film", "Full day"],
    image: "wed" as ImageKey,
    tone: "f-wed" as FieldTone,
    portrait: false,
    small: true,
    motion: true,
  },
] as const;

// UNCONFIRMED — the total. The five shown are real.
export const WORK_NOTE = "Five of thirty-plus projects · Full portfolio on request";

export const SERVICES = {
  slate: "Services",
  headline: "Four things, done end to end.",
  standfirst:
    "No agency layers, no subcontracted second unit. You brief the person who will be holding the camera.",
  items: [
    {
      n: "01",
      title: "Photography",
      body: "Full or half-day coverage, shot and graded in house. Events, corporate, product, interiors and portraits.",
      // UNCONFIRMED — "Same-night preview set" is a turnaround promise.
      tags: ["Same-night preview set", "Press and web exports", "Second shooter available"],
    },
    {
      n: "02",
      title: "Film",
      body: "From a single-camera testimonial to a scripted campaign piece, with the edit, sound and colour handled here.",
      tags: ["Brand and campaign films", "Highlight reels", "Vertical cutdowns", "Licensed music"],
    },
    {
      n: "03",
      title: "Live production",
      // The differentiator. Sport is proof of the capability, never the category.
      body: "Multi-camera, switched live, with your graphics on screen and your logo where it belongs. Streamed to your own channels, recorded clean for later edits.",
      tags: [
        "Hybrid conferences",
        "Town halls",
        "Ceremonies",
        "Sport with live scoring",
        "Sponsor slates",
      ],
    },
    {
      n: "04",
      title: "Retainers",
      body: "A monthly shoot day and a steady supply of assets, for teams who have run out of things to post.",
      tags: ["Monthly shoot days", "Asset libraries", "Template packs", "Priority dates"],
    },
  ],
} as const;

/**
 * Order is deliberate and settled: the first is read, the last is scrolled
 * past. KlickFrame SG are not a sports specialist — do not promote Sport.
 */
export const SECTORS = [
  {
    title: "Weddings",
    body: "Solemnisations, ceremonies and banquets, plus a live feed for family who can't fly in.",
    image: "wed" as ImageKey,
    tone: "f-wed" as FieldTone,
  },
  {
    title: "Corporate",
    body: "Conferences, D&Ds, town halls and launches, with hybrid streaming built in.",
    image: "corp" as ImageKey,
    tone: "f-corp" as FieldTone,
  },
  {
    title: "Brands & agencies",
    body: "Product films, campaign stills and content packs, studio setup through final grade.",
    image: "prod" as ImageKey,
    tone: "f-prod" as FieldTone,
  },
  {
    title: "Live events",
    body: "Festivals, showcases and community days. Multi-camera coverage, same-day clips.",
    image: "stage" as ImageKey,
    tone: "f-stage" as FieldTone,
  },
  {
    title: "Sport",
    body: "Clubs, leagues and race days. Match streams with live scoring, season photography.",
    image: "sport" as ImageKey,
    tone: "f-sport" as FieldTone,
  },
  {
    title: "F&B & retail",
    body: "Menu shoots, venue stills and short-form video for outlets and franchise groups.",
    image: "food" as ImageKey,
    tone: "f-food" as FieldTone,
  },
] as const;

/**
 * CONFIRMED by Hafiz as engaged clients. Everything else on the page is still
 * placeholder — this list is not.
 *
 * Ordered so the non-sport names read first. The marquee loops, but the opening
 * few are what a wedding or corporate prospect actually registers, and the
 * positioning is capability-first: sport is proof of the capability, never the
 * category. HSBC and Shopee do more for that argument than any copy on the page.
 *
 * Each renders as its logo when `public/logos/<slug>.svg` exists, and as its
 * name in type when it does not — see public/logos/README.md.
 */
export const CLIENTS = [
  "Puma",
  "HSBC",
  "Shopee",
  "On",
  "FAS",
  // NOTE: the supplied logo is the ASEAN Football Federation (AFF), not the
  // Asian Football Confederation (AFC). Different bodies — Hafiz listed AFC and
  // uploaded AFF. Named for the file that exists; correct whichever is wrong.
  "AFF",
  "Balestier Khalsa",
  "Weston",
  "SYL",
] as const;

/** `Balestier Khalsa` → `balestier-khalsa`, the filename in public/logos/. */
export function logoSlug(client: string) {
  return client
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** UNCONFIRMED — every step below is invented for the mock. */
export const PROCESS = {
  slate: "Process",
  headline: "What happens after you message us.",
  steps: [
    {
      when: "First call",
      title: "Tell us the date",
      body: "A short call to understand the day, the venue and what the footage is actually for. Written quote and shot list within two working days.",
    },
    {
      when: "Before",
      title: "Recce and run sheet",
      body: "For anything live or ticketed we walk the venue, check power, internet and sightlines, and agree timings with your organiser.",
    },
    {
      when: "On the day",
      title: "We stay out of the way",
      body: "Crew arrive early and rig quietly. If it is a live stream, the feed and graphics are tested before doors open.",
    },
    {
      when: "After",
      title: "Preview that night, full set in a week",
      body: "Edited stills and a short clip go out on the night so you have something to post. Full gallery and film follow within the agreed turnaround.",
    },
  ],
} as const;

export const ENQUIRY_TYPES = [
  "Wedding",
  "Corporate or conference",
  "Brand or product",
  "Live event",
  "Sport",
  "Portraits",
  "Content retainer",
  "Something else",
] as const;

/**
 * Everything that must be confirmed with the client before this site ships.
 * Keep this list honest — delete an entry only when it has actually been
 * signed off, not when the copy merely gets rewritten.
 */
export const CONTENT_HOLDS = [
  "Turnaround promises — same-night preview, full set in a week",
  "Process steps — recce, run sheet, crew arrival timings",
  "Kit ownership and no-markup claim",
  "In-house edit claim (the person who shot it edits it)",
  "The project count — \"thirty-plus\". Every card shown is real work.",
  "Studio address and email",
  "Non-sport photography — the work rail runs on reels, and there is none for the sector list",
] as const;
