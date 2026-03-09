'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useToastIntegration } from '@/hooks'
import { estimateReadingTimeMs } from '@/utils'

export const NotificationSystemContext = React.createContext()

const NotificationSystemContextProvider = ({ children }) => {
	const isClient = typeof window !== 'undefined'

	const [modal, setModal] = useState('loading')
	const [showModal, setShowModal] = useState(false)
	const [modalParent, setModalParent] = useState('')
	const [showModalParent, setShowModalParent] = useState(false)
	const [canCloseModal, setCanCloseModal] = useState(true)
	const [canCloseModalParent, setCanCloseModalParent] = useState(true)

	const [[stage1, setStage1], [stage2, setStage2], [stage3, setStage3]] = [
		useState({
			success: false,
			tag: 'Creation Request',
			description: 'Sending creation request',
			processing: true,
			complete: false,
		}),
		useState({
			success: false,
			tag: '$AVAX Payment',
			description: 'Pending...',
			processing: false,
			complete: false,
		}),
		useState({
			success: false,
			tag: 'Token Transfer',
			description: 'Queued',
			processing: false,
			complete: false,
		}),
	]

	const [alertInfo, setAlertInfo] = useState({
		title: 'Hey',
		message: `You've got a message`,
		forConfirmation: true,
		neg: {
			tag: 'Cancel',
			value: null,
		},
		pos: {
			tag: 'Continue',
			value: true,
		},
	})
	const [promiseOfConfirmation, setPromiseOfConfirmation] = useState({})
	const [loadingInfo, setLoadingInfo] = useState({
		title: 'Processing Request',
		message: 'Please wait while we process this action.',
		successMessage: 'Done. Finalizing...',
	})
	const [errorInfo, setErrorInfo] = useState({
		title: 'Action Failed',
		message: 'Something went wrong.',
		details: '',
		code: null,
		actionTag: 'Retry',
		action: null,
	})

	const [forCreation, setForCreation] = useState(true)
	const [complete, setComplete] = useState(false)

	/**
	 * Shows an alert
	 * @param {String} title A string title for the alert
	 * @param {String} message The alert message
	 * @param {Boolean} forConfirmation A boolean indicating whether a prompt should be presented to the user and a promise returned with the user's resolution
	 * @param {Object} neg An object with two properties-tag and value; used to express the user's negative response
	 * @param {Object} pos An object with two properties-tag and value; used to express the user's positive response
	 */
	const showAlert = async ({
		title = 'Hey',
		message = `You've got a message`,
		forConfirmation = false,
		neg = {},
		pos = {},
	}) => {
		setAlertInfo(() => ({
			title,
			message,
			forConfirmation,
			neg:
				Object.keys(neg).length === 2
					? neg
					: {
							tag: neg?.tag ?? 'Cancel',
							value: neg?.value ?? null,
						},
			pos:
				Object.keys(pos).length === 2
					? pos
					: {
							tag: pos?.tag ?? 'Continue',
							value: pos?.value ?? true,
						},
		}))
		setCanCloseModal(() => false)
		setModal(() => 'alert')
		setShowModal(() => true)
		return await new Promise((resolve, reject) => {
			setPromiseOfConfirmation({ resolve, reject })
		})
			.then((e) => e)
			.catch((e) => e)
	}

	const showLoading = useCallback(
		({
			title = 'Processing Request',
			message = 'Please wait while we process this action.',
			successMessage = 'Done. Finalizing...',
			canClose = false,
		} = {}) => {
			setLoadingInfo(() => ({ title, message, successMessage }))
			setCanCloseModal(() => canClose)
			setModal(() => 'loading')
			setShowModal(() => true)
		},
		[],
	)

	const showCreationProgress = useCallback(
		({
			title = 'Processing Request',
			message = 'Please wait while we process this action.',
			successMessage = 'Done. Finalizing...',
			canClose = false,
		} = {}) => {
			setLoadingInfo(() => ({ title, message, successMessage }))
			setCanCloseModal(() => canClose)
			setModal(() => 'creationProgress')
			setShowModal(() => true)
		},
		[],
	)

	const hideLoading = useCallback(() => {
		setCanCloseModal(() => true)
		setShowModal(() => false)
	}, [])

	const hideCreationProgress = useCallback(() => {
		setCanCloseModal(() => true)
		setShowModal(() => false)
	}, [])

	const showError = useCallback(
		({
			title = 'Action Failed',
			message = 'Something went wrong.',
			details = '',
			code = null,
			actionTag = 'Retry',
			action = null,
			canClose = true,
		} = {}) => {
			setErrorInfo(() => ({
				title,
				message,
				details,
				code,
				actionTag,
				action,
			}))
			setCanCloseModal(() => canClose)
			setModal(() => 'error')
			setShowModal(() => true)
		},
		[],
	)

	const hideError = useCallback(() => {
		setCanCloseModal(() => true)
		setShowModal(() => false)
	}, [])

	const { isAvailable, showToast } = useToastIntegration()

	const displayAlert = useCallback(
		async ({
			title,
			message,
			type = 'info',
			useShowAlert = false,
			leaveModal = false,
			...options
		}) => {
			const defaultDurations = {
				info: 6000,
				success: 5000,
				error: 10000,
				warning: 7000,
			}
			if (!leaveModal) setShowModal(() => false)

			return isClient && !useShowAlert && isAvailable
				? showToast(type, title, {
						body: message,
						icon: '/favicon.ico',
						duration:
							options.duration ??
							Math.max(
								estimateReadingTimeMs(message, {
									includeImages: false,
									includeHeadings: false,
								}).totalMs ?? 0,
								defaultDurations[type],
							),
						...options,
				  })
				: showAlert({ title, message, ...options })
		},
		[showAlert, isClient, setShowModal, isAvailable, showToast],
	)

	const ContextValue = useMemo(
		() => ({
			modal,
			setModal,
			showModal,
			setShowModal,
			modalParent,
			setModalParent,
			showModalParent,
			setShowModalParent,
			canCloseModal,
			setCanCloseModal,
			canCloseModalParent,
			setCanCloseModalParent,
			stage1,
			setStage1,
			stage2,
			setStage2,
			stage3,
			setStage3,
			alertInfo,
			setAlertInfo,
			promiseOfConfirmation,
			setPromiseOfConfirmation,
			forCreation,
			setForCreation,
			complete,
			setComplete,
			loadingInfo,
			setLoadingInfo,
			errorInfo,
			setErrorInfo,
			showLoading,
			showCreationProgress,
			hideLoading,
			hideCreationProgress,
			showError,
			hideError,
			showAlert,
			displayAlert,
		}),
		[
			modal,
			showModal,
			modalParent,
			showModalParent,
			canCloseModal,
			canCloseModalParent,
			stage1,
			stage2,
			stage3,
			alertInfo,
			promiseOfConfirmation,
			forCreation,
			complete,
			loadingInfo,
			errorInfo,
			showLoading,
			showCreationProgress,
			hideLoading,
			hideCreationProgress,
			showError,
			hideError,
			showAlert,
			displayAlert,
		],
	)

	return (
		<NotificationSystemContext.Provider value={ContextValue}>
			{children}
		</NotificationSystemContext.Provider>
	)
}

export default NotificationSystemContextProvider
