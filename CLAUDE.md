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
- Sector list where hover floats the image at the cursor
- Sticky services column against a scrolling list
- Archivo variable, width axis ~118 on headlines
- No cards, no rounded corners, no borders. Form fields are underlines.
- Type: Archivo. Palette: `#070707` / `#F4F2ED`, near-monochrome.

Marquee must clone its set until it exceeds 2× viewport, animate by exactly one set width, and rebuild on resize. Duration derived from width, not fixed, or it speeds up as logos are added. When real logos go in they need explicit `width`/`height` or the measurement runs against zero-width images.

Hero currently holds a client-supplied match photo (Malaysia v Singapore, centre circle), cropped at `center 38%`. It is dark in the lower third so white type holds. **A bright wedding hero will need a stronger veil gradient.**

### Deviation from the mock, deliberate
The mock's work rail sits directly under a full-width `<section>`, so its `margin-inline: calc(var(--gut) * -1)` overshoots by a gutter on each side. Measured at 1440px: card 01 rendered at `x: -60` (clipped) while the heading sat at `x: 60`, and the document carried 60px of horizontal overflow that `body { overflow-x: hidden }` only masked. The port puts the rail inside a `.wrap` and adds `scroll-padding-inline`, so mandatory snap lands card 01 flush with the heading. Full bleed to the right edge is preserved. Do not "restore" the mock here.

---

## Content status — almost everything is placeholder

Confirm with the client before any of this ships:

- ❌ Turnaround promises ("preview the same night, full set in a week")
- ❌ Process steps (recce, run sheet, crew arrival)
- ❌ "We own the kit, nothing rented in, nothing marked up"
- ❌ "We cut in house — the person who shot it edits it"
- ❌ Every project caption in the work rail
- ❌ Client logo wall — brands appear in their feed but **relationships are unconfirmed and must not be asserted**
- ❌ Studio address and email — not known

Photography: use **their own work**, not stock. Free, no licensing question, and the client seeing their own photos look good does more selling than any layout decision. Pull 8–12 off the IG and YouTube thumbnails. Pick for spread — a wedding, a boardroom, a product shot, a portrait — not the eight best football ones.

All images route through one `IMAGES` config object (`lib/images.ts`). Keep that pattern.

The live version of this list is `CONTENT_HOLDS` at the bottom of `lib/content.ts`, and each placeholder is marked `UNCONFIRMED` at its definition. Delete an entry only when it has actually been signed off, not when the copy merely gets rewritten.

---

## State of play

Done:

1. ✅ Scope confirmed — marketing site now, gallery portal deferred
2. ✅ Scaffolded — Next.js 16, homepage ported from the mock, builds static, lint and typecheck clean

Blocked on the client:

3. Real business details — studio address and email
4. **The asset drop.** Critical path. 8–12 of their own photos, picked for spread, not the best football ones. Until these land the work rail and sector peeks run on gradient fallbacks.
5. The approved client list, for the marquee
6. Sign-off on everything in `CONTENT_HOLDS`
