# KlickFrame SG — Website Build

Client project for Stackform Studios. Read this before touching anything.

---

## Client

**KlickFrame SG Pte Ltd** — Singapore photo, film and live production studio.

- Instagram `@klickframesg` (verified, ~1.1k followers) — the only current web presence
- YouTube: KlickFrameSG TV — sport live streaming
- Bookings run entirely through WhatsApp: **+65 8092 3828**
- No website exists. This is a from-scratch build.
- Logo: black circle, angular white "K" made of chevrons

Correct name is **KlickFrame SG**. It has been miscalled "Klickform Studios" — do not repeat that anywhere.

---

## Positioning — settled, do not relitigate

They are **not** a sports specialist. The Singapore sports media pool is too small to build on, and the client does not want to specialise. This was decided explicitly.

Position capability-first:

> The differentiator is running a **live multi-camera cut with on-screen graphics** — something few Singapore studios do. That sells conferences, town halls, D&Ds, launches and ceremonies as readily as football. Sport is proof of the capability, never the category.

**Sector order** (first is read, last is scrolled past): Weddings → Corporate → Brands & agencies → Live events → Sport → F&B & retail.

**Services:** Photography · Film · Live production · Content retainers.

### Known tension — SETTLED
Their Instagram is ~80% sport. The site promises generalist, the social proof delivers specialist, and prospects check the IG.

**Decision: the site carries enough non-sport portfolio to stand alone.** It does not depend on the feed being seeded. This makes the asset drop the critical path — a wedding, a boardroom, a product shot, a portrait, not the eight best football ones. Until those land the work rail runs on gradient fallbacks.

---

## Scope — SETTLED

**Marketing site now, gallery portal later.** Homepage, sectors, work, contact (~$4–5k), built so the client gallery can be added without a rewrite: the homepage lives in an `app/(marketing)` route group, and there is no database until the portal needs one.

The $15k platform figure is not off the table, it is deferred. The platform case rests on the **client gallery**: replaces their current WeTransfer/Drive delivery. Couples and corporate clients log in, pick selects, download at two resolutions, share to their own team. Optional second module: streaming archive fed from their YouTube.

Supabase goes in only when the portal is commissioned. Do not add it speculatively.

---

## Stack

Match the D2D platform so it is one maintenance surface:

- Next.js 16 (App Router), TypeScript — scaffolded, builds static
- Supabase — not installed. Add only when the gallery portal is commissioned.
- Vercel, with Vercel nameservers from day one

> Registrar note: a previous project lost six days to a DNS outage on Vodien/Ascio. Go straight to Vercel nameservers.

---

## Design reference

`klickframe-homepage-mock-v4.html` — approved direction. Carry these over:

- **Film grain** — light animated noise over the whole page. Biggest single lever on perceived quality.
- **Unified colour grade on every photo** — `saturate(.82) contrast(1.08) brightness(.94)` plus a warm-over-cool duotone multiply. This is what makes photos from different shoots read as one studio. Non-negotiable; ungraded mixed photography is the loudest "this is a mockup" tell.
- Full-viewport hero, slow drift, headline rises line-by-line once on load
- Nav in `mix-blend-mode: difference`
- Horizontal drag-scroll work rail, alternating portrait/landscape crops
- Sector list — plain, no hover image. The mock floated the sector image at the cursor; removed, because there is no sector photography and it floated an empty gradient over the type. Do not restore it without stills to put in it.
- Sticky services column against a scrolling list
- Archivo variable, width axis ~118 on headlines
- No cards, no rounded corners, no borders. Form fields are underlines.
- Type: Archivo. Palette: `#070707` / `#F4F2ED`, near-monochrome.

Marquee must clone its set until it exceeds 2× viewport, animate by exactly one set width, and rebuild on resize. Duration derived from width, not fixed, or it speeds up as logos are added. When real logos go in they need explicit `width`/`height` or the measurement runs against zero-width images.

Hero currently holds a client-supplied match photo (Malaysia v Singapore, centre circle), cropped at `center 38%`. It is dark in the lower third so white type holds. **A bright wedding hero will need a stronger veil gradient.**

### Deviation from the mock, deliberate
The mock's work rail sits directly under a full-width `<section>`, so its `margin-inline: calc(var(--gut) * -1)` overshoots by a gutter on each side. Measured at 1440px: card 01 rendered at `x: -60` (clipped) while the heading sat at `x: 60`, and the document carried 60px of horizontal overflow that `body { overflow-x: hidden }` only masked. The port puts the rail inside a `.wrap` and adds `scroll-padding-inline`, so mandatory snap lands card 01 flush with the heading. Full bleed to the right edge is preserved. Do not "restore" the mock here.

