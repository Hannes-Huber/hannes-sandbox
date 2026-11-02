import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", hash: "#/" },
  { label: "Blog", hash: "#/blog" },
  { label: "Creative Code", hash: "#/creative-code" },
  { label: "About", hash: "#/about" },
];

const themes = [
  { id: "soft-pop", label: "Soft Pop" },
  { id: "classic", label: "Original (Schwarz-Weiß)" },
];

export default function Shell({ route, children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("site-theme") || "soft-pop";
    } catch {
      return "soft-pop";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    let classicTheme = document.getElementById("classic-theme-stylesheet");
    if (!classicTheme) {
      classicTheme = document.createElement("link");
      classicTheme.id = "classic-theme-stylesheet";
      classicTheme.rel = "stylesheet";
      classicTheme.href = "/classic-theme.css";
      document.head.append(classicTheme);
    }
    classicTheme.disabled = theme !== "classic";

    try {
      window.localStorage.setItem("site-theme", theme);
    } catch {
      // The selected theme still applies when browser storage is unavailable.
    }
  }, [theme]);

  const activeSection = route.startsWith("/blog")
    ? "/blog"
    : route.startsWith("/creative-code")
      ? "/creative-code"
      : route;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Zur Startseite">
          <span>H</span>
          <strong>Hannes Sandbox</strong>
        </a>
        <nav className="site-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <a
              aria-current={
                activeSection === item.hash.replace("#", "")
                  ? "page"
                  : undefined
              }
              href={item.hash}
              key={item.hash}
            >
              {item.label}
            </a>
          ))}
          <label className="theme-picker">
            <span>Theme</span>
            <select
              aria-label="Website-Theme auswählen"
              onChange={(event) => setTheme(event.target.value)}
              value={theme}
            >
              {themes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>Personal blog and creative code archive.</span>
        <a href="#/about">About</a>
      </footer>
    </>
  );
}
