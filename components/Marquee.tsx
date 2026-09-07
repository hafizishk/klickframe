import { CLIENTS, logoSlug } from "@/lib/content";
import logos from "@/lib/logos.json";

type LogoEntry = {
  file: string;
  width: number;
  height: number;
  scale: number;
};

const MANIFEST = logos as Record<string, LogoEntry>;

/**
 * One set is rendered; `Interactions` clones it until the track exceeds twice
 * the viewport and animates by exactly one set width, so the loop is seamless
 * and the speed is constant however many names go in.
 *
 * Each client shows its logo when `npm run logos` has produced one, and its name
 * in type when it has not — so the wall is presentable at any stage of
 * collecting brand assets rather than being all-or-nothing.
 *
 * Everything about how a logo is drawn comes from the manifest rather than
 * being guessed here:
 *
 * - `width`/`height` are the real trimmed dimensions. They are load-bearing:
 *   without an intrinsic size the marquee measures the set before the logos
 *   have laid out, gets zero, and the loop breaks.
 * - `scale` evens out optical weight. A square crest at a wordmark's height
 *   carries far more visual mass and would dominate the row.
 *
 * Logos run in their own colours, which is why this band is bone rather than
 * the page's black: four of these files are pure black artwork that would be
 * invisible on it.
 *
 * The names are real engaged clients, confirmed by Hafiz — see CLIENTS in
 * lib/content.ts for the ordering rationale.
 */
export function Marquee() {
  return (
    <div className="marq" aria-label="Client list">
      <div className="marq-in">
        <div className="marq-set">
          {CLIENTS.map((client) => {
            const logo = MANIFEST[logoSlug(client)];
            return logo ? (
              // Plain <img>, not next/image: mostly SVG, which the optimiser
              // passes through untouched anyway, the static export has no
              // optimiser to run, and scripts/bundle.mjs needs a literal src.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={client}
                className="logo"
                src={logo.file}
                alt={client}
                width={logo.width}
                height={logo.height}
                style={{ "--logo-scale": logo.scale } as React.CSSProperties}
              />
            ) : (
              <span key={client}>{client}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
