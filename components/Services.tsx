import { SERVICES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { publicFileExists } from "@/lib/assets";
import { MediaField } from "./MediaField";

/**
 * Services — heading across the top, the four services across beneath it.
 *
 * Two layouts preceded this one and both fought the same problem. The mock's
 * sticky column put the heading in one narrow column and the services in the
 * other, which left about a screen of empty black down the left for the length
 * of the section; on a block the client had already called too wordy, the copy
 * sat in a narrow measure beside a void, which is what makes text feel like the
 * only thing on offer. Filling that void with a photograph that cross-faded per
 * row fixed the emptiness but showed one picture at a time.
 *
 * Four across solves both: no void to fill, and each photograph gets the full
 * width of its own column instead of a 240px sliver. The copy is short because
 * the pictures and the tags carry what the sentences were carrying.
 */
export function Services() {
  return (
    <section id="services" className="cap-sec">
      <div className="wrap">
        <div className="cap-head">
          <div>
            <p className="slate slate-lead">{SERVICES.slate}</p>
            <h2>{SERVICES.headline}</h2>
          </div>
          <p className="cap-stand">{SERVICES.standfirst}</p>
        </div>

        <div className="cap-grid4">
          {SERVICES.items.map((item) => (
            <article className="cap-cell" key={item.n}>
              <MediaField
                tone={item.tone}
                photo={publicFileExists(IMAGES[item.image]) ? IMAGES[item.image] : undefined}
                className="cap-shot"
              />
              <p className="slate n">{item.n}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <ul>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
