import { CLIENTS } from "@/lib/content";

/**
 * One set is rendered; `Interactions` clones it until the track exceeds twice
 * the viewport and animates by exactly one set width, so the loop is seamless
 * and the speed is constant however many names go in.
 *
 * The names are real engaged clients, confirmed by Hafiz — see CLIENTS in
 * lib/content.ts for the ordering rationale.
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
