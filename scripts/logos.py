"""Normalise client logos for the marquee.

    1. Put the originals in `assets/logos/`, named for their client:
       puma.svg, hsbc.svg, balestier-khalsa.png, syl.png ...
    2. npm run logos

Writes normalised assets into `public/logos/` plus `lib/logos.json`, the
manifest the marquee reads for each logo's real dimensions and optical scale.

Both source and output are committed: the originals because they are what a
future change has to be re-derived from, the outputs because they are kilobytes
and the site needs them.

Why any of this is necessary
----------------------------
The wall renders every logo as a flat white silhouette at a common height, so
colour is irrelevant. Two things are not:

**Padding.** Logo files are exported onto whatever canvas the designer had open.
Measured across this set, the ink occupied anywhere from 32% to 100% of the file
height. Sized by height, a logo padded to a third of its canvas renders a third
the size of its neighbours. So every file is trimmed to its ink — SVGs by
tightening the viewBox, which keeps them vector, and rasters by cropping.

**Optical weight.** Ink aspect ratios here span 0.51 (a tall badge) to 3.67 (a
long wordmark). Set to one height, a square badge carries far more visual mass
than a wordmark and dominates the row. The manifest therefore carries a per-logo
scale that eases badges down relative to wordmarks.

**Tonal structure.** A flat silhouette destroys any logo whose identity lives in
internal colour: a club crest becomes a featureless disc, a wordmark knocked out
of a coloured field becomes a solid block. Both happened here and neither trips
a transparency check, because the shape is not a rectangle. So each logo is
measured: a single-colour mark (low luminance variance among its opaque pixels)
is silhouetted, and a multi-tone one is desaturated instead, keeping the form
readable. The threshold is far from either cluster — this set measured sd 0-18
for flat marks and 94-103 for tonal ones.

**Transparency** is the fourth thing that matters, and the one that looks broken
rather than merely uneven: a logo on an opaque card silhouettes into a solid
white rectangle. Rasters get their background knocked out — everywhere it
appears, not just around the outside, because an enclosed counter inside an O
left opaque is turned white by the same filter that whitens the ink, and the
letter fills into a blob. The counter has to be a hole.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

SRC = Path("assets/logos")
DEST = Path("public/logos")
MANIFEST = Path("lib/logos.json")

# Rendered tall enough that the trim is precise and the committed asset is
# crisp on a retina screen at the ~27px it is displayed at.
RASTER_HEIGHT = 160
MEASURE_HEIGHT = 400  # only used to locate the ink; never written out
BG_TOLERANCE = 32
RASTER_TYPES = {".png", ".jpg", ".jpeg", ".webp"}

# Luminance spread above which a logo is treated as tonal rather than flat.
# Comfortably between the two clusters this set falls into.
TONAL_SD = 40


def optical_scale(aspect: float) -> float:
    """Height multiplier that evens out visual mass across shapes.

    A square badge at a wordmark's height reads heavier than the wordmark, so
    badges come down slightly. Everything else stays at full height.

    The obvious generalisation — scale down as the mark gets narrower — is
    wrong, and measurably so: a tall narrow mark loses width as well as height,
    so a 24% height cut took one logo here to 11px wide against a wordmark's 60,
    and it vanished from the row. Narrow marks need the height precisely
    because they have no width to spare.
    """
    if 0.9 <= aspect < 1.6:  # square-ish badge: dense, reads heavy
        return 0.85
    return 1.0


def treatment_for(img: Image.Image) -> tuple[str, float]:
    """Silhouette a flat mark; desaturate one that carries internal tone."""
    px = img.convert("RGBA").load()
    step_x = max(1, img.width // 120)
    step_y = max(1, img.height // 120)
    lums = []
    for y in range(0, img.height, step_y):
        for x in range(0, img.width, step_x):
            r, g, b, a = px[x, y]
            if a > 200:
                lums.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    if not lums:
        return "silhouette", 0.0
    mean = sum(lums) / len(lums)
    sd = (sum((l - mean) ** 2 for l in lums) / len(lums)) ** 0.5
    return ("tone" if sd > TONAL_SD else "silhouette"), round(sd, 1)


def has_embedded_raster(text: str) -> bool:
    """An SVG that is really a bitmap in a wrapper — no reason to keep it vector."""
    return re.search(r'(?:xlink:)?href\s*=\s*"data:image/', text) is not None


def ink_box(img: Image.Image) -> tuple[int, int, int, int] | None:
    """Bounding box of everything not transparent."""
    return img.convert("RGBA").getbbox()


def knock_out_background(img: Image.Image) -> tuple[Image.Image, bool]:
    """Clear the background colour wherever it appears. Returns (image, changed)."""
    img = img.convert("RGBA")
    width, height = img.size
    pixels = img.load()

    corners = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]
    opaque = [c for c in corners if c[3] > 8]
    if not opaque:
        return img, False  # already cut out

    base = opaque[0]
    for corner in opaque[1:]:
        if max(abs(a - b) for a, b in zip(corner[:3], base[:3])) > BG_TOLERANCE:
            # Corners disagree: a photograph or a gradient, not a flat card.
            # Guessing would do more damage than leaving it alone.
            return img, False

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 8 and max(abs(r - base[0]), abs(g - base[1]), abs(b - base[2])) <= BG_TOLERANCE:
                pixels[x, y] = (r, g, b, 0)
    return img, True


def render_svg(path: Path, height: int) -> Image.Image:
    """Rasterise an SVG with librsvg, which renders it the way a browser would."""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        out = Path(tmp.name)
    subprocess.run(
        ["rsvg-convert", "-h", str(height), "-b", "none", "-o", str(out), str(path)],
        check=True,
        capture_output=True,
    )
    img = Image.open(out).convert("RGBA")
    img.load()
    out.unlink(missing_ok=True)
    return img


def parse_viewbox(text: str) -> tuple[float, float, float, float] | None:
    match = re.search(r'viewBox\s*=\s*"\s*([-\d.eE]+)[,\s]+([-\d.eE]+)[,\s]+([-\d.eE]+)[,\s]+([-\d.eE]+)', text)
    return tuple(float(g) for g in match.groups()) if match else None  # type: ignore[return-value]


def process_svg(path: Path, slug: str) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    if has_embedded_raster(text):
        # A bitmap wrapped in SVG carries all the weight of the raster and none
        # of the benefit of vector. Render it once and store the result.
        return process_raster(path, slug, note_prefix="raster inside an SVG wrapper; ")
    viewbox = parse_viewbox(text)
    if not viewbox:
        return {"slug": slug, "error": "no viewBox — cannot place or scale it reliably"}

    # Measure the ink in pixels, then map back into viewBox user units so the
    # file stays vector.
    probe = render_svg(path, MEASURE_HEIGHT)
    box = ink_box(probe)
    if not box:
        return {"slug": slug, "error": "renders empty"}

    vb_x, vb_y, vb_w, vb_h = viewbox
    unit = vb_h / probe.height  # user units per rendered pixel
    left, top, right, bottom = box
    new = (
        round(vb_x + left * unit, 3),
        round(vb_y + top * unit, 3),
        round((right - left) * unit, 3),
        round((bottom - top) * unit, 3),
    )

    # Replace the viewBox, and set width/height to match so the intrinsic aspect
    # ratio is the ink's rather than the original canvas's.
    out_text = re.sub(
        r'viewBox\s*=\s*"[^"]*"',
        f'viewBox="{new[0]} {new[1]} {new[2]} {new[3]}"',
        text,
        count=1,
    )
    out_text = re.sub(r'(<svg\b[^>]*?)\swidth\s*=\s*"[^"]*"', r"\1", out_text, count=1)
    out_text = re.sub(r'(<svg\b[^>]*?)\sheight\s*=\s*"[^"]*"', r"\1", out_text, count=1)
    out_text = re.sub(
        r"<svg\b",
        f'<svg width="{new[2]}" height="{new[3]}"',
        out_text,
        count=1,
    )

    out = DEST / f"{slug}.svg"
    out.write_text(out_text, encoding="utf-8")

    aspect = new[2] / new[3]
    treatment, sd = treatment_for(probe.crop(box))
    trimmed = round(100 * (1 - (box[2] - box[0]) * (box[3] - box[1]) / (probe.width * probe.height)))
    return {
        "slug": slug,
        "file": f"/logos/{slug}.svg",
        "width": round(new[2]),
        "height": round(new[3]),
        "aspect": round(aspect, 2),
        "scale": optical_scale(aspect),
        "treatment": treatment,
        "sd": sd,
        "kb": round(out.stat().st_size / 1024, 1),
        "note": f"vector, trimmed {trimmed}% of canvas" if trimmed > 2 else "vector",
    }


def process_raster(path: Path, slug: str, note_prefix: str = "") -> dict:
    img = render_svg(path, RASTER_HEIGHT * 3) if path.suffix.lower() == ".svg" else Image.open(path)
    img, knocked = knock_out_background(img)

    box = ink_box(img)
    if not box:
        return {"slug": slug, "error": "fully transparent"}
    before = img.size
    img = img.crop(box)

    if img.height != RASTER_HEIGHT:
        ratio = RASTER_HEIGHT / img.height
        img = img.resize((max(1, round(img.width * ratio)), RASTER_HEIGHT), Image.LANCZOS)

    out = DEST / f"{slug}.png"
    img.save(out, optimize=True)

    solid = img.getchannel("A").getextrema() == (255, 255)
    treatment, sd = treatment_for(img)
    aspect = img.width / img.height
    trimmed = round(100 * (1 - (box[2] - box[0]) * (box[3] - box[1]) / (before[0] * before[1])))
    note = "NO TRANSPARENCY — will render as a solid block" if solid else (
        f"background knocked out, trimmed {trimmed}%" if knocked
        else (f"trimmed {trimmed}% of canvas" if trimmed > 2 else "ok")
    )
    return {
        "slug": slug,
        "file": f"/logos/{slug}.png",
        "width": img.width,
        "height": img.height,
        "aspect": round(aspect, 2),
        "scale": optical_scale(aspect),
        "treatment": treatment,
        "sd": sd,
        "kb": round(out.stat().st_size / 1024, 1),
        "note": note_prefix + note,
    }


def main() -> int:
    if not SRC.exists():
        print(f"No {SRC}/ directory. Put the logo originals there.", file=sys.stderr)
        return 1

    files = [p for p in sorted(SRC.iterdir()) if p.is_file() and not p.name.startswith(".")]
    if not files:
        print(f"{SRC}/ is empty.", file=sys.stderr)
        return 1

    DEST.mkdir(parents=True, exist_ok=True)
    rows, failed = [], []

    for path in files:
        slug = re.sub(r"[^a-z0-9]+", "-", path.stem.lower()).strip("-")
        suffix = path.suffix.lower()
        try:
            if suffix == ".svg":
                row = process_svg(path, slug)
            elif suffix in RASTER_TYPES:
                row = process_raster(path, slug)
            else:
                failed.append(f"{path.name} — unsupported type {suffix}")
                continue
        except Exception as exc:  # noqa: BLE001 — report, do not abort the batch
            failed.append(f"{path.name} — {type(exc).__name__}: {exc}")
            continue

        if "error" in row:
            failed.append(f"{path.name} — {row['error']}")
        else:
            rows.append(row)

    manifest = {
        r["slug"]: {k: r[k] for k in ("file", "width", "height", "scale", "treatment")}
        for r in rows
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    pad = max((len(r["slug"]) for r in rows), default=4)
    for r in sorted(rows, key=lambda r: r["slug"]):
        print(
            f"  {r['slug']:<{pad}}  {r['width']:>5}x{r['height']:<5} "
            f"aspect {r['aspect']:>5}  scale {r['scale']:<5} "
            f"{r['treatment']:<10} sd {r['sd']:>5}  {r['kb']:>7} KB   {r['note']}"
        )

    if failed:
        print("\nFailed:")
        for f in failed:
            print(f"  {f}")

    print(f"\n{len(rows)} logos in {DEST}/, manifest at {MANIFEST}.")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
