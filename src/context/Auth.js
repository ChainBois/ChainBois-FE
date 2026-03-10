'use client'

import { refreshRequest, request, requestUpload } from '@/utils'
import axios from 'axios'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { useNotifications } from '@/hooks'

export const AuthContext = React.createContext()

const AuthContextProvider = ({ children }) => {
	const activeAccount = useActiveAccount()
	const router = useRouter()
	const { displayAlert } = useNotifications()
	const [user, setUser] = useState('')
	const [requestingLogin, setRequestingLogin] = useState(false)
	const [loginRequest, setLoginRequest] = useState(null)
	const loginRequestRef = useRef(null)

	const beginInteractiveLogin = useCallback(() => {
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

	const applyUserPayload = useCallback(({ user: rawUser = {}, assets, weapons } = {}) => {
		const { accessToken = null, ...userData } = rawUser ?? {}
		const nextAssets =
			assets ??
			(userData?.hasNft !== undefined ||
			userData?.nftTokenId !== undefined ||
			userData?.level !== undefined
				? {
						hasNft: userData?.hasNft ?? false,
						nftTokenId: userData?.nftTokenId ?? null,
						level: userData?.level ?? 1,
					}
				: undefined)

		setUser((current) => ({
			...current,
			...userData,
			...(nextAssets ? { assets: nextAssets } : {}),
			...(Array.isArray(weapons) ? { weapons } : {}),
			...(accessToken ? { accessToken } : {}),
		}))
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

	const makeRequest = useCallback(async (
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
		if (user?.accessToken) {
			accessToken = user.accessToken
		} else {
			try {
				accessToken = await beginInteractiveLogin()
			} catch (error) {
				return { success: false, message: 'Authentication failed' }
			}

			if (!accessToken) {
				return { success: false, message: 'No access token received' }
			}
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
			try {
				const newToken = await beginInteractiveLogin()

				if (newToken) {
					return await makeApiCall(newToken)
				} else {
					return { success: false, message: 'Re-authentication failed' }
				}
			} catch (error) {
				return { success: false, message: 'Re-authentication failed' }
			}
		}

		return response
	}, [beginInteractiveLogin, refresh, user?.accessToken])

	const login = useCallback(async ({ address, accessToken, showLoading }) => {
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
			showLoading?.()
			const x = await signOut({
				callbackUrl: '/request-access',
				redirect: false,
			})
			const session = await getSession()

			await request({
				path: 'auth/logout',
				method: 'post',
				body: {
					address: activeAccount?.address ?? '',
				},
				})
			setUser(() => ({}))
			rejectPendingLogin('Session expired')
			router.push(x.url)
			return
		} else if (!res?.success) {
			rejectPendingLogin(res?.message || 'Login failed')
			return res
		} else {
			const authPayload = res?.data?.data ?? {}
			applyUserPayload(authPayload)
			resolvePendingLogin(authPayload?.user?.accessToken ?? null)
		}
		return res
	}, [
		activeAccount?.address,
		applyUserPayload,
		rejectPendingLogin,
		resolvePendingLogin,
		router,
	])

	const fetchCurrentUser = useCallback(async ({
		accessToken,
		silent = false,
		showError,
	} = {}) => {
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
	}, [applyUserPayload, rejectPendingLogin, resolvePendingLogin, user?.accessToken])

	const verifyAssets = useCallback(async ({
		showLoading,
		hideLoading,
		showError,
		displayAlert,
	} = {}) => {
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
		const nextAssets = {
			hasNft: verifiedData?.hasNft ?? false,
			nftTokenId: verifiedData?.nftTokenId ?? null,
			level: verifiedData?.level ?? user?.level ?? 1,
		}
		const nextWeapons = Array.isArray(verifiedData?.ownedWeaponNfts)
			? verifiedData.ownedWeaponNfts
			: []

		setUser((current) => ({
			...current,
			hasNft: nextAssets.hasNft,
			nftTokenId: nextAssets.nftTokenId,
			level: nextAssets.level,
			assets: nextAssets,
			weapons: nextWeapons,
		}))

		displayAlert?.({
			title: 'Assets Updated',
			message: 'Your ChainBoi and weapon inventory were refreshed successfully.',
			type: 'success',
		})

		return res
	}, [activeAccount?.address, makeRequest, user?.level])

	const setAvatar = useCallback(async ({
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
				title: res?.status === 503 ? 'Avatar Update Unavailable' : 'Avatar Update Failed',
				message:
					res?.message || res?.error || 'Unable to set that ChainBoi as your avatar.',
			})
			return res
		}

		const nextLevel = res?.data?.data?.level
		setUser((current) => ({
			...current,
			activeAvatarTokenId: tokenId,
			...(Number.isFinite(nextLevel)
				? {
						level: nextLevel,
						assets: {
							...(current?.assets ?? {}),
							level: nextLevel,
						},
				  }
				: {}),
			metrics: {
				...(current?.metrics ?? {}),
				avatar: tokenId,
			},
		}))

		displayAlert?.({
			title: 'Avatar Updated',
			message: `ChainBoi #${tokenId} is now your active avatar.`,
			type: 'success',
		})
		onSuccess?.(res)

		return res
	}, [makeRequest])

	const logout = useCallback(async (showAlert_ = true, callbacks) => {
		if (showAlert_)
			displayAlert({
				title: 'Alert',
				message: 'Login aborted!',
				type: 'error',
			})
		const x = await signOut({
			callbackUrl: '/request-access',
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
	}, [activeAccount?.address, displayAlert, rejectPendingLogin])

	const ContextValue = useMemo(() => ({
		makeRequest,
		user,
		setUser,
		requestingLogin,
		loginRequest,
		refresh,
		login,
		fetchCurrentUser,
		verifyAssets,
		setAvatar,
		logout,
	}), [
		fetchCurrentUser,
		login,
		loginRequest,
		logout,
		makeRequest,
		refresh,
		requestingLogin,
		setAvatar,
		user,
		verifyAssets,
	])

	return (
		<AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>
	)
}

export default AuthContextProvider
