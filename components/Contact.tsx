"use client";

import { useState } from "react";
import { ENQUIRY_TYPES, STUDIO } from "@/lib/content";

const EMPTY = { name: "", company: "", date: "", type: ENQUIRY_TYPES[0] as string, brief: "" };

/**
 * Bookings run entirely through WhatsApp, so the form has no backend. Rather
 * than dropping the enquirer into an empty chat and losing everything they
 * typed, it composes their answers into the opening message.
 */
function composeMessage(form: typeof EMPTY) {
  const lines = [
    `Hello ${STUDIO.name}, I'd like to enquire.`,
    "",
    `Name: ${form.name || "—"}`,
    form.company ? `Company: ${form.company}` : null,
    `Date: ${form.date || "To be confirmed"}`,
    `Type: ${form.type}`,
    "",
    form.brief || "—",
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function Contact() {
  const [form, setForm] = useState(EMPTY);

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
            onSubmit={(e) => {
              e.preventDefault();
              const text = encodeURIComponent(composeMessage(form));
              window.open(`${STUDIO.whatsappUrl}?text=${text}`, "_blank", "noopener,noreferrer");
            }}
          >
            <div className="row">
              <div>
                <label htmlFor="n">Name</label>
                <input
                  id="n"
                  type="text"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={set("name")}
                />
              </div>
              <div>
                <label htmlFor="o">Company</label>
                <input
                  id="o"
                  type="text"
                  placeholder="Optional"
                  value={form.company}
                  onChange={set("company")}
                />
              </div>
            </div>
            <div className="row">
              <div>
                <label htmlFor="d">Date</label>
                <input id="d" type="date" value={form.date} onChange={set("date")} />
              </div>
              <div>
                <label htmlFor="t">Type</label>
                <select id="t" value={form.type} onChange={set("type")}>
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
                placeholder="Photo, film, a live stream, or all three. Venue and rough timings help."
                value={form.brief}
                onChange={set("brief")}
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
