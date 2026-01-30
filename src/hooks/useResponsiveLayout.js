// hooks/useResponsiveLayout.js
'use client'
import { useEffect, useState, useCallback } from 'react'
// Import the user's useThrottle hook
import { useThrottle } from './useThrottle'

/**
 * A comprehensive React hook for responsive layout management.
 * Tracks window dimensions via ResizeObserver and monitors specified breakpoints via matchMedia.
 *
 * @param {Object.<string, string>} [breakpoints] - An object mapping breakpoint names to CSS media queries (e.g., { isMobile: '(max-width: 768px)' })
 * @param {number} [throttleTime=150] - Throttle delay for dimension tracking
 * @returns {Object} - An object containing current dimensions ({ width, height }) and an object of matching breakpoints
 *
 * @example
 * const APP_BREAKPOINTS = {
 *   isMobile: '(max-width: 768px)',
 *   isTablet: '(min-width: 769px) and (max-width: 1024px)',
 *   isDesktop: '(min-width: 1025px)'
 * };
 *
 * function AppLayoutComponent() {
 *   const { dimensions, matches } = useResponsiveLayout(APP_BREAKPOINTS);
 * 
 *   // dimensions: { width: number, height: number }
 *   // matches: { isMobile: boolean, isTablet: boolean, isDesktop: boolean }
 *
 *   return (
 *     <div>
 *       <p>Current Window Size: {dimensions.width}px x {dimensions.height}px</p>
 *
 *       {matches.isMobile && <h1>Welcome to the Mobile View!</h1>}
 *       {matches.isTablet && <h1>Welcome to the Tablet View!</h1>}
 *       {matches.isDesktop && <h1>Welcome to the Desktop View!</h1>}
 *     </div>
 *   );
 * }
 */
export function useResponsiveLayout(breakpoints = {}, throttleTime = 150) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
	const [matches, setMatches] = useState({})

	// Memoized callback to update dimensions
	const updateDimensions = useCallback(() => {
		if (typeof window !== 'undefined') {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}
	}, [])

	// Use the useThrottle hook to create a throttled version of the callback
	const throttledUpdateDimensions = useThrottle(
		updateDimensions,
		[],
		throttleTime,
	)

	// --- Logic 1: Use ResizeObserver for generic dimension changes (DevTools friendly) ---
	useEffect(() => {
		if (typeof window === 'undefined') return

		const resizeObserver = new ResizeObserver(() => {
			// The throttled function is called by the observer callback
			throttledUpdateDimensions()
		})

		// Observe the root HTML element
		resizeObserver.observe(document.documentElement || document.body)

		// Also run once on mount for initial sizing
		throttledUpdateDimensions()

		return () => {
			// Only need to unobserve here; useThrottle hook handles clearing its own timeout
			resizeObserver.unobserve(document.documentElement || document.body)
		}
	}, [throttledUpdateDimensions])

	// --- Logic 2: Use matchMedia for specific breakpoint tracking ---
	useEffect(() => {
		if (typeof window === 'undefined') return

		const mediaQueryLists = {}
		const listeners = {}

		const updateMatches = () => {
			const newMatches = {}
			for (const key in breakpoints) {
				if (mediaQueryLists[key]) {
					newMatches[key] = mediaQueryLists[key].matches
				}
			}
			setMatches(newMatches)
		}

		for (const key in breakpoints) {
			const query = breakpoints[key]
			mediaQueryLists[key] = window.matchMedia(query)
			listeners[key] = (event) => updateMatches()
			mediaQueryLists[key].addEventListener('change', listeners[key])
		}

		// Initial check
		updateMatches()

		return () => {
			for (const key in breakpoints) {
				if (mediaQueryLists[key] && listeners[key]) {
					mediaQueryLists[key].removeEventListener('change', listeners[key])
				}
			}
		}
	}, [breakpoints])

	return { dimensions, matches }
}
