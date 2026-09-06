import { SECTORS } from "@/lib/content";
import { IMAGES } from "@/lib/images";

/**
 * Sector list where hovering a row floats its image at the cursor. The peek is
 * driven by `Interactions`, which reads the data attributes below; it stays
 * inert under prefers-reduced-motion, and is display:none under 820px where
 * there is no cursor to follow.
 *
 * Order is deliberate and settled — Weddings first, Sport fifth.
 */
export function Sectors() {
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
                data-peek-src={IMAGES[sector.image]}
                data-peek-tone={sector.tone}
              >
                <h3>{sector.title}</h3>
                <p>{sector.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="peek" aria-hidden="true">
        <div className="f" />
      </div>
    </>
  );
}
