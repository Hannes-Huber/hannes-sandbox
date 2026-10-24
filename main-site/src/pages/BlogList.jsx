import PageIntro from "../PageIntro";
import Pagination from "../composables/Pagination";
import PostCard from "../composables/PostCard";
import { posts } from "../content/posts";
import {
  getDisplayTags,
  postHasAnyTag,
  tagsToPath,
  toggleTagSelection,
} from "../utils/tags";

const postsPerPage = 4;

function getFilterHref(tags) {
  return tags.length ? `#/blog/tag/${tagsToPath(tags)}` : "#/blog";
}

export default function BlogListPage({ page, selectedTags = [] }) {
  const hasSelectedTags = selectedTags.length > 0;
  const filteredPosts = hasSelectedTags
    ? posts.filter((post) => postHasAnyTag(post, selectedTags))
    : posts;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );
  const postTags = [...new Set(posts.flatMap((post) => post.tags))];
  const displayTags = getDisplayTags(posts, selectedTags);
  const displayTagList = displayTags.join(", ");
  const paginationBase = hasSelectedTags
    ? `#/blog/tag/${tagsToPath(displayTags)}/page/`
    : "#/blog/page/";

  return (
    <section className="listing-page">
      <PageIntro
        eyebrow={hasSelectedTags ? "Blog / Tags" : "Blog"}
        title={
          hasSelectedTags
            ? `Alle Beitrage mit: ${displayTagList}.`
            : "Texte, Notizen und Arbeitsgedanken."
        }
        text={
          hasSelectedTags
            ? `${filteredPosts.length} ${
                filteredPosts.length === 1 ? "Beitrag" : "Beitrage"
              } in dieser Auswahl. Weitere Tags verfeinern oder erweitern den Filter.`
            : "Eine paginierte Beitragsliste, bereit fur langere Essays, kurze Updates und wiederverwendbare Detailseiten."
        }
      />
      <div className="tag-row filter-bar">
        <a aria-current={!hasSelectedTags ? "page" : undefined} href="#/blog">
          Alle Beitrage
        </a>
        {postTags.map((filter) => (
          <a
            aria-current={
              selectedTags.some(
                (selectedTag) =>
                  selectedTag.toLowerCase() === filter.toLowerCase(),
              )
                ? "page"
                : undefined
            }
            href={getFilterHref(toggleTagSelection(displayTags, filter))}
            key={filter}
          >
            {filter}
          </a>
        ))}
      </div>
      <div className="post-list">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} featured />
        ))}
      </div>
      <Pagination
        base={paginationBase}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
