import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { InfinityTable, TablePaginationFooter } from "@/common/table";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        accessorKey: "photoUrl",
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

  const {
    getRowModel,
    getHeaderGroups,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
  } = useTable<VehiclePublic>({
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
