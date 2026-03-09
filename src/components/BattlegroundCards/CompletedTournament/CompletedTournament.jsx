'use client'

import s from '@/styles'
import { cap, cf, timeTillNext } from '@/utils'
import a from '../ActiveTournament/ActiveTournament.module.css'
import PolyButton from '@/components/PolyButton'
import { TitleSection, CountdownSection, Description } from '../Common'
import { Countdown } from '@/components/Countdown'
import { useMemo } from 'react'
import c from './CompletedTournament.module.css'
import Image from 'next/image'
import TourneyWinner from '@/assets/img/TourneyWinner.png'

const Platform = ({ pfp, username, position }) => {
	const positionClass = useMemo(() => {
		switch (position) {
			case 1:
				return c.first
			case 2:
				return c.second
			case 3:
				return c.third
			default:
				return c.first
		}
	}, [position])
	return (
		<div className={cf(s.flex, s.flexTop, s.p_absolute, c.platform, positionClass)}>
			<figure className={cf(s.flex, s.flexCenter, c.pfpWrapper)}>
				<Image
					src={pfp}
					alt={`PFP of ${cap(username)}`}
					className={cf(s.hMax, s.wMax, c.pfp)}
				/>
			</figure>
			<p className={cf(s.wMax, s.tCenter, s.ellipsis, c.username)}>
				{cap(username)}
			</p>
			<div className={cf(s.wMax, s.flex, s.flexTop, c.positionContainer)}>
				<p className={cf(s.wMax, s.flex, s.flexCenter, c.position)}>
					{position}
				</p>
			</div>
		</div>
	)
}

export default function CompletedTournament({ pseudoIndex, hasReward = true }) {
	const timeReference = useMemo(() => {
		return timeTillNext('mon')
	}, [])

	return (
		<section className={cf(s.wMax, s.flex, s.spaceXCenter, c.tournamentCard)}>
			<TitleSection
				tag='Tournament'
				title={`Tournament #${String(pseudoIndex).padStart(3, '0')}`}
				infoText={hasReward ? 'Your reward: 2,000 $AVAX' : 'No reward'}
				position='center'
			/>
			<div className={cf(s.wMax, s.flex, s.flexCenter, a.buttonContainer)}>
				<PolyButton
					tag={'Claim Reward'}
					side={'right'}
					polyButton={cf(a.polyButton)}
					polyButtonText={a.polyButtonText}
					polyButtonContainerBg={'#181818'}
					disabled={!hasReward}
				/>
			</div>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.p_relative,
					c.leaderboardContainer,
				)}
			>
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.p_absolute,
						c.leaderboardWrapper,
					)}
				>
					<Platform
						pfp={TourneyWinner}
						username={'Thechainalhji'}
						position={2}
					/>
					<Platform
						pfp={TourneyWinner}
						username={'Thechainalhji'}
						position={1}
					/>
					<Platform
						pfp={TourneyWinner}
						username={'Thechainalhji'}
						position={3}
					/>
				</div>
			</div>
		</section>
	)
}