---

## Stage — this is a pitch mockup

**There is no engagement yet.** The client is interested; this is the thing that
converts that interest. Hafiz is not in day-to-day contact with them and is not
going to go back to them with requests — no asset briefs, no sign-off forms, no
questionnaires. Anything the mockup needs, we source ourselves or design around.

Practical consequence: **do not produce homework lists for the client.** Work
with what can be pulled off the public Instagram and YouTube, and make every
missing piece degrade into something that still looks deliberate.

The placeholder list below is an *internal* record of what is invented, so it
does not silently become fact between mockup and launch. It is not a blocker on
the mockup and not a request to send anyone.

---

## Content status — almost everything is placeholder

Written for the mock, not agreed with anyone. Fine to show; confirm before it
ships for real:

- ❌ Turnaround promises ("preview the same night, full set in a week")
- ❌ Process steps (recce, run sheet, crew arrival)
- ❌ "We own the kit, nothing rented in, nothing marked up"
- ❌ "We cut in house — the person who shot it edits it"
- ❌ Every project caption in the work rail
- ✅ Client list — CONFIRMED by Hafiz: Puma, HSBC, Shopee, On, FAS, AFC, Balestier Khalsa, Weston, SYL. Ordered non-sport first, because the positioning is capability-first.
- ❌ Studio address and email — not known

Photography: use **their own work**, not stock. Free, no licensing question, and the client seeing their own photos look good does more selling than any layout decision. Pull it off the public IG and YouTube thumbnails — no need to ask them for anything. Pick for spread — a wedding, a boardroom, a product shot, a portrait — not the eight best football ones.

Stock is worse than nothing here. A random stock landscape in the work rail reads as filler; the gradient fallback reads as art direction. There is no picsum in the build for that reason.

Images are drop-in by filename — see `public/images/README.md`. Missing files fall back to gradients, so the mockup is presentable at any stage of being filled in.

All images route through one `IMAGES` config object (`lib/images.ts`). Keep that pattern.

The live version of this list is `CONTENT_HOLDS` at the bottom of `lib/content.ts`, and each placeholder is marked `UNCONFIRMED` at its definition. Delete an entry only when it has actually been signed off, not when the copy merely gets rewritten.

---

## State of play

Done:

1. ✅ Scope confirmed — marketing site now, gallery portal deferred
2. ✅ Scaffolded — Next.js 16, homepage ported from the mock, builds static, lint and typecheck clean

3. ✅ Images made drop-in by filename, gradients where a file is absent

4. ✅ Shareable as a link — `npm run bundle` flattens the site into one self-contained HTML file (`dist/klickframe-pitch.html`), published as an artifact. The footer carries "Concept mock · Stackform Studios" (`IS_CONCEPT` in `lib/content.ts`); keep it until they commission the build, because the page shows their real WhatsApp number next to claims they have never agreed to.

Next, all doable without contacting the client:

5. Pull 6–8 stills off the public IG and YouTube thumbnails into `public/images/` under the names in its README. Spread over sport, not eight football frames.
6. Decide the hero. The match photo is the strongest real asset but leads with sport; a wedding or boardroom frame suits the positioning better and needs a stronger veil gradient to hold the white headline.
7. Deploy to Vercel for a permanent URL when the pitch warrants one.

Deferred until there is an engagement — do **not** chase these now:

- Studio address and email (the contact block reads "to be confirmed")
- Sign-off on everything in `CONTENT_HOLDS`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Architecture note — the page ships no client framework

Every section is a server component. All interaction lives in
`public/interactions.js`, loaded by `components/Interactions.tsx` from an
effect. Two reasons, both load-bearing:

1. It is imperative DOM work (measuring, cursor-following, drag-scroll, image
   decode) that gains nothing from component state, on a page whose whole pitch
   is that it feels fast.
2. It lets `scripts/bundle.mjs` flatten the site into one portable HTML file.
   Inlining Next's own chunks does not work — turbopack's runtime reads
   `document.currentScript.src`, asserts it contains `/_next/`, and fetches
   sibling chunks by URL. The bundler therefore drops the framework entirely and
   inlines `interactions.js` directly.

**Do not turn the sections back into client components**, and do not load the
script with `<script defer>`. Deferred scripts run at DOMContentLoaded, before
hydration; the script's DOM mutations then cause a hydration mismatch and React
re-renders over them, leaving the page inert. That only reproduces in a
production build, never in `npm run dev`.
