'use client'

import { ThirdwebProviders } from '@/context'

export default function ContextWrapper({ children }) {
	return <ThirdwebProviders>{children}</ThirdwebProviders>
}
