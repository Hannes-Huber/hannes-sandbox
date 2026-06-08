import { useMemo } from "react";
import { projectCss } from "../content/projects";

export default function ProjectPreview({ project, large = false }) {
  const srcDoc = useMemo(
    () =>
      `<!doctype html><html><head><style>${projectCss}</style></head><body>${project.frame}</body></html>`,
    [project.frame],
  );

  if (large) {
    return (
      <div className="project-preview project-preview-large">
        <iframe title={`${project.title} Preview`} srcDoc={srcDoc} />
      </div>
    );
  }

  return (
    <a
      className="project-preview"
      href={`#/creative-code/${project.slug}`}
      aria-label={`${project.title} offnen`}
    >
      <iframe title={`${project.title} Preview`} srcDoc={srcDoc} />
    </a>
  );
}
