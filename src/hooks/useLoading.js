import { useState, useCallback, useRef } from 'react'

/**
 * Custom hook for managing loading states with customizable messages.
 *
 * Provides a simple and consistent way to handle loading states across the ChainBois
 * gaming platform. Perfect for async operations like API calls, game initialization,
 * and data fetching.
 *
 * @example
 * ```javascript
 * function GameComponent() {
 *   const { isLoading, loadingMessage, startLoading, stopLoading } = useLoading()
 *
 *   const handlePlayNow = async () => {
 *     startLoading('Entering Battle Arena...')
 *     try {
 *       await someAsyncOperation()
 *     } finally {
 *       stopLoading()
 *     }
 *   }
 *
 *   if (isLoading) {
 *     return <LoadingPage message={loadingMessage} />
 *   }
 *
 *   return <button onClick={handlePlayNow}>Play Now</button>
 * }
 * ```
 *
 * @param {string} [defaultMessage='Loading...'] - Default message to show when no custom message is provided
 * @returns {Object} Loading state object
 * @returns {boolean} returns.isLoading - Current loading state (true/false)
 * @returns {string} returns.loadingMessage - Current loading message text
 * @returns {Function} returns.startLoading - Function to start loading with optional message
 * @returns {Function} returns.stopLoading - Function to stop loading
 * @returns {Function} returns.updateMessage - Function to update message during loading
 *
 * @since 1.0.0
 * @author ChainBois Team
 */
export function useLoading(defaultMessage = 'Loading...') {
	const [isLoading, setIsLoading] = useState(false)
	const [loadingMessage, setLoadingMessage] = useState(defaultMessage)
	const timeoutRef = useRef(null)

	/**
	 * Starts the loading state with an optional custom message and timeout.
	 *
	 * @example
	 * ```javascript
	 * // Basic usage
	 * startLoading('Entering Battle Arena...')
	 *
	 * // With auto-stop timeout (5 seconds)
	 * startLoading('Connecting to server...', 5000)
	 *
	 * // Use default message
	 * startLoading()
	 * ```
	 *
	 * @param {string} [message=defaultMessage] - Custom loading message to display
	 * @param {number|null} [timeout=null] - Auto-stop timeout in milliseconds (optional)
	 *
	 * @returns {void}
	 *
	 * @throws {Error} If called while already loading (in development mode)
	 */
	const startLoading = useCallback(
		(message = defaultMessage, timeout = null) => {
			// Development-only warning for multiple loading states
			if (process.env.NODE_ENV === 'development' && isLoading) {
				console.warn(
					'useLoading: startLoading called while already loading. Consider stopping current loading first.'
				)
			}

			setLoadingMessage(message)
			setIsLoading(true)

			// Auto-stop loading after timeout (optional feature)
			if (timeout && typeof timeout === 'number' && timeout > 0) {
				timeoutRef.current = setTimeout(() => {
					stopLoading()
				}, timeout)
			}
		},
		[defaultMessage, isLoading]
	)

	/**
	 * Stops the loading state and clears any pending timeouts.
	 *
	 * Always call this in a finally block to ensure loading stops even if errors occur.
	 *
	 * @example
	 * ```javascript
	 * try {
	 *   startLoading('Processing...')
	 *   await riskyOperation()
	 * } finally {
	 *   stopLoading() // Always called, even if error occurs
	 * }
	 * ```
	 *
	 * @returns {void}
	 */
	const stopLoading = useCallback(() => {
		setIsLoading(false)

		// Clear any pending auto-stop timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
	}, [])

	/**
	 * Updates the loading message without changing the loading state.
	 *
	 * Useful for multi-step operations where you want to show progress
	 * without restarting the loading state.
	 *
	 * @example
	 * ```javascript
	 * startLoading('Starting process...')
	 * await step1()
	 *
	 * updateMessage('Processing data...')
	 * await step2()
	 *
	 * updateMessage('Finalizing...')
	 * await step3()
	 *
	 * stopLoading()
	 * ```
	 *
	 * @param {string} message - New loading message to display
	 *
	 * @returns {void}
	 *
	 * @throws {Error} If message is not a string
	 */
	const updateMessage = useCallback((message) => {
		if (typeof message !== 'string') {
			throw new Error('useLoading: updateMessage expects a string parameter')
		}
		setLoadingMessage(message)
	}, [])

	return {
		isLoading,
		loadingMessage,
		startLoading,
		stopLoading,
		updateMessage,
	}
}
