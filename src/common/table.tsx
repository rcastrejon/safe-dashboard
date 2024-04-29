import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";

export function InfinityTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="rounded-none border-y bg-card text-card-foreground shadow-sm sm:rounded-lg sm:border-x">
        <Table>{children}</Table>
      </div>
    </div>
  );
}

export function TablePaginationFooter({
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
}: {
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
}) {
  return (
    <div className="flex items-center justify-end space-x-3 py-3">
      <Button
        variant="outline"
        size="sm"
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={nextPage}
        disabled={!canNextPage}
      >
        Next
      </Button>
    </div>
  );
}
