import { useEffect, useMemo, useState } from 'react'
import './App.css'

const posts = [
  {
    slug: 'notizen-aus-dem-hellen-labor',
    title: 'Notizen aus dem hellen Labor',
    date: '2026-06-02',
    readingTime: '5 min',
    excerpt:
      'Ein Auftakt uber kleine Experimente, gute Oberflachen und die Freude daran, Dinge offentlich wachsen zu lassen.',
    tags: ['Essay', 'Process'],
    body: [
      'Dieser Blog ist als Arbeitsraum gedacht: hell, direkt und offen genug, um unfertige Gedanken nicht sofort zu verstecken.',
      'Ich mochte hier uber Code, Gestaltung, Alltagssysteme und die kleinen Entscheidungen schreiben, aus denen digitale Dinge entstehen.',
      'Die Seite ist deshalb bewusst modular aufgebaut. Jeder Beitrag nutzt dieselbe Komponente, kann aber durch Titel, Datum, Tags und Absatze schnell neu befullt werden.',
    ],
  },
  {
    slug: 'interfaces-mit-kanten',
    title: 'Interfaces mit Kanten',
    date: '2026-05-25',
    readingTime: '7 min',
    excerpt:
      'Warum klare Kontraste, prazise Typografie und etwas Reibung oft mehr Charakter haben als glatte Perfektion.',
    tags: ['Design', 'UI'],
    body: [
      'Ein Interface muss nicht laut sein, um Haltung zu haben. Oft reicht eine starke Linie, ein ehrlicher Abstand oder ein Button, der genau weiss, wozu er da ist.',
      'Schwarze Kontraste im Bright Mode geben dieser Seite ein grafisches Ruckgrat. Der Rest bleibt ruhig, damit Inhalte und Experimente Raum bekommen.',
      'Das Ziel ist kein dekoratives Portfolio, sondern eine nutzbare Struktur fur regelmassige Texte und Projekte.',
    ],
  },
  {
    slug: 'kleine-systeme-gross-denken',
    title: 'Kleine Systeme gross denken',
    date: '2026-05-12',
    readingTime: '4 min',
    excerpt:
      'Uber wiederverwendbare Bausteine, einfache Datenmodelle und warum gute Defaults das Schreiben erleichtern.',
    tags: ['React', 'Systems'],
    body: [
      'Der beste CMS-Ersatz am Anfang ist manchmal eine gute Datenstruktur. Eine Liste von Objekten kann erstaunlich weit tragen.',
      'Wenn Titel, Slug, Datum, Auszug und Inhalt konsistent sind, lassen sich Listen, Teaser und Detailseiten ohne zusatzliche Schwere bauen.',
      'Spater kann dieselbe Struktur aus Markdown, einer API oder einem Headless CMS kommen.',
    ],
  },
  {
    slug: 'creative-code-als-skizzenbuch',
    title: 'Creative Code als Skizzenbuch',
    date: '2026-04-30',
    readingTime: '6 min',
    excerpt:
      'Ein Pladoyer fur Browser-Skizzen: kleine Seiten, eigene Regeln, sofort sichtbar und leicht teilbar.',
    tags: ['Creative Code', 'JavaScript'],
    body: [
      'Creative Code ist fur mich weniger Galerie als Skizzenbuch. Manche Ideen brauchen nur eine Leinwand, ein paar Regeln und einen Nachmittag.',
      'Die Projektliste dieser Website zeigt deshalb echte HTML-Previews. Man sieht sofort, wohin ein Projekt fuhrt, bevor man es offnet.',
      'Jede Projektseite kann spater komplett eigenes JavaScript enthalten, ohne dass die Blogstruktur davon beruhrt wird.',
    ],
  },
  {
    slug: 'was-ich-von-tools-erwarte',
    title: 'Was ich von Tools erwarte',
    date: '2026-04-18',
    readingTime: '5 min',
    excerpt:
      'Werkzeuge sollten ruhig starten, schnell antworten und einem nicht standig erklaren, wie wichtig sie sind.',
    tags: ['Tools', 'Opinion'],
    body: [
      'Ein gutes Werkzeug lasst mich in einen Zustand kommen, in dem ich mehr sehe als die Bedienung.',
      'Deshalb mag ich Oberflachen, die zuerst Arbeit zulassen und erst danach glanzen.',
      'Diese Website folgt derselben Idee: klare Navigation, lesbare Inhalte, schnelle Wege.',
    ],
  },
  {
    slug: 'publizieren-ohne-drama',
    title: 'Publizieren ohne Drama',
    date: '2026-04-03',
    readingTime: '3 min',
    excerpt:
      'Ein kurzer Text uber niedrige Huerden, gute Routinen und das beruhigende Gefuhl eines eigenen Ortes im Web.',
    tags: ['Writing', 'Web'],
    body: [
      'Regelmassiges Publizieren wird leichter, wenn die technische Schwelle niedrig bleibt.',
      'Eine eigene kleine Seite ist nicht perfekt, aber sie gehort einem. Das ist schon viel.',
      'Der Rest darf wachsen: Kategorien, Suche, RSS, Archiv. Erst einmal muss der Ort funktionieren.',
    ],
  },
]

