import { useClipboard } from "@/common/use-clipboard";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

type Invitation = {
  id: string;
  userId: string;
};

export function Invitations() {
  const { copy } = useClipboard();
  const { mutate: deleteMutate } = useDelete();
  const columns = useMemo<ColumnDef<Invitation>[]>(
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    copy(invitation.id, {
                      id: `copy-invitation-${invitation.id}`,
                      message: "Invitation code copied to clipboard.",
                      type: "success",
                    })
                  }
                >
                  Copy invitation code
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteMutate({
                      resource: "invitations",
                      id: invitation.id,
                      mutationMode: "undoable",
                      undoableTimeout: import.meta.env.VITE_UNDOABLE_TIMEOUT_MS,
                    })
                  }
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [deleteMutate, copy],
  );

  const {
    getRowModel,
    getHeaderGroups,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
  } = useTable<Invitation>({
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
        <CardTitle>Invitations</CardTitle>
        <Button className="font-normal" size="sm">
          <CirclePlus className="mr-2 h-4 w-4" /> Add Invitation
        </Button>
      </div>
      <div className="flow-root">
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <div className="rounded-none border-y bg-card text-card-foreground shadow-sm sm:rounded-lg sm:border-x">
            <Table>
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
