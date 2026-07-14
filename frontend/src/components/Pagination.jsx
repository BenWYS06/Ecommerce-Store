const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`h-10 w-10 border text-sm font-medium transition ${
            currentPage === page
              ? "border-black bg-black text-white"
              : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