const projectFrames = {
  signalGrid: `
    <main class="signal-grid">
      <canvas id="field"></canvas>
      <div class="label">Signal Grid</div>
      <script>
        const canvas = document.getElementById('field');
        const ctx = canvas.getContext('2d');
        function draw(t = 0) {
          canvas.width = innerWidth;
          canvas.height = innerHeight;
          ctx.fillStyle = '#f7f7f2';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let y = 18; y < canvas.height; y += 18) {
            for (let x = 18; x < canvas.width; x += 18) {
              const wave = Math.sin((x + t) * 0.025) + Math.cos((y - t) * 0.03);
              ctx.fillStyle = wave > 0 ? '#050505' : '#d8d8d2';
              ctx.fillRect(x, y, 7 + wave * 2, 7 + wave * 2);
            }
          }
          requestAnimationFrame(draw);
        }
        draw();
      </script>
    </main>
  `,
  orbitLetters: `
    <main class="orbit-letters">
      <div class="word">CODE</div>
      <script>
        const root = document.querySelector('.orbit-letters');
        Array.from('creative').forEach((letter, index) => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.style.setProperty('--i', index);
          root.appendChild(span);
        });
      </script>
    </main>
  `,
  inkClock: `
    <main class="ink-clock">
      <div class="face">
        <div class="hand hour"></div>
        <div class="hand minute"></div>
        <div class="hand second"></div>
      </div>
      <script>
        const hands = document.querySelectorAll('.hand');
        function tick() {
          const d = new Date();
          hands[0].style.rotate = ((d.getHours() % 12) * 30 + d.getMinutes() / 2) + 'deg';
          hands[1].style.rotate = (d.getMinutes() * 6) + 'deg';
          hands[2].style.rotate = (d.getSeconds() * 6) + 'deg';
          requestAnimationFrame(tick);
        }
        tick();
      </script>
    </main>
  `,
  typeTerrain: `
    <main class="type-terrain">
      <div id="terrain"></div>
      <script>
        const terrain = document.getElementById('terrain');
        for (let i = 0; i < 90; i += 1) {
          const cell = document.createElement('b');
          cell.textContent = i % 3 === 0 ? '/' : i % 3 === 1 ? '-' : '\\\\';
          cell.style.setProperty('--d', (i % 15) * 0.06 + 's');
          terrain.appendChild(cell);
        }
      </script>
    </main>
  `,
  cursorPoster: `
    <main class="cursor-poster">
      <div class="poster">MOVE</div>
      <script>
        addEventListener('pointermove', (event) => {
          document.body.style.setProperty('--x', event.clientX / innerWidth - 0.5);
          document.body.style.setProperty('--y', event.clientY / innerHeight - 0.5);
        });
      </script>
    </main>
  `,
}

