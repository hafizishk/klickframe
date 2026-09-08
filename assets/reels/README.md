# Reel sources

Upload the raw reel downloads **into this folder** — GitHub's "Add file →
Upload files" puts them wherever you already are, so open `assets/reels/` first
and they land here.

Name each for its slot:

| File | Where it plays |
| --- | --- |
| `hero.mp4` | Full-viewport hero behind the headline |
| `brand.mp4` | Work rail 01 — Puma Ultimate 9 x Weston Corp |
| `live.mp4` | Work rail 02 — ASEAN Shopee Trophy |
| `sport.mp4` | Work rail 03 — Tibia by Picklebones |
| `hsbc.mp4` | Work rail 04 — HSBC netball |
| `wedding.mp4` | Work rail 05 — wedding film |
| `iwl.mp4` | FAS Island Wide League — the live broadcast |

`.mov` and `.webm` work too. Anything not named for a slot is skipped with a
warning rather than guessed at.

Then `npm run media` derives everything the site uses into `public/videos/` —
web-ready MP4 and WebM, plus a poster frame. Those outputs are git-ignored; one
command reproduces them from what is here.

## Worth knowing

**GitHub's browser upload caps at 25MB per file.** A raw reel can exceed that.
If one bounces, trim it first — only the opening 8 seconds are used anyway.

**Motion is set per slot** in `lib/content.ts`, by `motion: true` on the hero
and on every work-rail card. `portrait` is set per card there too, because the
crop has to follow the footage: a 9:16 reel belongs in a 3:4 card, but the
wedding film is a landscape source that a portrait card would reduce to a
letterbox of its own middle.

**Audio is stripped.** Nothing on the page autoplays with sound, so the track is
dead weight — and it keeps the music on the original post off a website.

A slot with no reel falls back to its photograph, then to its gradient, so
uploading one, three or all four all look finished.
