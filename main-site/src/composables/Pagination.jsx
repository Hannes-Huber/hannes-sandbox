export default function Pagination({ base, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <a
            aria-current={page === currentPage ? "page" : undefined}
            href={page === 1 ? base.replace("/page/", "") : `${base}${page}`}
            key={page}
          >
            {page}
          </a>
        );
      })}
    </nav>
  );
}
