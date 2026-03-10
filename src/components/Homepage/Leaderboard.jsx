'use client'

import { useEffect, useMemo, useState } from 'react'
import Container from './Container'
import s from '@/styles'
import { cf, request } from '@/utils'
import BorderedButton from '../BorderedButton'
import l from './Leaderboard.module.css'

const normalizeLeaderboardEntries = (payload) => {
	const candidates = [
		payload?.data?.entries,
		payload?.data?.leaderboard,
		payload?.data?.items,
		payload?.data?.data?.entries,
		payload?.data?.data?.leaderboard,
		payload?.data?.data?.items,
		payload?.data,
	]

	for (const candidate of candidates) {
		if (Array.isArray(candidate)) return candidate
	}

	return []
}

const getEntryValue = (entry, keys, fallback = 0) => {
	for (const key of keys) {
		const value = entry?.[key]
		if (value !== undefined && value !== null) return value
	}
	return fallback
}

export default function Leaderboard() {
	const [entries, setEntries] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		let isActive = true

		const loadLeaderboard = async () => {
			setIsLoading(true)
			setHasError(false)

			const res = await request({
				path: 'leaderboard?limit=5&page=1',
				method: 'get',
			})

			if (!isActive) return

			if (!res?.success) {
				setEntries([])
				setHasError(true)
				setIsLoading(false)
				return
			}

			setEntries(normalizeLeaderboardEntries(res).slice(0, 5))
			setIsLoading(false)
		}

		loadLeaderboard()

		return () => {
			isActive = false
		}
	}, [])

	const content = useMemo(() => {
		if (isLoading) {
			return Array.from({ length: 5 }, (_, index) => ({
				id: `loading-${index}`,
				username: 'Loading...',
				score: '...',
				pointsBalance: '...',
			}))
		}

		if (!entries.length) return []

		return entries.map((entry, index) => ({
			id: entry?.uid ?? entry?._id ?? `leaderboard-${index}`,
			rank: Number(entry?.rank ?? index + 1),
			username:
				getEntryValue(entry, ['username', 'displayName', 'name'], 'Unknown Player'),
			score: getEntryValue(entry, ['score', 'totalScore'], 0),
			pointsBalance: getEntryValue(entry, ['pointsBalance', 'points'], 0),
			gamesPlayed: getEntryValue(entry, ['gamesPlayed'], 0),
		}))
	}, [entries, isLoading])

	return (
		<Container tag='Leaderboard'>
			<div className={cf(s.wMax, s.flex, s.flexTop, l.shell)}>
				{/* <div className={cf(s.flex, s.flex_dColumn, l.intro)}>
					<span className={cf(l.kicker)}>All-Time Ranking</span>
					<h3 className={cf(l.title)}>Top operators across the ChainBois battleground.</h3>
					<p className={cf(l.copy)}>
						Track the highest cumulative scores and see who is setting the pace for the next tournament cycle.
					</p>
				</div> */}

				<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.board)}>
					<div className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, l.boardHeader)}>
						<div className={cf(s.flex, s.flexCenter, l.periodChip)}>All Time</div>
						<BorderedButton
							tag='Full Battleground'
							action='/battleground'
							isLink={true}
							borderButton={l.boardLink}
						/>
					</div>

					<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.rows)}>
						{content.map((entry) => (
							<article
								key={entry.id}
								className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, l.row, isLoading ? l.loadingRow : '')}
							>
								<div className={cf(s.flex, s.flexCenter, l.rankBlock)}>
									<span className={cf(l.rankValue)}>#{entry.rank ?? '--'}</span>
								</div>
								<div className={cf(s.flex, s.flex_dColumn, l.playerBlock)}>
									<span className={cf(l.playerName)}>{entry.username}</span>
									<span className={cf(l.playerMeta)}>
										{Number(entry.gamesPlayed ?? 0)} games played
									</span>
								</div>
								<div className={cf(s.flex, s.flex_dColumn, l.statBlock)}>
									<span className={cf(l.statLabel)}>Score</span>
									<span className={cf(l.statValue)}>{entry.score}</span>
								</div>
								<div className={cf(s.flex, s.flex_dColumn, l.statBlock, l.pointsBlock)}>
									<span className={cf(l.statLabel)}>Points</span>
									<span className={cf(l.statValue)}>{entry.pointsBalance}</span>
								</div>
							</article>
						))}

						{!isLoading && hasError && (
							<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.emptyState)}>
								<span className={cf(l.emptyTitle)}>Leaderboard offline</span>
								<span className={cf(l.emptyCopy)}>
									We could not load the current rankings. Try the battleground page in a bit.
								</span>
							</div>
						)}

						{!isLoading && !hasError && !content.length && (
							<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.emptyState)}>
								<span className={cf(l.emptyTitle)}>No standings yet</span>
								<span className={cf(l.emptyCopy)}>
									The first leaderboard entries will appear here once scores start syncing in.
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</Container>
	)
}
