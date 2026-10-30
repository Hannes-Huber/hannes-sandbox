const navItems = [
  { label: "Home", hash: "#/" },
  { label: "Blog", hash: "#/blog" },
  { label: "Creative Code", hash: "#/creative-code" },
  { label: "Tools", children: [{ label: "Quantencomputing", children: [{ label: "Codex", hash: "#/tools/quantencomputing/codex" }, { label: "Claude Code", hash: "#/tools/quantencomputing/claude-code" }] }] },
  { label: "About", hash: "#/about" },
];

export default function Shell({ route, children }) {
  const activeSection = route.startsWith("/blog")
    ? "/blog"
    : route.startsWith("/creative-code")
      ? "/creative-code"
      : route.startsWith("/tools/")
        ? route.startsWith("/tools/quantencomputing/claude-code")
          ? "/tools/quantencomputing/claude-code"
          : "/tools/quantencomputing/codex"
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
            <div className="nav-group" key={item.hash ?? item.label}>
              {item.hash ? (
                <a
                  aria-current={
                    activeSection === item.hash.replace("#", "")
                      ? "page"
                      : undefined
                  }
                  href={item.hash}
                >
                  {item.label}
                </a>
              ) : (
                <button className="nav-trigger" type="button" aria-haspopup="true">
                  {item.label} ▾
                </button>
              )}
              {item.children && <div className="nav-menu">{item.children.map((child) => (
                <div className="nav-subgroup" key={child.label}>
                  {child.hash ? <a href={child.hash}>{child.label}</a> : <span>{child.label} ›</span>}
                  {child.children && <div className="nav-submenu">{child.children.map((leaf) => <a aria-current={activeSection === leaf.hash.replace("#", "") ? "page" : undefined} href={leaf.hash} key={leaf.label}>{leaf.label}</a>)}</div>}
                </div>
              ))}</div>}
            </div>
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
