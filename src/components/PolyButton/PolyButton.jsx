'use client'

import { cf } from '@/utils'
import s from '@/styles'
import b from './PolyButton.module.css'
import { memo, useMemo } from 'react'
import Link from 'next/link'

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
export default function PolyButton({
	tag,
	action,
	isLink = false,
	side = 'right',
	polyButton = '',
	polyButtonContainer = '',
	polyButtonContent = '',
	polyButtonText = '',
	...props
}) {
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
	
	return (
		<Responder
			action={action}
			tag={tag}
			style={cf(
				s.flex,
				s.flexCenter,
				b.polyButton,
				sideClass,
				polyButton,
			)}
		>
			<div
				className={cf(
					s.flex,
					s.flexCenter,
					b.polyButtonContainer,
					sideClass,
					polyButtonContainer,
				)}
			>
				<div
					className={cf(
						s.flex,
						s.flexCenter,
						b.polyButtonContent,
						sideClass,
						polyButtonContent,
					)}
				>
					<span
						className={cf(s.dInlineBlock, b.polyButtonText, polyButtonText)}
					>
						{tag}
					</span>
				</div>
			</div>
		</Responder>
	)
}
