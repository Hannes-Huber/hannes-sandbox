import NotFound from "./NotFound";
import formatDate from "../utils/formatDate";
import { tagToPath } from "../utils/tags";
import useWordPressContent from "../content/useWordPressContent";

export default function BlogPostPage({ slug }) {
  const { posts, status, error } = useWordPressContent();
  const post = posts.find((item) => item.slug === slug);
  if (status === "loading") return <section className="article-page">Beitrag wird geladen …</section>;
  if (status !== "ready") return <section className="article-page">{error || "WordPress ist nicht konfiguriert. Bitte VITE_WORDPRESS_API_URL setzen."}</section>;
  if (!post) return <NotFound />;

  return (
    <article className="article-page">
      <a className="back-link" href="#/blog">
        Zuruck zum Blog
      </a>
      <header className="article-header">
        <p className="kicker">
          {formatDate(post.date)} / {post.readingTime}
        </p>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <a href={`#/blog/tag/${tagToPath(tag)}`} key={tag}>
              {tag}
            </a>
          ))}
        </div>
      </header>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
