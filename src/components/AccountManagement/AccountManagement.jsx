'use client'

import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import s from '@/styles'
import a from './AccountManagement.module.css'
import { useDebouncedEffect, useQueryParams } from '@/hooks'
import { usePathname, useRouter } from 'next/navigation'
import { useActiveAccount } from 'thirdweb/react'
import { getActualInputValues, InputField } from '../InputField'
import { cf, request } from '@/utils'
import { useMain, useNotifications } from '@/hooks'
import BorderedButton from '../BorderedButton'

export default function AccountManagement() {
	const { retrievePlatformData, showLoading, login, showRewardPoolSelection } =
		useMain()
	const { displayAlert } = useNotifications()
	const showAlert = ({ ...opts }) =>
		displayAlert({
			useShowAlert: true,
			...opts,
		})
	const { user, setUser } = useAuth()
	const { status, data: session } = useSession()
	const { activeAccount } = useActiveAccount()
	const { relink, useSimulation } = useQueryParams()
	const [loggedIn, setLoggedIn] = useState(null)
	const [requestBody, setRequestBody] = useState({})
	const [userMediaData, setUserMediaData] = useState({})
	const [userExists, setUserExists] = useState(null)

	

	const checkIfUserExists = async (email) => {
		const res = await request({
			path: `auth/check-user/${email}`,
			method: 'post',
		})
		setUserExists(res?.data?.exists)
	}

	useEffect(() => {
		setUserExists(() => null)
	}, [requestBody?.email])

	useDebouncedEffect(
		() => {
			checkIfUserExists(requestBody?.email)
		},
		[requestBody?.email],
		2000,
	)

	const router = useRouter()
	const pathname = usePathname()

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			email: true,
			password: true,
			username: true,
		}

		switch (name) {
			case '':
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
		showLoading()
		// TODO
		const req = getActualInputValues(requestBody)

		let res = undefined

		if (useSimulation === 'true') {
			const simulatedRes = await request({
				path: `simulate`,
				method: 'post',
				body: {
					email: req.email,
				},
			})
			if (simulatedRes.success) {
				res = await login(
					activeAccount?.address,
					simulatedRes?.data?.credentials?.idToken ?? '',
				)
				if (
					!(
						res?.error?.statusCode === 401 ||
						res?.status === 401 ||
						res?.message === 'Token has expired'
					)
				) {
					if (relink === 'true') {
						router.replace(pathname)
						showAlert({
							title: 'Linked',
							message: 'Re-Link was successful.',
						})
					} else {
						showRewardPoolSelection()
					}
				}
			} else {
				showAlert({
					title: 'Dear Gamer',
					message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
				})
			}
		} else {
			if (userExists === false) {
				const signUpRes = await request({
					path: `auth/create-user`,
					method: 'post',
					body: {
						email: req.email,
						password: req.password,
						username: req.username,
					},
				})
				if (!signUpRes.success) {
					showAlert({
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
				callbackUrl: `/?success=true${relink === 'true' ? '&relink=true' : ''}`,
			})
			// await fetch('/api/auth/session')
			if (res.error) {
				showAlert({
					title: 'Dear Gamer',
					message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
				})
			} else {
				const session = await getSession()
				if (!res.ok) {
					showAlert({
						title: 'Dear Gamer',
						message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
					})
				} else if (res.url) {
					if (
						res.url.slice(res.url.lastIndexOf('/')) ===
						`/?success=true${relink === 'true' ? '&relink=true' : ''}`
					) {
						if (relink === 'true') {
							router.replace(pathname)
							showAlert({
								title: 'Linked',
								message: 'Re-Link was successful.',
							})
						} else {
							showRewardPoolSelection?.()
						}
					} else {
						showAlert({
							title: 'Dear Gamer',
							message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
						})
					}
				} else {
					showAlert({
						title: 'Dear Gamer',
						message: `We're unable to create a link to your gamer account. Please ensure your login details are correct, and that you're using the same wallet as your first successful login with the intended account.`,
					})
				}
			}
		}
		retrievePlatformData()
	}

	const signout = async () => {
		showLoading()
		const x = await signOut({
			callbackUrl: '/',
			redirect: false,
		})
		const session = await getSession()

		await request({
			path: 'logout',
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

	return (
		<div
			className={cf(
				s.flex,
				s.flexCenter,
				a.connectWallet,
				activeWallet?.isActive ? a.isActive : '',
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
			{!!(activeAccount && activeAccount?.address && loggedIn === false) && (
				<form
					onSubmit={handleSubmit}
					className={cf(s.flex, s.flexTop, a.form)}
				>
					<span className={cf(s.wMax, s.tCenter, a.reg)}>Login</span>
					{userExists === false && (
						<InputField
							tag={'username'}
							state={requestBody}
							handler={handler}
							type={'text'}
							label={'Username'}
							placeholder={''}
							required={true}
						/>
					)}
					<InputField
						tag={'email'}
						state={requestBody}
						handler={handler}
						type={'email'}
						label={'Email'}
						placeholder={''}
						required={true}
						autoComplete={'username'}
					/>
					<InputField
						tag={'password'}
						state={requestBody}
						handler={handler}
						type={'password'}
						label={'Password'}
						placeholder={''}
						required={true}
						autoComplete={'current-password'}
					/>
					<div className={cf(s.wMax, s.flex, s.flexCenter, a.subCon)}>
						<BorderedButton
							type={'submit'}
							tag={'Continue'}
							icon={<BsArrowRight className={cf(s.dInlineBlock, a.subIcon)} />}
						/>
					</div>
				</form>
			)}
		</div>
	)
}
