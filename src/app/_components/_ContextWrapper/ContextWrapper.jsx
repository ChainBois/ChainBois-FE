'use client'

import {
	ThirdwebProviders,
	MainContextProvider,
	NotificationSystemContextProvider,
	ToastContextProvider,
	ParamsContextProvider,
	AuthContextProvider,
	SessionContextProvider,
} from '@/context'

export default function ContextWrapper({ children }) {
	return (
		<ToastContextProvider>
			<NotificationSystemContextProvider>
				<ThirdwebProviders>
					<SessionContextProvider>
						<AuthContextProvider>
							<MainContextProvider>
								<ParamsContextProvider>{children}</ParamsContextProvider>
							</MainContextProvider>
						</AuthContextProvider>
					</SessionContextProvider>
				</ThirdwebProviders>
			</NotificationSystemContextProvider>
		</ToastContextProvider>
	)
}
