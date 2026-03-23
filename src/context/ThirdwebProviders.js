'use client'

import { ACTIVE_CHAIN, ACTIVE_CHAIN_NAME, thirdwebClient } from '@/lib'
import { thirdwebAppMetadata, thirdwebWallets } from '@/lib/thirdwebWallets'
import {
	AutoConnect,
	ChainProvider,
	ThirdwebProvider,
	useActiveWalletChain,
	useActiveWalletConnectionStatus,
	useSwitchActiveWalletChain,
} from 'thirdweb/react'
import { useEffect, useRef } from 'react'

function ChainEnforcer({ children }) {
	const activeWalletChain = useActiveWalletChain()
	const walletConnectionStatus = useActiveWalletConnectionStatus()
	const switchChain = useSwitchActiveWalletChain()
	const lastAttemptedChainIdRef = useRef(null)

	useEffect(() => {
		if (walletConnectionStatus !== 'connected') {
			lastAttemptedChainIdRef.current = null
			return
		}

		if (!activeWalletChain) return

		if (activeWalletChain.id === ACTIVE_CHAIN.id) {
			lastAttemptedChainIdRef.current = null
			return
		}

		if (lastAttemptedChainIdRef.current === activeWalletChain.id) return

		lastAttemptedChainIdRef.current = activeWalletChain.id

		switchChain(ACTIVE_CHAIN).catch((error) => {
			console.error(`Failed to auto-switch to ${ACTIVE_CHAIN_NAME}:`, error)
		})
	}, [activeWalletChain, switchChain, walletConnectionStatus])

	return children
}

export default function Providers({ children }) {
	return (
		<ThirdwebProvider>
			<AutoConnect
				client={thirdwebClient}
				wallets={thirdwebWallets}
				appMetadata={thirdwebAppMetadata}
				chain={ACTIVE_CHAIN}
			/>
			<ChainProvider chain={ACTIVE_CHAIN}>
				<ChainEnforcer>{children}</ChainEnforcer>
			</ChainProvider>
		</ThirdwebProvider>
	)
}
