'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
	useActiveAccount,
	useActiveWalletConnectionStatus,
} from 'thirdweb/react'
import s from '@/styles'
import { cf } from '@/utils'

const WALLET_PENDING_STATUSES = new Set(['connecting', 'unknown'])

export default function AuthGate({ children }) {
	const router = useRouter()
	const pathname = usePathname()
	const { status } = useSession()
	const activeAccount = useActiveAccount()
	const walletStatus = useActiveWalletConnectionStatus()

	const hasWalletConnection = useMemo(
		() => walletStatus === 'connected' && !!activeAccount?.address,
		[activeAccount?.address, walletStatus],
	)

	const isCheckingAccess = useMemo(() => {
		if (status === 'loading') return true
		if (WALLET_PENDING_STATUSES.has(walletStatus)) return true
		if (status === 'authenticated' && walletStatus === 'connected' && !activeAccount?.address) {
			return true
		}
		return false
	}, [activeAccount?.address, status, walletStatus])

	const isAuthorized = useMemo(
		() => status === 'authenticated' && hasWalletConnection,
		[hasWalletConnection, status],
	)

	useEffect(() => {
		if (isCheckingAccess || isAuthorized) return

		const nextPath = pathname ? `?next=${encodeURIComponent(pathname)}` : ''
		router.replace(`/access-request${nextPath}`)
	}, [isAuthorized, isCheckingAccess, pathname, router])

	if (!isAuthorized) {
		return (
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.vHMax)}>
				Checking access...
			</div>
		)
	}

	return children
}
