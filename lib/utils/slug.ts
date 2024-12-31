/**
 * Convert any string to a valid URL slug
 * - Converts to lowercase
 * - Replaces invalid chars with hyphens
 * - Replaces multiple hyphens with single hyphen
 * - Removes leading/trailing hyphens
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9-]/g, "-") // Replace invalid chars with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
} 