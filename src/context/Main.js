'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import {
	useResponsiveLayout,
	useNotifications,
	usePlatformDataFetcher,
	useAuth,
} from '@/hooks'
import {
	fetchInventory,
	fetchInventoryHistory,
	fetchInventoryNfts,
	fetchInventoryWeapons,
	normalizeWeaponAssets,
	request,
} from '@/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
	const hasSeenConnectedWalletRef = useRef(false)

	const [platformDataIsLoading, setPlatformDataIsLoading] = useState(false)
	const [triggerCounter, setTriggerCounter] = useState(0)
	const [platformSettings, setPlatformSettings] = useState({})
	const [inventoryHistory, setInventoryHistory] = useState(null)

	const updateTriggerCounter = useCallback(
		() => setTriggerCounter((x) => x + 1),
		[],
	)

	const getPlatformSettings = useCallback(async () => {
		const res = await request({
			path: '/settings',
		})
		if (res?.success) {
			setPlatformSettings(res?.data?.data)
		}
	}, [])

	const getUserInventoryData = useCallback(
		async ({ address } = {}) => {
			const walletAddress =
				address ?? activeAccount?.address ?? user?.address ?? ''
			if (!walletAddress) return { success: false, message: 'Wallet required' }

			const res = await fetchInventory({ address: walletAddress })
			if (res?.success) {
				const inventory = res?.data?.data ?? {}
				const weapons = normalizeWeaponAssets(inventory?.weapons)
				const chainbois = Array.isArray(inventory?.chainbois)
					? inventory.chainbois
					: []
				const balances =
					inventory?.balances && typeof inventory.balances === 'object'
						? inventory.balances
						: {}
				const counts =
					inventory?.counts && typeof inventory.counts === 'object'
						? inventory.counts
						: {}

				setUser((current) => ({
					...current,
					address: current?.address ?? walletAddress,
					inventory,
					weapons,
					chainbois,
					inventoryBalances: balances,
					inventoryCounts: counts,
				}))
			}

			return res
		},
		[activeAccount?.address, setUser, user?.address],
	)

	const getUserInventoryWeapons = useCallback(
		async ({ address } = {}) => {
			const walletAddress =
				address ?? activeAccount?.address ?? user?.address ?? ''
			if (!walletAddress) return { success: false, message: 'Wallet required' }

			const res = await fetchInventoryWeapons({ address: walletAddress })
			if (res?.success) {
				const weapons = normalizeWeaponAssets(res?.data?.data)
				setUser((current) => ({
					...current,
					address: current?.address ?? walletAddress,
					weapons,
				}))
			}
			return res
		},
		[activeAccount?.address, setUser, user?.address],
	)

	const getUserInventoryNfts = useCallback(
		async ({ address } = {}) => {
			const walletAddress =
				address ?? activeAccount?.address ?? user?.address ?? ''
			if (!walletAddress) return { success: false, message: 'Wallet required' }

			const res = await fetchInventoryNfts({ address: walletAddress })
			if (res?.success) {
				const chainbois = Array.isArray(res?.data?.data) ? res.data.data : []
				setUser((current) => ({
					...current,
					address: current?.address ?? walletAddress,
					chainbois,
				}))
			}
			return res
		},
		[activeAccount?.address, setUser, user?.address],
	)

	const getUserInventoryHistory = useCallback(
		async ({ address, page, limit, type } = {}) => {
			const walletAddress =
				address ?? activeAccount?.address ?? user?.address ?? ''
			if (!walletAddress) return { success: false, message: 'Wallet required' }

			const res = await fetchInventoryHistory({
				address: walletAddress,
				page,
				limit,
				type,
			})
			if (res?.success) {
				setInventoryHistory(res?.data?.data ?? null)
			}
			return res
		},
		[activeAccount?.address, user?.address],
	)

	const { retrievePlatformData } = usePlatformDataFetcher({
		user,
		activeAddress: activeAccount?.address,
		platformDataIsLoading,
		setPlatformDataIsLoading,
		updateTriggerCounter,
		getPlatformSettings,
		getUserInventoryData,
	})

	const ContextValue = useMemo(
		() => ({
			dimensions,
			query: matches,
			retrievePlatformData,
			platformSettings,
			inventoryHistory,
			setInventoryHistory,
			getUserInventoryData,
			getUserInventoryWeapons,
			getUserInventoryNfts,
			getUserInventoryHistory,
		}),
		[
			dimensions,
			matches,
			retrievePlatformData,
			platformSettings,
			inventoryHistory,
			getUserInventoryData,
			getUserInventoryWeapons,
			getUserInventoryNfts,
			getUserInventoryHistory,
		],
	)

	const sessionAccessToken = session?.user?.accessToken ?? null

	useEffect(() => {
		if (isConnected) {
			hasSeenConnectedWalletRef.current = true
		}
	}, [isConnected])

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
				hasSeenConnectedWalletRef.current = false
				setUser(() => ({}))
			}
			// await fetch('/api/auth/session')
		}
		revalidateUserOnStatusChange()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		activeAccount?.address,
		sessionAccessToken,
		setUser,
		status,
	])

	useEffect(() => {
		if (status === 'unauthenticated') {
			hasSeenConnectedWalletRef.current = false
			return
		}

		if (status !== 'authenticated' || isConnected) return
		if (!hasSeenConnectedWalletRef.current) return

		hasSeenConnectedWalletRef.current = false
		void logout(false, null)
	}, [isConnected, logout, status])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
