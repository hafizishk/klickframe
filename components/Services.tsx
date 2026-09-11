import { SERVICES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { publicFileExists } from "@/lib/assets";
import { MediaField } from "./MediaField";

/**
 * Services — a sticky index on the left, the four services scrolling past it.
 *
 * The sticky column used to hold a heading, a standfirst and then a screen and
 * a half of empty black. The client's note was that the section read as too
 * wordy; the copy is already cut to one line per service, and what was left to
 * do was show rather than tell. So the void now carries a photograph, and it
 * changes to match whichever service you are reading — the row-to-image link is
 * made in interactions.js, off an IntersectionObserver.
 *
 * All four images are stacked and cross-faded rather than swapped by src, so
 * there is no flash of an undecoded image mid-scroll. With no JS the first one
 * is marked `is-on` server-side and simply stays: the section still has a
 * picture in it, it just does not follow the scroll.
 */
export function Services() {
  return (
    <section id="services" className="cap-sec">
      <div className="wrap cap-grid">
        <div className="cap-sticky">
          <p className="slate slate-lead">{SERVICES.slate}</p>
          <h2>{SERVICES.headline}</h2>
          <p>{SERVICES.standfirst}</p>

          <div className="cap-media" aria-hidden="true">
            {SERVICES.items.map((item, i) => (
              <MediaField
                key={item.n}
                tone={item.tone}
                photo={publicFileExists(IMAGES[item.image]) ? IMAGES[item.image] : undefined}
                className={`cap-shot${i === 0 ? " is-on" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="cap-list">
          {SERVICES.items.map((item) => (
            <div className="cap-item" data-svc={item.n} key={item.n}>
              <span className="n">{item.n}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <ul>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
