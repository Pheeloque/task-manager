interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <button type="button" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages} ({total} total)
      </span>
      <button type="button" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
