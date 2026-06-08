export default function SectionHeading({ title, actionLabel, actionHref }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <a href={actionHref}>{actionLabel}</a>
    </div>
  );
}
