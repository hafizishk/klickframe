# Dropping images in

Save a JPG here with one of these names and it appears on the site. No code
change, no config edit. Miss one out and its gradient fallback shows instead —
that is a designed state, so the page is presentable however many you have.

| Filename         | Where it lands              | Crop        |
| ---------------- | --------------------------- | ----------- |
| `hero-match.jpg` | Full-viewport hero          | any         |
| `corporate.jpg`  | Work rail 01, sector peek   | landscape   |
| `wedding.jpg`    | Work rail 02, sector peek   | portrait    |
| `brand.jpg`      | Work rail 03, sector peek   | landscape   |
| `live.jpg`       | Work rail 04, sector peek   | portrait    |
| `portrait.jpg`   | Work rail 06, sector peek   | portrait    |
| `food.jpg`       | Sector peek only            | landscape   |

Sport reuses `hero-match.jpg` in work rail 05.

## Notes

**Crop is a preference, not a requirement.** Everything is `background-size:
cover` and centred, so a 1080×1080 Instagram square works in every slot — it
just gets trimmed top and bottom in the landscape frames. Only the hero really
cares: it wants a **dark lower third**, or the white headline stops holding
against it.

**Don't colour-correct anything first.** The site applies one grade to every
photo — `saturate(.82) contrast(1.08) brightness(.94)` plus a warm-over-cool
duotone — which is what makes shots from different shoots read as one studio.
Pre-graded images get double-treated and go muddy. Straight off the feed is
right.

**Pick for spread, not for quality.** One wedding, one boardroom, one product,
one portrait beats the six best football frames. The feed is ~80% sport; the
site is the thing that says they aren't only that.

Resolution: anything from 1080px wide up is fine. Instagram's native download
size is plenty.
