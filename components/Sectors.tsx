import { SECTORS } from "@/lib/content";

/**
 * The sector list.
 *
 * The mock had each row float its image at the cursor on hover. That is gone:
 * there is no sector photography, so it floated an empty gradient over the
 * type — a grey box obscuring the words it was meant to illustrate. The one
 * row that did have an image was Sport, which made it worse: the only working
 * hover on a page whose whole argument is that this studio is not a sports
 * specialist.
 *
 * If sector stills ever land, the reel poster frames in public/videos/ are the
 * obvious source and this is worth rebuilding. Until then a clean list beats a
 * broken flourish.
 */
export function Sectors() {
  return (
    <section id="sectors" className="sectors">
      <div className="wrap">
        <p className="slate slate-lead">Sectors</p>
        <h2>Who we work with.</h2>
        <div className="slist">
          {SECTORS.map((sector) => (
            <a className="srow" href="#contact" key={sector.title}>
              <h3>{sector.title}</h3>
              <p>{sector.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
