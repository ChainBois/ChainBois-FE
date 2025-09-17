'use client'

import { useEffect, useMemo } from 'react'
import { useDebounce } from './useDebounce'

/**
 * A custom hook that debounces the execution of a callback function.
 *
 * @template T
 * @param {(...args: T[]) => void} callback - The function to be debounced
 * @param {T[]} deps - Array of dependencies that trigger the callback when changed
 * @param {number} delay - The delay in milliseconds before the callback is executed
 * @param {(() => void) | null} [cleanUpFunc=null] - Optional cleanup function to run on unmount or deps change
 *
 * @example
 * useDebouncedEffect(
 *   () => console.log('Search term:', searchTerm),
 *   [searchTerm],
 *   500
 * );
 */
export const useDebouncedEffect = (
	callback,
	deps,
	delay,
	cleanUpFunc = null
) => {
	const mDeps = useMemo(() => deps, deps)
	const dDeps = useDebounce(mDeps, delay)

	useEffect(() => {
		callback(dDeps)

		return () => {
			if (typeof cleanUpFunc === 'function') {
				cleanUpFunc()
			}
		}
	}, dDeps)
}

export default useDebouncedEffect
