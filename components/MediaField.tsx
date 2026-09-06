import type { FieldTone } from "@/lib/images";
import type { ReactNode } from "react";

type Props = {
  /** Gradient painted underneath, and the thing that shows if nothing loads. */
  tone: FieldTone;
  /** Silent looping reel (MP4). Takes precedence over `photo` when present. */
  video?: string;
  /** VP9/WebM sibling, offered first where the browser supports it. */
  webm?: string;
  /** Still frame for the video — shown before play, and instead of it under
   *  prefers-reduced-motion. */
  poster?: string;
  photo?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * One media slot, degrading in three tiers: reel → photograph → gradient.
 * Whatever is missing simply does not render, and the tier below shows through,
 * so any mix of supplied assets still reads as finished art direction rather
 * than as a hole.
 *
 * Nothing plays until `Interactions` sees the field approach the viewport, and
 * nothing plays at all under prefers-reduced-motion — the poster stays.
 *
 * The unified grade lives on `.f .photo, .f .motion` in globals.css, and the
 * warm-over-cool duotone is the `.duo` layer below. Every photograph AND every
 * reel goes through the same two, which is what makes footage from different
 * shoots read as one studio.
 */
export function MediaField({ tone, video, webm, poster, photo, className, children }: Props) {
  const hasMedia = Boolean(video || photo);

  return (
    <div className={["f", tone, className].filter(Boolean).join(" ")}>
      {video ? (
        <video
          className="motion"
          data-src={video}
          data-src-webm={webm}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : photo ? (
        <div className="photo" data-src={photo} />
      ) : null}
      {hasMedia ? <span className="duo" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
