'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import AccountManagement from '@/components/AccountManagement'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActiveWalletConnectionStatus } from 'thirdweb/react'
import { useEffect, useMemo } from 'react'

export default function Page () {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { status } = useSession()
	const walletStatus = useActiveWalletConnectionStatus()
	const nextPath = searchParams.get('next')

	const redirectPath = useMemo(() => {
		if (typeof nextPath !== 'string') return '/battleground'
		if (!nextPath.startsWith('/')) return '/battleground'
		if (nextPath.startsWith('//')) return '/battleground'
		return nextPath
	}, [nextPath])

	const hasActiveWalletConnection = useMemo(
		() => walletStatus === 'connected',
		[walletStatus],
	)

	useEffect(() => {
		if (status === 'authenticated' && hasActiveWalletConnection) {
			router.replace(redirectPath)
		}
	}, [status, hasActiveWalletConnection, redirectPath, router])

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<AccountManagement />
		</div>
	)
}
