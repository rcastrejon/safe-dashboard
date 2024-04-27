import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

type Invitation = {
  id: string;
  userId: string;
};

export function Invitations() {
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
    [deleteMutate],
  );

  const {
    getRowModel,
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>User ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
        </CardContent>
      </Card>
    </div>
  );
}
