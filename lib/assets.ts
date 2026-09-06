import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Does this file actually exist in `public/`?
 *
 * The page is prerendered, so asset availability is knowable at build time —
 * and knowing it is what makes the reel → photograph → gradient fallback real.
 * Without this check a slot marked `motion` renders a <video> whether or not
 * the reel exists, and a missing one skips straight past the photograph to the
 * gradient, which is the wrong tier and loses the best asset on the page.
 *
 * It also keeps the console clean: nothing is referenced that would 404.
 *
 * Server-only by construction — it reads the filesystem, and there is no
 * filesystem in a browser.
 */
export function publicFileExists(path: string) {
  return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}

/** The first of these that exists in `public/`, or undefined. */
export function firstAvailable(...paths: Array<string | undefined>) {
  return paths.find((path) => path && publicFileExists(path));
}