const projects = [
  {
    slug: 'signal-grid',
    title: 'Signal Grid',
    date: '2026-06-01',
    summary: 'Ein animiertes Punktfeld, das aus einfachen Sinuswellen ein grafisches Signal baut.',
    frame: projectFrames.signalGrid,
  },
  {
    slug: 'orbit-letters',
    title: 'Orbit Letters',
    date: '2026-05-20',
    summary: 'Typografie als Umlaufbahn: Buchstaben kreisen um ein festes Wortzentrum.',
    frame: projectFrames.orbitLetters,
  },
  {
    slug: 'ink-clock',
    title: 'Ink Clock',
    date: '2026-05-05',
    summary: 'Eine minimalistische Uhr mit schwarzen Linien und weicher Bewegung.',
    frame: projectFrames.inkClock,
  },
  {
    slug: 'type-terrain',
    title: 'Type Terrain',
    date: '2026-04-22',
    summary: 'Ein Terrain aus Zeichen, das nur mit Text, Verzogerung und Rhythmus arbeitet.',
    frame: projectFrames.typeTerrain,
  },
  {
    slug: 'cursor-poster',
    title: 'Cursor Poster',
    date: '2026-04-08',
    summary: 'Ein interaktives Poster, dessen Perspektive auf die Cursorposition reagiert.',
    frame: projectFrames.cursorPoster,
  },
]

const projectCss = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; overflow: hidden; }
  main { position: relative; min-height: 100vh; background: #f7f7f2; color: #050505; }
  .label { position: absolute; left: 18px; bottom: 18px; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; }
  .orbit-letters { display: grid; place-items: center; }
  .word { font-size: clamp(46px, 16vw, 110px); font-weight: 900; letter-spacing: .02em; }
  .orbit-letters span { position: absolute; font-size: 18px; font-weight: 800; animation: orbit 5s linear infinite; animation-delay: calc(var(--i) * -.36s); transform-origin: 0 96px; }
  @keyframes orbit { to { rotate: 360deg; } }
  .ink-clock { display: grid; place-items: center; }
  .face { width: min(66vw, 260px); aspect-ratio: 1; border: 3px solid #050505; border-radius: 50%; position: relative; }
  .face::after { content: ''; position: absolute; inset: 50%; width: 12px; height: 12px; translate: -50% -50%; background: #050505; border-radius: 50%; }
  .hand { position: absolute; left: 50%; bottom: 50%; width: 3px; height: 38%; background: #050505; transform-origin: bottom; }
  .minute { height: 43%; width: 2px; }
  .second { height: 45%; width: 1px; background: #e33f2f; }
  .type-terrain { display: grid; place-items: center; }
  #terrain { width: min(82vw, 520px); display: grid; grid-template-columns: repeat(15, 1fr); gap: 4px; font: 800 26px/1 ui-monospace, monospace; }
  #terrain b { animation: rise 1.8s ease-in-out infinite alternate; animation-delay: var(--d); text-align: center; }
  @keyframes rise { to { transform: translateY(-18px); } }
  .cursor-poster { display: grid; place-items: center; perspective: 700px; }
  .poster { font-size: clamp(52px, 18vw, 132px); font-weight: 950; border: 4px solid #050505; padding: .1em .2em; transform: rotateX(calc(var(--y, 0) * -22deg)) rotateY(calc(var(--x, 0) * 28deg)); }
`

const navItems = [
  { label: 'Home', hash: '#/' },
  { label: 'Blog', hash: '#/blog' },
  { label: 'Creative Code', hash: '#/creative-code' },
  { label: 'About', hash: '#/about' },
]

const postsPerPage = 4
const projectsPerPage = 4

function tagToPath(tag) {
  return encodeURIComponent(tag.toLowerCase())
}

function pathToTag(pathTag) {
  return decodeURIComponent(pathTag)
}

function postHasTag(post, routeTag) {
  return post.tags.some((tag) => tag.toLowerCase() === routeTag.toLowerCase())
}

function formatDate(date) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash.replace(/^#/, '') || '/'
}

function Shell({ route, children }) {
  const activeSection = route.startsWith('/blog')
    ? '/blog'
    : route.startsWith('/creative-code')
      ? '/creative-code'
      : route

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
                activeSection === item.hash.replace('#', '') ? 'page' : undefined
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
  )
}

function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div>
          <p className="kicker">Personal Blog / Creative Code</p>
          <h1>Ein heller Ort fur Texte, Experimente und grafische Web-Skizzen.</h1>
        </div>
        <p>
          Essays, Notizen und kleine JavaScript-Projekte in einem klaren Bright-Mode
          Layout mit starken schwarzen Kontrasten.
        </p>
      </section>

      <section className="section-block">
        <SectionHeading
          title="Neu im Blog"
          actionLabel="Alle Beitrage"
          actionHref="#/blog"
        />
        <div className="post-grid">
          {posts.slice(0, 4).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeading
          title="Neu in Creative Code"
          actionLabel="Alle Projekte"
          actionHref="#/creative-code"
        />
        <div className="project-grid">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  )
}

function BlogListPage({ page, tag }) {
  const filteredPosts = tag ? posts.filter((post) => postHasTag(post, tag)) : posts
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  )
  const matchingTag = posts
    .flatMap((post) => post.tags)
    .find((postTag) => postTag.toLowerCase() === tag?.toLowerCase())
  const displayTag = matchingTag || tag
  const title = tag
    ? `Alle Beitrage mit dem Tag "${displayTag}".`
    : 'Texte, Notizen und Arbeitsgedanken.'
  const text = tag
    ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'Beitrag' : 'Beitrage'} in dieser Auswahl.`
    : 'Eine paginierte Beitragsliste, bereit fur langere Essays, kurze Updates und wiederverwendbare Detailseiten.'
  const paginationBase = tag
    ? `#/blog/tag/${tagToPath(displayTag)}/page/`
    : '#/blog/page/'

  return (
    <section className="listing-page">
      <PageIntro
        eyebrow={tag ? 'Blog / Tag' : 'Blog'}
        title={title}
        text={text}
      />
      {tag && (
        <a className="back-link" href="#/blog">
          Alle Beitrage anzeigen
        </a>
      )}
      <div className="post-list">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} featured />
        ))}
      </div>
      <Pagination
        base={paginationBase}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  )
}

function BlogPostPage({ post }) {
  if (!post) return <NotFound />

  return (
    <article className="article-page">
      <a className="back-link" href="#/blog">
        Zuruck zum Blog
      </a>
      <header className="article-header">
        <p className="kicker">{formatDate(post.date)} / {post.readingTime}</p>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <a href={`#/blog/tag/${tagToPath(tag)}`} key={tag}>
              {tag}
            </a>
          ))}
        </div>
      </header>
      <div className="article-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}

