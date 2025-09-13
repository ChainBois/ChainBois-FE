/**
 * Creates a throttled version of a function that ensures it's called at most once per specified delay period.
 * Uses the same logic as useThrottle hook but as a standalone utility function.
 *
 * @param {Function} func - The function to throttle
 * @param {number} delay - The minimum time in milliseconds between function executions
 *
 * @returns {Function} A throttled version of the function with a cleanup method
 *
 * @example
 * // Basic throttling
 * const throttledSearch = throttle((query) => {
 *   performSearch(query)
 * }, 300)
 *
 * // Call the throttled function
 * throttledSearch('user input')
 *
 * // Cleanup when no longer needed
 * throttledSearch.cleanup()
 *
 * @example
 * // Throttled API call
 * const throttledSave = throttle(async (data) => {
 *   await saveToAPI(data)
 * }, 1000)
 *
 * // Use in event handlers
 * element.addEventListener('scroll', throttledSave)
 *
 * // Cleanup on component unmount or when removing listener
 * element.removeEventListener('scroll', throttledSave)
 * throttledSave.cleanup()
 */
export const throttle = (func, delay) => {
	let timeoutId = null
	let lastExecuted = 0

	const throttledFunction = function (...args) {
		const now = Date.now()
		const timeSinceLastExecution = now - lastExecuted

		const executeFunction = () => {
			lastExecuted = Date.now()
			func.apply(this, args)
		}

		if (timeSinceLastExecution >= delay) {
			// Enough time has passed, execute immediately
			executeFunction()
		} else {
			// Not enough time has passed, clear any pending timeout and schedule execution
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
			timeoutId = setTimeout(executeFunction, delay - timeSinceLastExecution)
		}
	}

	// Add cleanup method to clear pending timeouts
	throttledFunction.cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	// Add method to check if there's a pending execution
	throttledFunction.pending = () => {
		return timeoutId !== null
	}

	// Add method to cancel any pending execution
	throttledFunction.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	// Add method to flush (execute immediately) any pending execution
	throttledFunction.flush = function (...args) {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
			lastExecuted = Date.now()
			func.apply(this, args.length > 0 ? args : [])
		}
	}

	return throttledFunction
}
