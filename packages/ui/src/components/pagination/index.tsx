import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./pagination";

interface AppPaginationProps {
  page: number; // current page (1-based)
  pageSize: number;
  totalItems: number;

  onPageChange: (page: number) => void;

  siblingCount?: number; // pages around current page
  disabled?: boolean;
}

export function AppPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  siblingCount = 1,
  disabled = false,
}: AppPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const createPageRange = () => {
    const totalNumbers = siblingCount * 2 + 5;

    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const range: (number | "ellipsis")[] = [];

    range.push(1);

    if (showLeftEllipsis) range.push("ellipsis");

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (showRightEllipsis) range.push("ellipsis");

    if (totalPages !== 1) range.push(totalPages);

    return range;
  };
  const canGoPrev = page > 1 && !disabled;
  const canGoNext = page < totalPages && !disabled;
  console.log(canGoNext);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!canGoPrev}
            className={
              !canGoPrev
                ? "pointer-events-none opacity-50 bg-red-500 text-muted-foreground transition-none"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();
              if (canGoPrev) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {createPageRange().map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={!canGoNext}
            className={
              !canGoNext
                ? "pointer-events-none opacity-50 bg-red-500 text-muted-foreground transition-none"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();
              if (canGoNext) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
