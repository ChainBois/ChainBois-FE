'use client'

import { useContext } from 'react'
import { ToastContext } from '@/context'

export const useToastIntegration = () => {
	const toastContext = useContext(ToastContext)

	return {
		isAvailable: Boolean(toastContext),
		showToast: (type, title, options = {}) => {
			if (!toastContext) {
				console.warn('Toast context unavailable')
				return null
			}

			const method = `show${type.charAt(0).toUpperCase() + type.slice(1)}`
			const toastMethod = toastContext[method]

			if (!toastMethod) {
				console.warn(`Toast method ${method} not found`)
				return null
			}

			const content = options.body ? `${title}: ${options.body}` : title
			return toastMethod(content, options)
		},
	}
}
