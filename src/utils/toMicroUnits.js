// import { PUBLIC_ENV } from '@/constants'
import { trimDecimal } from './trimDecimal'

export const toMicroUnits = (num, exponent) => {
	if (process.env.NODE_ENV !== 'production')
		console.log('toMicroUnits init debug', { num, exponent })
	if (typeof num !== 'number' || typeof exponent !== 'number') {
		throw new TypeError('Both arguments must be numbers')
	}

	// Step 1: Trim the number using your smart logic
	const trimmed = trimDecimal(num, { decimals: exponent })
	if (process.env.NODE_ENV !== 'production') console.log('debug log: trimmed', trimmed)

	// Step 2: Convert to string for safe manipulation
	const numStr = trimmed.toExponential().includes('e')
		? trimmed.toFixed(20)
		: trimmed.toString()

	// Step 3: Split into integer and fractional parts
	const [intPartRaw, fracPartRaw = ''] = numStr.split('.')
	const intPart = intPartRaw.replace(/^0+(?!$)/, '') || '0'
	const fracPart = fracPartRaw.replace(/0+$/, '')

	// Step 4: Build raw digits string (integer + fractional)
	const raw = intPart + fracPart

	// Step 5: Calculate total shift needed
	const fractionDigits = fracPart.length
	const totalShift = exponent - fractionDigits

	// Step 6: Build final string for BigInt
	let finalStr
	if (totalShift < 0) {
		// Need to truncate raw string
		finalStr = raw.slice(0, raw.length + totalShift) || '0'
	} else {
		// Pad with zeros
		finalStr = raw + '0'.repeat(totalShift)
	}

	if (process.env.NODE_ENV !== 'production')
		console.log(
			'toMicroUnits args',
			{
				num: { value: num, type: typeof num },
				exponent: { value: exponent, type: typeof exponent },
			},
			'\n',
			'toMicroUnits internal state',
			{
				intPartRaw,
				fracPartRaw,
				intPart,
				fracPart,
				raw,
				fractionDigits,
				totalShift,
				finalStr,
			}
		)

	// Step 7: Handle negatives
	return BigInt(trimmed < 0 ? `-${finalStr}` : finalStr)
}
