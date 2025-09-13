'use client'

import { ThirdwebProvider, ChainProvider } from 'thirdweb/react'
import { avalanche } from 'thirdweb/chains'

export default function Providers({ children }) {
	return (
		<ThirdwebProvider>
			<ChainProvider chain={avalanche}>{children}</ChainProvider>
		</ThirdwebProvider>
	)
}
