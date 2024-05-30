import { dataProvider } from "@/data-provider";
import * as utils from "@/lib/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("dataProvider", () => {
  const apiUrl = "https://api.example.com";
  const provider = dataProvider(apiUrl);

  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getList", () => {
    it("should fetch data and return formatted response", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({
        items: [1, 2, 3],
      });
      const response = await provider.getList({ resource: "posts" });
      expect(response).toEqual({ data: [1, 2, 3], total: 3 });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts`);
    });
  });

  describe("getOne", () => {
    it("should fetch a single resource and return formatted response", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({
        id: 1,
        title: "Post 1",
      });
      const response = await provider.getOne({ resource: "posts", id: "1" });
      expect(response).toEqual({ data: { id: 1, title: "Post 1" } });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts/1`);
    });
  });

  describe("create", () => {
    it("should create a new resource with JSON payload", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({
        id: 1,
        title: "New Post",
      });
      const response = await provider.create({
        resource: "posts",
        variables: { title: "New Post" },
      });
      expect(response).toEqual({ data: { id: 1, title: "New Post" } });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts`, {
        method: "POST",
        body: '{"title":"New Post"}',
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should create a new resource with FormData payload", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({
        id: 1,
        title: "New Post",
      });
      const formData = new FormData();
      formData.append("title", "New Post");
      const response = await provider.create({
        resource: "posts",
        variables: formData,
        meta: { headers: { "Content-Type": "multipart/form-data" } },
      });
      expect(response).toEqual({ data: { id: 1, title: "New Post" } });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    });
  });

  describe("update", () => {
    it("should update an existing resource", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({
        id: 1,
        title: "Updated Post",
      });
      const response = await provider.update({
        resource: "posts",
        id: "1",
        variables: { title: "Updated Post" },
      });
      expect(response).toEqual({ data: { id: 1, title: "Updated Post" } });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts/1`, {
        method: "PUT",
        body: '{"title":"Updated Post"}',
        headers: { "Content-Type": "application/json" },
      });
    });
  });

  describe("deleteOne", () => {
    it("should delete a resource", async () => {
      vi.spyOn(utils, "fetchApi").mockResolvedValueOnce({});
      const response = await provider.deleteOne({ resource: "posts", id: "1" });
      expect(response).toEqual({ data: {} });
      expect(utils.fetchApi).toHaveBeenCalledWith(`${apiUrl}/posts/1`, {
        method: "DELETE",
      });
    });
  });

  describe("getApiUrl", () => {
    it("should return the API URL", () => {
      expect(provider.getApiUrl()).toBe(apiUrl);
    });
  });

  describe("error handling", () => {
    it("should handle validation errors from fetchApi", async () => {
      vi.spyOn(utils, "fetchApi").mockRejectedValueOnce({
        message:
          "There are validation errors in the form. Please check the fields.",
        statusCode: 422,
        errors: { field: "Field validation error" },
      });

      await expect(
        provider.create({
          resource: "posts",
          variables: { title: "New Post" },
        }),
      ).rejects.toEqual({
        message:
          "There are validation errors in the form. Please check the fields.",
        statusCode: 422,
        errors: { field: "Field validation error" },
      });
    });

    it("should handle other errors from fetchApi", async () => {
      vi.spyOn(utils, "fetchApi").mockRejectedValueOnce({
        message: "Unexpected error",
        statusCode: 500,
      });

      await expect(
        provider.getOne({ resource: "posts", id: "1" }),
      ).rejects.toEqual({
        message: "Unexpected error",
        statusCode: 500,
      });
    });

    it("should handle network errors from fetchApi", async () => {
      vi.spyOn(utils, "fetchApi").mockRejectedValueOnce(
        new utils.NetworkError({
          message:
            "Could not comunicate with the server. Please try again later.",
          statusCode: -1,
        }),
      );

      await expect(
        provider.deleteOne({ resource: "posts", id: "1" }),
      ).rejects.toBeInstanceOf(utils.NetworkError);
    });
  });
});
