# Dropping images in

Save a JPG here with one of these names and it appears on the site. No code
change, no config edit. Miss one out and its gradient fallback shows instead —
that is a designed state, so the page is presentable however many you have.

| Filename         | Where it lands                          | Crop      |
| ---------------- | --------------------------------------- | --------- |
| `hero-match.jpg` | Full-viewport hero                      | any       |
| `brand.jpg`      | Work rail 01 — Puma Ultimate 9 x Weston | portrait  |
| `live.jpg`       | Work rail 02 — ASEAN Shopee Trophy      | portrait  |
| `hsbc.jpg`       | Work rail 04 — HSBC netball             | portrait  |
| `wedding.jpg`    | Work rail 05 — wedding film             | landscape |
| `iwl.jpg`        | FAS Island Wide League broadcast        | either    |
| `corporate.jpg`  | Not placed yet — no boardroom card      | landscape |
| `portrait.jpg`   | Not placed yet — no portrait card       | portrait  |
| `food.jpg`       | Not placed yet                          | landscape |

Sport (work rail 03) reuses `hero-match.jpg`.

Every rail slot currently plays a reel, and a reel wins over the photograph in
the same slot — so a JPG here is the fallback for anyone whose browser will not
play the video, not the thing most people see. The exceptions are `hero-match`,
which is a real photograph in its own right, and any name with no reel beside it.

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
