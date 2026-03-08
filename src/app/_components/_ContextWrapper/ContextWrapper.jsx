'use client'

import {
	ThirdwebProviders,
	MainContextProvider,
	NotificationSystemContextProvider,
} from '@/context'

export default function ContextWrapper({ children }) {
	return (
		<ThirdwebProviders>
			<NotificationSystemContextProvider>
				<MainContextProvider>{children}</MainContextProvider>
			</NotificationSystemContextProvider>
		</ThirdwebProviders>
	)
}
