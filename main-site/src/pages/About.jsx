import PageIntro from "../PageIntro";

export default function AboutPage() {
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
            Ich sammle hier Gedanken zu Interfaces, Programmierung,
            Schreibprozessen und digitalen Werkzeugen. Die Seite ist bewusst
            schlank gehalten, damit neue Inhalte schnell entstehen konnen.
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
  );
}
