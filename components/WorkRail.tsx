import { WORK, WORK_NOTE } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { ImageField } from "./ImageField";

export function WorkRail() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="rail-head">
          <h2>Selected work</h2>
          <p className="slate">Drag or scroll sideways</p>
        </div>
      </div>

      {/* The rail must stay inside a .wrap — its negative margin is measured
          against one. See the deviation note in CLAUDE.md. */}
      <div className="wrap">
        <div className="rail">
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
