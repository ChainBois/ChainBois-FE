'use client'

import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import s from '@/styles'
import a from './AccountManagement.module.css'
import { useAuth, useDebouncedEffect, useQueryParams } from '@/hooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	useActiveAccount,
	useActiveWalletConnectionStatus,
} from 'thirdweb/react'
import { getActualInputValues, InputField } from '../InputField'
import { cf, request } from '@/utils'
import { useMain, useNotifications } from '@/hooks'
import BorderedButton from '../BorderedButton'
import { useEffect, useMemo, useState } from 'react'
import ConnectWalletButton from '../ConnectWalletButton'
import { BsArrowRight } from 'react-icons/bs'

export default function AccountManagement() {
	const { retrievePlatformData } = useMain()
	const { login } = useAuth()
	const {
		displayAlert,
		showLoading,
		showError,
		hideLoading,
		hideError,
		setShowModal,
	} = useNotifications()
	const showAlert = ({ ...opts }) =>
		displayAlert({
			useShowAlert: true,
			...opts,
		})
	const { user, setUser } = useAuth()
	const { status, data: session } = useSession()
	const activeAccount = useActiveAccount()
	const searchParams = useSearchParams()
	const [loggedIn, setLoggedIn] = useState(null)
	const [requestBody, setRequestBody] = useState({})
	const [userMediaData, setUserMediaData] = useState({})
	const [userExists, setUserExists] = useState(null)

 const pathname = usePathname()
	const next = searchParams.get('next') ?? pathname
	const relink = searchParams.get('relink')

	const activeWalletConnectionStatus = useActiveWalletConnectionStatus()
	const isActive = useMemo(
		() => activeWalletConnectionStatus === 'connected',
		[activeWalletConnectionStatus],
	)

	const checkIfUserExists = async (email) => {
		const res = await request({
			path: `auth/check-user/${email}`,
		})
		// console.log('check user', res)
		setUserExists(res?.data?.data?.exists)
	}

	useEffect(() => {
		setUserExists(() => null)
	}, [requestBody?.email])

	function validateEmail(email) {
		if (typeof email !== 'string') return false
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailPattern.test(email.trim())
	}

	useDebouncedEffect(
		(deps) => {
			const [email] = deps
			// console.log('email', email)
			// console.log('email check', validateEmail(email))
			if (email && validateEmail(email)) checkIfUserExists(email)
		},
		[requestBody?.email],
		2000,
	)

	const router = useRouter()
	

	/**
	 * Handles changes to input fields and updates request body accordingly.
	 * @param {Object} e - Event object.
	 */
	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			email: true,
			password: true,
			username: true,
		}

		switch (name) {
			case 'email':
				setRequestBody((x) => ({
					...x,
					[name]: String(value).trim(),
				}))
				break
			case 'username':
				setRequestBody((x) => ({
					...x,
					[name]: String(value).trim(),
				}))
				break
			default:
				if (validators[name]) {
					setRequestBody((x) => ({
						...x,
						[name]: value,
					}))
				}
				break
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		showLoading({
			title: 'Authenticating',
			message: 'Please wait...',
		})
		// TODO
		const req = getActualInputValues(requestBody)

		let res = undefined

		if (userExists === false) {
			const signUpRes = await request({
				path: `auth/create-user`,
				method: 'post',
				body: {
					email: String(req.email).trim(),
					password: req.password,
					username: String(req.username).trim(),
				},
			})
			if (!signUpRes.success) {
				showError({
					title: 'Dear Gamer',
					message: `We're unable to create your gamer account. Please try again later.`,
				})
				return
				// res = await signIn('credentials', {
				// 	...req,
				// 	address: activeAccount?.address ?? '',
				// 	redirect: false,
				// 	callbackUrl: `/?success=true${relink === 'true' ? '&relink=true' : ''}`,
				// })
			}
		}
		res = await signIn('credentials', {
			...req,
			address: activeAccount?.address ?? '',
			redirect: false,
			callbackUrl: next ?? `/`,
		})
		// await fetch('/api/auth/session')
		if (res.error) {
			showError({
				title: 'Dear Gamer',
				message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
			})
		} else {
			const session = await getSession()
			if (!res.ok) {
				showError({
					title: 'Dear Gamer',
					message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
				})
			} else if (res.url) {
				if (res.url.slice(res.url.lastIndexOf('/')) === next ?? `/`) {
					if (relink === 'true') {
						showAlert({
							title: 'Linked',
							message: 'Re-Link was successful.',
						})
					} else {
						showAlert({
							title: 'Linked',
							message: 'Link was successful.',
						})
					}
				} else {
					showError({
						title: 'Dear Gamer',
						message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
					})
				}
			} else {
				showError({
					title: 'Dear Gamer',
					message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
				})
			}
		}
		retrievePlatformData()
	}

	const signout = async () => {
		showLoading()
		const x = await signOut({
			callbackUrl: '/access-request',
			redirect: false,
		})
		const session = await getSession()

		await request({
			path: 'auth/logout',
			method: 'post',
			body: {
				address: activeAccount?.address,
			},
		})

		// await fetch('/api/auth/session')

		setUser(() => ({}))
		showConnectWallet(true)
		router.push(x.url)
		return
	}

	useEffect(() => {
		if (status === 'authenticated' && session && user?.username) {
			setLoggedIn(() => true)
		} else if (status === 'unauthenticated' && !session) {
			setLoggedIn(() => false)
		}
	}, [status, session, user])

	useEffect(() => {
		if (loggedIn && user?.metrics?.avatar) {
			const doSomething = async () => {
				const media = null // await getTokenAndMedia([user?.metrics?.avatar])
				setUserMediaData(() => media?.[0] ?? {})
			}
			doSomething()
		}
	}, [loggedIn, user])

	const isDisabled = useMemo(() => {
		return requestBody?.email &&
			requestBody?.password &&
			(userExists === false ? requestBody?.username : true)
			? false
			: true
	}, [requestBody, userExists])

	return (
		<div
			className={cf(
				s.flex,
				s.flexCenter,
				a.connectWallet,
				isActive ? a.isActive : '',
				loggedIn === false ? a.notLoggedIn : '',
			)}
		>
			{!!loggedIn && (
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.flex_dColumn,
						a.userDetails,
					)}
				>
					You are logged in.
				</div>
			)}
			{!!(activeAccount && activeAccount?.address && loggedIn === false) ? (
				<form
					onSubmit={handleSubmit}
					className={cf(s.flex, s.flexTop, a.form)}
				>
					<span className={cf(s.wMax, s.tCenter, a.reg)}>Login</span>
					<InputField
						tag={'email'}
						state={requestBody}
						handler={handler}
						type={'email'}
						label={'Email'}
						placeholder={''}
						required={true}
						autoComplete={'username'}
						cusLabel={a.fieldLabel}
						cusClass={a.fieldInput}
					/>
					{userExists === false && (
						<InputField
							tag={'username'}
							state={requestBody}
							handler={handler}
							type={'text'}
							label={'Username'}
							placeholder={''}
							required={true}
							cusLabel={a.fieldLabel}
							cusClass={a.fieldInput}
						/>
					)}
					{userExists !== null && (
						<InputField
							tag={'password'}
							state={requestBody}
							handler={handler}
							type={'password'}
							label={'Password'}
							placeholder={''}
							required={true}
							autoComplete={'current-password'}
							cusLabel={a.fieldLabel}
							cusClass={a.fieldInput}
						/>
					)}
					<div className={cf(s.wMax, s.flex, s.flexCenter, a.subCon)}>
						<BorderedButton
							type={'submit'}
							tag={'Continue'}
							icon={<BsArrowRight className={cf(s.dInlineBlock, a.subIcon)} />}
							disabled={isDisabled}
						/>
					</div>
				</form>
			) : (
				<ConnectWalletButton
					isLanding={true}
					center
				/>
			)}
		</div>
	)
}
