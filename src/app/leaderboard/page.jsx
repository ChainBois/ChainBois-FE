'use client'

import { useEffect, useMemo, useState } from 'react'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import { cf } from '@/utils'
import s from '@/styles'
import l from '@/components/Homepage/Leaderboard.module.css'
import BorderedButton from '@/components/BorderedButton'
import { useMain } from '@/hooks'
import h from '@/components/Homepage/Homepage.module.css'
import p from './page.module.css'
import pg from '@/components/Pagination/Pagination.module.css'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

const PERIODS = [
	{ key: 'all', label: 'All Time' },
	{ key: 'weekly', label: 'Weekly' },
	{ key: 'monthly', label: 'Monthly' },
]

const getEntryValue = (entry, keys, fallback = 0) => {
	for (const key of keys) {
		const value = entry?.[key]
		if (value !== undefined && value !== null) return value
	}
	return fallback
}

const DEFAULT_LEADERBOARD_CONTENT = {
	entries: [],
	viewerRank: null,
	pagination: null,
	isLoading: true,
	hasError: false,
}

export default function Page() {
	const {
		buildLeaderboardPageKey,
		leaderboardContentByKey,
		loadLeaderboardContent,
	} = useMain()
	const [period, setPeriod] = useState('all')
	const [page, setPage] = useState(1)
	const [limit] = useState(20)
	const leaderboardKey = useMemo(
		() => buildLeaderboardPageKey?.({ period, limit, page }) ?? '',
		[buildLeaderboardPageKey, limit, page, period],
	)
	const {
		entries,
		viewerRank,
		pagination,
		isLoading,
		hasError,
	} = leaderboardContentByKey?.[leaderboardKey] ?? DEFAULT_LEADERBOARD_CONTENT

	useEffect(() => {
		void loadLeaderboardContent({ period, limit, page })
	}, [limit, loadLeaderboardContent, page, period])

	const content = useMemo(() => {
		if (isLoading) {
			return Array.from({ length: 10 }, (_, index) => ({
				id: `loading-${index}`,
				username: 'Loading...',
				currentScore: '...',
				scoreGained: '...',
				gamesPlayed: null,
				rank: '...',
			}))
		}

		return entries.map((entry, index) => ({
			id: entry?.uid ?? entry?._id ?? `leaderboard-${index}`,
			rank: Number(entry?.rank ?? index + 1),
			username: getEntryValue(entry, ['username', 'displayName', 'name'], 'Unknown Player'),
			currentScore: getEntryValue(entry, ['currentScore', 'score', 'totalScore'], 0),
			scoreGained: getEntryValue(entry, ['scoreGained', 'scoreGain', 'pointsBalance', 'points'], 0),
			gamesPlayed: getEntryValue(entry, ['gamesPlayed'], null),
		}))
	}, [entries, isLoading])

	const periodLabel = useMemo(() => {
		return PERIODS.find((p) => p.key === period)?.label ?? 'All Time'
	}, [period])

	const maxPages = useMemo(() => {
		const pages = Number(pagination?.pages ?? pagination?.totalPages ?? 0)
		return Number.isFinite(pages) && pages > 0 ? pages : null
	}, [pagination])

	const canGoPrev = page > 1 && !isLoading
	const canGoNext = !isLoading && (maxPages ? page < maxPages : content.length >= limit)

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={<>Leaderboard</>}
				subText={
					<>
						Track top operators and monitor your own performance.
						<br className={cf(h.smHidden)} /> Climb the ranks <br className={cf(h.xlHidden, h.lgHidden, h.mdHidden)} />and earn your place.
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Enter Battleground'}
							action={'/battleground'}
							isLink={true}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>

			<Container
				tag='Leaderboard'
				cusClass={cf(p.container)}
			>
				<div className={cf(s.wMax, s.flex, s.flexTop, l.shell)}>
					<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.board)}>
						<div className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, l.boardHeader)}>
							<div className={cf(s.flex, s.flexCenter, l.periodChip)}>{periodLabel}</div>
								<div className={cf(s.flex, s.flexCenter)} style={{ gap: 10 }}>
									{PERIODS.map((nextPeriod) => (
										<BorderedButton
											key={nextPeriod.key}
											tag={nextPeriod.label}
											action={() => {
												setPeriod(nextPeriod.key)
												setPage(1)
											}}
											borderButton={l.boardLink}
											borderButtonContent={cf(
												p.filterContent,
												period === nextPeriod.key
													? p.filterContentActive
													: p.filterContentInactive,
											)}
											borderButtonText={cf(
												period === nextPeriod.key
													? p.filterTextActive
													: p.filterTextInactive,
											)}
											aria-pressed={period === nextPeriod.key}
										/>
									))}
								</div>
							</div>

						{viewerRank && !isLoading ? (
							<div className={cf(s.wMax, s.flex, s.flex_dColumn, p.viewerSection)}>
								<div className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, p.viewerHeader)}>
									<span className={cf(p.viewerTitle)}>Your Rank</span>
								</div>
								<article className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, l.row, p.viewerRow)}>
									<div className={cf(s.flex, s.flexCenter, l.rankBlock)}>
										<span className={cf(l.rankValue)}>
											#{getEntryValue(viewerRank, ['rank'], '--')}
										</span>
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.playerBlock)}>
										<span className={cf(l.playerName)}>
											{getEntryValue(viewerRank, ['username', 'displayName', 'name'], 'You')}
										</span>
										{getEntryValue(viewerRank, ['gamesPlayed'], null) !== null ? (
											<span className={cf(l.playerMeta)}>
												{Number(getEntryValue(viewerRank, ['gamesPlayed'], 0))} games played
											</span>
										) : null}
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock)}>
										<span className={cf(l.statLabel)}>Current Score</span>
										<span className={cf(l.statValue)}>
											{getEntryValue(viewerRank, ['currentScore', 'score', 'totalScore'], 0)}
										</span>
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock, l.pointsBlock)}>
										<span className={cf(l.statLabel)}>Score Gained</span>
										<span className={cf(l.statValue)}>
											{getEntryValue(viewerRank, ['scoreGained', 'scoreGain', 'pointsBalance', 'points'], 0)}
										</span>
									</div>
								</article>
							</div>
						) : null}

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
										{entry.gamesPlayed !== null && entry.gamesPlayed !== undefined ? (
											<span className={cf(l.playerMeta)}>
												{Number(entry.gamesPlayed ?? 0)} games played
											</span>
										) : null}
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock)}>
										<span className={cf(l.statLabel)}>Current Score</span>
										<span className={cf(l.statValue)}>{entry.currentScore}</span>
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock, l.pointsBlock)}>
										<span className={cf(l.statLabel)}>Score Gained</span>
										<span className={cf(l.statValue)}>{entry.scoreGained}</span>
									</div>
								</article>
							))}

							{!isLoading && hasError && (
								<div className={cf(s.wMax, s.flex, s.flex_dColumn, l.emptyState)}>
									<span className={cf(l.emptyTitle)}>Leaderboard offline</span>
									<span className={cf(l.emptyCopy)}>
										We could not load the current rankings. Try again in a bit.
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

						<nav
							className={cf(s.wMax, s.flex, s.flexCenter, s.spaceYCenter, p.pagination)}
							aria-label='Leaderboard pagination'
						>
							<button
								className={cf(pg.pagination_btn, pg.prev)}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={!canGoPrev}
								type='button'
								aria-label='Previous page'
							>
								<LuArrowLeft className={cf(pg.icon)} />
							</button>
							<div className={cf(s.flex, s.flexCenter, p.pageCount)}>
								Page {page}
								{maxPages ? ` of ${maxPages}` : ''}
							</div>
							<button
								className={cf(pg.pagination_btn, pg.next)}
								onClick={() => setPage((p) => p + 1)}
								disabled={!canGoNext}
								type='button'
								aria-label='Next page'
							>
								<LuArrowRight className={cf(pg.icon)} />
							</button>
						</nav>
					</div>
				</div>
			</Container>
		</div>
	)
}
