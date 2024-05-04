import type { DataProvider } from "@refinedev/core";
import { NetworkError, apiFetch } from "./lib/utils";

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
  getOne: async ({ resource, id }) => {
    const response = await apiFetch(`/${resource}/${id}`);
    return {
      data: await response.json(),
    };
  },
  create: async ({ resource, variables, meta }) => {
    const response = await apiFetch(`/${resource}`, {
      method: "POST",
      body:
        variables instanceof FormData === true
          ? variables
          : JSON.stringify(variables),
      headers: meta?.headers ?? {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const json = await response.json();
      throw new NetworkError({
        message: "Failed to create the resource",
        statusCode: response.status,
        errors: json.error,
      });
    }
    return {
      data: await response.json(),
    };
  },
  update: async ({ resource, id, variables }) => {
    const response = await apiFetch(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const json = await response.json();
      throw new NetworkError({
        message: "Failed to update the resource",
        statusCode: response.status,
        errors: json.error,
      });
    }
    return {
      data: await response.json(),
    };
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
