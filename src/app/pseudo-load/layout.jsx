'use client'

import s from '@/styles'
import { cf } from '@/utils'

export default function Layout({ children }) {
	return (
		<div className={cf(s.wMax, s.flex, s.flexTop)}>{children}</div>
	)
}
