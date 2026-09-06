# Client logos

Drop an SVG here named for the client and the marquee swaps it in. Anything
missing renders as the client's name in type instead, so the wall is
presentable at every stage of collecting nine sets of brand assets.

```
puma.svg   hsbc.svg   shopee.svg   on.svg   fas.svg
afc.svg    balestier-khalsa.svg    weston.svg   syl.svg
```

Filenames come from `logoSlug()` in `lib/content.ts`: lowercase, spaces to
hyphens. Add a client to `CLIENTS` and its slug follows automatically.

## Where to get them

Each brand's own press or brand-assets page, not a logo-aggregator site. The
aggregators are riddled with redrawn approximations, outdated marks and wrong
proportions — and a subtly wrong Puma or HSBC in front of the people who own it
is worse than no logo at all.

Prefer the single-colour or mono version where a brand offers one. The wall
renders everything as a flat silhouette anyway (see below), so a full-colour
master just carries detail that gets thrown away.

## Usage, worth a thought before this goes public

These marks are trademarks, and putting one on a site is asserting a client
relationship. That is normal practice for a client wall and fine for a pitch
shown to KlickFrame — but Puma, HSBC and Shopee in particular publish
guidelines on how their marks may be used by third parties, and a public site is
a different thing from a pitch deck. Worth checking before launch, not before
the pitch.

## What the page does to them

- **Flattened to one colour.** `brightness(0) invert(1)` crushes any logo —
  colour, black, or white — to a white silhouette, then opacity drops it to the
  same value as the text names. Nine brand palettes would otherwise tear a
  near-monochrome page apart, and the row would read as a pasted-in sponsor
  board rather than part of the design.
- **Normalised by height**, not width, so a wide wordmark and a square badge
  sit at the same optical weight.

Because they are flattened, do not spend time sourcing colour-accurate files.

## One thing that will break the marquee

The `<img>` carries `width` and `height` attributes. They are load-bearing:
the marquee measures one set to decide how many copies it needs and how long
the loop runs. Without an intrinsic size it measures before the logos have laid
out, gets zero, and the animation breaks. `components/Marquee.tsx` sets them;
leave them there.

SVGs also need a `viewBox` for the aspect ratio to survive scaling. Most
official exports have one — if a logo renders at the wrong proportion, that is
the first thing to check.
