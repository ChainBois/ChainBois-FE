'use client'

import { useMain, useResizeEffect, useThrottle } from '@/hooks'
import { cf } from '@/utils'
import s from '@/styles'
import p from './Homepage.module.css'
import t from './Tournament.module.css'
import './Tournament.module.css'
import Container from './Container'
import TournamentCard from '../TournamentCard'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import { useEffect, useRef, useState } from 'react'

export default function Tournament() {
	const slidingCardsRef = useRef()
	const parentRef = useRef()
	const autoScrollTimerRef = useRef()
	const transitionTimerRef = useRef()

	const { isTiny, isSmall } = useMain()

	// Tournament data - you can replace this with your actual data source
	const tournaments = [
		{ id: 1 },
		{ id: 2 },
		{ id: 3 },
		{ id: 4 },
		{ id: 5 }, // The last two should be
		{ id: 6 }, // the same as the first two
	]

	const [scrollState, setScrollState] = useState({
		progression: 0,
		translation: 0,
	})

	const [canMove, setCanMove] = useState(true)
	const [isScrollable, setIsScrollable] = useState(false)
	const [flowStopped, setFlowStopped] = useState(false)
	const [maxScroll, setMaxScroll] = useState(0)
	const [maxVisible, setMaxVisible] = useState(0)
	const [autoScrollTriggerCounter, setAutoScrollTriggerCounter] = useState(0)

	// Tournament cards scroll horizontally, so we need card width (1202px + gap)
	const getCardWidth = () => 1202 + 90 // tournament card width + gap

	const updateTransform = (value) => {
		if (slidingCardsRef?.current && slidingCardsRef?.current?.style) {
			slidingCardsRef.current.style.transform = `translate(-${value}px, 0)`
		}
	}

	const pauseFlow = () => {
		setCanMove(() => false)
		setFlowStopped(() => true)
	}

	const continueFlow = () => {
		setCanMove(() => true)
		setFlowStopped(() => false)
	}

	const moveLeft = useThrottle(
		(e) => {
			const cardWidth = getCardWidth()
			setScrollState((prev) => {
				const newProgression = Math.max(0, prev.progression - cardWidth)
				updateTransform(newProgression)
				setAutoScrollTriggerCounter((x) => x + 1)
				return {
					progression: newProgression,
					translation: prev.translation + 1,
				}
			})
		},
		[maxScroll, maxVisible, isSmall, isTiny],
		750
	)

	const moveRight = useThrottle(
		(e) => {
			if (!maxScroll) return
			const cardWidth = getCardWidth()

			setScrollState((prev) => {
				const newProgression = Math.min(maxScroll, prev.progression + cardWidth)
				updateTransform(newProgression)
				setAutoScrollTriggerCounter((x) => x + 1)
				return {
					progression: newProgression,
					translation: prev.translation + 1,
				}
			})
		},
		[maxScroll, maxVisible, isSmall, isTiny],
		750
	)

	const revert = (setState = true) => {
		if (!slidingCardsRef.current || !slidingCardsRef?.current?.style) return

		const ogTimer = setTimeout(() => {
			if (!slidingCardsRef.current || !slidingCardsRef?.current?.style) return
			slidingCardsRef.current.style.transition = 'none'
			updateTransform(0)

			if (setState)
				setScrollState((prev) => ({
					...prev,
					progression: 0,
				}))
			const timer = setTimeout(() => {
				if (slidingCardsRef?.current && slidingCardsRef?.current?.style) {
					slidingCardsRef.current.style.transition =
						'transform 0.5s ease-in-out'
				}
				clearTimeout(timer)
				clearTimeout(ogTimer)
			}, 50)
		}, 550)
	}

	useEffect(() => {
		if (!maxScroll || scrollState.progression < maxScroll) return

		// Only revert when we've actually reached the end
		if (scrollState.progression >= maxScroll) {
			revert()
		}
	}, [scrollState.translation, maxScroll])

	useEffect(() => {
		if (
			!canMove ||
			!slidingCardsRef?.current ||
			!parentRef.current ||
			!maxScroll ||
			maxVisible >= tournaments.length
		)
			return

		const cardWidth = getCardWidth()

		const startAutoScroll = () => {
			autoScrollTimerRef.current = setInterval(() => {
				if (!slidingCardsRef?.current || !slidingCardsRef?.current?.style)
					return

				setScrollState((prev) => {
					const newProgression = prev.progression + cardWidth

					updateTransform(newProgression)
					return {
						progression: newProgression,
						translation: prev.translation + 1,
					}
				})
			}, 3000)
		}

		transitionTimerRef.current = setTimeout(startAutoScroll, 1500)

		return () => {
			clearInterval(autoScrollTimerRef.current)
			clearTimeout(transitionTimerRef.current)
		}
	}, [
		canMove,
		maxScroll,
		maxVisible,
		tournaments.length,
		autoScrollTriggerCounter,
	])

	useResizeEffect(
		() => {
			if (!parentRef.current) return

			const cardWidth = getCardWidth()
			const containerWidth = parentRef.current.offsetWidth
			const sectionWidth = tournaments?.length * cardWidth

			// revert()

			// For column flex with fixed height, cards wrap horizontally
			// So we calculate how many cards fit in the container width
			const maxVisibleCards = Math.floor(containerWidth / cardWidth) || 1
			const maxScrollWidth = Math.max(
				0,
				(tournaments.length - maxVisibleCards) * cardWidth - cardWidth
			)

			setMaxVisible(() => maxVisibleCards)
			setMaxScroll(() => maxScrollWidth)
			setIsScrollable(() => sectionWidth > containerWidth)

			setFlowStopped((flowStopped) => {
				setCanMove(!flowStopped)
				return flowStopped
			})
		},
		[tournaments, isSmall, isTiny],
		500
	)

	// Mouse enter/leave handlers for pausing auto-scroll
	const handleMouseEnter = () => pauseFlow()
	const handleMouseLeave = () => continueFlow()

	return (
		<Container tag='Tournament'>
			<div className={cf(s.wMax, s.flex, s.flexLeft, t.cardsWrapper)}>
				<div
					className={cf(s.flex, s.flexLeft, t.parentContainer)}
					ref={parentRef}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div
						className={cf(s.flex, s.flex_dColumn, t.cards)}
						ref={slidingCardsRef}
						style={{
							transition: 'transform 0.5s ease-in-out',
						}}
					>
						{tournaments.map((tournament, i) => (
							<TournamentCard
								key={tournament.id}
								tournament={tournament.id}
							/>
						))}
					</div>
				</div>

				{isScrollable && (
					<nav
						className={cf(s.flex, s.flexCenter, t.carousal_navigation)}
						aria-label='Tournaments navigation'
					>
						<button
							className={cf(t.pagination_btn, t.prev)}
							aria-label='Previous tournament'
							onClick={moveLeft}
							disabled={scrollState.progression === 0}
						>
							<LuArrowLeft className={cf(t.icon)} />
						</button>

						<button
							className={cf(t.pagination_btn, t.next)}
							aria-label='Next tournament'
							onClick={moveRight}
							disabled={scrollState.progression >= maxScroll}
						>
							<LuArrowRight className={cf(t.icon)} />
						</button>
					</nav>
				)}				
			</div>
		</Container>
	)
}
