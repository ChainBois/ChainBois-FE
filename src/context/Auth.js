'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useWallet } from '@txnlab/use-wallet-react'
import { request } from '@/utils'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const AuthContext = React.createContext()

const AuthContextProvider = ({ children }) => {
	const { data: session, status, update } = useSession()
	const { activeAddress, getAddress } = useWallet()
	const [user, setUser] = useState('')
	const router = useRouter()

	const getAccessToken = useCallback(() => {
		if (!session) return ''
		const {
			user: { accessToken },
		} = session
		return accessToken
	}, [session])

	const makeRequest = async (
		{ path = '', method = 'get', body = {}, prop = 'data' } = {},
		upload = false
	) => {
		const xx = getAccessToken()
		const response = upload
			? await requestUpload({
					path,
					method,
					file: body,
					accessToken: xx,
			  })
			: await request({
					path,
					method,
					body,
					accessToken: xx,
					prop,
			  })
		if (
			response?.error?.statusCode === 401 ||
			response?.status === 401 ||
			response?.message === 'Token has expired'
		) {
			router.push('/?modal=connectWallet&relink=true')
		}
		return response
	}

	const refresh = async () => {
		const refreshRes = await update()
		return refreshRes?.user?.accessToken || ''
	}

	const ContextValue = {
		getAccessToken,
		makeRequest,
		refresh,
		user,
		setUser,
	}

	// useEffect(() => {
	// 	if (status === 'authenticated') {
	// 		const {
	// 			user: { accessToken, ...user },
	// 		} = session
	// 		setUser((x) => user)
	// 	} else if (status === 'unauthenticated') {
	// 		setUser((x) => ({}))
	// 	}
	// }, [status])

	const interval = useRef()
	useEffect(() => {
		clearInterval(interval.current)
		interval.current = setInterval(() => update(), 116000)
		return () => clearInterval(interval.current)
	}, [update])

	useEffect(() => {
		const visibilityHandler = () =>
			document.visibilityState === 'visible' && update()
		window.removeEventListener('visibilitychange', visibilityHandler, false)
		window.addEventListener('visibilitychange', visibilityHandler, false)
		return () =>
			window.removeEventListener('visibilitychange', visibilityHandler, false)
	}, [update])

	return (
		<AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>
	)
}

export default AuthContextProvider
