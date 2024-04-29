import { RowActionMenuItem, RowActionsRoot } from "@/common/row-actions";
import { InfinityTable, TablePaginationFooter } from "@/common/table";
import { useClipboard } from "@/common/use-clipboard";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvitationPublic } from "@/lib/types/invitation";
import { useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";

export function Invitations() {
  const { copy } = useClipboard();
  const { mutate: deleteOne } = useDelete();
  const columns = useMemo<ColumnDef<InvitationPublic>[]>(
    () => [
      {
        header: "Code",
        accessorKey: "id",
      },
      {
        header: "User ID",
        accessorKey: "userId",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const invitation = row.original;
          return (
            <RowActionsRoot>
              <RowActionMenuItem
                onClick={() =>
                  copy(invitation.id, {
                    id: `copy-invitation-${invitation.id}`,
                    message: "Invitation code copied to clipboard.",
                  })
                }
              >
                Copy invitation code
              </RowActionMenuItem>
              <RowActionMenuItem
                onClick={() =>
                  deleteOne({
                    resource: "invitations",
                    id: invitation.id,
                    mutationMode: "undoable",
                    undoableTimeout: import.meta.env.VITE_UNDOABLE_TIMEOUT_MS,
                  })
                }
              >
                Delete
              </RowActionMenuItem>
            </RowActionsRoot>
          );
        },
      },
    ],
    [deleteOne, copy],
  );

  const {
    getRowModel,
    getHeaderGroups,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
  } = useTable<InvitationPublic>({
    refineCoreProps: {
      resource: "invitations",
      pagination: {
        mode: "client",
      },
      filters: {
        mode: "off",
      },
      sorters: {
        mode: "off",
      },
    },
    columns,
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <h3 className="font-semibold text-2xl leading-none tracking-tight">
          Invitations
        </h3>
        <Button className="font-normal" size="sm">
          <CirclePlus className="mr-2 h-4 w-4" /> Add Invitation
        </Button>
      </div>
      <div className="flow-root">
        <InfinityTable>
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-muted/40 sm:last:pr-6 sm:first:pl-6"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="sm:last:pr-6 sm:first:pl-6"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </InfinityTable>
        <TablePaginationFooter
          canNextPage={getCanNextPage()}
          nextPage={nextPage}
          canPreviousPage={getCanPreviousPage()}
          previousPage={previousPage}
        />
      </div>
    </>
  );
}
