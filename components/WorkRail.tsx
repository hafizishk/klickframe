"use client";

import { useRef } from "react";
import { WORK, WORK_NOTE } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { ImageField } from "./ImageField";

export function WorkRail() {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0 });

  return (
    <section id="work">
      <div className="wrap">
        <div className="rail-head">
          <h2>Selected work</h2>
          <p className="slate">Drag or scroll sideways</p>
        </div>
      </div>

      <div className="wrap">
        <div
          className="rail"
          ref={rail}
          onPointerDown={(e) => {
            if (!rail.current) return;
            drag.current = {
              down: true,
              startX: e.clientX,
              startLeft: rail.current.scrollLeft,
            };
            rail.current.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current.down || !rail.current) return;
            rail.current.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
          }}
          onPointerUp={() => {
            drag.current.down = false;
          }}
          onPointerCancel={() => {
            drag.current.down = false;
          }}
        >
          {WORK.map((project) => (
            <article className="case" key={project.index}>
              <ImageField tone={project.tone} src={IMAGES[project.image]}>
                <span className="idx">
                  {project.index} / {project.kicker}
                </span>
              </ImageField>
              <div className="cap">
                <h3>{project.title}</h3>
                <p>
                  {project.meta[0]}
                  <br />
                  {project.meta[1]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wrap railnote">
        <p className="slate">{WORK_NOTE}</p>
      </div>
    </section>
  );
}
