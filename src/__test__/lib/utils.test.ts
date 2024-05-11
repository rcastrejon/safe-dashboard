import {
  NetworkError,
  clearSessionFromLocalStorage,
  cn,
  customTitleHandler,
  fetchApi,
  getSessionFromLocalStorage,
  handleFormError,
  setSessionInLocalStorage,
} from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("cn helper", () => {
  it("should concatonate classes", () => {
    const classes = cn("block", "text-sm");
    expect(classes).toBe("block text-sm");
  });

  it("should not duplicate classes", () => {
    const classes = cn("block", "block", "block");
    expect(classes).toBe("block");
  });
});

describe("customTitleHandler helper", () => {
  it('should return "S.A.F.E." when autoGeneratedTitle has only one section', () => {
    const autoGeneratedTitle = "S.A.F.E.";
    const result = customTitleHandler({ autoGeneratedTitle });
    expect(result).toBe("S.A.F.E.");
  });

  it('should return the modified title with "| S.A.F.E." appended when autoGeneratedTitle has multiple sections', () => {
    const autoGeneratedTitle = "Some Title | S.A.F.E.";
    const result = customTitleHandler({ autoGeneratedTitle });
    expect(result).toBe("Some Title | S.A.F.E.");
  });

  it('should remove the leading "#{string}" and any subsequent whitespace from the first section if present', () => {
    const autoGeneratedTitle = "#123 Some Title | S.A.F.E.";
    const result = customTitleHandler({ autoGeneratedTitle });
    expect(result).toBe("Some Title | S.A.F.E.");
  });

  it("should handle empty string autoGeneratedTitle", () => {
    const autoGeneratedTitle = "";
    const result = customTitleHandler({ autoGeneratedTitle });
    expect(result).toBe("S.A.F.E.");
  });

  it('should handle autoGeneratedTitle with only one section and leading "#{string}"', () => {
    const autoGeneratedTitle = "#123";
    const result = customTitleHandler({ autoGeneratedTitle });
    expect(result).toBe("S.A.F.E.");
  });
});

describe("setSessionInLocalStorage", () => {
  it("should set the session token in localStorage", () => {
    const session = "test-session";
    setSessionInLocalStorage(session);
    expect(localStorage.getItem(import.meta.env.VITE_SESSION_TOKEN_KEY)).toBe(
      session,
    );
  });
});

describe("getSessionFromLocalStorage", () => {
  it("should return the session token from localStorage", () => {
    const session = "test-session";
    localStorage.setItem(import.meta.env.VITE_SESSION_TOKEN_KEY, session);
    expect(getSessionFromLocalStorage()).toBe(session);
  });

  it("should return null if no session token is present in localStorage", () => {
    localStorage.removeItem(import.meta.env.VITE_SESSION_TOKEN_KEY);
    expect(getSessionFromLocalStorage()).toBeNull();
  });
});

describe("clearSessionFromLocalStorage", () => {
  it("should remove the session token from localStorage", () => {
    localStorage.setItem(
      import.meta.env.VITE_SESSION_TOKEN_KEY,
      "test-session",
    );
    clearSessionFromLocalStorage();
    expect(
      localStorage.getItem(import.meta.env.VITE_SESSION_TOKEN_KEY),
    ).toBeNull();
  });
});

describe("NetworkError", () => {
  it("should create a NetworkError instance with the correct properties", () => {
    const error = {
      message: "Error message",
      statusCode: -1,
      errors: { field: "Field error" },
    };
    const networkError = new NetworkError(error);
    expect(networkError.message).toBe(error.message);
    expect(networkError.name).toBe("Network Error");
    expect(networkError.statusCode).toBe(error.statusCode);
    expect(networkError.errors).toEqual(error.errors);
  });
});

describe("fetchApi", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: "test-data" }),
      } as Response),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send a request with the correct headers", async () => {
    const session = "test-session";
    localStorage.setItem(import.meta.env.VITE_SESSION_TOKEN_KEY, session);
    await fetchApi("https://example.com");
    expect(global.fetch).toHaveBeenCalledWith("https://example.com", {
      headers: expect.anything(),
    });
  });

  it("should return the response data", async () => {
    const data = await fetchApi("https://example.com");
    expect(data).toEqual({ data: "test-data" });
  });

  it("should reject with a validation error for status code 422", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({ error: { field: "Field validation error" } }),
      } as Response),
    );
    await expect(fetchApi("https://example.com")).rejects.toEqual({
      message:
        "There are validation errors in the form. Please check the fields.",
      statusCode: 422,
      errors: { field: "Field validation error" },
    });
  });

  it("should reject with a HttpError for other errors", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      } as Response),
    );
    await expect(fetchApi("https://example.com")).rejects.toEqual({
      message: "Server error",
      statusCode: 500,
    });
  });

  it("should reject with a NetworkError for network errors", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.reject(new Error("Network error")),
    );
    await expect(fetchApi("https://example.com")).rejects.toBeInstanceOf(
      NetworkError,
    );
  });
});

describe("handleFormError", () => {
  it("returns the correct OpenNotificationParams for network error", () => {
    const error: HttpError = {
      message: "Network error message",
      statusCode: -1,
    };

    const result = handleFormError(error, undefined);

    expect(result).toEqual({
      key: "network-error",
      message: "Network Error",
      description: error.message,
      type: "error",
    });
  });

  it("returns false when errors is an empty object", () => {
    const error: HttpError = {
      message: "Error message",
      statusCode: 400,
      errors: {},
    };

    const result = handleFormError(error, "resource");

    expect(result).toBe(false);
  });

  it("returns the correct OpenNotificationParams for validation error", () => {
    const error: HttpError = {
      message: "Error message",
      statusCode: 400,
      errors: {
        field: "Field validation error",
      },
    };

    const result = handleFormError(error, "resource");

    expect(result).toEqual({
      key: "form-error-field",
      message: "Could not create resource",
      description: "Field validation error",
      type: "error",
    });
  });

  it("returns false when errors.field is not a string", () => {
    const error: HttpError = {
      message: "Error message",
      statusCode: 400,
      errors: {
        // @ts-expect-error Testing invalid error
        field: { nestedError: "Nested error" },
      },
    };

    const result = handleFormError(error, "resource");

    expect(result).toBe(false);
  });

  it("returns the correct OpenNotificationParams for string error", () => {
    const error: HttpError = {
      message: "Error message",
      statusCode: 400,
      // @ts-expect-error Testing invalid error
      errors: "String error",
    };

    const result = handleFormError(error, undefined);

    expect(result).toEqual({
      key: "form-error-String error",
      message: "An error occurred",
      description: error.message,
      type: "error",
    });
  });
});
