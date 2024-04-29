import type {
  Action,
  HttpError,
  IResourceItem,
  OpenNotificationParams,
} from "@refinedev/core";
import type { ValidationErrors } from "@refinedev/core/dist/contexts/data/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function customTitleHandler({
  autoGeneratedTitle,
}: {
  resource?: IResourceItem | undefined;
  action?: Action | undefined;
  params?: Record<string, string | undefined> | undefined;
  pathname?: string | undefined;
  autoGeneratedTitle: string;
}): string {
  const titleSections = autoGeneratedTitle.split(" | ");
  if (titleSections.length > 1)
    return `${titleSections.slice(0, -1)} | S.A.F.E.`;
  return "S.A.F.E.";
}

export function setSessionInLocalStorage(session: string): void {
  localStorage.setItem(import.meta.env.VITE_SESSION_TOKEN_KEY, session);
}

export function getSessionFromLocalStorage(): string | null {
  return localStorage.getItem(import.meta.env.VITE_SESSION_TOKEN_KEY);
}

export function clearSessionFromLocalStorage(): void {
  localStorage.removeItem(import.meta.env.VITE_SESSION_TOKEN_KEY);
}

export class NetworkError extends Error implements HttpError {
  statusCode: number;
  errors?: ValidationErrors;

  constructor(e: HttpError) {
    super(e.message);
    this.name = "Network Error";
    this.statusCode = e.statusCode;
    this.errors = e.errors;
  }
}

export async function apiFetch(
  endpoint: `/${string}`,
  init?: RequestInit,
): Promise<Response> {
  // TODO: Allow passing the api url to this function.

  // The env variable is injected by Vite is expected to not end with a slash,
  // so we remove it if it's there by using the URL constructor and then
  // getting the origin property.
  const apiURL = new URL(import.meta.env.VITE_API_ORIGIN);
  // Set the Authorization header if a session token is present in local
  // storage.
  const { headers: headersInit, ...rest } = init ?? {};
  const headers = new Headers(headersInit);
  const session = localStorage.getItem(import.meta.env.VITE_SESSION_TOKEN_KEY);
  if (session) {
    headers.set("Authorization", `Bearer ${session}`);
  }
  try {
    return await fetch(`${apiURL.origin}${endpoint}`, {
      headers,
      ...rest,
    });
  } catch (_) {
    throw new NetworkError({
      message: "Could not comunicate with the server",
      statusCode: -1,
    });
  }
}

/*
 * This function is used to handle form errors. The API returns CREATE errors
 * in two forms:
 *
 * 1. A string that is the error message.
 * 2. An object with the field name as the key and the error message as the
 * value.
 *
 * This function will return an object that can be used to display a notification
 * with the error message. If the error is not in the expected format, it will
 * return false, which means the error should be handled by the caller.
 */
export function handleFormError(
  error: HttpError,
  resource: string | undefined,
): OpenNotificationParams | false {
  if (error.statusCode === -1) {
    return {
      key: "network-error",
      message: "Network Error",
      description: error.message,
      type: "error",
    };
  }

  if (typeof error.errors === "string") {
    const message = resource
      ? `Could not create ${resource}`
      : "An error occurred";
    return {
      key: `form-error-${error.errors}`,
      message,
      description: error.errors,
      type: "error",
    };
  }
  // If the error is an object, we assume it's a validation error.
  // We get the first key and value from the object and use them to create
  // the notification.
  if (typeof error.errors === "object") {
    const field = Object.keys(error.errors)[0];
    if (!field) return false;
    const value = error.errors[field];
    if (typeof value !== "string") return false;

    return {
      key: `form-error-${field}`,
      message: `Could not create ${resource}`,
      description: value,
      type: "error",
    };
  }
  return false;
}
