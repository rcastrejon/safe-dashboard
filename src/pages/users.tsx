import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { InfinityTable, TablePaginationFooter } from "@/common/table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserPublic } from "@/lib/types/user";
import { useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";

export function UsersPage() {
  const { mutate: deleteOne } = useDelete();
  const columns = useMemo<ColumnDef<UserPublic>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Registration date",
        accessorKey: "registrationDate",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <RowActionsRoot>
              <RowActionsMenuItem
                onClick={() =>
                  deleteOne({
                    resource: "users",
                    id: user.id,
                    mutationMode: "undoable",
                    undoableTimeout: import.meta.env.VITE_UNDOABLE_TIMEOUT_MS,
                  })
                }
              >
                Delete
              </RowActionsMenuItem>
            </RowActionsRoot>
          );
        },
      },
    ],
    [deleteOne],
  );

  const {
    getRowModel,
    getHeaderGroups,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
  } = useTable<UserPublic>({
    refineCoreProps: {
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
          Users
        </h3>
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
