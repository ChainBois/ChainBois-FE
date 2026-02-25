'use client'
import { useResizeEffect, useThrottle, useMediaQuery } from '@/hooks' // Assuming useMediaQuery is added to your hooks index
import s from '@/styles'
import { cf } from '@/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import TournamentCard from '../TournamentCard'
import Container from './Container'
import './Tournament.module.css'
import t from './Tournament.module.css'
import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'

export default function Tournament() {
	const slidingCardsRef = useRef()
	const parentRef = useRef()
	const autoScrollTimerRef = useRef()
	const transitionTimerRef = useRef()

	// Define and use the new breakpoints
	// isMobile: (max-width: 480px)
	const isMobile = useMediaQuery(MOBILE_QUERY || '(max-width: 480px)')
	// isTablet: (max-width: 834px) OR (width >= 600px and width <= 960px and orientation: landscape)
	const isTablet = useMediaQuery(
		TABLET_QUERY ||
			'(max-width: 834px)',
	)
	// isDesktop: Everything else (implied)

	// Use a derived state for clarity if needed in legacy parts of the code
	const isDesktop = !isMobile && !isTablet

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
	// Replaced isTiny/isSmall logic with new breakpoints
	const getCardWidth = useCallback(
		() => {
			if (isMobile) return 243.5 + 19
			if (isTablet) return 546 + 45
			return 1202 + 90 // Default to desktop size
		},
		[isMobile, isTablet], // Depend on the new breakpoints
	)

	const updateTransform = (value) => {
		if (slidingCardsRef?.current && slidingCardsRef?.current?.style) {
			slidingCardsRef.current.style.transform = `translate(-${value}px, 0)`
		}
	}

	// ... (pauseFlow, continueFlow, moveLeft, moveRight, revert functions remain unchanged) ...
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
		[maxScroll, maxVisible],
		750,
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
		[maxScroll, maxVisible],
		750,
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

	// This hook now uses ResizeObserver internally for robust resizing
	// const [resizeTrigger, setResizeTrigger] = useState(0)
	useResizeEffect(
		() => {
			if (!parentRef.current) return
			const cardWidth = getCardWidth()
			const containerWidth = parentRef.current.offsetWidth
			const sectionWidth = tournaments?.length * cardWidth

			// For column flex with fixed height, cards wrap horizontally
			// So we calculate how many cards fit in the container width
			const maxVisibleCards = Math.floor(containerWidth / cardWidth) || 1
			const maxScrollWidth = Math.max(
				0,
				(tournaments.length - maxVisibleCards) * cardWidth - cardWidth,
			)
			setMaxVisible(() => maxVisibleCards)
			setMaxScroll(() => maxScrollWidth)
			setIsScrollable(() => sectionWidth > containerWidth)
			setFlowStopped((flowStopped) => {
				setCanMove(!flowStopped)
				return flowStopped
			})

			// setResizeTrigger((c) => c + 1)
		},
		[tournaments, getCardWidth], // Depend on getCardWidth which depends on the breakpoints
		500,
	)

	// Dedicated effect to handle the reset *after* layout state updates
	// useEffect(() => {
	// 	// This effect runs whenever maxScroll updates (which happens immediately after the resize calculation)
	// 	// We use the resizeTrigger to confirm this reset was due to a layout change.
	// 	revert(true)
	// }, [resizeTrigger, maxScroll]) // Depend on maxScroll and the new trigger state

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
