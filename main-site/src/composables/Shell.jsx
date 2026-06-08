const navItems = [
  { label: "Home", hash: "#/" },
  { label: "Blog", hash: "#/blog" },
  { label: "Creative Code", hash: "#/creative-code" },
  { label: "About", hash: "#/about" },
];

export default function Shell({ route, children }) {
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
