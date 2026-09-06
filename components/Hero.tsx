import { HERO } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { ImageField } from "./ImageField";

export function Hero() {
  return (
    <div className="hero">
      <ImageField tone={HERO.tone} src={IMAGES[HERO.image]} className="hero-bg" />
      <div className="hero-veil" />
      <span className="brk tl" aria-hidden="true" />
      <span className="brk br" aria-hidden="true" />
      <div className="wrap">
        <h1>
          {HERO.headline.map((line) => (
            <span className="ln" key={line}>
              <i>{line}</i>
            </span>
          ))}
        </h1>
        <div className="hero-foot">
          <p>{HERO.standfirst}</p>
          <p className="slate">{HERO.slate}</p>
        </div>
      </div>
    </div>
  );
}
