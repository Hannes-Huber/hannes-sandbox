import formatDate from "../utils/formatDate";
import ProjectPreview from "./ProjectPreview";

export default function ProjectCard({ project }) {
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
  );
}
