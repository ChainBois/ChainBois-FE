'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import {
	useResponsiveLayout,
	useNotifications,
	usePlatformDataFetcher,
	useAuth,
	useDebouncedEffect,
} from '@/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import {
	useActiveAccount,
	useActiveWalletConnectionStatus,
	useActiveWallet,
} from 'thirdweb/react'
import { useSession } from 'next-auth/react'

export const MainContext = React.createContext()

const APP_BREAKPOINTS = {
	isMobile: MOBILE_QUERY,
	isTablet: TABLET_QUERY,
	isDesktop: '(min-width: 834px)',
}

const MainContextProvider = ({ children }) => {
	const { dimensions, matches } = useResponsiveLayout(APP_BREAKPOINTS)

	const { data: session, status } = useSession()

	const {
		makeRequest,
		user,
		setUser,
		requestingLogin,
		loginRequest,
		refresh,
		login,
		logout,
	} = useAuth()

	const {
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
		displayAlert,
	} = useNotifications()

	const activeAccount = useActiveAccount()
	const activeWallet = useActiveWallet()
	const isConnected = useActiveWalletConnectionStatus() === 'connected'

	const [platformDataIsLoading, setPlatformDataIsLoading] = useState(false)
	const [tempAddress, setTempAddress] = useState('')
	const [triggerCounter, setTriggerCounter] = useState(0)

	const updateTriggerCounter = () => setTriggerCounter((x) => x + 1)

	const { retrievePlatformData } = usePlatformDataFetcher({
		user,
		activeAddress: activeAccount?.address,
		platformDataIsLoading,
		setPlatformDataIsLoading,
		updateTriggerCounter,
	})

	const checkIfUserExists = async (email) => {
		const res = await request({
			path: `auth/check-user/${email}`,
			method: 'post',
		})
		setUserExists(res?.data?.exists)
	}

	const ContextValue = useMemo(
		() => ({
			dimensions,
			query: matches,
			retrievePlatformData,
		}),
		[dimensions, matches],
	)

	useEffect(() => {
		const revalidateUserOnStatusChange = async () => {
			if (status === 'authenticated') {
				const {
					user: { accessToken, ...user },
				} = session
				if (accessToken && (activeAccount?.address ?? '')) {
					await login({
						address: activeAccount?.address ?? '',
						accessToken,
						showLoading,
					})
				} else {
					showAlert({
						title: 'Dear Gamer',
						message: `We're unable create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
					})
				}
			} else if (status === 'unauthenticated') {
				setUser((x) => ({}))
			}
			// await fetch('/api/auth/session')
		}
		revalidateUserOnStatusChange()
	}, [status])

	const hasLoginResolve = useMemo(
		() => !!loginRequest?.resolve,
		[loginRequest?.resolve],
	)
	const hasLoginReject = useMemo(
		() => !!loginRequest?.reject,
		[loginRequest?.reject],
	)

	useDebouncedEffect(
		(deps) => {
			const [
				activeAddress,
				isActive,
				isConnected,
				requestingLogin,
				hasResolve,
				hasReject,
				tempAddress,
			] = deps

			const handleLoginEffect = async () => {
				const walletIsConnectedAndActive = isActive && isConnected
				if (activeAddress && walletIsConnectedAndActive) {
					if (tempAddress !== activeAddress || requestingLogin) {
						// const res = await checkIfUserExists(
						// 	async () => await login({ address: activeAddress, accessToken: undefined }), // TODO: showLoading?
						// )
						// if (res) {
						// 	if (requestingLogin && hasResolve && loginRequest?.resolve) {
						// 		loginRequest.resolve(res) // Current closure reference
						// 	}
						// 	setTempAddress(() => activeAddress)
						// } else {
						// 	if (requestingLogin && hasReject && loginRequest?.reject) {
						// 		loginRequest.reject() // Current closure reference
						// 	}
						// 	logout(false)
						// }
						logout(false)
					}
				}
			}
			handleLoginEffect()
		},
		[
			activeAccount?.address,
			!!activeWallet,
			isConnected,
			requestingLogin,
			hasLoginResolve,
			hasLoginReject,
			tempAddress,
		],
	)

	useEffect(() => {
		retrievePlatformData()
	}, [])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
