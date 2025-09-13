/**
 * Trims a number to a specified number of decimal places with configurable rounding mode and optional trailing zero preservation.
 *
 * @param {number} num - The number to trim.
 * @param {Object} [options] - Configuration options.
 * @param {number} [options.decimals=2] - Number of decimal places to keep.
 * @param {'round'|'floor'|'ceil'} [options.roundingMode='round'] - Rounding mode to use.
 * @param {boolean} [options.preserveTrailingZeros=false] - Whether to preserve trailing zeros in the result.
 * @returns {number|string} The trimmed number, or a string if trailing zeros are preserved.
 */
export function trimDecimal(
	num,
	options = {
		decimals: 2,
		roundingMode: 'round', // 'round', 'floor', 'ceil'
		preserveTrailingZeros: false,
	}
) {
	const {
		decimals,
		roundingMode, // 'round', 'floor', 'ceil'
		preserveTrailingZeros,
	} = options

	// Input validation
	if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
		return num
	}

	const multiplier = Math.pow(10, decimals)
	let result

	switch (roundingMode) {
		case 'floor':
			result = Math.floor(num * multiplier) / multiplier
			break
		case 'ceil':
			result = Math.ceil(num * multiplier) / multiplier
			break
		case 'round':
		default:
			result = Math.round(num * multiplier) / multiplier
			break
	}

	if (preserveTrailingZeros) {
		return result.toFixed(decimals)
	}

	return result
}
