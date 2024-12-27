import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shouldExcludeFile = (filename: string): boolean => {
  const excludePatterns = [
    /^public\//, // public folder
    /package-lock\.json$/, // npm
    /yarn\.lock$/, // yarn
    /pnpm-lock\.yaml$/, // pnpm
    /\.lock$/, // generic lock files
    /\.(woff2?|ttf|eot|otf)$/, // font files
    /\.ico$/, // ico files
  ]

  return excludePatterns.some((pattern) => pattern.test(filename))
}
