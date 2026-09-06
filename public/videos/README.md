# Reels

Generated files. **Do not put raw downloads here** — drop them in `media-src/`
and run `npm run media`, which writes everything in this folder.

```
media-src/wedding.mp4   →   public/videos/wedding.mp4
                            public/videos/wedding.webm
                            public/videos/wedding-poster.jpg
```

Slot names: `hero`, `wedding`, `corporate`, `brand`, `live`, `sport`,
`portrait`, `food`. Anything else in `media-src/` is skipped with a warning.

## What the script does to each file

- **Strips the audio.** Nothing on the page autoplays with sound, so the track
  is dead weight — and it means the music on the original post does not travel
  onto a website.
- **Caps height and bitrate.** A reel is a full-screen phone video; here it is a
  card a few hundred pixels wide.
- **Trims to 8 seconds.** These loop silently behind text. They are texture, not
  something anyone watches to the end.
- **`+faststart`.** Moves the index to the front of the file so playback can
  begin before the download finishes. Without it the first frame waits for the
  last byte.
- **Writes a WebM as well.** Chrome and Firefox take it at roughly two thirds
  the bytes. Safari ignores it and takes the MP4, which is the only one it
  will play.
- **Grabs a poster** one second in — frame zero of a reel is very often a black
  fade-up, which would show as an empty slot.

## Which slots move

Set per card by `motion` in `lib/content.ts`. It is on for the hero and the
three **portrait** work-rail cards (02, 04, 06), because reels are shot 9:16 and
those slots are 3:4. The landscape cards would crop a vertical reel down to a
letterbox of its middle, so they stay photographs.

## How it behaves on the page

Nothing loads until the card approaches the viewport, and a card that scrolls
away pauses. Under `prefers-reduced-motion` no video is fetched at all — the
poster stands in as a still.

Each slot degrades in three tiers: **reel → photograph → gradient**. Whatever is
missing simply does not render and the tier below shows through, so any mix of
what exists still looks finished.

Every reel gets the same grade and duotone as the photography. That is what
makes footage from different shoots read as one studio — do not exempt video
from it.
