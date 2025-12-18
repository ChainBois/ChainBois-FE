'use client'

import { cf } from '@/utils'
import p from './page.module.css'
import s from '@/styles'
import {
	Gameplay,
	HomePageHero,
	Roadmap,
	Tournament,
	Team,
	Socials,
	Partnership,
} from '@/components/Homepage'

/**
 * Render the homepage layout composed of the main homepage sections.
 *
 * Renders HomePageHero, Gameplay, Tournament, Roadmap, Team, Socials, and Partnership
 * inside a container that combines layout utilities and page-specific styles.
 * @returns {JSX.Element} The root JSX element containing the composed homepage sections.
 */
export default async function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexStart, p.page)}>
			<HomePageHero />
			<Gameplay />
			<Tournament />
			<Roadmap />
			<Team />
			<Socials />
			<Partnership />
		</div>
	)
}