'use client'

import s from '@/styles'
import { cf, formatAsCurrency, timeTillNext } from '@/utils'
import a from './ActiveTournament.module.css'
import { TitleSection, CountdownSection, Description } from '../Common'
import { Countdown } from '@/components/Countdown'
import PolyButton from '@/components/PolyButton'
import { useMemo, useRef } from 'react'
import { useMain, useResizeEffect } from '@/hooks'

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
			<p className={cf(s.flex, s.flexRight, a.username)}>{username}</p>
			<p className={cf(s.flex, s.flexRight, a.points)}>
				{pointsValue} point{points !== 1 && 's'}
			</p>
		</section>
	)
}

export default function ActiveTournament({ pseudoIndex = 0 }) {
	const { query: { isTablet = null, isDesktop = null, isMobile = null } = {} } =
		useMain()
	const timeReference = useMemo(() => {
		return timeTillNext('mon')
	}, [])

	const tournamentCardRef = useRef(null)
	const tourneyInfoRef = useRef(null)
	const leaderboardSectionRef = useRef(null)
	const leaderboardWrapperRef = useRef(null)
	const baseLeaderboardHeightRef = useRef(null)
	const appliedLeaderboardHeightRef = useRef(null)
	const layoutModeRef = useRef(null)

	useResizeEffect(
		() => {
			if (
				!tournamentCardRef.current ||
				!tourneyInfoRef.current ||
				!leaderboardSectionRef.current ||
				!leaderboardWrapperRef.current
			)
				return

			const wrapperElement = leaderboardWrapperRef.current
			const isMobileView = Boolean(isMobile)
			const isTabletView = !isMobileView && Boolean(isTablet)
			const isDesktopView = !isMobileView && !isTabletView && Boolean(isDesktop)
			const currentLayoutMode = isMobileView
				? 'mobile'
				: isTabletView
					? 'tablet'
					: isDesktopView
						? 'desktop'
						: 'unknown'

			// Re-sync baseline height when breakpoint mode changes.
			// Clear inline height first so we can read the stylesheet height for this mode.
			if (layoutModeRef.current !== currentLayoutMode) {
				wrapperElement.style.height = ''
				layoutModeRef.current = currentLayoutMode
				baseLeaderboardHeightRef.current = null
				appliedLeaderboardHeightRef.current = null
			}

			if (baseLeaderboardHeightRef.current === null) {
				const initialHeight = parseFloat(
					getComputedStyle(wrapperElement).height,
				)
				baseLeaderboardHeightRef.current = Number.isNaN(initialHeight)
					? 0
					: initialHeight
			}

			const tourneyInfoRect = tourneyInfoRef.current.getBoundingClientRect()
			const wrapperTop = wrapperElement.getBoundingClientRect().top
			const baselineWrapperBottom =
				wrapperTop + baseLeaderboardHeightRef.current
			const gapFromBottom = Math.max(
				0,
				Math.round(tourneyInfoRect.bottom - baselineWrapperBottom),
			)
			let nextHeight = baseLeaderboardHeightRef.current + gapFromBottom

			// Mobile should always use the stylesheet base height.
			if (isMobileView) {
				nextHeight = baseLeaderboardHeightRef.current
			}

			// Final guard for tablet/desktop: if leaderboardSection is taller than
			// tourneyInfo, reduce the wrapper by that overflow amount.
			if (isTabletView || isDesktopView) {
				const leaderboardSectionHeight =
					leaderboardSectionRef.current.getBoundingClientRect().height
				const tourneyInfoHeight =
					tourneyInfoRef.current.getBoundingClientRect().height
				const overflowDifference = Math.max(
					0,
					Math.round(leaderboardSectionHeight - tourneyInfoHeight),
				)
				nextHeight = Math.max(0, nextHeight - overflowDifference)
			}

			// Prevent write loops by only mutating when the computed height changes.
			if (appliedLeaderboardHeightRef.current !== nextHeight) {
				wrapperElement.style.height = `${nextHeight}px`
				appliedLeaderboardHeightRef.current = nextHeight
			}
		},
		[isMobile, isTablet, isDesktop],
		150,
	)

	return (
		<section
			className={cf(s.wMax, s.flex, s.spaceXCenter, a.tournamentCard)}
			ref={tournamentCardRef}
		>
			<div className={cf(s.flex, s.flex_dColumn, s.flexLeft, a.tourneyWrapper)}>
				<div
					className={cf(s.wMax, s.flex, s.flexCenter, a.tourneyInfo)}
					ref={tourneyInfoRef}
				>
					<TitleSection
						tag='Tournament'
						title={`Tournament #${String(pseudoIndex + 1).padStart(3, '0')}`}
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
					<div
						className={cf(s.wMax, s.flex, s.spaceXBetween, a.buttonContainer)}
					>
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
			</div>
			<div
				className={cf(
					s.flex,
					s.flexLeft,
					s.flex_dColumn,
					s.flexOne,
					a.leaderboardSection,
				)}
				ref={leaderboardSectionRef}
			>
				<h3 className={cf(s.wMax, s.flex, s.flexLeft, a.leaderboardTitle)}>
					Leaderboard
				</h3>
				<div
					className={cf(s.wMax, s.flex, s.flexTop, a.leaderboardWrapper)}
					ref={leaderboardWrapperRef}
				>
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