function CreativeCodePage({ page }) {
  const totalPages = Math.ceil(projects.length / projectsPerPage)
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const visibleProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  )

  return (
    <section className="listing-page">
      <PageIntro
        eyebrow="Creative Code"
        title="Kleine Browser-Projekte mit eigener JavaScript-Logik."
        text="Jedes Projekt zeigt eine echte HTML-Preview und fuhrt auf eine eigene Projektseite."
      />
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <Pagination
        base="#/creative-code/page/"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  )
}

function ProjectPage({ project }) {
  if (!project) return <NotFound />

  return (
    <article className="project-page">
      <a className="back-link" href="#/creative-code">
        Zuruck zu Creative Code
      </a>
      <PageIntro
        eyebrow={formatDate(project.date)}
        title={project.title}
        text={project.summary}
      />
      <ProjectPreview project={project} large />
    </article>
  )
}

function AboutPage() {
  return (
    <section className="about-page">
      <PageIntro
        eyebrow="About"
        title="Ein personlicher Ort fur Web, Gestaltung und Experimente."
        text="Diese Seite verbindet Blog und Creative-Code-Archiv: klare Texte, kleine Projekte und genug Struktur, um regelmassig weiterzuschreiben."
      />
      <div className="about-grid">
        <div>
          <h2>Worum es hier geht</h2>
          <p>
            Ich sammle hier Gedanken zu Interfaces, Programmierung, Schreibprozessen
            und digitalen Werkzeugen. Die Seite ist bewusst schlank gehalten, damit
            neue Inhalte schnell entstehen konnen.
          </p>
        </div>
        <div>
          <h2>Wie es aufgebaut ist</h2>
          <p>
            Blogposts und Creative-Code-Projekte liegen als Daten im React-Code.
            Daraus entstehen Startseite, Listen, Pagination und Detailseiten.
          </p>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({ title, actionLabel, actionHref }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <a href={actionHref}>{actionLabel}</a>
    </div>
  )
}

function PageIntro({ eyebrow, title, text }) {
  return (
    <header className="page-intro">
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  )
}

function PostCard({ post, featured = false }) {
  return (
    <article className={featured ? 'post-card post-card-wide' : 'post-card'}>
      <a href={`#/blog/${post.slug}`}>
        <div className="card-meta">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </a>
    </article>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <ProjectPreview project={project} />
      <div className="project-copy">
        <div className="card-meta">
          <span>{formatDate(project.date)}</span>
          <span>HTML / JS</span>
        </div>
        <h3>
          <a href={`#/creative-code/${project.slug}`}>{project.title}</a>
        </h3>
        <p>{project.summary}</p>
      </div>
    </article>
  )
}

function ProjectPreview({ project, large = false }) {
  const srcDoc = useMemo(
    () => `<!doctype html><html><head><style>${projectCss}</style></head><body>${project.frame}</body></html>`,
    [project.frame],
  )

  if (large) {
    return (
      <div className="project-preview project-preview-large">
        <iframe title={`${project.title} Preview`} srcDoc={srcDoc} />
      </div>
    )
  }

  return (
    <a className="project-preview" href={`#/creative-code/${project.slug}`} aria-label={`${project.title} offnen`}>
      <iframe title={`${project.title} Preview`} srcDoc={srcDoc} />
    </a>
  )
}

function Pagination({ base, currentPage, totalPages }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1
        return (
          <a
            aria-current={page === currentPage ? 'page' : undefined}
            href={page === 1 ? base.replace('/page/', '') : `${base}${page}`}
            key={page}
          >
            {page}
          </a>
        )
      })}
    </nav>
  )
}

