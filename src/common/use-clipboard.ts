import { useNotification } from "@refinedev/core";

export const useClipboard = () => {
  const { open } = useNotification();

  async function copy(
    text: string,
    toastParams: {
      id?: string;
      description?: string;
      message: string;
      type: "success" | "error" | "progress";
    },
  ): Promise<string | undefined> {
    try {
      await navigator.clipboard.writeText(text);
      open?.({
        key: toastParams.id,
        description: toastParams.description,
        message: toastParams.message,
        type: toastParams.type,
      });
      return toastParams.id;
    } catch (_e) {
      open?.({
        key: toastParams.id,
        message: "Error",
        description: "Access to the clipboard is not allowed on this device.",
        type: "error",
      });
    }
  }

  return {
    copy,
  };
};
