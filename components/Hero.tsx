import { firstAvailable, publicFileExists } from "@/lib/assets";
import { HERO } from "@/lib/content";
import { IMAGES, VIDEOS, posterFor, webmFor } from "@/lib/images";
import { MediaField } from "./MediaField";

export function Hero() {
  // Reel → photograph → gradient, resolved against what is actually in
  // public/ so a slot never renders a reference to a file that is not there.
  const video = HERO.motion ? firstAvailable(VIDEOS[HERO.image]) : undefined;

  return (
    <div className="hero">
      <MediaField
        tone={HERO.tone}
        video={video}
        webm={video && publicFileExists(webmFor(video)) ? webmFor(video) : undefined}
        poster={video ? firstAvailable(posterFor(video), IMAGES[HERO.image]) : undefined}
        photo={video ? undefined : firstAvailable(IMAGES[HERO.image])}
        className="hero-bg"
      />
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
