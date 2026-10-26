import NotFound from "./NotFound";
import useWordPressContent from "../content/useWordPressContent";

export default function WordPressPage({ slug }) {
  const { pages, status, error } = useWordPressContent();
  if (status === "loading") return <section className="article-page">Seite wird geladen …</section>;
  if (status !== "ready") return <section className="article-page">{error || "WordPress ist nicht konfiguriert. Bitte VITE_WORDPRESS_API_URL setzen."}</section>;

  const page = pages.find((item) => item.slug === slug);
  if (!page) return <NotFound />;

  return (
    <article className="article-page wordpress-page">
      <a className="back-link" href="#/">Zur Startseite</a>
      <header className="article-header"><h1>{page.title}</h1></header>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
