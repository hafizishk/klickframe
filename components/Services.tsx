import { SERVICES } from "@/lib/content";

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
