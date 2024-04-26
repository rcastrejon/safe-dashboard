import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open: ({ message, description, key }) => {
    toast(message, {
      id: key,
      description,
    });
  },
  close: (key) => {
    toast.dismiss(key);
  },
};
