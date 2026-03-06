'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'

const SessionContextProvider = ({ children }) => {
	return (
		<SessionProvider
			refetchInterval={2 * 58}
			refetchOnWindowFocus={true}
		>
			{children}
		</SessionProvider>
	)
}

export default SessionContextProvider
