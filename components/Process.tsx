import { PROCESS } from "@/lib/content";

export function Process() {
  return (
    <section id="process" className="proc">
      <div className="wrap">
        <p className="slate slate-lead">{PROCESS.slate}</p>
        <h2>{PROCESS.headline}</h2>
        <div className="steps">
          {PROCESS.steps.map((step) => (
            <div className="step" key={step.when}>
              <div className="tc">{step.when}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
