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

/** UNCONFIRMED — every caption below is invented for the mock. */
export const WORK = [
  {
    index: "01",
    kicker: "Corporate",
    title: "Annual conference, streamed live",
    meta: ["Four cameras", "Two days"],
    image: "corp" as ImageKey,
    tone: "f-corp" as FieldTone,
  },
  {
    index: "02",
    kicker: "Wedding",
    title: "Solemnisation and banquet",
    meta: ["Photo, film", "Live feed"],
    image: "wed" as ImageKey,
    tone: "f-wed" as FieldTone,
  },
  {
    index: "03",
    kicker: "Brand",
    title: "Footwear campaign film",
    meta: ["Studio", "Product"],
    image: "prod" as ImageKey,
    tone: "f-prod" as FieldTone,
  },
  {
    index: "04",
    kicker: "Live",
    title: "Festival main stage",
    meta: ["Multi-cam", "Same-day cuts"],
    image: "stage" as ImageKey,
    tone: "f-stage" as FieldTone,
  },
  {
    index: "05",
    kicker: "Sport",
    title: "League season coverage",
    meta: ["Live graphics", "Full season"],
    image: "sport" as ImageKey,
    tone: "f-sport" as FieldTone,
  },
  {
    index: "06",
    kicker: "Portrait",
    title: "Executive portrait series",
    meta: ["Studio", "On location"],
    image: "port" as ImageKey,
    tone: "f-port" as FieldTone,
  },
] as const;

// UNCONFIRMED — project count.
export const WORK_NOTE = "Six of thirty-plus projects · Full portfolio on request";

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
 * UNCONFIRMED — client relationships have NOT been confirmed and must not be
 * asserted. Brands appear in the KlickFrame feed; that is not a client list.
 * These are neutral placeholders until an approved list arrives.
 *
 * When real logos go in they need explicit width/height, or the marquee
 * measures against zero-width images and the loop breaks.
 */
export const CLIENTS = [
  "Client",
  "Client",
  "Client",
  "Client",
  "Client",
  "Client",
  "Client",
  "Client",
] as const;

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
  "Every project caption in the work rail, and the project count",
  "Client list — relationships are unconfirmed and must not be asserted",
  "Studio address and email",
  "Non-sport photography for the work rail and sector peeks",
] as const;
