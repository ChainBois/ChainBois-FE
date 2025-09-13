/**
 * Fills an array by repeating its elements until the desired length is reached.
 *
 * Given an array, this function repeats its elements to fill up the array to
 * the desired length. For example, if the array is [1, 2, 3] and the desired
 * length is 6, the resulting array will be [1, 2, 3, 1, 2, 3].
 *
 * @param {Array} array - The original array to fill up.
 * @param {number} size - The desired length of the filled array.
 * @returns {Array} A new array with the original array elements repeated until
 * the desired length is reached.
 */
export const fillArray = (array, size) => {
	if (!array?.length || !size) return []
	if (array?.length >= size) return array
	const newArray = []

	let i = 0
	for (i; i < size; i++) {
		newArray.push(array[i % array.length])
	}

	return newArray
}

/**
 * Pads an array by repeating its elements a specified number of times.
 *
 * @param {Array} array - The array to be padded.
 * @param {number} padTimes - The number of times to repeat the elements of the array.
 * @returns {Array} - The new array with repeated elements.
 */
export const padArray = (array, padTimes) => {
	if (!array?.length || !padTimes) return []
	const newArray = [...array]
	let i = 0
	for (i; i < padTimes; i++) {
		newArray.push(newArray[i])
	}

	return newArray
}

// const tempArray = [1, 2, 3, 4, 5]

// const filledArray = fillArray(tempArray, 3)
// console.log(filledArray) // [1, 2, 1]
// const paddedArray = padArray(tempArray, 3)
// console.log(paddedArray) // [1, 2, 1, 1, 2, 1]

/**
 * Merges and validates two arrays of objects based on a specified property,
 * prioritizing the data from the new array while maintaining items from the previous array
 * that are still present in the new data.
 *
 * @param {Array} prevData - The previous array of objects to merge from
 * @param {Array} newData - The new array of objects to merge with
 * @param {string} prop - The property name to use as a unique identifier for merging
 * @returns {Array} A merged array containing validated items from both arrays
 *
 * @example
 * const prev = [{id: 1, name: 'old'}, {id: 2, name: 'keep'}];
 * const next = [{id: 2, name: 'keep'}, {id: 3, name: 'new'}];
 * validateAndMerge(prev, next, 'id');
 * // Returns [{id: 2, name: 'keep'}, {id: 3, name: 'new'}]
 */
export const validateAndMerge = (prevData, newData, prop) => {
	const updatedSet = new Map()

	newData.forEach((item) => updatedSet.set(item?.[prop], item))

	prevData.forEach((item) => {
		if (updatedSet.has(item?.[prop])) {
			updatedSet.set(item?.[prop], item)
		}
	})

	return Array.from(updatedSet.values())
}

// const prev = [{id: 1, name: 'old'}, {id: 2, name: 'keep'}];
// const next = [{id: 2, name: 'keeps'}, {id: 3, name: 'new'}];
// const merged = validateAndMerge(prev, next, 'id');
// merged

/**
 * Merges new data with previous data, ensuring no duplicates based on a specified property.
 *
 * @param {Array<Object>} prevData - The previous data array.
 * @param {Array<Object>} newData - The new data array to be merged.
 * @param {string} prop - The property name used to identify duplicates.
 * @returns {Array<Object>} - The merged array with unique items based on the specified property.
 */
export const validateAndMergeWithOld = (prevData, newData, prop) => {
	const mergedData = [
		...prevData.filter(
			(item) => !newData.some((prevItem) => prevItem?.[prop] === item?.[prop])
		),
		...newData,
	]

	return mergedData
}

/**
 * Sorts an array of strings alphanumerically using natural sort order
 * @param {string[]} array - The array of strings to be sorted
 * @returns {string[]} The sorted array
 * @example
 * sortArrayAlphaNumerically(['item1', 'item10', 'item2'])
 * // returns ['item1', 'item2', 'item10']
 */
export const sortArrayAlphaNumerically = (array) => {
	const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true })
	return array.sort(sortAlphaNum)
}
