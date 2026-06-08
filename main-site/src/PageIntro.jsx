export default function PageIntro({ eyebrow, title, text }) {
  return (
    <header className="page-intro">
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
