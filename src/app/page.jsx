'use client'

import { cf } from '@/utils'
import p from './page.module.css'
import s from '@/styles'
import App from './_components/_App'
import { Gameplay, Hero } from '@/components/Homepage'

export default function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexStart, p.page)}>
			<Hero />
			<Gameplay />
		</div>
	)
}
