import { CLIENTS } from "@/lib/content";

/**
 * One set is rendered; `Interactions` clones it until the track exceeds twice
 * the viewport and animates by exactly one set width, so the loop is seamless
 * and the speed is constant however many names go in.
 *
 * The names are neutral placeholders. Brands appear in the KlickFrame feed, but
 * those relationships are unconfirmed and must not be asserted.
 */
export function Marquee() {
  return (
    <div className="marq" aria-label="Client list">
      <div className="marq-in">
        <div className="marq-set">
          {CLIENTS.map((client, i) => (
            <span key={`${client}-${i}`}>{client}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
