'use client'

import { refreshRequest, request, requestUpload } from '@/utils'
import axios from 'axios'
import React, { useState } from 'react'
import { signOut, getSession } from 'next-auth/react'
import { useNotifications } from '@/hooks'

export const AuthContext = React.createContext()

const AuthContextProvider = ({ children }) => {
	const { activeAccount } = useActiveAccount()
	const { displayAlert } = useNotifications()
	const showAlert = ({ ...opts }) =>
		displayAlert({
			useShowAlert: true,
			...opts,
		})
	const [user, setUser] = useState('')
	const [requestingLogin, setRequestingLogin] = useState(false)
	const [loginRequest, setLoginRequest] = useState(null)

	const refresh = async () => {
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
	}

	const makeRequest = async (
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
				accessToken = await new Promise((resolve, reject) => {
					setLoginRequest(() => ({ resolve, reject }))
					setRequestingLogin(() => true)
				})
			} catch (error) {
				return { success: false, message: 'Authentication failed' }
			} finally {
				setLoginRequest(() => null)
				setRequestingLogin(() => false)
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
				const newToken = await new Promise((resolve, reject) => {
					setLoginRequest(() => ({ resolve, reject }))
					setRequestingLogin(() => true)
				})

				if (newToken) {
					return await makeApiCall(newToken)
				} else {
					return { success: false, message: 'Re-authentication failed' }
				}
			} catch (error) {
				return { success: false, message: 'Re-authentication failed' }
			} finally {
				setLoginRequest(() => null)
				setRequestingLogin(() => false)
			}
		}

		return response
	}

	const login = async (address, accessToken, showLoading) => {
		const res = await request({
			path: `login`,
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
				callbackUrl: '/?modal=connectWallet&relink=true',
				redirect: false,
			})
			const session = await getSession()

			await request({
				path: 'logout',
				method: 'post',
				body: {
					address: activeAccount?.address ?? '',
				},
			})
			setUser(() => ({}))
			router.push(x.url)
			return
		} else {
			const {
				user: { accessToken = null, ...user },
				assets,
			} = res?.data ?? {}
			setUser(() => ({ ...user, assets }))
		}
		return res
	}

    const logout = async (showAlert_ = true, callbacks) => {
		if (showAlert_)
			displayAlert({
				title: 'Alert',
				message: 'Login aborted!',
				type: 'error',
			})
		setUser(() => ({}))
		callbacks?.map((cb) => cb?.())
		await request({
			path: 'logout',
			method: 'post',
			body: {
				address: activeAccount?.address ?? '',
			},
			// includeClientID: true,
		})
	}

	const ContextValue = {
		makeRequest,
		user,
		setUser,
		requestingLogin,
		setRequestingLogin,
		loginRequest,
		setLoginRequest,
		refresh,
		login,
        logout,
	}

	return (
		<AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>
	)
}

export default AuthContextProvider
