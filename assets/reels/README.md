# Reel sources

Upload the raw reel downloads **into this folder** — GitHub's "Add file →
Upload files" puts them wherever you already are, so open `assets/reels/` first
and they land here.

Name each for its slot:

| File | Where it plays |
| --- | --- |
| `hero.mp4` | Full-viewport hero behind the headline |
| `wedding.mp4` | Work rail card 02 |
| `live.mp4` | Work rail card 04 |
| `portrait.mp4` | Work rail card 06 |

`.mov` and `.webm` work too. Anything not named for a slot is skipped with a
warning rather than guessed at.

Then `npm run media` derives everything the site uses into `public/videos/` —
web-ready MP4 and WebM, plus a poster frame. Those outputs are git-ignored; one
command reproduces them from what is here.

## Worth knowing

**GitHub's browser upload caps at 25MB per file.** A raw reel can exceed that.
If one bounces, trim it first — only the opening 8 seconds are used anyway.

**Motion is set per slot** in `lib/content.ts`, on the hero and the three
portrait work-rail cards. Reels are shot 9:16 and those slots are 3:4; the
landscape cards would crop a vertical reel down to a letterbox of its middle,
so they stay photographs.

**Audio is stripped.** Nothing on the page autoplays with sound, so the track is
dead weight — and it keeps the music on the original post off a website.

A slot with no reel falls back to its photograph, then to its gradient, so
uploading one, three or all four all look finished.
