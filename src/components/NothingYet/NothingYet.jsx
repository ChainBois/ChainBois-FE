'use client'

import { cf } from '@/utils'
import s from '@/styles'
import n from './NothingYet.module.css'
import h from './Homepage/Hero.module.css'

export default function NothingYet({ message, cta }) {
	return (
		<div
			className={cf(
				s.flex,
				s.flex_dColumn,
				s.flexBottom,
				s.tCenter,
				s.pX10,
				s.pY20,
			)}
		>
			<div className={cf(s.flex, s.flex_dColumn, s.flexBottom, n.wrapper)}>
				<p className={cf(s.wMax, s.tLeft, h.heroTitle, n.message)}>{message ?? 'Nothing Yet'}</p>
				{cta}
			</div>
		</div>
	)
}
