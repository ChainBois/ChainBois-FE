'use client'

import { useEffect, useMemo, useState } from 'react'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import { cf, request } from '@/utils'
import s from '@/styles'
import l from '@/components/Homepage/Leaderboard.module.css'
import BorderedButton from '@/components/BorderedButton'
import { useAuth } from '@/hooks'
import h from '@/components/Homepage/Homepage.module.css'
import p from './page.module.css'
import pg from '@/components/Pagination/Pagination.module.css'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

const PERIODS = [
	{ key: 'all', label: 'All Time' },
	{ key: 'weekly', label: 'Weekly' },
	{ key: 'monthly', label: 'Monthly' },
]

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

const normalizePagination = (payload) => {
	const candidates = [
		payload?.data?.pagination,
		payload?.data?.data?.pagination,
		payload?.pagination,
	]
	for (const candidate of candidates) {
		if (candidate && typeof candidate === 'object') return candidate
	}
	return null
}

const getEntryValue = (entry, keys, fallback = 0) => {
	for (const key of keys) {
		const value = entry?.[key]
		if (value !== undefined && value !== null) return value
	}
	return fallback
}

const getViewerUid = (user) =>
	user?.uid ?? user?.userID ?? user?._id ?? user?.id ?? null

const buildLeaderboardPaths = ({ period = 'all', limit = 20, page = 1 }) => {
	const safePeriod = period || 'all'
	const safeLimit = Number(limit) || 20
	const safePage = Number(page) || 1

	if (safePeriod === 'all') {
		return [`leaderboard?limit=${safeLimit}&page=${safePage}`]
	}

	return [
		`leaderboard/${safePeriod}?limit=${safeLimit}&page=${safePage}`,
		`leaderboard?period=${encodeURIComponent(safePeriod)}&limit=${safeLimit}&page=${safePage}`,
	]
}

const buildRankPaths = ({ uid, period = 'all' }) => {
	if (!uid) return []
	const safePeriod = period || 'all'

	return [
		`leaderboard/rank/${uid}`,
		`leaderboard/rank/${uid}?period=${encodeURIComponent(safePeriod)}`,
		`leaderboard/rank/${uid}/${safePeriod}`,
	]
}

const requestWithFallbackPaths = async (paths, accessToken) => {
	for (const path of paths) {
		const res = await request({
			path,
			method: 'get',
			...(accessToken ? { accessToken } : {}),
		})
		if (res?.success) return res
	}
	return null
}

export default function Page() {
	const { user } = useAuth()
	const viewerUid = useMemo(() => getViewerUid(user), [user])
	const [period, setPeriod] = useState('all')
	const [page, setPage] = useState(1)
	const [limit] = useState(20)

	const [entries, setEntries] = useState([])
	const [viewerRank, setViewerRank] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const [pagination, setPagination] = useState(null)

	useEffect(() => {
		let isActive = true

		const loadLeaderboard = async () => {
			setIsLoading(true)
			setHasError(false)

			const leaderboardRes = await requestWithFallbackPaths(
				buildLeaderboardPaths({ period, limit, page }),
				user?.accessToken ?? '',
			)

			if (!isActive) return

			if (!leaderboardRes?.success) {
				setEntries([])
				setPagination(null)
				setHasError(true)
				setIsLoading(false)
				return
			}

			const nextEntries = normalizeLeaderboardEntries(leaderboardRes)
			setEntries(nextEntries)
			setPagination(normalizePagination(leaderboardRes))
			setIsLoading(false)
		}

		loadLeaderboard()

		return () => {
			isActive = false
		}
	}, [limit, page, period, user?.accessToken])

	useEffect(() => {
		let isActive = true

		const loadRank = async () => {
			if (!viewerUid) {
				setViewerRank(null)
				return
			}

			const rankRes = await requestWithFallbackPaths(
				buildRankPaths({ uid: viewerUid, period }),
				user?.accessToken ?? '',
			)

			if (!isActive) return

			if (!rankRes?.success) {
				setViewerRank(null)
				return
			}

			const data = rankRes?.data?.data ?? rankRes?.data ?? null
			setViewerRank(data)
		}

		loadRank()

		return () => {
			isActive = false
		}
	}, [period, user?.accessToken, viewerUid])

	const content = useMemo(() => {
		if (isLoading) {
			return Array.from({ length: 10 }, (_, index) => ({
				id: `loading-${index}`,
				username: 'Loading...',
				score: '...',
				pointsBalance: '...',
				gamesPlayed: '...',
				rank: '...',
			}))
		}

		return entries.map((entry, index) => ({
			id: entry?.uid ?? entry?._id ?? `leaderboard-${index}`,
			rank: Number(entry?.rank ?? index + 1),
			username: getEntryValue(entry, ['username', 'displayName', 'name'], 'Unknown Player'),
			score: getEntryValue(entry, ['score', 'totalScore'], 0),
			pointsBalance: getEntryValue(entry, ['pointsBalance', 'points'], 0),
			gamesPlayed: getEntryValue(entry, ['gamesPlayed'], 0),
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
										<span className={cf(l.playerMeta)}>
											{Number(getEntryValue(viewerRank, ['gamesPlayed'], 0))} games played
										</span>
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock)}>
										<span className={cf(l.statLabel)}>Score</span>
										<span className={cf(l.statValue)}>
											{getEntryValue(viewerRank, ['score', 'totalScore'], 0)}
										</span>
									</div>
									<div className={cf(s.flex, s.flex_dColumn, l.statBlock, l.pointsBlock)}>
										<span className={cf(l.statLabel)}>Points</span>
										<span className={cf(l.statValue)}>
											{getEntryValue(viewerRank, ['pointsBalance', 'points'], 0)}
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
