'use client'

import {
	Gameplay,
	HomePageHero,
	Roadmap,
	Socials,
	Team,
	Tournament,
} from '@/components/Homepage';
import s from '@/styles';
import { cf } from '@/utils';
import p from './page.module.css';

export default function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexStart, p.page)}>
			<HomePageHero />
			<Gameplay />
			<Tournament />
			<Roadmap />
			<Team />
			<Socials />			
		</div>
	)
}