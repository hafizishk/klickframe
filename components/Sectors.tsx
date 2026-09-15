import { SECTORS } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { publicFileExists } from "@/lib/assets";
import { MediaField } from "./MediaField";

/**
 * The sector list — a thumbnail, the sector, and one line, per row.
 *
 * The mock floated the sector image at the cursor on hover. That was removed
 * because there was no sector photography, so it floated an empty gradient over
 * the type; it is not being restored now that there is. Hover shows one image
 * at a time, needs a mouse, and is invisible until you go looking — the same
 * reason the cross-fading photograph in Services was replaced. A thumbnail in
 * the row is always there, works on a phone, and shows all six at once.
 *
 * The list stays a list: the thumbnail is small and the sector name still does
 * the work, because a sector list is scanned rather than read.
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
              <MediaField
                tone={sector.tone}
                photo={publicFileExists(IMAGES[sector.image]) ? IMAGES[sector.image] : undefined}
                className="sthumb"
              />
              <h3>{sector.title}</h3>
              <p>{sector.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
