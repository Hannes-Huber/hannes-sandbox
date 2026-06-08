import PageIntro from "../PageIntro";
import NotFound from "../pages/NotFound";
import ProjectPreview from "./ProjectPreview";
import formatDate from "../utils/formatDate";

export default function ProjectPage({ project }) {
  if (!project) return <NotFound />;

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
  );
}
