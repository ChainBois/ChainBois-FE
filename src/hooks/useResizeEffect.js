'use client'

import { useEffect, useCallback } from 'react'
import { useWindowEffect } from './useWindowEffect'
import { useWindowEvent } from './useWindowEvent'
import { throttle } from '@/utils';

/**
 * A custom React hook that executes a callback function when the window size changes.
 * Handles window resize, device orientation changes, and initial load events with throttling.
 * Provides immediate execution on mount for initial sizing calculations.
 *
 * @param {Function} callback - The function to execute when resize events occur
 * @param {Array<any>} [deps=[]] - Dependencies array for the callback function
 * @param {number} [throttleTime=150] - Throttle delay in milliseconds (optimized for resize events)
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.includeLoad=true] - Whether to listen for window load events
 * @param {boolean} [options.includeOrientation=true] - Whether to listen for orientation changes
 * @param {boolean} [options.includeDOMReady=false] - Whether to listen for DOMContentLoaded
 * @param {boolean} [options.executeOnMount=true] - Whether to execute callback immediately on mount
 * @param {AddEventListenerOptions} [options.eventOptions={ passive: true }] - Event listener options
 *
 * @returns {void}
 *
 * @example
 * // Basic usage - handle window resize
 * useResizeEffect(() => {
 *   const { width, height } = getViewportSize()
 *   updateLayout(width, height)
 * })
 *
 * @example
 * // With dependencies and custom throttling
 * const [breakpoint, setBreakpoint] = useState('desktop')
 * useResizeEffect(() => {
 *   const width = window.innerWidth
 *   const newBreakpoint = getBreakpoint(width)
 *   if (newBreakpoint !== breakpoint) {
 *     setBreakpoint(newBreakpoint)
 *   }
 * }, [breakpoint], 100)
 *
 * @example
 * // Custom configuration
 * useResizeEffect(handleResize, [dependency], 200, {
 *   includeOrientation: false,  // Skip orientation events
 *   includeDOMReady: true,      // Include DOMContentLoaded
 *   executeOnMount: false,      // Don't run on mount
 *   eventOptions: { passive: false }
 * })
 *
 * @example
 * // Responsive component sizing
 * const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
 *
 * useResizeEffect(() => {
 *   setDimensions({
 *     width: window.innerWidth,
 *     height: window.innerHeight
 *   })
 * }, [])
 *
 * @since 1.0.0
 * @see {@link useWindowEffect} for handling multiple window events
 * @see {@link useWindowEvent} for handling single window events
 */
export const useResizeEffect = (
	callback,
	deps = [],
	throttleTime = 150,
	options = {},
) => {
	const {
		includeLoad = true,
		includeOrientation = true,
		includeDOMReady = false,
		executeOnMount = true,
		eventOptions = { passive: true },
	} = options

	// Memoize callback to prevent unnecessary re-renders
	const memoizedCallback = useCallback(callback, deps)

	// Build events array based on options for window-level events
	const events = []
	// Keep window.resize for manual browser window dragging events
	events.push({ event: 'resize', handler: memoizedCallback })
	if (includeLoad) {
		events.push({ event: 'load', handler: memoizedCallback })
	}
	if (includeOrientation) {
		events.push({ event: 'orientationchange', handler: memoizedCallback })
	}
	if (includeDOMReady) {
		events.push({ event: 'DOMContentLoaded', handler: memoizedCallback })
	}

	// Use the robust useWindowEffect for legacy window event management
	useWindowEffect(events, deps, throttleTime, eventOptions)

	// CRITICAL ADDITION: Use ResizeObserver to reliably detect DevTools/viewport changes
	useEffect(() => {
		if (typeof window === 'undefined') return

		// Throttle the callback specifically for the observer if needed
		const throttledObserverCallback = throttle(memoizedCallback, throttleTime)

		const resizeObserver = new ResizeObserver((entries) => {
			// The callback runs when observed element size changes
			throttledObserverCallback()
		})

		// Observe the root HTML element or body for viewport dimension changes
		resizeObserver.observe(document.documentElement || document.body)

		return () => {
			resizeObserver.unobserve(document.documentElement || document.body)
			throttledObserverCallback.cleanup?.() // Clean up the throttled function if it has a method
		}
	}, [memoizedCallback, throttleTime])

	// Execute callback immediately on mount if requested
	useEffect(() => {
		if (executeOnMount && typeof window !== 'undefined') {
			memoizedCallback()
		}
	}, [executeOnMount, memoizedCallback])
}

/**
 * A simplified version of useResizeEffect for basic resize handling.
 * Only listens to window resize events with default settings.
 *
 * @param {Function} callback - The function to execute on window resize
 * @param {Array<any>} [deps=[]] - Dependencies array for the callback function
 * @param {number} [throttleTime=150] - Throttle delay in milliseconds
 *
 * @returns {void}
 *
 * @example
 * // Simple resize handler
 * useSimpleResize(() => {
 *   console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight)
 * })
 *
 * @since 1.0.0
 */
export const useSimpleResize = (callback, deps = [], throttleTime = 150) => {
	useResizeEffect(callback, deps, throttleTime, {
		includeLoad: false,
		includeOrientation: false,
		includeDOMReady: false,
		executeOnMount: false,
	})
}
