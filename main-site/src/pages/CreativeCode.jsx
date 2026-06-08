import PageIntro from "../PageIntro";
import Pagination from "../composables/Pagination";
import ProjectCard from "../composables/ProjectCard";
import { projects } from "../content/projects";

const projectsPerPage = 4;

export default function CreativeCodePage({ page }) {
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const visibleProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

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
  );
}
