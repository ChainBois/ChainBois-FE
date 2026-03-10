'use client'

import {
	Gameplay,
	HomePageHero,
	Leaderboard,
	Roadmap,
	Socials,
	Team,
} from '@/components/Homepage';
import s from '@/styles';
import { cf } from '@/utils';
import p from './page.module.css';

export default function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexStart, p.page)}>
			<HomePageHero />
			<Gameplay />
			<Leaderboard />
			<Roadmap />
			<Team />
			<Socials />			
		</div>
	)
}
