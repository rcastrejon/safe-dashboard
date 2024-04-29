import type { DataProvider } from "@refinedev/core";
import { apiFetch } from "./lib/utils";

export const dataProvider = (url: string): DataProvider => ({
  getList: async ({ resource }) => {
    const response = await apiFetch(`/${resource}`);
    // biome-ignore lint/suspicious/noExplicitAny: satisfy the type requiried by DataProvider
    const { items }: { items: any[] } = await response.json();
    return {
      data: items,
      total: items.length,
    };
  },
  getOne: async () => {
    throw new Error("Not implemented");
  },
  create: async () => {
    throw new Error("Not implemented");
  },
  update: async () => {
    throw new Error("Not implemented");
  },
  deleteOne: async ({ resource, id }) => {
    const response = await apiFetch(`/${resource}/${id}`, {
      method: "DELETE",
    });
    return {
      data: await response.json(),
    };
  },
  getApiUrl: () => url,
});
