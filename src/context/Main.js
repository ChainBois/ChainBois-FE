'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import {
	useResponsiveLayout,
	useNotifications,
	usePlatformDataFetcher,
	useAuth,
} from '@/hooks'
import {
	fetchArmoryNfts,
	fetchArmoryWeapons,
	fetchInventory,
	fetchInventoryHistory,
	fetchInventoryNfts,
	fetchInventoryWeapons,
	normalizeChainBoiListingsPayload,
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

const EMPTY_MARKET_DATA = Object.freeze({
	nfts: [],
	price: null,
	currency: 'AVAX',
	available: 0,
	paymentAddress: '',
})

const createInitialArmoryContent = () => ({
	weapons: [],
	isLoading: false,
	error: '',
	hasError: false,
	hasLoaded: false,
	lastFetchedAt: null,
})

const createInitialMarketplaceContent = () => ({
	marketData: EMPTY_MARKET_DATA,
	isLoading: false,
	error: '',
	hasError: false,
	hasLoaded: false,
	lastFetchedAt: null,
})

const createInitialLeaderboardContent = () => ({
	entries: [],
	viewerRank: null,
	pagination: null,
	isLoading: false,
	hasError: false,
	hasLoaded: false,
	lastFetchedAt: null,
})

const getViewerUid = (user) =>
	user?.uid ?? user?.userID ?? user?._id ?? user?.id ?? null

const normalizeArmoryWeaponsPayload = (payload = {}) => {
	if (Array.isArray(payload)) {
		return normalizeWeaponAssets(payload)
	}
	if (!payload || typeof payload !== 'object') return []

	const weapons = []

	for (const [category, items] of Object.entries(payload)) {
		if (!Array.isArray(items)) continue

		for (const weapon of items) {
			weapons.push({
				category: weapon?.category ?? category,
				...weapon,
			})
		}
	}

	return normalizeWeaponAssets(weapons)
}

const normalizeLeaderboardEntries = (payload) => {
	const candidates = [
		payload?.data?.entries,
		payload?.data?.leaderboard,
		payload?.data?.items,
		payload?.data?.data?.entries,
		payload?.data?.data?.leaderboard,
		payload?.data?.data?.items,
		payload?.data,
	]

	for (const candidate of candidates) {
		if (Array.isArray(candidate)) return candidate
	}

	return []
}

const normalizeLeaderboardPagination = (payload) => {
	const candidates = [
		payload?.data?.pagination,
		payload?.data?.data?.pagination,
		payload?.data,
		payload?.data?.data,
		payload?.pagination,
	]
	for (const candidate of candidates) {
		if (!candidate || typeof candidate !== 'object') continue

		const pages = candidate?.pages ?? candidate?.totalPages
		const currentPage = candidate?.page ?? candidate?.currentPage
		const totalUsers = candidate?.total ?? candidate?.totalUsers
		const hasUsefulFields =
			pages !== undefined || currentPage !== undefined || totalUsers !== undefined

		if (hasUsefulFields) {
			return {
				...candidate,
				pages,
				page: currentPage,
				total: totalUsers,
			}
		}
	}
	return null
}

const buildLeaderboardPaths = ({ period = 'all', limit = 20, page = 1 }) => {
	const safePeriod = period || 'all'
	const safeLimit = Number(limit) || 20
	const safePage = Number(page) || 1

	if (safePeriod === 'all') {
		return [`leaderboard?limit=${safeLimit}&page=${safePage}`]
	}

	return [
		`leaderboard/${safePeriod}?limit=${safeLimit}&page=${safePage}`,
		`leaderboard?period=${encodeURIComponent(safePeriod)}&limit=${safeLimit}&page=${safePage}`,
	]
}

const buildRankPaths = ({ uid, period = 'all' }) => {
	if (!uid) return []
	const safePeriod = period || 'all'

	return [
		`leaderboard/rank/${uid}`,
		`leaderboard/rank/${uid}?period=${encodeURIComponent(safePeriod)}`,
		`leaderboard/rank/${uid}/${safePeriod}`,
	]
}

const requestWithFallbackPaths = async (paths, accessToken) => {
	for (const path of paths) {
		const res = await request({
			path,
			method: 'get',
			...(accessToken ? { accessToken } : {}),
		})
		if (res?.success) return res
	}
	return null
}

const buildLeaderboardContentKey = ({
	period = 'all',
	limit = 20,
	page = 1,
	viewerUid = '',
} = {}) =>
	[
		'leaderboard',
		period || 'all',
		String(Number(limit) || 20),
		String(Number(page) || 1),
		String(viewerUid ?? 'guest'),
	].join(':')

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
	const [armoryContent, setArmoryContent] = useState(createInitialArmoryContent)
	const [marketplaceContent, setMarketplaceContent] = useState(
		createInitialMarketplaceContent,
	)
	const [leaderboardContentByKey, setLeaderboardContentByKey] = useState({})
	const armoryContentRef = useRef(armoryContent)
	const marketplaceContentRef = useRef(marketplaceContent)
	const leaderboardContentRef = useRef(leaderboardContentByKey)
	const viewerUid = useMemo(() => getViewerUid(user), [user])

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

	const { retrievePlatformData, retrievePageContent } = usePlatformDataFetcher({
		user,
		activeAddress: activeAccount?.address,
		platformDataIsLoading,
		setPlatformDataIsLoading,
		updateTriggerCounter,
		getPlatformSettings,
		getUserInventoryData,
	})

	useEffect(() => {
		armoryContentRef.current = armoryContent
	}, [armoryContent])

	useEffect(() => {
		marketplaceContentRef.current = marketplaceContent
	}, [marketplaceContent])

	useEffect(() => {
		leaderboardContentRef.current = leaderboardContentByKey
	}, [leaderboardContentByKey])

	const loadArmoryWeapons = useCallback(
		async ({ force = false } = {}) => {
			const currentContent = armoryContentRef.current
			if (!force && currentContent?.hasLoaded && !currentContent?.hasError) {
				return {
					success: true,
					cached: true,
					data: { data: currentContent?.weapons ?? [] },
				}
			}

			return await retrievePageContent({
				key: 'page:armory:weapons',
				onLoadingChange: (isLoading) => {
					setArmoryContent((current) => ({
						...current,
						isLoading,
					}))
				},
				fetcher: async () => {
					const res = await fetchArmoryWeapons()
					if (!res?.success) return res

					return {
						...res,
						normalizedData: normalizeArmoryWeaponsPayload(res?.data?.data ?? {}),
					}
				},
				onSuccess: (res) => {
					const weapons = Array.isArray(res?.normalizedData)
						? res.normalizedData
						: []

					setArmoryContent((current) => ({
						...current,
						weapons,
						error: weapons.length
							? ''
							: 'No weapons are currently available in the armory.',
						hasError: false,
						hasLoaded: true,
						lastFetchedAt: Date.now(),
					}))
				},
				onError: (res) => {
					setArmoryContent((current) => ({
						...current,
						weapons: [],
						error:
							res?.message ||
							res?.error ||
							'We could not load the armory weapons right now.',
						hasError: true,
						hasLoaded: true,
						lastFetchedAt: Date.now(),
					}))
				},
			})
		},
		[retrievePageContent],
	)

	const loadPrimaryMarket = useCallback(
		async ({ force = false } = {}) => {
			const currentContent = marketplaceContentRef.current
			if (!force && currentContent?.hasLoaded && !currentContent?.hasError) {
				return {
					success: true,
					cached: true,
					data: { data: currentContent?.marketData ?? EMPTY_MARKET_DATA },
				}
			}

			return await retrievePageContent({
				key: 'page:marketplace:primary',
				onLoadingChange: (isLoading) => {
					setMarketplaceContent((current) => ({
						...current,
						isLoading,
					}))
				},
				fetcher: async () => {
					const res = await fetchArmoryNfts()
					if (!res?.success) return res

					return {
						...res,
						normalizedData: normalizeChainBoiListingsPayload(
							res?.data?.data ?? {},
						),
					}
				},
				onSuccess: (res) => {
					const marketData =
						res?.normalizedData && typeof res.normalizedData === 'object'
							? res.normalizedData
							: EMPTY_MARKET_DATA

					setMarketplaceContent((current) => ({
						...current,
						marketData,
						error: marketData?.nfts?.length
							? ''
							: 'No purchasable ChainBois are currently listed in the Primary Market.',
						hasError: false,
						hasLoaded: true,
						lastFetchedAt: Date.now(),
					}))
				},
				onError: (res) => {
					setMarketplaceContent((current) => ({
						...current,
						marketData: EMPTY_MARKET_DATA,
						error:
							res?.message ||
							res?.error ||
							'We could not load the Primary Market listings right now.',
						hasError: true,
						hasLoaded: true,
						lastFetchedAt: Date.now(),
					}))
				},
			})
		},
		[retrievePageContent],
	)

	const buildLeaderboardPageKey = useCallback(
		({ period = 'all', limit = 20, page = 1 } = {}) =>
			buildLeaderboardContentKey({
				period,
				limit,
				page,
				viewerUid,
			}),
		[viewerUid],
	)

	const loadLeaderboardContent = useCallback(
		async ({ period = 'all', limit = 20, page = 1, force = false } = {}) => {
			const cacheKey = buildLeaderboardContentKey({
				period,
				limit,
				page,
				viewerUid,
			})
			const currentContent = leaderboardContentRef.current?.[cacheKey]

			if (!force && currentContent?.hasLoaded && !currentContent?.hasError) {
				return {
					success: true,
					cached: true,
					data: currentContent,
				}
			}

			return await retrievePageContent({
				key: `page:${cacheKey}`,
				onLoadingChange: (isLoading) => {
					setLeaderboardContentByKey((current) => ({
						...current,
						[cacheKey]: {
							...(current?.[cacheKey] ?? createInitialLeaderboardContent()),
							isLoading,
						},
					}))
				},
				fetcher: async () => {
					const accessToken = user?.accessToken ?? ''
					const [leaderboardRes, rankRes] = await Promise.all([
						requestWithFallbackPaths(
							buildLeaderboardPaths({ period, limit, page }),
							accessToken,
						),
						viewerUid
							? requestWithFallbackPaths(
									buildRankPaths({ uid: viewerUid, period }),
									accessToken,
								)
							: Promise.resolve(null),
					])

					if (!leaderboardRes?.success) {
						return (
							leaderboardRes ?? {
								success: false,
								message: 'We could not load the leaderboard right now.',
							}
						)
					}

					return {
						success: true,
						leaderboardRes,
						rankRes,
					}
				},
				onSuccess: ({ leaderboardRes, rankRes }) => {
					setLeaderboardContentByKey((current) => ({
						...current,
						[cacheKey]: {
							...(current?.[cacheKey] ?? createInitialLeaderboardContent()),
							entries: normalizeLeaderboardEntries(leaderboardRes),
							viewerRank: rankRes?.success
								? (rankRes?.data?.data ?? rankRes?.data ?? null)
								: null,
							pagination: normalizeLeaderboardPagination(leaderboardRes),
							hasError: false,
							hasLoaded: true,
							lastFetchedAt: Date.now(),
						},
					}))
				},
				onError: () => {
					setLeaderboardContentByKey((current) => ({
						...current,
						[cacheKey]: {
							...(current?.[cacheKey] ?? createInitialLeaderboardContent()),
							entries: [],
							viewerRank: null,
							pagination: null,
							hasError: true,
							hasLoaded: true,
							lastFetchedAt: Date.now(),
						},
					}))
				},
			})
		},
		[retrievePageContent, user?.accessToken, viewerUid],
	)

	const ContextValue = useMemo(
		() => ({
			dimensions,
			query: matches,
			retrievePlatformData,
			platformSettings,
			inventoryHistory,
			setInventoryHistory,
			armoryContent,
			marketplaceContent,
			leaderboardContentByKey,
			buildLeaderboardPageKey,
			loadArmoryWeapons,
			loadPrimaryMarket,
			loadLeaderboardContent,
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
			armoryContent,
			marketplaceContent,
			leaderboardContentByKey,
			buildLeaderboardPageKey,
			loadArmoryWeapons,
			loadPrimaryMarket,
			loadLeaderboardContent,
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
