/**
 * Bundles the static export in `out/` into ONE self-contained HTML file with no
 * external requests — every stylesheet, script, font and image inlined.
 *
 * This exists to hand someone a pitch link (a published artifact, an email
 * attachment, a file on a USB stick) without standing up hosting. It is a build
 * output, never edited by hand: change the site, re-run `npm run bundle`.
 *
 * The output omits <!doctype>, <html>, <head> and <body> wrappers, because the
 * artifact host supplies those and rejects a file that brings its own.
 *
 *   npm run bundle   →  dist/klickframe-pitch.html
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname, posix } from "node:path";

const OUT = "out";
const TARGET = join("dist", "klickframe-pitch.html");

if (!existsSync(join(OUT, "index.html"))) {
  console.error("No static export found. Run `npm run export` first.");
  process.exit(1);
}

const MIME = {
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/**
 * How much base64 video the portable file will carry. Reels are the heaviest
 * thing on the page by an order of magnitude; past this the file stops being
 * something you can email, so the reels are dropped to their poster frames
 * instead and the page still reads as designed.
 */
const VIDEO_BUDGET_MB = 10;

const stats = { css: 0, js: 0, fonts: 0, images: 0, videos: 0, frameworkDropped: 0 };
const missing = new Set();

/** Read a site-absolute path ("/_next/...") out of the export directory. */
function readAsset(sitePath) {
  const file = join(OUT, sitePath.split(/[?#]/)[0].replace(/^\//, ""));
  if (!existsSync(file)) {
    missing.add(sitePath);
    return null;
  }
  return readFileSync(file);
}

function dataUri(sitePath) {
  const buf = readAsset(sitePath);
  if (!buf) return null;
  const mime = MIME[extname(sitePath.split(/[?#]/)[0])] ?? "application/octet-stream";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/**
 * Replace every reference to a public asset with a data URI, wherever it
 * appears — an HTML attribute, an HTML-escaped inline style, or a string
 * literal inside a JS chunk (which is where lib/images.ts ends up). Cached so
 * the hero photo is encoded once no matter how many times it is referenced.
 */
const uriCache = new Map();
function inlinePublicAssets(text) {
  return text.replace(/\/(?:images|videos|logos|icon)\/?[\w./-]*\.(?:jpe?g|png|svg|webp|avif)/g, (match) => {
    if (!uriCache.has(match)) {
      const uri = dataUri(match);
      uriCache.set(match, uri);
      if (uri) stats.images++;
    }
    return uriCache.get(match) ?? match;
  });
}

let html = readFileSync(join(OUT, "index.html"), "utf8");

// 1. Stylesheets → <style>, resolving url(...) relative to the CSS file.
html = html.replace(
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*\/?>/g,
  (tag, href) => {
    const buf = readAsset(href);
    if (!buf) return tag;
    const cssDir = posix.dirname(href.split(/[?#]/)[0]);
    const css = buf.toString("utf8").replace(/url\((["']?)([^)"']+)\1\)/g, (m, q, url) => {
      if (/^(?:data:|https?:)/.test(url)) return m;
      const uri = dataUri(url.startsWith("/") ? url : posix.join(cssDir, url));
      if (!uri) return m;
      stats.fonts++;
      return `url(${uri})`;
    });
    stats.css++;
    return `<style>${css}</style>`;
  },
);

// 2. Preloads now point at inlined content — drop them so the page issues no
//    network requests at all.
html = html.replace(/<link\b[^>]*rel="(?:preload|prefetch|modulepreload)"[^>]*\/?>/g, "");

// 3. Inline the public assets referenced by the markup itself, BEFORE any JS
//    is embedded, so this never rewrites something inside a script body.
html = inlinePublicAssets(html);

// 3b. Reels. Inline them only while they fit the budget; otherwise replace each
//     <video> with its poster as a still, so the slot keeps a real frame rather
//     than falling all the way back to the gradient.
//
//     BOTH formats are carried. It is tempting to keep only the MP4 on the
//     grounds that everything plays H.264, but that is not true of every
//     Chromium build — Linux packages routinely ship without the proprietary
//     decoder, and a portable file has no server to negotiate with. Safari
//     needs the MP4, those builds need the WebM, so the file carries each.
const reelTags = [...html.matchAll(/<video\b[^>]*\bdata-src="([^"]+)"[^>]*>(?:<\/video>)?/g)];
const sizeOf = (sitePath) => {
  const file = join(OUT, sitePath.replace(/^\//, ""));
  return existsSync(file) ? statSync(file).size : 0;
};
// base64 is 4 bytes per 3.
const projected = (bytes) => (bytes * 1.34) / 1024 / 1024;
const mp4Only = reelTags.reduce((total, [, src]) => total + sizeOf(src), 0);
const bothFormats = reelTags.reduce(
  (total, [, src]) => total + sizeOf(src) + sizeOf(src.replace(/\.mp4$/, ".webm")),
  0,
);

// Degrade a step at a time rather than straight to stills. Carrying both
// formats is the ideal; dropping the WebM halves the weight and still plays
// everywhere H.264 is available, which is everywhere except a few Chromium
// builds; posters are the last resort.
const reelMode =
  projected(bothFormats) <= VIDEO_BUDGET_MB
    ? "both"
    : projected(mp4Only) <= VIDEO_BUDGET_MB
      ? "mp4"
      : "posters";
const inlineReels = reelMode !== "posters";
const projectedMB = reelMode === "both" ? projected(bothFormats) : projected(mp4Only);

html = html.replace(/<video\b([^>]*)><\/video>|<video\b([^>]*)\/>/g, (tag, a, b) => {
  const attrs = a ?? b ?? "";
  const src = attrs.match(/\bdata-src="([^"]+)"/)?.[1];
  const poster = attrs.match(/\bposter="([^"]+)"/)?.[1];
  const classes = attrs.match(/\bclass="([^"]+)"/)?.[1] ?? "motion";

  if (inlineReels && src) {
    const mp4 = dataUri(src);
    const webm = reelMode === "both" ? dataUri(src.replace(/\.mp4$/, ".webm")) : null;
    if (mp4 || webm) {
      stats.videos++;
      let kept = attrs
        .replace(/\sdata-src-webm="[^"]*"/, "")
        .replace(/\sdata-src="[^"]*"/, "");
      if (mp4) kept += ` data-src="${mp4}"`;
      if (webm) kept += ` data-src-webm="${webm}"`;
      return `<video${kept}></video>`;
    }
  }

  // No video: stand the poster in as a still, on the same code path photos use.
  return poster
    ? `<div class="${classes.replace("motion", "photo")}" data-src="${poster}"></div>`
    : "";
});

// 4. Scripts.
//
//    Next's own chunks are DROPPED, not inlined. The page has no client
//    components, so nothing on it hydrates and the framework runtime has no
//    work to do here. Inlining it would also be actively broken: turbopack's
//    runtime reads `document.currentScript.src` and asserts it contains
//    `/_next/`, then fetches sibling chunks by URL — neither of which survives
//    being flattened into one file with no server. Reproducing that would mean
//    depending on framework internals that can change in a patch release and
//    fail silently, which is not a thing to discover during a pitch.
//
//    Our own script (public/interactions.js) IS inlined — it is the only one
//    the page actually needs.
html = html.replace(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/g, (tag, pre, src, post) => {
  if (src.startsWith("/_next/")) {
    stats.frameworkDropped++;
    return "";
  }
  if (/\bnomodule\b/i.test(`${pre} ${post}`)) return "";
  const buf = readAsset(src);
  if (!buf) return tag;
  stats.js++;
  const code = inlinePublicAssets(buf.toString("utf8"))
    // A literal </script> in the source would close the tag early.
    .replace(/<\/script>/gi, "<\\/script>");
  return `<script>${code}</script>`;
});

// The real site appends public/interactions.js from a client component, so it
// runs after hydration. With React dropped, that never happens — inline the
// script directly at the end of <body>, where the markup it drives already
// exists. Same file, so the two targets can never drift apart.
const interactions = readFileSync(join("public", "interactions.js"), "utf8");
stats.js++;
html = html.replace(
  /<\/body>/i,
  // Function replacement, not a string: JS is full of `$&` and "$`" sequences,
  // which a string replacement would read as match references and silently
  // rewrite into broken code.
  () => `<script>${inlinePublicAssets(interactions).replace(/<\/script>/gi, "<\\/script>")}</script></body>`,
);

// The RSC payload only feeds hydration that no longer happens. Left in, it is
// a few hundred KB of duplicated page text on a file meant to travel.
html = html.replace(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, (tag) =>
  /self\.__next_f/.test(tag) ? "" : tag,
);

// 5. Strip the document wrappers the artifact host supplies itself. Index from
//    the outside in — an inlined chunk can easily contain the literal string
//    "</body>", which a non-greedy match would stop at, silently truncating
//    the page.
function section(source, tag) {
  const open = source.match(new RegExp(`<${tag}\\b[^>]*>`, "i"));
  if (!open) return null;
  const start = open.index + open[0].length;
  const end = source.lastIndexOf(`</${tag}>`);
  return end > start ? source.slice(start, end) : source.slice(start);
}

const head = section(html, "head") ?? "";
const body = section(html, "body") ?? html;

// The font-variable class sits on <html>, which the artifact host owns, so
// re-apply it (and any body class) to a wrapper or the typography is lost.
const wrapperClass = [
  html.match(/<html\b[^>]*\bclass="([^"]*)"/i)?.[1],
  html.match(/<body\b[^>]*\bclass="([^"]*)"/i)?.[1],
]
  .filter(Boolean)
  .join(" ");

// Title first, ALWAYS. The inlined font faces are hundreds of KB of base64, and
// a host that only scans the head of the file for a <title> would never reach
// one sitting behind them.
const title = head.match(/<title>[\s\S]*?<\/title>/i)?.[0] ?? "";
const styles = (head.match(/<style[\s\S]*?<\/style>/gi) ?? []).join("\n");
const keptHead = `${title}\n${styles}`;

// next/font defines --font-archivo on the class it puts on <html>. The artifact
// host owns <html>, so that class rides on a wrapper <div> instead — but
// globals.css resolves var(--font-archivo) on `body`, an ANCESTOR of the
// wrapper, where the variable is not in scope. Unresolved, the whole
// font-family declaration is invalid and the page silently renders in Times.
// Re-declare the family on the wrapper, where the variable does resolve.
const fontFix = wrapperClass
  ? `<style>.${wrapperClass.split(/\s+/).join(".")}{font-family:var(--font-archivo),system-ui,sans-serif}</style>`
  : "";

const out = `${keptHead}\n${fontFix}\n<div class="${wrapperClass}">${body}</div>`;

mkdirSync("dist", { recursive: true });
writeFileSync(TARGET, out, "utf8");

// Anything in the MARKUP still pointing at a site-absolute path would 404 in
// the artifact. Script bodies are excluded: a inlined chunk legitimately
// contains things like `window.location.href="/"`, which is control flow, not
// an asset reference.
const markup = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

// Photography that has not been supplied yet is an expected state, not a
// failure — those fields render their gradient fallback, and their data-src
// stays pointing at the filename that will one day exist.
const awaitingPhotos = [...missing].filter(
  (p) => p.startsWith("/images/") || p.startsWith("/videos/"),
);

// \s before the attribute name, or `data-src="…"` matches as `src="…"`.
const dangling = [
  ...new Set([...markup.matchAll(/\s(?:src|href|data-src)="(\/[^"]*)"/g)].map((m) => m[1])),
].filter((ref) => !awaitingPhotos.includes(ref));
const trulyMissing = [...missing].filter(
  (p) => !p.startsWith("/images/") && !p.startsWith("/videos/") && !p.includes("%23"),
);

console.log(
  JSON.stringify(
    {
      target: TARGET,
      sizeMB: +(Buffer.byteLength(out) / 1024 / 1024).toFixed(2),
      inlined: stats,
      reels:
        reelMode === "both"
          ? `MP4 + WebM inlined (${projectedMB.toFixed(1)} MB of ${VIDEO_BUDGET_MB} MB budget)`
          : reelMode === "mp4"
            ? `MP4 only, WebM dropped to fit (${projectedMB.toFixed(1)} MB of ${VIDEO_BUDGET_MB} MB budget)`
            : `dropped to posters — even MP4 alone would exceed the ${VIDEO_BUDGET_MB} MB budget`,
      awaitingPhotos,
      danglingRefs: dangling,
      trulyMissing,
      wrapperClass,
    },
    null,
    2,
  ),
);

if (dangling.length || trulyMissing.length) {
  console.error("\nRefusing to ship: the bundle still references files it does not carry.");
  process.exit(1);
}
