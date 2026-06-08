import PageIntro from "../PageIntro";

export default function NotFound() {
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
  );
}
