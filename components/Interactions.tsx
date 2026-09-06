"use client";

import { useEffect } from "react";

/**
 * Loads `public/interactions.js` — the one place every interaction on this page
 * lives — once React has finished hydrating.
 *
 * It cannot be a plain `<script defer>` in the markup. Deferred scripts run at
 * DOMContentLoaded, which is BEFORE hydration: the script adds `.loaded` to
 * image fields and clones marquee sets, React then finds a DOM that no longer
 * matches the server HTML, bails out with a hydration error, and re-renders
 * from scratch — discarding those mutations and every listener attached to the
 * old nodes. The symptom is a page that looks right in dev and is quietly inert
 * in production.
 *
 * Appending it from an effect runs it strictly after hydration, so React and
 * the script never contend for the same DOM.
 *
 * The static bundle has no React at all, so `scripts/bundle.mjs` inlines the
 * same file directly instead. One implementation, two ways in.
 */
export function Interactions() {
  useEffect(() => {
    if (document.querySelector('script[data-interactions]')) return;
    const script = document.createElement("script");
    script.src = "/interactions.js";
    script.dataset.interactions = "";
    document.body.appendChild(script);
  }, []);

  return null;
}
