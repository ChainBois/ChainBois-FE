
/**
 * Capitalize the first letter of a given string.
 * If the input value is not a string or is empty, it will be returned unchanged.
 *
 * @param {string} value - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export function capitalizeFirstLetter(value) {
	if (typeof value === 'string' && value.length > 0) {
		return value.charAt(0).toUpperCase() + value.slice(1)
	}
	return value
}
