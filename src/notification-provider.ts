import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open: ({
    message,
    description,
    key,
    type,
    cancelMutation,
    undoableTimeout,
  }) => {
    switch (type) {
      case "success":
      case "error":
        toast(message, {
          id: key,
          description,
        });
        break;
      case "progress":
        toast(message, {
          description,
          action: {
            label: "Undo",
            onClick: () => cancelMutation?.(),
          },
          duration: undoableTimeout && undoableTimeout * 1000,
        });
        break;
    }
  },
  close: (key) => {
    toast.dismiss(key);
  },
};
