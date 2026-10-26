import ProjectCard from "../composables/ProjectCard";
import SectionHeading from "../composables/SectionHeading";
import PostCard from "../composables/PostCard";
import useWordPressContent from "../content/useWordPressContent";
import { projects } from "../content/projects";

export default function HomePage() {
  const { posts, pages, status } = useWordPressContent();
  return (
    <>
      <section className="home-hero">
        <div>
          <p className="kicker">Personal Blog / Creative Code</p>
          <h1>
            Ein heller Ort fur Texte, Experimente und grafische Web-Skizzen.
          </h1>
        </div>
        <p>
          Essays, Notizen und kleine JavaScript-Projekte in einem klaren
          Bright-Mode Layout mit starken schwarzen Kontrasten.
        </p>
      </section>

      {status === "ready" && pages.length > 0 && (
        <section className="section-block">
          <SectionHeading title="Seiten" />
          <div className="post-grid">
            {pages.map((page) => (
              <article className="post-card" key={page.id}>
                <a href={`#/pages/${page.slug}`}>
                  <h3>{page.title}</h3>
                  <p>Eigene Seite öffnen</p>
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section-block">
        <SectionHeading
          title="Neu im Blog"
          actionLabel="Alle Beitrage"
          actionHref="#/blog"
        />
        <div className="post-grid">
          {status === "ready" && posts.slice(0, 4).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {status === "loading" && <p>Beiträge werden geladen …</p>}
          {status === "error" && <p>WordPress-Beiträge konnten nicht geladen werden.</p>}
          {status === "unconfigured" && <p>WordPress ist noch nicht konfiguriert.</p>}
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
  );
}
