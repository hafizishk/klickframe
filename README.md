# KlickFrame SG — website

Marketing site for **KlickFrame SG Pte Ltd**, a Singapore photo, film and live
production studio. Built by Stackform Studios.

Read [`CLAUDE.md`](./CLAUDE.md) before changing anything — it carries the
positioning, the settled decisions and the content that is not yet confirmed.

## Stack

- Next.js 16 (App Router) + TypeScript, statically prerendered
- Archivo variable font via `next/font` (the `wdth` axis is used on headlines)
- Vercel, with **Vercel nameservers from day one** — do not point the domain at
  Vodien/Ascio, a previous project lost six days to a DNS outage there
- No database. Supabase arrives only with the client gallery portal.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Where things are

```
app/
  layout.tsx           root shell, fonts, metadata, film grain
  globals.css          the entire design system — no CSS modules, no Tailwind
  (marketing)/page.tsx the homepage, composed from components/
components/            one component per section of the page
lib/images.ts          IMAGES — every photograph on the site routes through here
lib/content.ts         all copy, with UNCONFIRMED markers and CONTENT_HOLDS
public/images/         local photography
```

### Adding photography

Drop a JPG into `public/images/` using one of the names in
[`public/images/README.md`](./public/images/README.md). That is the whole job —
no code change. Missing files fall back to gradients, so the site is
presentable at any stage of being filled in.

Every photo renders through `components/ImageField.tsx`, which paints a gradient
fallback first and fades the photograph in over it once it decodes. If a file is
missing or fails, the gradient stays and the page still reads as designed.

No stock. A random stock landscape in the work rail reads as filler; the
gradient reads as art direction.

The unified colour grade — `saturate(.82) contrast(1.08) brightness(.94)` plus a
warm-over-cool duotone multiply — lives on `.f .photo` in `globals.css` and is
what makes photos from different shoots read as one studio. **Do not remove it
per-image.** Ungraded mixed photography is the loudest "this is a mockup" tell.

## Before this ships

`CONTENT_HOLDS` at the bottom of `lib/content.ts` is the live list of copy that
has not been confirmed with the client — turnaround promises, process steps, kit
and in-house-edit claims, every work-rail caption, the client list, and the
studio address and email. Delete an entry only when it has actually been signed
off.

The client list in particular: brands appear in the KlickFrame feed, but those
**relationships are unconfirmed and must not be asserted**. The marquee ships
with neutral placeholders until an approved list arrives. When real logos go in
they need explicit `width`/`height`, or the marquee measures the set before the
images have laid out and gets zero.
