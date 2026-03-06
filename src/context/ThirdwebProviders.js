'use client'

import { ThirdwebProvider, ChainProvider } from 'thirdweb/react'
import { avalanche, avalancheFuji } from 'thirdweb/chains'

export default function Providers({ children }) {
	return ( 
		<ThirdwebProvider>
			<ChainProvider chain={avalancheFuji}>{children}</ChainProvider>
		</ThirdwebProvider>
	)
}
