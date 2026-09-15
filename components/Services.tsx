import { SERVICES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { publicFileExists } from "@/lib/assets";
import { MediaField } from "./MediaField";

/**
 * Services — a sticky index on the left, the four services scrolling past it.
 *
 * Each service carries its own photograph, in its own row. An earlier pass put
 * a single photo in the sticky column and cross-faded it to match whichever row
 * was crossing the middle of the viewport; it worked, but it showed one picture
 * at a time and only rewarded you for scrolling slowly. Four pictures on screen
 * at once do more for a section that was criticised for being too wordy than
 * one picture that changes does.
 *
 * The photographs are the third column of the row rather than a band above the
 * text, so the section stays four scannable lines deep instead of four screens.
 */
export function Services() {
  return (
    <section id="services" className="cap-sec">
      <div className="wrap cap-grid">
        <div className="cap-sticky">
          <p className="slate slate-lead">{SERVICES.slate}</p>
          <h2>{SERVICES.headline}</h2>
          <p>{SERVICES.standfirst}</p>
        </div>

        <div className="cap-list">
          {SERVICES.items.map((item) => (
            <div className="cap-item" key={item.n}>
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
              <MediaField
                tone={item.tone}
                photo={publicFileExists(IMAGES[item.image]) ? IMAGES[item.image] : undefined}
                className="cap-shot"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
