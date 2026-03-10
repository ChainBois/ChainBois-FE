'use client'

import AuthGate from '@/components/AuthGate/AuthGate'
import s from '@/styles'
import { cf } from '@/utils'

export default function Layout({ children }) {
	return (
		<AuthGate>
			<div className={cf(s.wMax, s.flex, s.flexTop)}>{children}</div>
		</AuthGate>
	)
}
