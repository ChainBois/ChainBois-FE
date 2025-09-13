/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 * @description Uses setTimeout internally to achieve the delay.
 */
export function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calls a callback function for each item in an array with a specified number of concurrent calls and delay between calls.
 * @param {Array} array - The array of items to process.
 * @param {function} callback - The function to call for each item. Must return a promise.
 * @param {number} concurrentCalls - The number of concurrent calls allowed. Defaults to 3.
 * @param {number} delayMs - The delay in milliseconds between calls. Defaults to 500ms.
 * @returns {Promise<Array>} A promise that resolves to an array of results from the callback function.
 */
export async function queueFunctionCalls(
	array,
	callback,
	concurrentCalls = 3,
	delayMs = 500
) {
	const results = []
	const len = array.length
	const cLen = Math.ceil(len / concurrentCalls)

	for (let i = 0; i < cLen; i++) {
		const nextPosition = Math.min((i + 1) * concurrentCalls, len)
		const tempResults = []

		for (let j = i * concurrentCalls; j < nextPosition; j++) {
			tempResults.push(callback(array[j]))
		}

		results.push(...(await Promise.all(tempResults)))
		if (delayMs && i < len - 1) {
			await delay(delayMs)
		}
	}

	return results
}

/**
 * Calls a callback function for each item in an array with a delay between calls and concurrency.
 * @param {Array} array - The array of items to process.
 * @param {function} callback - The function to call for each item. Must return a promise.
 * @param {number} concurrency - The number of concurrent calls allowed. Defaults to 3.
 * @param {number} delayMs - The delay in milliseconds between calls. Defaults to 500ms.
 * @returns {Promise<Array>} A promise that resolves to an array of results from the callback function.
 *
 */
export async function queueWithConcurrency(
	array,
	callback,
	concurrency = 3,
	delayMs = 500
) {
	const results = []
	const executing = new Set()

	for (const item of array) {
		const promise = (async () => {
			await delay(delayMs)
			const result = await callback(item)
			return result
		})()

		results.push(promise)
		executing.add(promise)

		promise.finally(() => executing.delete(promise))

		if (executing.size >= concurrency) {
			await Promise.race(executing)
		}
	}

	return Promise.all(results)
}

/**
 * Creates an async generator that yields results from a callback function for each item in an array with a delay between calls.
 * @param {Array} array - The array of items to process.
 * @param {function} callback - The function to call for each item. Must return a promise.
 * @param {number} delayMs - The delay in milliseconds between calls.
 * @yields {any} The result of the callback function for each item.
 */
export async function* createTaskGenerator(array, callback, delayMs) {
	for (const item of array) {
		yield await callback(item)
		await new Promise((resolve) => setTimeout(resolve, delayMs))
	}
}

/**
 * Runs tasks using an async generator with a delay between each task.
 * @param {Array} array - The array of items to process.
 * @param {function} callback - The function to call for each item. Must return a promise.
 * @param {number} delayMs - The delay in milliseconds between calls.
 * @returns {Promise<Array>} A promise that resolves to an array of results from the callback function.
 */
export async function runTasksWithGenerator(array, callback, delayMs) {
	const generator = createTaskGenerator(array, callback, delayMs)
	const results = []
	for await (const result of generator) {
		results.push(result)
	}
	return results
}
