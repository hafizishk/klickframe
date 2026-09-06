import { NAV, STUDIO } from "@/lib/content";

export function Header() {
  return (
    <header>
      <div className="wrap bar">
        <a className="mark" href="#top">
          <svg className="glyph" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M8 7h4v18H8z" fill="#fff" />
            <path d="M25 7l-9 9 9 9h-6l-9-9 9-9z" fill="#fff" />
          </svg>
          <span className="wordmark">{STUDIO.name.replace(" SG", "")}</span>
        </a>
        <nav aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
