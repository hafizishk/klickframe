import { IS_CONCEPT, STUDIO } from "@/lib/content";

export function Footer() {
  return (
    <footer>
      <div className="wrap fgrid">
        <span>
          {STUDIO.legalName} · {STUDIO.city}
        </span>
        <span>
          <a href={STUDIO.instagramUrl}>Instagram</a> · <a href={STUDIO.youtubeUrl}>YouTube</a> ·{" "}
          <a href={STUDIO.whatsappUrl}>WhatsApp</a>
        </span>
        {IS_CONCEPT ? <span>Concept mock · Stackform Studios</span> : null}
      </div>
    </footer>
  );
}
