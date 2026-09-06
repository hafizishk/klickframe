"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CLIENTS } from "@/lib/content";

/** Pixels per second. Duration is derived from the measured set width, never
 *  fixed, or the marquee speeds up as logos are added. */
const SPEED = 55;

/**
 * The set is cloned until the track is at least twice the viewport, so there
 * is never a gap, and the track animates by exactly one set width, so the loop
 * is seamless. Both are re-derived on resize.
 *
 * When real logos replace the text placeholders they need explicit width and
 * height attributes — otherwise this measures the set before the images have
 * laid out and gets zero.
 */
export function Marquee() {
  const set = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(1);
  const [metrics, setMetrics] = useState<{ set: string; dur: string } | null>(null);

  const measure = useCallback(() => {
    if (!set.current) return;
    const width = set.current.getBoundingClientRect().width;
    if (!width) return;
    setCopies(Math.max(1, Math.ceil((window.innerWidth * 2) / width)));
    setMetrics({ set: `${width}px`, dur: `${width / SPEED}s` });
  }, []);

  useEffect(() => {
    measure();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  const style = metrics
    ? ({ "--set": metrics.set, "--dur": metrics.dur } as React.CSSProperties)
    : undefined;

  return (
    <div className="marq" aria-label="Client list">
      <div className="marq-in" style={style}>
        {Array.from({ length: copies }, (_, copy) => (
          <div
            className="marq-set"
            key={copy}
            ref={copy === 0 ? set : undefined}
            aria-hidden={copy > 0 || undefined}
          >
            {CLIENTS.map((client, i) => (
              <span key={`${client}-${i}`}>{client}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
