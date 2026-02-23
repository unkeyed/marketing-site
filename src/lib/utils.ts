import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitLeadSentence(text: string) {
  const splitIndex = text.indexOf(". ");
  if (splitIndex === -1) {
    return { lead: text, rest: "" };
  }
  return {
    lead: text.slice(0, splitIndex + 1),
    rest: text.slice(splitIndex + 2),
  };
}
