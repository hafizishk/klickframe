import { firstAvailable, publicFileExists } from "@/lib/assets";
import { WORK, WORK_NOTE } from "@/lib/content";
import { IMAGES, VIDEOS, posterFor, webmFor } from "@/lib/images";
import { MediaField } from "./MediaField";

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
          {WORK.map((project) => {
            // Reel → photograph → gradient, resolved against what is actually
            // in public/ so a slot never references a file that is not there.
            const video = project.motion ? firstAvailable(VIDEOS[project.image]) : undefined;
            const photo = IMAGES[project.image];
            return (
              <article className="case" key={project.index}>
                <MediaField
                  tone={project.tone}
                  video={video}
                  webm={video && publicFileExists(webmFor(video)) ? webmFor(video) : undefined}
                  poster={video ? firstAvailable(posterFor(video), photo) : undefined}
                  photo={video ? undefined : firstAvailable(photo)}
                >
                  <span className="idx">
                    {project.index} / {project.kicker}
                  </span>
                </MediaField>
                <div className="cap">
                  <h3>{project.title}</h3>
                  <p>
                    {project.meta[0]}
                    <br />
                    {project.meta[1]}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="wrap railnote">
        <p className="slate">{WORK_NOTE}</p>
      </div>
    </section>
  );
}
