import type { DataProvider } from "@refinedev/core";
import qs from "query-string";
import { fetchApi } from "./lib/utils";

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource }) => {
    const { items: data } = await fetchApi(`${apiUrl}/${resource}`);
    return {
      data,
      total: data.length,
    };
  },
  getOne: async ({ resource, id }) => {
    const data = await fetchApi(`${apiUrl}/${resource}/${id}`);
    return {
      data,
    };
  },
  create: async ({ resource, variables, meta }) => {
    const formData = variables instanceof FormData ? variables : undefined;

    const data = await fetchApi(`${apiUrl}/${resource}`, {
      method: "POST",
      body: formData ?? JSON.stringify(variables),
      headers: meta?.headers ?? {
        "Content-Type": "application/json",
      },
    });
    return {
      data,
    };
  },
  update: async ({ resource, id, variables }) => {
    const data = await fetchApi(`${apiUrl}/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      data,
    };
  },
  deleteOne: async ({ resource, id }) => {
    const data = await fetchApi(`${apiUrl}/${resource}/${id}`, {
      method: "DELETE",
    });
    return {
      data,
    };
  },
  getApiUrl: () => apiUrl,
  custom: async ({ url, method, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (query) {
      requestUrl = `${requestUrl}&${qs.stringify(query)}`;
    }

    let data;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        data = await fetchApi(url, {
          body: JSON.stringify(payload),
          method: method.toUpperCase(),
          headers,
        });
        break;
      case "delete":
        data = await fetchApi(url, {
          method: "DELETE",
          body: payload && JSON.stringify(payload),
          headers,
        });
        break;
      default:
        data = await fetchApi(url, {
          method: "GET",
          headers,
        });
        break;
    }

    return { data };
  },
});
