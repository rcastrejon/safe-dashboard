import type { Action, IResourceItem } from "@refinedev/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
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
}) {
  const titleSections = autoGeneratedTitle.split(" | ");
  if (titleSections.length > 1)
    return `${titleSections.slice(0, -1)} | S.A.F.E.`;
  return "S.A.F.E.";
}
