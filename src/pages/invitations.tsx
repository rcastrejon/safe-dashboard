import {
  InfinityTable,
  SimpleReactTableBody,
  SimpleReactTableHeader,
  TablePaginationFooter,
} from "@/common/infinity-table";
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { useClipboard } from "@/common/use-clipboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell, TableHead } from "@/components/ui/table";
import type { InvitationPublic } from "@/lib/types/invitation";
import { handleFormError } from "@/lib/utils";
import { useDelete } from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
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
        header: "Created by",
        accessorKey: "user.email",
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const invitation = row.original;
          return (
            <RowActionsRoot>
              <RowActionsMenuItem
                onClick={() =>
                  copy(invitation.id, {
                    id: `copy-invitation-${invitation.id}`,
                    message: "Invitation code copied to clipboard.",
                  })
                }
              >
                Copy code
              </RowActionsMenuItem>
              <RowActionsMenuItem
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
              </RowActionsMenuItem>
            </RowActionsRoot>
          );
        },
      },
    ],
    [deleteOne, copy],
  );

  const table = useTable<InvitationPublic>({
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

  const {
    modal: { visible, show, close },
    saveButtonProps,
  } = useModalForm({
    refineCoreProps: {
      action: "create",
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <h3 className="font-semibold text-2xl leading-none tracking-tight">
          Invitations
        </h3>
        <Dialog
          open={visible}
          onOpenChange={() => (visible ? close() : show())}
        >
          <DialogTrigger asChild>
            <Button className="font-normal" size="sm">
              <CirclePlus className="mr-2 h-4 w-4" /> Add Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to create an invitation?
              </DialogTitle>
              <DialogDescription>
                Anyone with the invitation code will be able to register an
                account. Invitations can be deleted at any time before they are
                used.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" {...saveButtonProps}>
                Accept
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
