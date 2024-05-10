import { InfinityTable, SimpleReactTableHeader } from "@/common/infinity-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import type { DriverPublic } from "@/lib/types/driver";
import type { RoutePublic } from "@/lib/types/route";
import type { UserPublic } from "@/lib/types/user";
import type { VehiclePublic } from "@/lib/types/vehicle";
import { useSelect } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

export function Dashboard() {
  const { options: userOptions } = useSelect<UserPublic>({
    resource: "users",
    optionLabel: "email",
    optionValue: "id",
  });
  const { options: driverOptions } = useSelect<DriverPublic>({
    resource: "drivers",
    optionLabel: "name",
    optionValue: "id",
  });
  const { options: vehicleOptions } = useSelect<VehiclePublic>({
    resource: "vehicles",
    optionLabel: "vin",
    optionValue: "id",
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader>
          <CardTitle>Total users</CardTitle>
        </CardHeader>
        <CardContent>{userOptions.length}</CardContent>
      </Card>
      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader>
          <CardTitle>Total drivers</CardTitle>
        </CardHeader>
        <CardContent>{driverOptions.length}</CardContent>
      </Card>
      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader>
          <CardTitle>Total vehicles</CardTitle>
        </CardHeader>
        <CardContent>{vehicleOptions.length}</CardContent>
      </Card>
      <div className="sm:col-span-3">
        <TodaysRoutesTable />
      </div>
    </div>
  );
}

function TodaysRoutesTable() {
  const today = format(new Date(), "yyyy-MM-dd");
  const columns = useMemo<ColumnDef<RoutePublic>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
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
    ],
    [],
  );

  const table = useTable<RoutePublic>({
    refineCoreProps: {
      resource: "routes",
      filters: {
        permanent: [
          {
            field: "driveDate",
            operator: "eq",
            value: "2024-05-09",
          },
        ],
      },
      pagination: {
        mode: "off",
      },
      sorters: {
        mode: "off",
      },
    },
    columns,
  });
  const { getRowModel } = table;

  return (
    <InfinityTable>
      <SimpleReactTableHeader table={table}>
        {(header) => (
          <TableHead className="bg-muted/40 sm:last:pr-6 sm:first:pl-6">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        )}
      </SimpleReactTableHeader>
      <TableBody>
        {getRowModel()
          .rows.filter((row) => row.original.driveDate === today)
          .map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell className="sm:last:pr-6 sm:first:pl-6" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </InfinityTable>
  );
}
