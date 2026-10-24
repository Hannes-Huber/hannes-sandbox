import ProjectCard from "../composables/ProjectCard";
import SectionHeading from "../composables/SectionHeading";
import PostCard from "../composables/PostCard";
import { posts } from "../content/posts";
import { projects } from "../content/projects";

export default function HomePage() {
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
  );
}
