/**
 * Converts a string to a URL-friendly slug, removing accents and special characters
 * @param str - The string to convert
 * @returns The generated slug
 */
export function stringToSlug(str: string): string {
	return str
		.normalize("NFD") // Normalize to decomposed form to separate accents
		.replace(/[\u0300-\u036f]/g, "") // Remove all accent marks
		.toLowerCase() // Convert to lowercase
		.trim() // Trim whitespace from both ends
		.replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
		.replace(/^-+/, "") // Remove leading hyphens
		.replace(/-+$/, ""); // Remove trailing hyphens
}
