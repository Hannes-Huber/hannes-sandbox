import formatDate from "../utils/formatDate";

export default function PostCard({ post, featured = false }) {
  return (
    <article className={featured ? "post-card post-card-wide" : "post-card"}>
      <a href={`#/blog/${post.slug}`}>
        <div className="card-meta">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </a>
    </article>
  );
}
