import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-rendi-500";
  if (score >= 40) return "text-amber-500";
  return "text-coral-500";
}

export function getScoreRingColor(score: number): string {
  if (score >= 70) return "stroke-rendi-500";
  if (score >= 40) return "stroke-amber-400";
  return "stroke-coral-400";
}

export function getStatusBadgeClass(status: string): string {
  if (status === "Nearly ready" || status === "Strong position")
    return "bg-rendi-50 text-rendi-700 border-rendi-200";
  if (status === "Getting closer" || status === "Getting there")
    return "bg-amber-50 text-yellow-700 border-yellow-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export function getLabelColor(label: string): string {
  if (label === "Strong" || label === "Low impact") return "text-rendi-600";
  if (label === "Okay" || label === "Getting there") return "text-amber-600";
  if (label === "Not provided") return "text-gray-400";
  return "text-coral-500";
}

export function extractApiError(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong.";
  const err = error as { response?: { data?: Record<string, unknown> } };
  const data = err.response?.data;
  if (!data) return "Something went wrong.";
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  // Field errors — return first one
  const firstKey = Object.keys(data)[0];
  const firstVal = data[firstKey];
  if (Array.isArray(firstVal) && typeof firstVal[0] === "string") {
    return `${firstKey}: ${firstVal[0]}`;
  }
  return "Something went wrong.";
}
