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
			<ThirdwebProviders>
				<SessionContextProvider>
					<AuthContextProvider>
						<NotificationSystemContextProvider>
							<MainContextProvider>
								<ParamsContextProvider>{children}</ParamsContextProvider>
							</MainContextProvider>
						</NotificationSystemContextProvider>
					</AuthContextProvider>
				</SessionContextProvider>
			</ThirdwebProviders>
		</ToastContextProvider>
	)
}
