'use client'

import { cf } from '@/utils'
import s from '@/styles'
import b from './BuyButton.module.css'
import { memo } from 'react'
import Link from 'next/link'
import { isEqual } from '@/hooks'

/**
 * BuyButton is a customizable buy/sell button or link component with optional icon and styling.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} [props.tag] - The button or link text/content. Defaults to "Buy" / "Sell".
 * @param {React.ReactNode} [props.icon] - Optional icon to display inside the button.
 * @param {function|string|null} [props.action=null] - Click handler function (for button) or href (for link).
 * @param {boolean} [props.isLink=false] - If true, renders as a Next.js Link; otherwise, as a button.
 * @param {boolean} [props.sell=false] - If true and tag is not provided, uses "Sell" label.
 * @param {string} [props.buyButton=''] - Additional class names for the button container.
 * @param {string} [props.buyButtonContent=''] - Additional class names for the button content wrapper.
 * @param {string} [props.buyButtonText=''] - Additional class names for the button text.
 * @param {string} [props.buyButtonIcon=''] - Additional class names for the button icon.
 * @returns {JSX.Element} The rendered BuyButton component.
 */
const BuyButton = memo(
	({
		tag,
		icon,
		action = null,
		isLink = false,
		buyButton = '',
		buyButtonContent = '',
		buyButtonText = '',
		buyButtonIcon = '',
		sell = false,
		...props
	}) => {
		const label = tag ?? (sell ? 'Sell' : 'Buy')

		const Responder = ({ action, style, children }) =>
			isLink ? (
				<Link
					href={typeof action === 'string' && action ? action : '#'}
					className={style}
					{...props}
				>
					{children}
				</Link>
			) : (
				<button
					onClick={typeof action === 'function' ? action : undefined}
					className={style}
					type='button'
					{...props}
				>
					{children}
				</button>
			)

		return (
			<Responder
				action={action}
				tag={label}
				style={cf(s.flex, s.flexCenter, s.g10, b.buyButton, buyButton)}
			>
				<span
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						b.buyButtonContent,
						buyButtonContent,
					)}
				>
					{icon ? (
						<span
							className={cf(
								s.flex,
								s.flexCenter,
								b.buyButtonIcon,
								buyButtonIcon,
							)}
						>
							{icon}
						</span>
					) : null}
					<span className={cf(s.dInlineBlock, b.buyButtonText, buyButtonText)}>
						{label}
					</span>
				</span>
			</Responder>
		)
	},
	(prev, next) => isEqual(prev, next),
)

BuyButton.displayName = 'BuyButton'

export default BuyButton