function NotFound() {
  return (
    <section className="not-found">
      <PageIntro
        eyebrow="404"
        title="Diese Seite gibt es noch nicht."
        text="Der Link zeigt auf keinen vorhandenen Beitrag oder kein vorhandenes Projekt."
      />
      <a className="button-link" href="#/">
        Zur Startseite
      </a>
    </section>
  )
}

function getPageFromRoute(route, prefix) {
  const value = Number(route.replace(prefix, ''))
  return Number.isFinite(value) && value > 0 ? value : 1
}

function App() {
  const route = useRoute()
  const cleanRoute = route.replace(/\/$/, '') || '/'
  let page = <HomePage />

  if (cleanRoute === '/blog') {
    page = <BlogListPage page={1} />
  } else if (cleanRoute.startsWith('/blog/page/')) {
    page = <BlogListPage page={getPageFromRoute(cleanRoute, '/blog/page/')} />
  } else if (cleanRoute.startsWith('/blog/tag/') && cleanRoute.includes('/page/')) {
    const [tagPath, pagePath] = cleanRoute.replace('/blog/tag/', '').split('/page/')
    page = <BlogListPage page={Number(pagePath) || 1} tag={pathToTag(tagPath)} />
  } else if (cleanRoute.startsWith('/blog/tag/')) {
    page = <BlogListPage page={1} tag={pathToTag(cleanRoute.replace('/blog/tag/', ''))} />
  } else if (cleanRoute.startsWith('/blog/')) {
    page = <BlogPostPage post={posts.find((post) => `/blog/${post.slug}` === cleanRoute)} />
  } else if (cleanRoute === '/creative-code') {
    page = <CreativeCodePage page={1} />
  } else if (cleanRoute.startsWith('/creative-code/page/')) {
    page = (
      <CreativeCodePage page={getPageFromRoute(cleanRoute, '/creative-code/page/')} />
    )
  } else if (cleanRoute.startsWith('/creative-code/')) {
    page = (
      <ProjectPage
        project={projects.find((project) => `/creative-code/${project.slug}` === cleanRoute)}
      />
    )
  } else if (cleanRoute === '/about') {
    page = <AboutPage />
  } else if (cleanRoute !== '/') {
    page = <NotFound />
  }

  return <Shell route={cleanRoute}>{page}</Shell>
}

export default App
