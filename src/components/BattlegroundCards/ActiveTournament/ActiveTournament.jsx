'use client'

import s from '@/styles'
import { cf, formatAsCurrency, timeTillNext } from '@/utils'
import a from './ActiveTournament.module.css'
import { TitleSection, CountdownSection, Description } from '../Common'
import { Countdown } from '@/components/Countdown'
import PolyButton from '@/components/PolyButton'
import { useMemo } from 'react';

const dummyLeaderboardRanks = [
	{
		rank: 1,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 2,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 3,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 4,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 5,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 6,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 7,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 8,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 9,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 10,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 123,
		username: 'Thechainalhji',
		points: 5000,
	},
	{
		rank: 4321,
		username: 'Thechainalhji',
		points: 5000,
	},
]

const LeaderboardRank = ({ rank, username, points }) => {
	const rankValue = useMemo(() => {
		return formatAsCurrency({
			value: rank,
			depth: 1e6,
			dp: 2,
			trim: true,
		})
	}, [rank])
	const pointsValue = useMemo(() => {
		return formatAsCurrency({
			value: points,
			depth: 1e9,
			dp: 2,
			trim: true,
		})
	}, [points])
	return (
		<section
			className={cf(
				s.wMax,
				s.flex,
				s.flexRight,
				s.p_relative,
				a.leaderboardRank,
			)}
		>
			<p className={cf(s.p_absolute, a.rank)}>
				{String(rankValue).padStart(2, '0')}
			</p>
			<p className={cf(s.flex, s.flexRight, a.username)}>
				{username}
			</p>
			<p className={cf(s.flex, s.flexRight, a.points)}>
				{pointsValue} point{points !== 1 && 's'}
			</p>
		</section>
	)
}

export default function ActiveTournament({}) {
	const timeReference = useMemo(() => {
		return timeTillNext('mon')
	}, [])
	return (
		<section className={cf(s.wMax, s.flex, s.spaceXCenter, a.tournamentCard)}>
			<div className={cf(s.flex, s.flexTop, a.tourneyInfo)}>
				<TitleSection
					tag='Tournament'
					title='Active Tournament'
					infoText='200 $somi'
					position='left'
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
						tag={'Leaderboard'}
						side={'right'}
						polyButton={a.polyButton}
						polyButtonText={a.polyButtonText}
					/>
					<PolyButton
						tag={'Details'}
						side={'left'}
						polyButton={a.polyButton}
						polyButtonText={a.polyButtonText}
					/>
				</div>
			</div>
			<div className={cf(s.flex, s.flexTop, s.flexOne, a.leaderboardSection)}>
				<h3 className={cf(s.wMax, s.flex, s.flexLeft, a.leaderboardTitle)}>
					Leaderboard
				</h3>
				<div className={cf(s.wMax, s.flex, s.flexCenter, a.leaderboardWrapper)}>
					<div className={cf(s.wMax, s.flex, s.flexTop, a.leaderboard)}>
						{dummyLeaderboardRanks.map((rank, index) => {
							return (
								<LeaderboardRank
									key={index}
									rank={rank.rank}
									username={rank.username}
									points={rank.points}
								/>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
