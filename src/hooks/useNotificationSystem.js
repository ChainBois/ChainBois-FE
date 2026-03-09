// src/hooks/useNotificationSystem.js - MIGRATED VERSION
import { useCallback, useMemo } from 'react'
import { useToastNotifications } from './notificationsSystem/useToastNotifications'
import { useDeviceDetection } from './notificationsSystem/useDeviceDetection'

/**
 * Simplified notification system - Service Worker removed
 * Toast-only implementation with clean architectural boundaries
 */
export const useNotificationSystem = ({
	enableAnimations = true,
	debugMode = false,
} = {}) => {
	const device = useDeviceDetection()

	const toastNotifications = useToastNotifications({
		maxToasts: device.isMobile ? 3 : 5,
		position: 'auto',
		enableAnimations,
		defaultDuration: 5000,
	})

	// Unified notification interface - always routes to toast
	const showNotification = useCallback(
		(title, options = {}) => {
			const {
				type = 'info',
				body = '',
				urgent = false,
				...notificationOptions
			} = options

			if (debugMode) {
				console.log('🔔 Notification:', { title, type, options })
			}

			// Combine title and body for toast display
			const content = body ? `${title}: ${body}` : title

			// Route by type with appropriate durations
			const typeConfig = {
				error: { duration: urgent ? 0 : 10000, persistent: urgent },
				warning: { duration: 8000 },
				success: { duration: 6000 },
				info: { duration: 7000 },
			}

			const config = typeConfig[type] || typeConfig.info
			const toastMethod = `show${type.charAt(0).toUpperCase() + type.slice(1)}`

			const toastId =
				toastNotifications[toastMethod]?.(content, {
					...config,
					...notificationOptions,
				}) ||
				toastNotifications.addToast(content, {
					type,
					...config,
					...notificationOptions,
				})

			return { method: 'toast', success: true, toastId }
		},
		[toastNotifications, debugMode]
	)

	// Mock permission methods for API compatibility
	const requestPermissions = useCallback(
		async ({ userInitiated = false } = {}) => {
			if (debugMode) {
				console.log('🔔 Permission request (mocked):', { userInitiated })
			}
			// Always return granted since we're using toasts
			return {
				granted: true,
				method: 'toast-fallback',
				message: 'Using in-app notifications',
			}
		},
		[debugMode]
	)

	// System diagnostics
	const getSystemDiagnostics = useCallback(
		() => ({
			strategy: 'toast-only',
			device: {
				type: device.isMobile ? 'mobile' : 'desktop',
				browser: device.browser,
			},
			toastNotifications: {
				active: toastNotifications.toasts.length,
				visible: toastNotifications.isVisible,
				position: toastNotifications.position,
			},
			serviceWorker: { removed: true },
		}),
		[device, toastNotifications]
	)

	return useMemo(
		() => ({
			// Core notification methods
			showNotification,
			showSuccess: (title, options) =>
				showNotification(title, { ...options, type: 'success' }),
			showError: (title, options) =>
				showNotification(title, { ...options, type: 'error', urgent: true }),
			showWarning: (title, options) =>
				showNotification(title, { ...options, type: 'warning' }),
			showInfo: (title, options) =>
				showNotification(title, { ...options, type: 'info' }),

			// Permission management (mocked for compatibility)
			requestPermissions,

			// System control
			clearAllNotifications: toastNotifications.clearAllToasts,
			getSystemDiagnostics,

			// State exposure for UI integration
			isSupported: true,
			isAvailable: true,
			permissionState: 'granted', // Always granted for toasts
			strategy: { primary: 'toast', fallback: null },

			// Stats
			stats: {
				toasts: { active: toastNotifications.toasts.length },
			},

			// Direct subsystem access
			toast: toastNotifications,
			device,
		}),
		[
			showNotification,
			requestPermissions,
			toastNotifications,
			device,
			getSystemDiagnostics,
		]
	)
}
