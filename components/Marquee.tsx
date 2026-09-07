import { firstAvailable } from "@/lib/assets";
import { CLIENTS, logoSlug } from "@/lib/content";

/**
 * One set is rendered; `Interactions` clones it until the track exceeds twice
 * the viewport and animates by exactly one set width, so the loop is seamless
 * and the speed is constant however many names go in.
 *
 * Each client shows its logo when `public/logos/<slug>.svg` is there, and its
 * name in type when it is not — so the wall is presentable at every stage of
 * collecting nine sets of brand assets, rather than being all-or-nothing.
 *
 * The width/height attributes are load-bearing, not decoration. Without an
 * intrinsic size the marquee measures the set before the logos have laid out,
 * gets zero, and the loop breaks. 120x32 is the reserved box; the CSS scales
 * each logo to a common optical height inside it.
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
            const slug = logoSlug(client);
            // SVG preferred, but not required: the wall renders every logo as a
            // flat silhouette, so a transparent PNG is indistinguishable from
            // vector at these sizes — and tracing a raster logo to fake vector
            // would only introduce inaccuracy in a trademark.
            const logo = firstAvailable(
              `/logos/${slug}.svg`,
              `/logos/${slug}.png`,
              `/logos/${slug}.webp`,
            );
            return logo ? (
              // Plain <img>, not next/image: these are SVGs, which the image
              // optimiser passes through untouched anyway (and only with
              // dangerouslyAllowSVG), the static export has no optimiser to run,
              // and scripts/bundle.mjs needs a literal src it can inline.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={client} className="logo" src={logo} alt={client} width={120} height={32} />
            ) : (
              <span key={client}>{client}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
