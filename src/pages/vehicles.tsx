import {
  InfinityTable,
  SimpleReactTableBody,
  SimpleReactTableHeader,
  TablePaginationFooter,
} from "@/common/infinity-table";
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead } from "@/components/ui/table";
import type { VehiclePublic } from "@/lib/types/vehicle";
import { useDelete, useGo } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function VehiclesPage() {
  const go = useGo();
  const { mutate: deleteOne } = useDelete();
  const columns = useMemo<ColumnDef<VehiclePublic>[]>(
    () => [
      {
        id: "photoUrl",
        header: () => <span className="sr-only">Photo</span>,
        cell: ({ row }) => (
          <img
            alt="Vehicle photo"
            className="aspect-square rounded-md object-cover"
            src={row.original.photoUrl}
            loading="lazy"
            decoding="async"
            height={64}
            width={64}
          />
        ),
      },
      {
        header: "Make",
        accessorKey: "make",
      },
      {
        header: "Model",
        accessorKey: "model",
      },
      {
        header: "License plate",
        accessorKey: "licensePlate",
      },
      {
        header: "Cost",
        accessorKey: "cost",
      },
      {
        header: "Registration date",
        accessorKey: "registrationDate",
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <RowActionsRoot>
              <RowActionsMenuItem
                onClick={() =>
                  go({
                    to: {
                      action: "edit",
                      resource: "vehicles",
                      id: vehicle.id,
                    },
                  })
                }
              >
                Edit
              </RowActionsMenuItem>
              <RowActionsMenuItem
                onClick={() =>
                  deleteOne({
                    resource: "vehicles",
                    id: vehicle.id,
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

  const table = useTable<VehiclePublic>({
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
          Vehicles
        </h3>
        <Button className="font-normal" size="sm" asChild>
          <Link to="new">
            <CirclePlus className="mr-2 h-4 w-4" /> Add Vehicle
          </Link>
        </Button>
      </div>
      <div className="flow-root">
        <InfinityTable>
          <SimpleReactTableHeader table={table}>
            {(header) => (
              <TableHead className="bg-muted/40 sm:first:w-[104px] first:min-w-[96px] sm:first:min-w-[104px] sm:last:pr-6 sm:first:pl-6">
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
