'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './Homepage.module.css'

export default function Container({ tag, children }) {
	return (
		<section className={cf(s.wMax, s.flex, s.flexStart, p.section)}>
			<div className={cf(s.wMax, s.flex, s.flexRight, p.labelContainer)}>
				<h2 className={cf(s.h2, p.label)}>{tag}</h2>
				<div className={cf(p.line)}></div>
			</div>
			<div className={cf(s.wMax, s.flex, s.flexStart, p.content)}>
				{children}
			</div>
		</section>
	)
}
