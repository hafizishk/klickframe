"""Normalise client logos for the marquee.

    1. Drop whatever you have into `logo-src/` — SVG, PNG, JPG, WEBP, even a
       screenshot. Name each for its client: puma, hsbc, balestier-khalsa...
    2. npm run logos

Writes `public/logos/<slug>.svg` or `.png`. Anything it cannot make sense of is
reported rather than silently half-done.

Why this is mostly about transparency
-------------------------------------
The wall renders every logo as a flat white silhouette, so colour accuracy is
irrelevant and vector buys nothing at 27px tall. What matters is the ALPHA
channel: a logo on an opaque white card silhouettes into a solid white
rectangle, which is the one way this can look broken.

So for raster input this:
  - knocks out the background colour EVERYWHERE it appears, not just around the
    outside. That looks wrong until you follow it through the silhouette: an
    enclosed white counter inside an O, left opaque, gets turned white by the
    same filter that whitens the ink, and the letter fills into a blob. The
    counter has to become a hole. Whichever colour is the background, the ink is
    the other one, so removing it globally is right for dark-on-light and
    light-on-dark alike.
  - trims to the ink, so every logo is measured by its mark rather than by
    whatever padding the export happened to carry.
  - resizes to a common height at 2x the display size, for retina.

SVGs pass through untouched apart from a viewBox check, since without one the
aspect ratio collapses when the CSS scales it by height.
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

from PIL import Image

SRC = Path("logo-src")
DEST = Path("public/logos")

TARGET_HEIGHT = 64  # 2x the ~32px display box
BG_TOLERANCE = 32  # per-channel distance still counted as background
RASTER = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}


def knock_out_background(img: Image.Image) -> Image.Image:
    """Clear the background colour wherever it appears, so counters read as holes."""
    img = img.convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Sample the corners to identify the background. If they disagree it is not
    # a uniform card — a photograph, a gradient — and guessing would do more
    # harm than leaving it alone.
    corners = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]
    opaque = [c for c in corners if c[3] > 8]
    if not opaque:
        return img  # already cut out

    base = opaque[0]
    for corner in opaque[1:]:
        if max(abs(a - b) for a, b in zip(corner[:3], base[:3])) > BG_TOLERANCE:
            return img

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 8 and max(abs(r - base[0]), abs(g - base[1]), abs(b - base[2])) <= BG_TOLERANCE:
                pixels[x, y] = (r, g, b, 0)
    return img


def process_raster(path: Path, slug: str) -> dict:
    img = Image.open(path)
    had_alpha = img.mode in ("RGBA", "LA") or "transparency" in img.info
    img = knock_out_background(img)

    box = img.getbbox()  # bbox of everything non-transparent
    if box:
        img = img.crop(box)

    if img.height != TARGET_HEIGHT:
        ratio = TARGET_HEIGHT / img.height
        img = img.resize((max(1, round(img.width * ratio)), TARGET_HEIGHT), Image.LANCZOS)

    out = DEST / f"{slug}.png"
    img.save(out, optimize=True)

    # If it is still fully opaque the silhouette will be a rectangle — say so
    # rather than let it reach the page looking like a bug.
    alpha = img.getchannel("A")
    solid = alpha.getextrema() == (255, 255)
    return {
        "slug": slug,
        "out": out.name,
        "size": f"{img.width}x{img.height}",
        "kb": round(out.stat().st_size / 1024, 1),
        "note": "NO TRANSPARENCY — will render as a solid block" if solid
        else ("background knocked out" if not had_alpha else "ok"),
    }


def process_svg(path: Path, slug: str) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    out = DEST / f"{slug}.svg"
    shutil.copyfile(path, out)
    has_viewbox = re.search(r"\bviewBox\s*=", text, re.I) is not None
    return {
        "slug": slug,
        "out": out.name,
        "size": "vector",
        "kb": round(out.stat().st_size / 1024, 1),
        "note": "ok" if has_viewbox else "NO viewBox — aspect ratio will collapse when scaled",
    }


def main() -> int:
    if not SRC.exists():
        print(f"No {SRC}/ directory. Create it and drop the logo files in.", file=sys.stderr)
        return 1

    files = [p for p in sorted(SRC.iterdir()) if p.is_file() and not p.name.startswith(".")]
    if not files:
        print(f"{SRC}/ is empty.", file=sys.stderr)
        return 1

    DEST.mkdir(parents=True, exist_ok=True)
    rows, skipped = [], []

    for path in files:
        slug = re.sub(r"[^a-z0-9]+", "-", path.stem.lower()).strip("-")
        suffix = path.suffix.lower()
        try:
            if suffix == ".svg":
                rows.append(process_svg(path, slug))
            elif suffix in RASTER:
                rows.append(process_raster(path, slug))
            else:
                skipped.append(f"{path.name} — unsupported type {suffix}")
        except Exception as exc:  # noqa: BLE001 — report, do not abort the batch
            skipped.append(f"{path.name} — {type(exc).__name__}: {exc}")

    width = max((len(r["slug"]) for r in rows), default=4)
    for r in rows:
        flag = "" if r["note"] == "ok" else f"   <- {r['note']}"
        print(f"  {r['slug']:<{width}}  {r['out']:<28} {r['size']:>10}  {r['kb']:>6} KB{flag}")

    if skipped:
        print("\nSkipped:")
        for s in skipped:
            print(f"  {s}")

    print(f"\n{len(rows)} written to {DEST}/. Names must match CLIENTS in lib/content.ts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
