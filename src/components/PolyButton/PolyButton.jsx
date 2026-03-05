'use client'

import { cf } from '@/utils'
import s from '@/styles'
import b from './PolyButton.module.css'
import { memo, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { isEqual, useResizeEffect } from '@/hooks'

/**
 * PolyButton is a customizable button or link component with optional icon and styling.
 *
 * @param {React.ReactNode} tag - The button or link text/content.
 * @param {function|string} action - Click handler function (for button) or href (for link).
 * @param {boolean} [isLink=false] - If true, renders as a link; otherwise, as a button.
 * @param {('right'|'left')} [side='right'] - The side of the button to be clipped.
 * @param {string} [polyButton=''] - Additional class names for the button container.
 * @param {string} [polyButtonContainer=''] - Additional class names for the button content wrapper.
 * @param {string} [polyButtonContent=''] - Additional class names for the button content.
 * @param {string} [polyButtonText=''] - Additional class names for the button text.
 * @returns {JSX.Element} The rendered button or link component.
 */
const PolyButton = memo(
	({
		tag,
		action,
		isLink = false,
		side = 'right',
		polyButton = '',
		polyButtonContainer = '',
		polyButtonContainerBg = '',
		polyButtonContent = '',
		polyButtonText = '',
		...props
	}) => {
		const Responder = memo(
			({ action, style, children }) =>
				isLink ? (
					<Link
						href={action}
						className={style}
						{...props}
					>
						{children}
					</Link>
				) : (
					<button
						onClick={action}
						className={style}
						{...props}
					>
						{children}
					</button>
				),
			(prev, next) => isEqual(prev, next),
		)

		const sideClass = useMemo(() => {
			switch (side) {
				case 'right':
					return b.right
				case 'left':
					return b.left
				default:
					return ''
			}
		}, [side])

		const polyButtonContainerRef = useRef()
		const polyButtonContentRef = useRef()

		useResizeEffect(
			() => {
				const width = polyButtonContainerRef.current.offsetWidth
				const basePadding = 3.5
				const multiplier = basePadding / 170
				const newPadding = multiplier * width
				polyButtonContainerRef.current.style.padding = `${newPadding}px`
				polyButtonContentRef.current.style.clipPath =
					side === 'right'
						? `polygon(0 0, calc(100% - 15%) 0, 100% calc(60% + ${newPadding}px), 100% 100%, 0 100%, 0 0)`
						: `polygon(0 100%, 0 calc(60% + ${newPadding}px), 15% 0, 100% 0, 100% 100%, 0 100%)`
			},
			[polyButtonContainerRef],
			500,
		)

		useEffect(() => {
			if (polyButtonContainerBg) {
				polyButtonContainerRef.current.style.background = polyButtonContainerBg
			}
		}, [polyButtonContainerBg])

		return (
			<Responder
				action={action}
				tag={tag}
				style={cf(s.flex, s.flexCenter, b.polyButton, sideClass, polyButton)}
			>
				<div
					className={cf(
						s.flex,
						s.flexCenter,
						b.polyButtonContainer,
						sideClass,
						polyButtonContainer,
					)}
					ref={polyButtonContainerRef}
				>
					<div
						className={cf(
							s.flex,
							s.flexCenter,
							b.polyButtonContent,
							sideClass,
							polyButtonContent,
						)}
						ref={polyButtonContentRef}
					>
						<span
							className={cf(s.dInlineBlock, polyButtonText ?? b.polyButtonText)}
						>
							{tag}
						</span>
					</div>
				</div>
			</Responder>
		)
	},
	(prev, next) => isEqual(prev, next),
)

export default PolyButton
