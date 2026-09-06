"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { FieldTone } from "@/lib/images";

type Props = {
  /** Gradient painted underneath, and the thing that shows if the photo fails. */
  tone: FieldTone;
  src?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * A gradient field that fades a real photograph in over itself once the file
 * has actually decoded. If the URL fails — or no photo has been supplied yet —
 * the gradient stays and the page still reads as designed.
 *
 * The unified colour grade and duotone multiply live on `.f .photo` in
 * globals.css. Every photo on the site goes through this component so no
 * shoot ever lands ungraded.
 */
export function ImageField({ tone, src, className, children }: Props) {
  // Held as the URL that decoded rather than a boolean, so a changed src
  // reads as not-yet-loaded without an extra reset render.
  const [decoded, setDecoded] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    let live = true;
    const probe = new window.Image();
    probe.onload = () => {
      if (live) setDecoded(src);
    };
    probe.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  const loaded = Boolean(src) && decoded === src;

  return (
    <div className={["f", tone, loaded ? "loaded" : "", className].filter(Boolean).join(" ")}>
      {src ? <div className="photo" style={{ backgroundImage: `url("${src}")` }} /> : null}
      {children}
    </div>
  );
}
