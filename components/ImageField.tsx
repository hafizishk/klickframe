import type { FieldTone } from "@/lib/images";
import type { ReactNode } from "react";

type Props = {
  /** Gradient painted underneath, and the thing that shows if the photo fails. */
  tone: FieldTone;
  src?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * A gradient field with a photograph layered over it. The photo starts at
 * opacity 0; `Interactions` decodes it and adds `.loaded` to fade it in. If the
 * file is missing or fails — or JavaScript never runs — the gradient stays and
 * the page still reads as designed rather than as a broken grid.
 *
 * The unified colour grade and duotone multiply live on `.f .photo` in
 * globals.css. Every photo on the site goes through this component, so no
 * shoot ever lands ungraded.
 */
export function ImageField({ tone, src, className, children }: Props) {
  return (
    <div className={["f", tone, className].filter(Boolean).join(" ")}>
      {/* The background image is set by Interactions once the file decodes.
          Emitting it here too would be dead weight: `.f .photo` is opacity 0
          until `.loaded` lands, so without the script it never shows either
          way — and in the inlined bundle every duplicate URL is a second copy
          of a base64 photograph. */}
      {src ? <div className="photo" data-src={src} /> : null}
      {children}
    </div>
  );
}
