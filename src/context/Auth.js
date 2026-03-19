'use client'

import { refreshRequest, request, requestUpload } from '@/utils'
import axios from 'axios'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { signOut, getSession, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { useNotifications } from '@/hooks'

export const AuthContext = React.createContext()

const asTokenId = (value) => {
	const tokenId = Number(value)
	return Number.isInteger(tokenId) && tokenId >= 0 ? tokenId : null
}

const asFiniteNumber = (value) => {
	const num = Number(value)
	return Number.isFinite(num) ? num : null
}

const normalizeChainBoiAssets = (assets) => {
	if (Array.isArray(assets)) return assets.filter(Boolean)

	if (assets && typeof assets === 'object') {
		if (Array.isArray(assets.assets)) return assets.assets.filter(Boolean)

		const tokenId = asTokenId(assets?.tokenId ?? assets?.nftTokenId)
		if (tokenId !== null) {
			return [
				{
					tokenId,
					level: asFiniteNumber(assets?.level) ?? 1,
				},
			]
		}
	}

	return []
}

const getMaxAssetLevel = (assets = [], fallback = 1) => {
	if (!Array.isArray(assets) || assets.length === 0) return fallback

	let maxLevel = fallback
	for (const asset of assets) {
		const level = asFiniteNumber(asset?.level)
		if (level !== null) maxLevel = Math.max(maxLevel, level)
	}
	return maxLevel
}

const mergeWeaponsByTokenId = (currentWeapons = [], incomingWeapons = []) => {
	if (!Array.isArray(currentWeapons) && !Array.isArray(incomingWeapons))
		return []
	if (!Array.isArray(currentWeapons)) return incomingWeapons
	if (!Array.isArray(incomingWeapons)) return currentWeapons

	const byTokenId = new Map()
	for (const weapon of currentWeapons) {
		const tokenId = asTokenId(weapon?.tokenId)
		if (tokenId === null) continue
		byTokenId.set(tokenId, weapon)
	}
	for (const weapon of incomingWeapons) {
		const tokenId = asTokenId(weapon?.tokenId)
		if (tokenId === null) continue
		byTokenId.set(tokenId, weapon)
	}
	return [...byTokenId.values()]
}

const AuthContextProvider = ({ children }) => {
	const activeAccount = useActiveAccount()
	const router = useRouter()
	const pathname = usePathname()
	const { data: session } = useSession()
	const { displayAlert } = useNotifications()
	const [user, setUser] = useState({})
	const [requestingLogin, setRequestingLogin] = useState(false)
	const [loginRequest, setLoginRequest] = useState(null)
	const loginRequestRef = useRef(null)

	const beginInteractiveLogin = useCallback(async () => {
		setRequestingLogin(true)
		return new Promise((resolve, reject) => {
			const nextLoginRequest = { resolve, reject }
			loginRequestRef.current = nextLoginRequest
			setLoginRequest(nextLoginRequest)
		})
	}, [])

	const clearInteractiveLogin = useCallback(() => {
		loginRequestRef.current = null
		setLoginRequest(null)
		setRequestingLogin(false)
	}, [])

	const resolvePendingLogin = useCallback(
		(accessToken) => {
			if (accessToken && loginRequestRef.current?.resolve) {
				loginRequestRef.current.resolve(accessToken)
			}
			clearInteractiveLogin()
		},
		[clearInteractiveLogin],
	)

	const rejectPendingLogin = useCallback(
		(message = 'Authentication failed') => {
			if (loginRequestRef.current?.reject) {
				loginRequestRef.current.reject(new Error(message))
			}
			clearInteractiveLogin()
		},
		[clearInteractiveLogin],
	)

	const applyUserPayload = useCallback((payload = {}) => {
		const { user: rawUser = {}, assets, weapons } = payload ?? {}
		const { accessToken = null, ...userData } = rawUser ?? {}

		const hasProvidedAssets =
			payload && Object.prototype.hasOwnProperty.call(payload, 'assets')
		const hasProvidedWeapons =
			payload && Object.prototype.hasOwnProperty.call(payload, 'weapons')

		const normalizedWeapons =
			hasProvidedWeapons && Array.isArray(weapons) ? weapons : null

		setUser((current) => {
			const normalizedAssets = hasProvidedAssets
				? normalizeChainBoiAssets(assets)
				: null

			const shouldUpdateAssetConvenience =
				hasProvidedAssets ||
				userData?.hasNft !== undefined ||
				userData?.nftTokenId !== undefined

			const nextNftTokenId = shouldUpdateAssetConvenience
				? (asTokenId(userData?.nftTokenId) ??
					(hasProvidedAssets
						? asTokenId(normalizedAssets?.[0]?.tokenId)
						: null) ??
					asTokenId(current?.nftTokenId) ??
					null)
				: undefined

			const nextHasNft = shouldUpdateAssetConvenience
				? (userData?.hasNft ??
					(hasProvidedAssets
						? (normalizedAssets?.length ?? 0) > 0
						: (current?.hasNft ?? nextNftTokenId !== null)))
				: undefined

			const nextLevel = shouldUpdateAssetConvenience
				? (asFiniteNumber(userData?.level) ??
					(hasProvidedAssets
						? getMaxAssetLevel(
								normalizedAssets ?? [],
								asFiniteNumber(current?.level) ?? 1,
							)
						: (asFiniteNumber(current?.level) ?? 1)))
				: undefined

			return {
				...current,
				...userData,
				...(shouldUpdateAssetConvenience
					? {
							hasNft: nextHasNft,
							nftTokenId: nextNftTokenId,
							level: nextLevel,
						}
					: {}),
				...(normalizedAssets ? { assets: normalizedAssets } : {}),
				...(normalizedWeapons ? { weapons: normalizedWeapons } : {}),
				...(accessToken ? { accessToken } : {}),
			}
		})
	}, [])

	const refresh = useCallback(async () => {
		const jwtRes = await refreshRequest(
			user?.accessToken ?? '',
			user?.address ?? '',
		)
		if (jwtRes?.accessToken) {
			setUser((x) => ({
				...x,
				accessToken: jwtRes?.accessToken,
			}))
			return jwtRes?.accessToken
		}
		return false
	}, [user?.accessToken, user?.address])

	const sessionAccessToken = session?.user?.accessToken ?? null

	const makeRequest = useCallback(
		async (
			{
				path = '',
				method = 'get',
				body = {},
				prop = 'data',
				includeClientID = false,
			} = {},
			upload = false,
		) => {
			const source = axios.CancelToken.source()
			let accessToken = ''

			// Get access token
			if (sessionAccessToken) {
				accessToken = sessionAccessToken
			} else {
				displayAlert({
					title: 'Authentication Required',
					message: 'Please log in to perform this action.',
					type: 'error',
					duration: 5000,
				})
				const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
				router.replace(`/access-request${nextPath}`)
				return { success: false, message: 'Authentication required' }
			}

			// Helper function to make the actual request
			const makeApiCall = (token) => {
				return upload
					? requestUpload({
							path,
							method,
							file: body,
							accessToken: token,
							cancelToken: source.token,
						})
					: request({
							path,
							method,
							body,
							accessToken: token,
							prop,
							includeClientID,
							cancelToken: source.token,
						})
			}

			// Initial request
			let response = await makeApiCall(accessToken)

			// Handle 401/expired token
			if (
				response?.error?.statusCode === 401 ||
				response?.status === 401 ||
				response?.message === 'Token has expired'
			) {
				// Try refresh first
				const refreshedToken = await refresh()
				if (refreshedToken) {
					return await makeApiCall(refreshedToken)
				}

				// If refresh fails, try re-login
				displayAlert({
					title: 'Authentication Required',
					message: 'Please log in to perform this action.',
					type: 'error',
					duration: 5000,
				})
				const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
				router.replace(`/access-request${nextPath}`)
				return { success: false, message: 'Authentication required' }
			}

			return response
		},
		[refresh, displayAlert, pathname, router, sessionAccessToken],
	)

	const login = useCallback(
		async ({ address, accessToken, showLoading }) => {
			const res = await request({
				path: `auth/login`,
				method: 'post',
				body: {
					address: address || '',
				},
				accessToken: accessToken,
			})
			if (
				res?.error?.statusCode === 401 ||
				res?.status === 401 ||
				res?.message === 'Token has expired'
			) {
				if (sessionAccessToken) {
					showLoading?.()
					const x = await signOut({
						callbackUrl: '/access-request',
						redirect: false,
					})
					const session = await getSession()

					await makeRequest({
						path: 'auth/logout',
						method: 'post',
						body: {
							address: activeAccount?.address ?? '',
						},
					})
					setUser(() => ({}))
					rejectPendingLogin('Session expired')
					router.push(x.url)
					hideLoading?.()
				}
				return { success: false, message: 'Authentication error' }
			} else if (!res?.success) {
				rejectPendingLogin(res?.message || 'Login failed')
				return res
			} else {
				const authPayload = res?.data?.data ?? {}
				applyUserPayload(authPayload)
				resolvePendingLogin(authPayload?.user?.accessToken ?? null)
			}
			return res
		},
		[
			activeAccount?.address,
			applyUserPayload,
			rejectPendingLogin,
			resolvePendingLogin,
			router,
			makeRequest,
			sessionAccessToken,
		],
	)

	const fetchCurrentUser = useCallback(
		async ({ accessToken, silent = false, showError } = {}) => {
			const res = await request({
				path: 'auth/me',
				method: 'get',
				accessToken,
			})

			if (!res?.success) {
				if (!silent) {
					showError?.({
						title: 'Profile Sync Failed',
						message:
							res?.message || 'Unable to restore your profile right now.',
					})
				}
				if (!silent) {
					rejectPendingLogin(res?.message || 'Unable to restore your profile')
				}
				return res
			}

			const profileData = res?.data?.data ?? {}
			applyUserPayload({
				user: {
					...profileData,
					accessToken: accessToken ?? user?.accessToken ?? null,
				},
			})
			resolvePendingLogin(accessToken ?? profileData?.accessToken ?? null)

			return res
		},
		[
			applyUserPayload,
			rejectPendingLogin,
			resolvePendingLogin,
			user?.accessToken,
		],
	)

	const verifyAssets = useCallback(
		async ({ showLoading, hideLoading, showError, displayAlert } = {}) => {
			if (!activeAccount?.address) {
				showError?.({
					title: 'Wallet Required',
					message: 'Connect a wallet before refreshing your assets.',
				})
				return { success: false, message: 'Wallet connection required' }
			}

			showLoading?.({
				title: 'Refreshing Assets',
				message: 'Checking on-chain ownership and syncing your profile.',
			})

			const res = await makeRequest({
				path: 'game/verify-assets',
				method: 'post',
			})

			hideLoading?.()

			if (!res?.success) {
				const message =
					res?.message ||
					res?.error ||
					'Unable to refresh your assets right now.'

				if (res?.status === 503) {
					showError?.({
						title: 'Asset Sync Unavailable',
						message,
					})
				} else {
					showError?.({
						title: 'Asset Sync Failed',
						message,
					})
				}
				return res
			}

			const verifiedData = res?.data?.data ?? {}
			const nextWeapons = Array.isArray(verifiedData?.ownedWeaponNfts)
				? verifiedData.ownedWeaponNfts
				: []

			setUser((current) => {
				const normalizedAssets = normalizeChainBoiAssets(verifiedData?.assets)
				const derivedLevel = getMaxAssetLevel(
					normalizedAssets,
					asFiniteNumber(current?.level) ?? 1,
				)

				return {
					...current,
					hasNft: verifiedData?.hasNft ?? normalizedAssets.length > 0,
					nftTokenId:
						asTokenId(verifiedData?.nftTokenId) ??
						asTokenId(normalizedAssets?.[0]?.tokenId) ??
						asTokenId(current?.nftTokenId) ??
						null,
					level: asFiniteNumber(verifiedData?.level) ?? derivedLevel,
					assets: normalizedAssets,
					weapons: nextWeapons,
				}
			})

			displayAlert?.({
				title: 'Assets Updated',
				message:
					'Your ChainBoi and weapon inventory were refreshed successfully.',
				type: 'success',
			})

			return res
		},
		[activeAccount?.address, makeRequest],
	)

	const fetchTrainingNfts = useCallback(
		async ({ address } = {}) => {
			const walletAddress = address ?? activeAccount?.address ?? ''
			if (!walletAddress)
				return { success: false, message: 'Wallet address required' }

			return await makeRequest({
				path: `training/nfts/${walletAddress}`,
				method: 'get',
			})
		},
		[activeAccount?.address, makeRequest],
	)

	const syncTrainingNfts = useCallback(
		async ({ address } = {}) => {
			const res = await fetchTrainingNfts({ address })
			if (!res?.success) return res

			const nfts = res?.data?.data?.nfts
			const normalizedAssets = normalizeChainBoiAssets(
				Array.isArray(nfts) ? nfts : [],
			)

			setUser((current) => ({
				...current,
				hasNft: normalizedAssets.length > 0,
				nftTokenId:
					asTokenId(current?.nftTokenId) ??
					asTokenId(normalizedAssets?.[0]?.tokenId),
				level: getMaxAssetLevel(
					normalizedAssets,
					asFiniteNumber(current?.level) ?? 1,
				),
				assets: normalizedAssets,
			}))

			return res
		},
		[fetchTrainingNfts],
	)

	const fetchTrainingNftDetail = useCallback(
		async ({ tokenId } = {}) => {
			const normalizedTokenId = asTokenId(tokenId)
			if (normalizedTokenId === null) {
				return { success: false, message: 'Valid tokenId required' }
			}

			return await makeRequest({
				path: `training/nft/${normalizedTokenId}`,
				method: 'get',
			})
		},
		[makeRequest],
	)

	const fetchTrainingLevelUpCost = useCallback(
		async ({ tokenId, currentLevel } = {}) => {
			const params = new URLSearchParams()
			const normalizedTokenId = asTokenId(tokenId)
			if (normalizedTokenId !== null)
				params.set('tokenId', String(normalizedTokenId))

			const normalizedCurrentLevel = asFiniteNumber(currentLevel)
			if (normalizedCurrentLevel !== null)
				params.set('currentLevel', String(normalizedCurrentLevel))

			const query = params.toString()
			return await makeRequest({
				path: `training/level-up/cost${query ? `?${query}` : ''}`,
				method: 'get',
			})
		},
		[makeRequest],
	)

	const fetchTrainingEligibility = useCallback(
		async ({ tokenId } = {}) => {
			const normalizedTokenId = asTokenId(tokenId)
			if (normalizedTokenId === null) {
				return { success: false, message: 'Valid tokenId required' }
			}

			return await makeRequest({
				path: `training/eligibility/${normalizedTokenId}`,
				method: 'get',
			})
		},
		[makeRequest],
	)

	const submitTrainingLevelUp = useCallback(
		async ({ tokenId, txHash } = {}) => {
			const normalizedTokenId = asTokenId(tokenId)
			const hash = String(txHash ?? '').trim()
			if (normalizedTokenId === null)
				return { success: false, message: 'Valid tokenId required' }
			if (!hash) return { success: false, message: 'txHash is required' }

			const res = await makeRequest({
				path: 'training/level-up',
				method: 'post',
				body: {
					tokenId: normalizedTokenId,
					txHash: hash,
				},
			})

			if (!res?.success) return res

			const levelUpData = res?.data?.data ?? {}
			const newLevel = asFiniteNumber(levelUpData?.newLevel)
			const nextRank = levelUpData?.rank

			setUser((current) => {
				const currentAssets = Array.isArray(current?.assets)
					? current.assets
					: []
				const updatedAssets = currentAssets.some(
					(asset) => asTokenId(asset?.tokenId) === normalizedTokenId,
				)
					? currentAssets.map((asset) =>
							asTokenId(asset?.tokenId) === normalizedTokenId
								? {
										...asset,
										...(newLevel !== null ? { level: newLevel } : {}),
										...(nextRank ? { rank: nextRank } : {}),
									}
								: asset,
						)
					: [
							...currentAssets,
							{
								tokenId: normalizedTokenId,
								...(newLevel !== null ? { level: newLevel } : {}),
								...(nextRank ? { rank: nextRank } : {}),
							},
						]

				const unlockedWeapons = Array.isArray(levelUpData?.unlockedWeapons)
					? levelUpData.unlockedWeapons
					: null
				const ownedWeaponNfts = Array.isArray(levelUpData?.ownedWeaponNfts)
					? levelUpData.ownedWeaponNfts
					: null
				const mergedWeapons = mergeWeaponsByTokenId(
					Array.isArray(current?.weapons) ? current.weapons : [],
					ownedWeaponNfts ?? unlockedWeapons ?? [],
				)

				return {
					...current,
					hasNft: updatedAssets.length > 0,
					nftTokenId:
						asTokenId(current?.nftTokenId) ??
						asTokenId(updatedAssets?.[0]?.tokenId),
					level: getMaxAssetLevel(
						updatedAssets,
						asFiniteNumber(current?.level) ?? 1,
					),
					assets: updatedAssets,
					...(mergedWeapons.length ? { weapons: mergedWeapons } : {}),
				}
			})

			return res
		},
		[makeRequest],
	)

	const setAvatar = useCallback(
		async ({
			tokenId,
			showLoading,
			hideLoading,
			showError,
			displayAlert,
			onSuccess,
		} = {}) => {
			if (!Number.isInteger(tokenId) || tokenId < 0) {
				showError?.({
					title: 'Invalid ChainBoi',
					message: 'Select a valid ChainBoi before setting an avatar.',
				})
				return { success: false, message: 'Invalid tokenId' }
			}

			showLoading?.({
				title: 'Setting Avatar',
				message: 'Updating your active ChainBoi avatar.',
			})

			const res = await makeRequest({
				path: 'game/set-avatar',
				method: 'post',
				body: {
					tokenId,
				},
			})

			hideLoading?.()

			if (!res?.success) {
				showError?.({
					title:
						res?.status === 503
							? 'Avatar Update Unavailable'
							: 'Avatar Update Failed',
					message:
						res?.message ||
						res?.error ||
						'Unable to set that ChainBoi as your avatar.',
				})
				return res
			}

			const nextLevel = asFiniteNumber(res?.data?.data?.level)
			setUser((current) => {
				const currentAssets = Array.isArray(current?.assets)
					? current.assets
					: []
				const updatedAssets =
					nextLevel !== null
						? currentAssets.map((asset) =>
								asTokenId(asset?.tokenId) === tokenId
									? { ...asset, level: nextLevel }
									: asset,
							)
						: currentAssets

				const derivedLevel = getMaxAssetLevel(
					updatedAssets,
					asFiniteNumber(current?.level) ?? 1,
				)

				return {
					...current,
					activeAvatarTokenId: tokenId,
					...(nextLevel !== null
						? {
								level: Math.max(nextLevel, derivedLevel),
								hasNft: current?.hasNft ?? true,
								nftTokenId: asTokenId(current?.nftTokenId) ?? tokenId,
								assets: updatedAssets,
							}
						: {}),
					metrics: {
						...(current?.metrics ?? {}),
						avatar: tokenId,
					},
				}
			})

			displayAlert?.({
				title: 'Avatar Updated',
				message: `ChainBoi #${tokenId} is now your active avatar.`,
				type: 'success',
			})
			onSuccess?.(res)

			return res
		},
		[makeRequest],
	)

	const logout = useCallback(
		async (showAlert_ = true, callbacks) => {
			if (showAlert_)
				displayAlert({
					title: 'Alert',
					message: 'Login aborted!',
					type: 'error',
				})
			const x = await signOut({
				callbackUrl: '/access-request',
				redirect: false,
			})
			const session = await getSession()

			setUser(() => ({}))
			rejectPendingLogin('Login aborted')
			callbacks?.map((cb) => cb?.())
			await request({
				path: 'auth/logout',
				method: 'post',
				body: {
					address: activeAccount?.address ?? '',
				},
				// includeClientID: true,
			})
			// router.push(x.url)
		},
		[activeAccount?.address, displayAlert, rejectPendingLogin],
	)

	const ContextValue = useMemo(
		() => ({
			makeRequest,
			user,
			setUser,
			requestingLogin,
			loginRequest,
			refresh,
			login,
			fetchCurrentUser,
			verifyAssets,
			fetchTrainingNfts,
			syncTrainingNfts,
			fetchTrainingNftDetail,
			fetchTrainingLevelUpCost,
			fetchTrainingEligibility,
			submitTrainingLevelUp,
			setAvatar,
			logout,
		}),
		[
			fetchTrainingEligibility,
			fetchTrainingLevelUpCost,
			fetchTrainingNftDetail,
			fetchTrainingNfts,
			fetchCurrentUser,
			login,
			loginRequest,
			logout,
			makeRequest,
			refresh,
			requestingLogin,
			submitTrainingLevelUp,
			setAvatar,
			syncTrainingNfts,
			user,
			verifyAssets,
		],
	)

	return (
		<AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>
	)
}

export default AuthContextProvider
