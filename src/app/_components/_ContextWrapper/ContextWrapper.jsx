'use client'

import { ThirdwebProviders, MainContextProvider } from '@/context'

export default function ContextWrapper({ children }) {
	return (
		<ThirdwebProviders>
			<MainContextProvider>{children}</MainContextProvider>
		</ThirdwebProviders>
	)
}
