"use client";

import { useEffect, useRef, useState } from "react";
import { SECTORS } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { ImageField } from "./ImageField";

type Peek = (typeof SECTORS)[number] | null;

/**
 * Sector list where hovering a row floats its image at the cursor. Disabled
 * under prefers-reduced-motion and below 820px, where the peek is display:none
 * and there is no cursor to follow anyway.
 */
export function Sectors() {
  const [active, setActive] = useState<Peek>(null);
  const [calm, setCalm] = useState(false);
  const peek = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCalm(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const move = (x: number, y: number) => {
    if (!peek.current) return;
    peek.current.style.left = `${x}px`;
    peek.current.style.top = `${y}px`;
  };

  return (
    <>
      <section id="sectors" className="sectors">
        <div className="wrap">
          <p className="slate slate-lead">Sectors</p>
          <h2>Who we work with.</h2>
          <div className="slist">
            {SECTORS.map((sector) => (
              <a
                className="srow"
                href="#contact"
                key={sector.title}
                onMouseEnter={calm ? undefined : () => setActive(sector)}
                onMouseLeave={calm ? undefined : () => setActive(null)}
                onMouseMove={calm ? undefined : (e) => move(e.clientX, e.clientY)}
              >
                <h3>{sector.title}</h3>
                <p>{sector.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={`peek${active ? " on" : ""}`} ref={peek} aria-hidden="true">
        {active ? <ImageField tone={active.tone} src={IMAGES[active.image]} /> : <div className="f" />}
      </div>
    </>
  );
}
