import { ENQUIRY_TYPES, STUDIO } from "@/lib/content";

/**
 * Bookings run entirely through WhatsApp, so the form has no backend.
 * `Interactions` intercepts the submit and composes the answers into the
 * opening message, rather than dropping the enquirer into an empty chat having
 * lost everything they typed. With no JS the form still degrades to the direct
 * WhatsApp link above it.
 */
export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="slate slate-lead">Enquiries</p>
        <h2>Tell us about the day.</h2>
        <div className="cgrid">
          <div>
            <div className="direct">
              <a href={STUDIO.whatsappUrl}>WhatsApp {STUDIO.whatsapp}</a>
              <a href={STUDIO.instagramUrl}>Instagram {STUDIO.instagram}</a>
              <a href={STUDIO.youtubeUrl}>YouTube {STUDIO.youtube}</a>
            </div>
            {/* UNCONFIRMED — studio address and email are not known. */}
            <p className="slate" style={{ marginTop: 26 }}>
              Studio address and email to be confirmed
            </p>
          </div>

          <form
            className="fields"
            action={STUDIO.whatsappUrl}
            method="get"
            target="_blank"
            data-whatsapp={STUDIO.whatsappUrl}
            data-studio={STUDIO.name}
          >
            <div className="row">
              <div>
                <label htmlFor="n">Name</label>
                <input id="n" name="name" type="text" placeholder="Full name" required />
              </div>
              <div>
                <label htmlFor="o">Company</label>
                <input id="o" name="company" type="text" placeholder="Optional" />
              </div>
            </div>
            <div className="row">
              <div>
                <label htmlFor="d">Date</label>
                <input id="d" name="date" type="date" />
              </div>
              <div>
                <label htmlFor="t">Type</label>
                <select id="t" name="type" defaultValue={ENQUIRY_TYPES[0]}>
                  {ENQUIRY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="w">What do you need?</label>
              <textarea
                id="w"
                name="brief"
                placeholder="Photo, film, a live stream, or all three. Venue and rough timings help."
              />
            </div>
            <button className="btn" type="submit">
              <span>Send enquiry</span>
              <span>&#8594;</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
