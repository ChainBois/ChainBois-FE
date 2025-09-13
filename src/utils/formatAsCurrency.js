// --- formatAsCurrency.js ---
import { trimDecimal } from './trimDecimal'
import { isNaN } from './isNaN'

/**
 * Unified method with format options
 * This combines the reliability of the math method with formatting options
 *
 * @param {number} num - The input number to be reduced
 * @param {object} options - Formatting options
 * @returns {object|string} Result based on format option
 */
function reduceNumber(num, options = {}) {
	const defaultOptions = {
		format: 'object', // 'object', 'string', 'scientific'
		stringTemplate: '{reduced} × 10^{power}',
		scientific: false, // If true, returns in scientific notation
		detectOnly: false, // If true, only detects if it's a multiple of 10
	}

	const opts = { ...defaultOptions, ...options }

	// Use the mathematical approach for reduction
	let n = Math.round(num)
	let powerOf10 = 0

	while (n % 10 === 0 && n !== 0) {
		n /= 10
		powerOf10++
	}

	const result = {
		original: num,
		reduced: n,
		powerOf10: powerOf10,
		isMultipleOf10: powerOf10 > 0,
	}

	// Return based on format option
	if (opts.detectOnly) {
		return result.isMultipleOf10
	}

	if (opts.format === 'string') {
		return opts.stringTemplate
			.replace('{reduced}', result.reduced)
			.replace('{power}', result.powerOf10)
			.replace('{original}', result.original)
	}

	if (opts.format === 'scientific' || opts.scientific) {
		return `${result.reduced}e${result.powerOf10}`
	}

	return result
}

/**
 * Format a number as currency with support for:
 * - Abbreviation (K, M, B)
 * - Scientific fallback
 * - RTL locale awareness (e.g. Arabic)
 * - Locale + currencyCode
 * - Tiny number visual precision
 * - asObject + scientific mode
 *
 * @param {Object} options
 * @returns {String|Object|any}
 */
export function formatAsCurrency({
	value = 0,
	depth = 1e6,
	dp = 2,
	includeBlankDecimals = false,
	trim = false,
	abbreviate = true,
	scientific = false,
	asObject = false,
	currencySymbol = '',
	currencyCode,
	locale = undefined,
} = {}) {
	try {
		includeBlankDecimals = Boolean(includeBlankDecimals)
		trim = Boolean(trim)
		abbreviate = Boolean(abbreviate)
		scientific = Boolean(scientific)
		asObject = Boolean(asObject)

		if (isNaN(value)) return value
		value = Number(value)
		if (!isFinite(value)) return value

		depth = Math.max(1, Number(depth) || 1e6)
		dp = Math.min(Math.max(0, dp), 100)

		// Handle scientific mode
		if (scientific) {
			const expStr = value.toExponential(dp)
			const result = currencySymbol ? currencySymbol + expStr : expStr
			return asObject ? { value, display: result } : result
		}

		// Handle tiny numbers (0.0000001 → 0.0{6}1x)
		const scientificStr = value.toExponential(20)
		const [_, exponent_] = scientificStr.split('e')
		const absExponent = Math.abs(exponent_)
		const dpMin = Number(
			'0.' + '0'.repeat(absExponent - (absExponent >= 2 ? 2 : 0)) + '1'
		)

		if (
			value > 0 &&
			absExponent >= (absExponent <= 4 ? 4 : dp) &&
			value < dpMin
		) {
			const exponentValue = parseInt(exponent_, 10)
			if (exponentValue < 0) {
				const leadingZerosCount = Math.abs(exponentValue) - 1
				const scaleFactor = Math.pow(10, leadingZerosCount + dp)
				const scaledValue = value * scaleFactor
				const reduced = reduceNumber(scaledValue)?.reduced ?? scaledValue
				const roundedMantissa = trimDecimal(reduced, { decimals: 0 })
				const significantDigits = roundedMantissa.toString().substring(0, dp)
				const tinyStr = `0.0{${leadingZerosCount}}${significantDigits}`
				const finalTiny = currencySymbol + tinyStr
				return asObject ? { value, display: finalTiny } : finalTiny
			}
		}

		// RTL handling (basic detection)
		const rtlLocales = ['ar', 'he', 'fa', 'ur']
		const dir =
			locale && rtlLocales.includes(locale.split('-')[0]) ? 'rtl' : 'ltr'

		// Abbreviation logic
		const lookup = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'K' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e9, symbol: 'B' },
			{ value: 1e12, symbol: 'T' },
			{ value: 1e15, symbol: 'P' },
			{ value: 1e18, symbol: 'E' },
		]

		const absValue = Math.abs(value)
		const trimmedValue = trimDecimal(value, { decimals: dp })
		let suffix = ''
		let exponent = 0

		if (abbreviate) {
			const item = lookup.findLast(
				(item) => trimmedValue >= item.value && item.value >= depth
			)
			if (item) {
				suffix = item.symbol
				exponent = Math.floor(Math.log10(item.value))
			}
		}

		let effectiveDp = dp
		if (abbreviate && trim && dp > 0 && absValue >= depth) {
			effectiveDp = 1
		}

		const scaledValue = exponent > 0 ? value / Math.pow(10, exponent) : value

		let result

		if (currencyCode) {
			const formatter = new Intl.NumberFormat(locale, {
				style: 'currency',
				currency: currencyCode,
				minimumFractionDigits: includeBlankDecimals ? effectiveDp : 0,
				maximumFractionDigits: effectiveDp,
			})
			result = formatter.format(scaledValue) + suffix
		} else {
			result = trimDecimal(scaledValue, {
				decimals: effectiveDp,
			}).toLocaleString(locale, {
				minimumFractionDigits: includeBlankDecimals ? effectiveDp : 0,
				maximumFractionDigits: effectiveDp,
			})
			result = dir === 'rtl' ? suffix + result : result + suffix
			if (currencySymbol) result = currencySymbol + result
		}

		return asObject ? { value, display: result } : result
	} catch (err) {
		return value
	}
}
