// hooks/useToastNotifications.js
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useDeviceDetection } from './useDeviceDetection'

/**
 * Toast notification system implementing graceful degradation architecture
 * Provides permission-free notification fallback with mobile-optimized positioning
 * Implements memory-efficient queue management and collision avoidance algorithms
 * @param {Object} options Configuration object for toast behavior and styling
 * @returns {Object} Toast notification interface with lifecycle management
 */
export const useToastNotifications = ({
	maxToasts = 5,
	defaultDuration = 10000,
	position = 'auto', // 'auto' | 'top-right' | 'bottom-right' | 'bottom-center'
	enableAnimations = true,
	stackSpacing = 10,
} = {}) => {
	const device = useDeviceDetection()

	const [toasts, setToasts] = useState([])
	const [isVisible, setIsVisible] = useState(true)

	// Performance optimization through refs
	const toastTimeouts = useRef(new Map())
	const nextId = useRef(0)
	const containerRef = useRef(null)

	// Architectural positioning logic based on device constraints
	const getOptimalPosition = useCallback(() => {
		if (position !== 'auto') return position

		// Mobile-first positioning strategy to avoid navigation interference
		if (device.isMobile) {
			return device.isIOS ? 'top-right' : 'bottom-center'
		}

		return 'top-right'
	}, [position, device.isMobile, device.isIOS])

	// Memory-efficient toast lifecycle management
	const addToast = useCallback(
		(content, toastOptions = {}) => {
			const id = nextId.current++
			const duration = toastOptions.duration ?? defaultDuration
			const type = toastOptions.type || 'info'

			const toast = {
				id,
				content,
				type,
				duration,
				timestamp: Date.now(),
				onClose: toastOptions.onClose,
				onClick: toastOptions.onClick,
				persistent: toastOptions.persistent || false,
			}

			setToasts((prevToasts) => {
				const newToasts = [...prevToasts, toast]

				// Implement queue management with FIFO eviction
				if ((newToasts?.length ?? 0) > maxToasts) {
					const removedToasts = newToasts.splice(
						0,
						(newToasts?.length ?? 0) - maxToasts
					)
					removedToasts.forEach((removedToast) => {
						const timeout = toastTimeouts.current.get(removedToast.id)
						if (timeout) {
							clearTimeout(timeout)
							toastTimeouts.current.delete(removedToast.id)
						}
					})
				}

				return newToasts
			})

			// Auto-removal timer with memory cleanup
			if (duration > 0 && !toast.persistent) {
				const timeoutId = setTimeout(() => {
					removeToast(id)
				}, duration)

				toastTimeouts.current.set(id, timeoutId)
			}

			return id
		},
		[defaultDuration, maxToasts]
	)

	// Performant toast removal with cleanup verification
	const removeToast = useCallback((id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))

		const timeout = toastTimeouts.current.get(id)
		if (timeout) {
			clearTimeout(timeout)
			toastTimeouts.current.delete(id)
		}
	}, [])

	// Batch clearing for performance optimization
	const clearAllToasts = useCallback(() => {
		setToasts([])

		// Memory cleanup of all timeouts
		toastTimeouts.current.forEach((timeout) => clearTimeout(timeout))
		toastTimeouts.current.clear()
	}, [])

	// Type-specific toast creation methods for API ergonomics
	const showSuccess = useCallback(
		(content, options = {}) => {
			return addToast(content, { ...options, type: 'success' })
		},
		[addToast]
	)

	const showError = useCallback(
		(content, options = {}) => {
			return addToast(content, {
				...options,
				type: 'error',
				duration: options.duration || 8000,
			})
		},
		[addToast]
	)

	const showWarning = useCallback(
		(content, options = {}) => {
			return addToast(content, { ...options, type: 'warning' })
		},
		[addToast]
	)

	const showInfo = useCallback(
		(content, options = {}) => {
			return addToast(content, { ...options, type: 'info' })
		},
		[addToast]
	)

	// Visibility management for focus/blur optimization
	const toggleVisibility = useCallback((visible) => {
		setIsVisible(visible)
	}, [])

	// Dynamic positioning calculations for collision avoidance
	const getToastStyles = useCallback(
		(index) => {
			const basePosition = getOptimalPosition()
			const spacing = stackSpacing
			const toastHeight = device.isMobile ? 60 : 50

			const styles = {
				position: 'fixed',
				zIndex: 9999 + index,
				pointerEvents: isVisible ? 'auto' : 'none',
				opacity: isVisible ? 1 : 0.7,
				transition: enableAnimations ? 'all 0.3s ease-in-out' : 'none',
			}

			switch (basePosition) {
				case 'top-right':
					styles.top = `${20 + index * (toastHeight + spacing)}px`
					styles.right = '20px'
					break
				case 'bottom-right':
					styles.bottom = `${20 + index * (toastHeight + spacing)}px`
					styles.right = '20px'
					break
				case 'bottom-center':
					styles.bottom = `${20 + index * (toastHeight + spacing)}px`
					styles.left = '50%'
					styles.transform = 'translateX(-50%)'
					styles.width = device.isMobile ? '90%' : '400px'
					styles.maxWidth = device.isMobile ? '350px' : '400px'
					break
				default:
					styles.top = `${20 + index * (toastHeight + spacing)}px`
					styles.right = '20px'
			}

			return styles
		},
		[
			getOptimalPosition,
			stackSpacing,
			device.isMobile,
			isVisible,
			enableAnimations,
		]
	)

	// Page visibility API integration for performance optimization
	useEffect(() => {
		const handleVisibilityChange = () => {
			setIsVisible(!document.hidden)
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () =>
			document.removeEventListener('visibilitychange', handleVisibilityChange)
	}, [])

	// Cleanup on unmount to prevent memory leaks
	useEffect(() => {
		return () => {
			toastTimeouts.current.forEach((timeout) => clearTimeout(timeout))
			toastTimeouts.current.clear()
		}
	}, [])

	// Touch gesture handling for mobile interactions
	const handleToastInteraction = useCallback(
		(toast, action) => {
			switch (action) {
				case 'click':
					if (toast.onClick) {
						toast.onClick()
					}
					if (!toast.persistent) {
						removeToast(toast.id)
					}
					break
				case 'dismiss':
					if (toast.onClose) {
						toast.onClose()
					}
					removeToast(toast.id)
					break
				default:
					break
			}
		},
		[removeToast]
	)

	// Accessibility support for screen readers
	const getAriaAttributes = useCallback((toast) => {
		return {
			role: toast.type === 'error' ? 'alert' : 'status',
			'aria-live': toast.type === 'error' ? 'assertive' : 'polite',
			'aria-atomic': 'true',
		}
	}, [])

	return useMemo(
		() => ({
			toasts,
			addToast,
			removeToast,
			clearAllToasts,
			showSuccess,
			showError,
			showWarning,
			showInfo,
			toggleVisibility,
			getToastStyles,
			handleToastInteraction,
			getAriaAttributes,
			isVisible,
			position: getOptimalPosition(),
			containerRef,
			device: {
				isMobile: device.isMobile,
				isTouch: device.supportsTouch,
			},
		}),
		[
			toasts,
			addToast,
			removeToast,
			clearAllToasts,
			showSuccess,
			showError,
			showWarning,
			showInfo,
			toggleVisibility,
			getToastStyles,
			handleToastInteraction,
			getAriaAttributes,
			isVisible,
			getOptimalPosition,
			containerRef,
			device,
		]
	)
}
