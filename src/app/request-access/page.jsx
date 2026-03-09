'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import AccountManagement from '@/components/AccountManagement'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useActiveWalletConnectionStatus } from 'thirdweb/react'
import { useEffect, useMemo } from 'react'

export default function Page () {
	const router = useRouter()
	const { status } = useSession()
	const walletStatus = useActiveWalletConnectionStatus()

	const hasActiveWalletConnection = useMemo(
		() => walletStatus === 'connected',
		[walletStatus],
	)

	useEffect(() => {
		if (status === 'authenticated' && hasActiveWalletConnection) {
			router.replace('/battleground')
		}
	}, [status, hasActiveWalletConnection, router])

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<AccountManagement />
		</div>
	)
}
