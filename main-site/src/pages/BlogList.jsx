import PageIntro from "../PageIntro";
import Pagination from "../composables/Pagination";
import PostCard from "../composables/PostCard";
import { posts } from "../content/posts";

const postsPerPage = 4;

export default function BlogListPage({ page }) {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const visiblePosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  return (
    <section className="listing-page">
      <PageIntro
        eyebrow="Blog"
        title="Texte, Notizen und Arbeitsgedanken."
        text="Eine paginierte Beitragsliste, bereit fur langere Essays, kurze Updates und wiederverwendbare Detailseiten."
      />
      <div className="post-list">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} featured />
        ))}
      </div>
      <Pagination
        base="#/blog/page/"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
