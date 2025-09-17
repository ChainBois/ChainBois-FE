'use client'

import { useEffect } from 'react'
import { useThrottle } from './useThrottle'
import { useWindowEffect } from './useWindowEffect'

/**
 * A custom React hook for managing a single window event listener with throttling.
 * Automatically handles SSR compatibility and cleanup on unmount.
 *
 * @param {string} event - The window event name to listen for (e.g., 'resize', 'scroll', 'keydown')
 * @param {Function} handler - The event handler function to execute when the event fires
 * @param {Array<any>} [deps=[]] - Dependencies array for the handler function (similar to useEffect deps)
 * @param {number} [throttleMs=100] - Throttle delay in milliseconds to limit handler execution frequency
 * @param {AddEventListenerOptions|boolean} [options={}] - Standard addEventListener options
 * @param {boolean} [options.passive] - If true, indicates that the function will never call preventDefault()
 * @param {boolean} [options.once] - If true, the listener will be automatically removed after triggering once
 * @param {boolean} [options.capture] - If true, the listener will be triggered during the capture phase
 * @param {AbortSignal} [options.signal] - An AbortSignal to remove the event listener
 *
 * @returns {void}
 *
 * @example
 * // Basic usage - throttled resize handler
 * useWindowEvent('resize', () => {
 *   console.log('Window resized:', window.innerWidth, window.innerHeight)
 * })
 *
 * @example
 * // With dependencies and custom throttling
 * const [count, setCount] = useState(0)
 * useWindowEvent('scroll', () => {
 *   console.log('Scroll event, count is:', count)
 * }, [count], 200)
 *
 * @example
 * // With event listener options
 * useWindowEvent('wheel', handleWheel, [], 50, { passive: true })
 *
 * @example
 * // Keyboard event handling
 * useWindowEvent('keydown', (event) => {
 *   if (event.key === 'Escape') {
 *     closeModal()
 *   }
 * }, [closeModal])
 *
 * @example
 * // One-time event listener
 * useWindowEvent('load', () => {
 *   console.log('Window loaded')
 * }, [], 0, { once: true })
 *
 * @since 1.0.0
 * @see {@link useThrottle} for general function throttling
 * @see {@link useWindowEffect} for handling multiple events simultaneously
 */
export const useWindowEvent = (
	event,
	handler,
	deps = [],
	throttleMs = 100,
	options = {}
) => {
	const throttledHandler = useThrottle(handler, deps, throttleMs)

	useEffect(() => {
		if (typeof window === 'undefined') return

		window.addEventListener(event, throttledHandler, options)

		return () => {
			window.removeEventListener(event, throttledHandler, options)
		}
	}, [event, throttledHandler, options])
}
