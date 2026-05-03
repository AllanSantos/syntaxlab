import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tokenize(phrase: string): string[] {
  return phrase.trim().split(/\s+/).filter(Boolean);
}

export function morphWord(from: string, to: string): string {
  return to;
}