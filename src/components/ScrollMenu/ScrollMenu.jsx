'use client'

import s from '@/styles'
import { cf } from '@/utils'
import m from './ScrollMenu.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

const DEFAULT_OPTIONS = [
	{ tag: 'Home' },
	{ tag: 'Gameplay' },
	{ tag: 'Tournament' },
	{ tag: 'Roadmap' },
	{ tag: 'Team' },
	{ tag: 'Partnership' },
]

const MenuOption = ({ tag, action, isActive, itemRef }) => {
	return (
		<button
			ref={itemRef}
			className={cf(s.flex, s.flexCenter, m.menuOption, isActive ? m.isActive : '')}
			onClick={action}
		>
			{tag}
		</button>
	)
}

export default function ScrollMenu({ options = DEFAULT_OPTIONS }) {
	const wrapperRef = useRef(null)
	const firstItemRef = useRef(null)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(false)
	const [activeIndex, setActiveIndex] = useState(0)

	// Recalculate overflow and scroll-edge state
	const syncScrollState = useCallback(() => {
		const el = wrapperRef.current
		if (!el) return
		const overflowing = el.scrollWidth > el.clientWidth
		setIsOverflowing(overflowing)
		setCanScrollLeft(el.scrollLeft > 0)
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
	}, [])

	useEffect(() => {
		const el = wrapperRef.current
		if (!el) return

		// Sync on scroll
		el.addEventListener('scroll', syncScrollState, { passive: true })

		// Sync on resize
		const ro = new ResizeObserver(syncScrollState)
		ro.observe(el)

		// Initial sync
		syncScrollState()

		return () => {
			el.removeEventListener('scroll', syncScrollState)
			ro.disconnect()
		}
	}, [syncScrollState])

	// Derive the step: first item width + computed column-gap
	const getStep = useCallback(() => {
		const wrapper = wrapperRef.current
		const firstItem = firstItemRef.current
		if (!wrapper || !firstItem) return 120

		const gap = parseFloat(getComputedStyle(wrapper).columnGap) || 0
		return firstItem.offsetWidth + gap
	}, [])

	const scrollLeft = useCallback(() => {
		const el = wrapperRef.current
		if (!el) return
		el.scrollBy({ left: -getStep(), behavior: 'smooth' })
	}, [getStep])

	const scrollRight = useCallback(() => {
		const el = wrapperRef.current
		if (!el) return
		el.scrollBy({ left: getStep(), behavior: 'smooth' })
	}, [getStep])

	return (
		<div className={cf(s.flex, m.parent)}>
			<div
				className={cf(s.wMax, s.flex, s.flexLeft, m.wrapper)}
				ref={wrapperRef}
			>
				<div className={cf(s.flex, s.flex_dColumn, m.menu)}>
					{options.map(({ tag, action }, i) => (
						<MenuOption
							key={tag}
							tag={tag}
							action={() => {
								setActiveIndex(i)
								action?.()
							}}
							isActive={activeIndex === i}
							itemRef={i === 0 ? firstItemRef : undefined}
						/>
					))}
				</div>
			</div>

			{/* Absolutely positioned scroll buttons — rendered outside flex flow */}
			{isOverflowing && (
				<>
					<div className={cf(m.scrollBtnEdge, m.scrollBtnEdgeLeft)}>
						<button
							className={cf(m.scrollBtn, m.scrollBtnLeft)}
							onClick={scrollLeft}
							disabled={!canScrollLeft}
							aria-label='Scroll left'
						>
							<LuArrowLeft className={m.scrollBtnIcon} />
						</button>
					</div>
					<div className={cf(m.scrollBtnEdge, m.scrollBtnEdgeRight)}>
						<button
							className={cf(m.scrollBtn, m.scrollBtnRight)}
							onClick={scrollRight}
							disabled={!canScrollRight}
							aria-label='Scroll right'
						>
							<LuArrowRight className={m.scrollBtnIcon} />
						</button>
					</div>
				</>
			)}
		</div>
	)
}