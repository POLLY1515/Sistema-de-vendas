import { Button } from './Button';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = page <= 0;
  const isLastPage = page >= totalPages - 1;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <Button
        variant="secondary"
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>

      <span className="text-sm text-slate-600">
        Página {page + 1} de {totalPages}
      </span>

      <Button
        variant="secondary"
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
      </Button>
    </div>
  );
}
