'use client'

import { cf } from '@/utils'
import p from './page.module.css'
import s from '@/styles'
import {
	Gameplay,
	Hero,
	Roadmap,
	Tournament,
	Team,
	Socials,
	Partnership,
} from '@/components/Homepage'

export default async function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexStart, p.page)}>
			<Hero />
			<Gameplay />
			<Tournament />
			<Roadmap />
			<Team />
			<Socials />
			<Partnership />
		</div>
	)
}
