import NotFound from "./NotFound";
import formatDate from "../utils/formatDate";

export default function BlogPostPage({ post }) {
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
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>
      <div className="article-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
