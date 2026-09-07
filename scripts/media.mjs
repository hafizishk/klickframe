/**
 * Turns raw reel downloads into web-ready video, plus the poster frame each one
 * falls back to.
 *
 *   1. Put the downloads in `assets/reels/` named for their slot:
 *      wedding.mp4, corporate.mp4, brand.mp4, live.mp4, sport.mp4,
 *      portrait.mp4, food.mp4, hero.mp4
 *   2. npm run media
 *
 * Writes `public/videos/<name>.mp4`, `.webm` and `<name>-poster.jpg`, all
 * git-ignored: one command reproduces them from the sources.
 *
 * `media-src/` still works as a local, git-ignored scratch drop for anyone who
 * would rather not commit an original.
 *
 * What it does to each file, and why:
 *   - strips the audio entirely. Nothing on the page autoplays with sound, so
 *     the track is dead weight — and it removes any question about the music on
 *     the original post travelling onto a website.
 *   - caps the height and the bitrate. A reel is a full-screen phone video; on
 *     the page it is a card a few hundred pixels wide.
 *   - trims to a default of 8 seconds. These loop silently behind text; they
 *     are texture, not something anyone watches to the end.
 *   - moves the moov atom to the front (+faststart), so playback can begin
 *     before the file has finished downloading. Without it the first frame
 *     waits for the last byte.
 *   - yuv420p, which some phone exports are not, and which Safari requires.
 *   - writes a VP9/WebM alongside the MP4. Chrome and Firefox take the WebM at
 *     roughly two thirds the bytes; Safari takes the MP4, which it requires.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";

// Committed sources first; media-src/ is the git-ignored local alternative.
const SRC = existsSync("assets/reels") ? "assets/reels" : "media-src";
const DEST = join("public", "videos");

/** Slot names the site knows about — see VIDEOS in lib/images.ts. */
const SLOTS = ["hero", "wedding", "corporate", "brand", "live", "sport", "portrait", "food"];

const MAX_HEIGHT = 900; // reels are 1920 tall; the biggest slot here is a card
const MAX_SECONDS = 8;
const BITRATE = "900k";

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function seconds(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ]);
  return Number.parseFloat(out.toString().trim());
}

if (!existsSync(SRC)) {
  console.error(
    `No assets/reels/ or media-src/ directory.\n\n` +
      `Create one, put the reel downloads in named for their slot, and re-run:\n` +
      SLOTS.map((s) => `  assets/reels/${s}.mp4`).join("\n"),
  );
  process.exit(1);
}

const sources = readdirSync(SRC).filter((f) => /\.(mp4|mov|m4v|webm)$/i.test(f));
if (!sources.length) {
  console.error(`${SRC}/ has no video files in it.`);
  process.exit(1);
}

mkdirSync(DEST, { recursive: true });
const done = [];
const skipped = [];

for (const file of sources) {
  const { name } = parse(file);
  if (!SLOTS.includes(name)) {
    skipped.push(`${file} — "${name}" is not a slot. Expected one of: ${SLOTS.join(", ")}`);
    continue;
  }

  const input = join(SRC, file);
  const output = join(DEST, `${name}.mp4`);
  const webm = join(DEST, `${name}.webm`);
  const poster = join(DEST, `${name}-poster.jpg`);
  const duration = seconds(input);
  const clip = Math.min(MAX_SECONDS, Number.isFinite(duration) ? duration : MAX_SECONDS);

  ffmpeg([
    "-i", input,
    "-t", String(clip),
    "-an", // no audio
    "-vf", `scale=-2:'min(${MAX_HEIGHT},ih)'`,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-b:v", BITRATE,
    "-maxrate", BITRATE,
    "-bufsize", "2800k",
    "-movflags", "+faststart",
    output,
  ]);

  ffmpeg([
    "-i", input,
    "-t", String(clip),
    "-an",
    "-vf", `scale=-2:'min(${MAX_HEIGHT},ih)'`,
    "-c:v", "libvpx-vp9",
    "-b:v", BITRATE,
    "-deadline", "good",
    "-cpu-used", "4",
    "-row-mt", "1",
    webm,
  ]);

  // Poster from one second in — frame zero of a reel is very often a black
  // fade-up, which would show as an empty slot until the video starts.
  ffmpeg([
    "-i", output,
    "-ss", String(Math.min(1, clip / 2)),
    "-frames:v", "1",
    "-q:v", "4",
    poster,
  ]);

  done.push({
    slot: name,
    seconds: +clip.toFixed(1),
    mp4KB: Math.round(statSync(output).size / 1024),
    webmKB: Math.round(statSync(webm).size / 1024),
    posterKB: Math.round(statSync(poster).size / 1024),
  });
}

console.table(done);
if (skipped.length) console.warn("\nSkipped:\n" + skipped.map((s) => "  " + s).join("\n"));
console.log(
  `\n${done.length} ready in ${DEST}/. Motion slots are set per card in lib/content.ts.`,
);
