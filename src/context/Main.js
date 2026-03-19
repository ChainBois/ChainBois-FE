'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import {
	useResponsiveLayout,
	useNotifications,
	usePlatformDataFetcher,
	useAuth,
} from '@/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useActiveAccount,
	useActiveWalletConnectionStatus,
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

	const { user, setUser, login, logout, fetchCurrentUser } = useAuth()

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
		showLoading,
		showError,
		hideLoading,
		hideError,
	} = useNotifications()

	const showAlert = useCallback(
		({ ...opts }) =>
			displayAlert({
				useShowAlert: true,
				...opts,
			}),
		[displayAlert],
	)

	const activeAccount = useActiveAccount()
	const isConnected = useActiveWalletConnectionStatus() === 'connected'

	const [platformDataIsLoading, setPlatformDataIsLoading] = useState(false)
	const [triggerCounter, setTriggerCounter] = useState(0)
	const [platformSettings, setPlatformSettings] = useState({})

	const updateTriggerCounter = () => setTriggerCounter((x) => x + 1)

	const getPlatformSettings = async () => {
		const res = await request({
			path: '/settings',
		})
		if (res?.success) {
			setPlatformSettings(res?.data?.data)
		}
	}

	const { retrievePlatformData } = usePlatformDataFetcher({
		user,
		activeAddress: activeAccount?.address,
		platformDataIsLoading,
		setPlatformDataIsLoading,
		updateTriggerCounter,
		getPlatformSettings,
	})

	const ContextValue = useMemo(
		() => ({
			dimensions,
			query: matches,
			retrievePlatformData,
			platformSettings,
		}),
		[dimensions, matches, platformSettings, retrievePlatformData],
	)

	const sessionAccessToken = session?.user?.accessToken ?? null

	useEffect(() => {
		const revalidateUserOnStatusChange = async () => {
			if (status === 'authenticated') {
				if (sessionAccessToken && (activeAccount?.address ?? '')) {
					await login({
						address: activeAccount?.address ?? '',
						accessToken: sessionAccessToken,
						showLoading,
					})
				} else if (sessionAccessToken) {
					await fetchCurrentUser({
						accessToken: sessionAccessToken,
						silent: true,
						showError,
					})
				} else {
					showAlert({
						title: 'Dear Gamer',
						message: `We're unable create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
					})
				}
			} else if (status === 'unauthenticated') {
				await logout(false, null)
			}
			// await fetch('/api/auth/session')
		}
		revalidateUserOnStatusChange()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		activeAccount?.address,
		sessionAccessToken,
		status,
	])

	useEffect(() => {
		retrievePlatformData()
	}, [retrievePlatformData])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
