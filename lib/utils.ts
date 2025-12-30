import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status: string | null) {
  if(status === 'success') return "bg-emerald-500";
  if(status === 'failed') return "bg-red-500";
  if (!status) return "bg-gray-500"
  const code = Number.parseInt(status)
  if (code >= 200 && code < 300) return "bg-emerald-500"
  if (code >= 400 && code < 500) return "bg-amber-500"
  if (code >= 500) return "bg-red-500"
  return "bg-blue-500"
}

export function getMethodColor(method: string | null) {
  switch (method) {
    case "GET":
      return "bg-blue-500/10 text-blue-400"
    case "POST":
      return "bg-emerald-500/10 text-emerald-400"
    case "PUT":
      return "bg-amber-500/10 text-amber-400"
    case "DELETE":
      return "bg-red-500/10 text-red-400"
    case "PATCH":
      return "bg-purple-500/10 text-purple-400"
    default:
      return "bg-gray-500/10 text-gray-400"
  }
}
