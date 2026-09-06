import { STATEMENT } from "@/lib/content";

export function Statement() {
  return (
    <section className="statement">
      <div className="wrap">
        <p className="slate slate-lead">{STATEMENT.slate}</p>
        <h2>{STATEMENT.headline}</h2>
        <div className="meta">
          {STATEMENT.points.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
