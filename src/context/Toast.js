'use client'

import React, { createContext, useMemo } from 'react'
import { useToastNotifications } from '@/hooks/notificationsSystem/useToastNotifications'

export const ToastContext = createContext(null)

const ToastContextProvider = ({ children }) => {
	// ✅ ARCHITECTURAL DECISION: Isolated toast state prevents cross-contamination
	const toastSystem = useToastNotifications({
		maxToasts: 5,
		position: 'auto',
		enableAnimations: true,
		defaultDuration: 5000,
	})

	// ✅ PERFORMANCE: Memoize context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			toasts: toastSystem.toasts,
			addToast: toastSystem.addToast,
			removeToast: toastSystem.removeToast,
			clearAllToasts: toastSystem.clearAllToasts,
			showSuccess: toastSystem.showSuccess,
			showError: toastSystem.showError,
			showWarning: toastSystem.showWarning,
			showInfo: toastSystem.showInfo,
			getToastStyles: toastSystem.getToastStyles,
			handleToastInteraction: toastSystem.handleToastInteraction,
			getAriaAttributes: toastSystem.getAriaAttributes,
			containerRef: toastSystem.containerRef,
			isVisible: toastSystem.isVisible,
		}),
		[toastSystem]
	)

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
		</ToastContext.Provider>
	)
}

export default ToastContextProvider