import { trimDecimal } from './trimDecimal'

export const toMacroUnits = (bigIntVal, exponent, dec = exponent) => {
	return trimDecimal(Number(bigIntVal) / Math.pow(10, exponent), {
		decimals: dec,
	})
}
