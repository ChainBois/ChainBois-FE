'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * A custom React hook that creates a throttled version of a callback function.
 * Ensures the callback is called at most once per specified delay period, with proper cleanup.
 *
 * @param {Function} callback - The function to throttle
 * @param {Array<any>} [deps=[]] - Dependencies array that determines when to recreate the throttled function
 * @param {number} delay - The minimum time in milliseconds between callback executions
 *
 * @returns {Function} A throttled version of the callback that respects the delay constraint
 *
 * @example
 * // Basic throttling
 * const throttledSearch = useThrottle((query) => {
 *   performSearch(query)
 * }, [], 300)
 *
 * @example
 * // With dependencies
 * const [searchType, setSearchType] = useState('users')
 * const throttledSearch = useThrottle((query) => {
 *   performSearch(query, searchType)
 * }, [searchType], 300)
 *
 * @example
 * // Throttled API call
 * const throttledSave = useThrottle(async (data) => {
 *   await saveToAPI(data)
 * }, [userId], 1000)
 *
 * @example
 * // No dependencies needed
 * const throttledResize = useThrottle(() => {
 *   updateLayout()
 * }, [], 250)
 *
 * @example
 * // Multiple dependencies
 * const [filter, sort, page] = useState()
 * const throttledFilter = useThrottle((searchTerm) => {
 *   fetchResults(searchTerm, filter, sort, page)
 * }, [filter, sort, page], 500)
 *
 * @since 1.0.0
 * @see {@link useWindowEvent} for throttled window event handling
 * @see {@link useWindowEffect} for throttled multiple window events
 */
export const useThrottle = (callback, deps = [], delay) => {
	const timeoutRef = useRef(null)
	const lastExecutedRef = useRef(0)

	const throttledCallback = useCallback(
		(...args) => {
			const now = Date.now()
			const timeSinceLastExecution = now - lastExecutedRef.current

			const executeCallback = () => {
				lastExecutedRef.current = now
				callback(...args)
			}

			if (timeSinceLastExecution >= delay) {
				executeCallback()
			} else {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current)
				}
				timeoutRef.current = setTimeout(
					executeCallback,
					delay - timeSinceLastExecution
				)
			}
		},
		[callback, delay, ...deps]
	)

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return throttledCallback
}
