// src/components/ToastContainer/ToastContainer.jsx - Refactored implementation

'use client'

import React, { memo } from 'react'
import { useToast } from '@/hooks' // ✅ ISOLATION: Direct toast context import
import {
	FiCheckCircle,
	FiXCircle,
	FiAlertCircle,
	FiInfo,
	FiX,
} from 'react-icons/fi'
import styles from './ToastContainer.module.css'

// ✅ PERFORMANCE: Extracted static icon mapping prevents re-creation
const TOAST_ICONS = {
	success: FiCheckCircle,
	error: FiXCircle,
	warning: FiAlertCircle,
	info: FiInfo,
}

export const ToastContainer = memo(() => {
	// ✅ ARCHITECTURAL INTEGRITY: Direct access to isolated toast state
	const {
		toasts,
		getToastStyles,
		handleToastInteraction,
		getAriaAttributes,
		containerRef,
	} = useToast()

	// ✅ PERFORMANCE: Early return prevents unnecessary render work
	if (!toasts || toasts.length === 0) {
		return null
	}

	const getIcon = (type) => {
		const IconComponent = TOAST_ICONS[type] || TOAST_ICONS.info
		return <IconComponent className={styles.toastIcon} />
	}

	return (
		<div
			ref={containerRef}
			className={styles.toastContainer}
		>
			{toasts.map((toastItem, index) => (
				<div
					key={toastItem.id} // ✅ STABILITY: ID-based key prevents reconciliation issues
					style={getToastStyles(index)}
					className={`${styles.toastWrapper} ${
						styles[`toast-${toastItem.type}`]
					}`}
					{...getAriaAttributes(toastItem)}
					onClick={() => handleToastInteraction(toastItem, 'click')}
				>
					<div className={styles.toastContent}>
						<div className={styles.toastIconWrapper}>
							{getIcon(toastItem.type)}
						</div>
						<div className={styles.toastMessage}>{toastItem.content}</div>
						<button
							onClick={(e) => {
								e.stopPropagation()
								handleToastInteraction(toastItem, 'dismiss')
							}}
							className={styles.toastCloseButton}
							aria-label='Close notification'
						>
							<FiX className={styles.toastCloseIcon} />
						</button>
					</div>
				</div>
			))}
		</div>
	)
})

ToastContainer.displayName = 'ToastContainer'
