/**
 * Determines whether the provided value is considered NaN (Not-a-Number) or an invalid number-like value.
 *
 * Returns true if the value is:
 * - NaN (using Number.isNaN)
 * - null
 * - undefined
 * - the string 'NaN'
 * - the string 'null'
 * - the string 'undefined'
 * Returns false for BigInt values.
 *
 * @param {*} num - The value to check.
 * @returns {boolean} True if the value is considered NaN or invalid, false otherwise.
 */
export const isNaN = (num) =>
	typeof num === 'bigint'
		? false
		: num === null ||
		  num === undefined ||
		  num === 'NaN' ||
		  num === 'null' ||
		  num === 'undefined' ||
		  Number.isNaN(Number(num))

// console.log(isNaN(10n))
// console.log(isNaN('1999999999999999999990'))
// console.log(isNaN(null))
// console.log(isNaN(undefined))
// console.log(isNaN('NaN'))
// console.log(isNaN('null'))
// console.log(
// 	isNaN(
// 		'https://res.cloudinary.com/docwdvaa9/image/upload/v1738799695/qirgihz3lah3elkrx23y.jpg'
// 	)
// )

