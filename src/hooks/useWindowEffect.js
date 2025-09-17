'use client'

import { throttle } from '@/utils'
import { useEffect, useMemo } from 'react'
import { useWindowEvent } from './useWindowEvent'

/**
 * A custom React hook that manages multiple window event listeners with throttling capabilities.
 * Automatically handles SSR compatibility, prevents memory leaks, and provides efficient event management.
 *
 * @param {Array<{event: string, handler: Function}>} events - Array of event configuration objects
 * @param {string} events[].event - The window event name (e.g., 'resize', 'scroll', 'keydown')
 * @param {Function} events[].handler - The event handler function for this event
 * @param {Array<any>} [deps=[]] - Dependencies array for all event handlers (similar to useEffect deps)
 * @param {number} [throttleMs=100] - Throttle delay in milliseconds applied to all handlers
 * @param {AddEventListenerOptions|boolean} [options={}] - Standard addEventListener options for all events
 * @param {boolean} [options.passive] - If true, indicates handlers will never call preventDefault()
 * @param {boolean} [options.once] - If true, listeners will be automatically removed after first trigger
 * @param {boolean} [options.capture] - If true, listeners will trigger during the capture phase
 * @param {AbortSignal} [options.signal] - An AbortSignal to remove all event listeners
 *
 * @returns {void}
 *
 * @example
 * // Multiple related events
 * useWindowEffect([
 *   { event: 'resize', handler: handleResize },
 *   { event: 'orientationchange', handler: handleOrientationChange }
 * ], [isReady], 150)
 *
 * @example
 * // Scroll and mouse events with passive option
 * useWindowEffect([
 *   { event: 'scroll', handler: handleScroll },
 *   { event: 'wheel', handler: handleWheel },
 *   { event: 'touchmove', handler: handleTouch }
 * ], [scrollPosition], 50, { passive: true })
 *
 * @example
 * // Keyboard shortcuts system
 * const [shortcuts, setShortcuts] = useState({})
 * useWindowEffect([
 *   { event: 'keydown', handler: handleKeyDown },
 *   { event: 'keyup', handler: handleKeyUp }
 * ], [shortcuts], 0) // No throttling for keyboard events
 *
 * @example
 * // Focus management
 * useWindowEffect([
 *   { event: 'focus', handler: handleFocus },
 *   { event: 'blur', handler: handleBlur },
 *   { event: 'visibilitychange', handler: handleVisibilityChange }
 * ], [isActive])
 *
 * @since 1.0.0
 * @see {@link useWindowEvent} for handling a single window event
 */
export const useWindowEffect = (
	events,
	deps = [],
	throttleMs = 100,
	options = {}
) => {
	const throttledHandlers = useMemo(() => {
		return events.map(({ event, handler }) => ({
			event,
			handler: throttle(handler, throttleMs),
		}))
	}, [events, throttleMs, ...deps])

	useEffect(() => {
		if (typeof window === 'undefined') return

		throttledHandlers.forEach(({ event, handler }) => {
			window.addEventListener(event, handler, options)
		})

		return () => {
			throttledHandlers.forEach(({ event, handler }) => {
				window.removeEventListener(event, handler, options)
				handler.cleanup?.()
			})
		}
	}, [throttledHandlers, options])
}
