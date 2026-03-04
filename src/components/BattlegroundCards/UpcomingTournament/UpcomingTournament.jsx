'use client'

import s from '@/styles'
import { cf, timeTillNext } from '@/utils'
import a from '../ActiveTournament/ActiveTournament.module.css'
import PolyButton from '@/components/PolyButton'
import { TitleSection, CountdownSection, Description } from '../Common'
import { Countdown } from '@/components/Countdown'
import { useMemo } from 'react'
import u from './UpcomingTournament.module.css'

export default function UpcomingTournament({pseudoIndex}) {
	const timeReference = useMemo(() => {
		return timeTillNext('mon')
	}, [])

	return (
		<section className={cf(s.wMax, s.flex, s.spaceXCenter, u.tournamentCard)}>
			<TitleSection
				tag='Tournament'
				title={`Tournament #${String(pseudoIndex).padStart(3, '0')}`}
				infoText='200 $somi'
				position='center'
			/>
			<Description
				text={`A  brief description of the tournament goes here; 
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
				Aenean vitae velit pellentesque, euismod justo at, volutpat augue.
				Aliquam rhoncus tincidunt blandit. Morbi dictum mattis pretium. 
				Mauris justo metus, faucibus nec purus vel, dapibus fermentum dui.
				Etiam sit amet odio iaculis leo tincidunt pulvinar nec id eros.
				Quisque dictum augue quis mattis sodales.
				Curabitur posuere ligula at dignissim facilisis.`}
			/>
			<Countdown
				timeReference={timeReference}
				CustomComponent={CountdownSection}
			/>
			<div className={cf(s.wMax, s.flex, s.spaceXBetween, a.buttonContainer)}>
				<PolyButton
					tag={'Join Now'}
					side={'right'}
					polyButton={cf(s.mRA, a.polyButton)}
					polyButtonText={a.polyButtonText}
				/>
				<PolyButton
					tag={'Details'}
					side={'left'}
					polyButton={cf(s.mLA, a.polyButton)}
					polyButtonText={a.polyButtonText}
				/>
			</div>
		</section>
	)
}
