'use client'

import { thirdwebClient } from '@/lib'
import { thirdwebAppMetadata, thirdwebWallets } from '@/lib/thirdwebWallets'
import { AutoConnect, ChainProvider, ThirdwebProvider } from 'thirdweb/react'
import { avalancheFuji } from 'thirdweb/chains'

export default function Providers({ children }) {
	return ( 
		<ThirdwebProvider>
			<AutoConnect
				client={thirdwebClient}
				wallets={thirdwebWallets}
				appMetadata={thirdwebAppMetadata}
				chain={avalancheFuji}
			/>
			<ChainProvider chain={avalancheFuji}>{children}</ChainProvider>
		</ThirdwebProvider>
	)
}
