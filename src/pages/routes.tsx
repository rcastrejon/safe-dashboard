import {
  InfinityTable,
  SimpleReactTableBody,
  SimpleReactTableHeader,
  TablePaginationFooter,
} from "@/common/infinity-table";
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead } from "@/components/ui/table";
import type { RoutePublic } from "@/lib/types/route";
import { useDelete, useGo } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function RoutesPage() {
  const go = useGo();
  const { mutate: deleteOne } = useDelete();
  const columns = useMemo<ColumnDef<RoutePublic>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Drive date",
        accessorKey: "driveDate",
      },
      {
        header: "Destination",
        cell: ({ row: { original } }) => {
          const coords = `${original.endLatitude}, ${original.endLongitude}`;
          return <span>{coords}</span>;
        },
      },
      {
        header: "Driver",
        accessorKey: "assignment.driver.name",
      },
      {
        header: "Vehicle",
        cell: ({ row: { original } }) => {
          const vehicle = `${original.assignment.vehicle.make} ${original.assignment.vehicle.model}`;
          return <span>{vehicle}</span>;
        },
      },
      {
        header: "Registration date",
        accessorKey: "registrationDate",
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const route = row.original;
          return (
            <RowActionsRoot>
              <RowActionsMenuItem
                onClick={() =>
                  go({
                    to: {
                      action: "edit",
                      resource: "routes",
                      id: route.id,
                    },
                  })
                }
              >
                Edit
              </RowActionsMenuItem>
              <RowActionsMenuItem
                onClick={() =>
                  deleteOne({
                    resource: "routes",
                    id: route.id,
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
    [deleteOne, go],
  );

  const table = useTable<RoutePublic>({
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
          Routes
        </h3>
        <Button className="font-normal" size="sm" asChild>
          <Link to="new">
            <CirclePlus className="mr-2 h-4 w-4" /> Add Route
          </Link>
        </Button>
      </div>
      <div className="flow-root">
        <InfinityTable>
          <SimpleReactTableHeader table={table}>
            {(header) => (
              <TableHead className="bg-muted/40 sm:last:pr-6 sm:first:pl-6">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            )}
          </SimpleReactTableHeader>
          <SimpleReactTableBody table={table}>
            {(cell) => (
              <TableCell className="sm:last:pr-6 sm:first:pl-6">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )}
          </SimpleReactTableBody>
        </InfinityTable>
        <TablePaginationFooter table={table} />
      </div>
    </>
  );
}
