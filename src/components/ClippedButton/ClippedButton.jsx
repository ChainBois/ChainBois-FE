'use client'

import { cf } from '@/utils'
import b from './ClippedButton.module.css'
import s from '@/styles'
import { memo } from 'react'
import Link from 'next/link';
import { isEqual } from '@/hooks';

/**
 * ClippedButton is a customizable button or link component with optional icon and styling.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.tag - The button or link text/content.
 * @param {React.ReactNode} [props.icon] - Optional icon to display inside the button.
 * @param {function|string} props.action - Click handler function (for button) or href (for link).
 * @param {boolean} [props.isLink=false] - If true, renders as a Next.js Link; otherwise, as a button.
 * @param {string} [props.clippedButton] - Additional class names for the button border.
 * @param {string} [props.clippedButtonContent] - Additional class names for the button content.
 * @param {string} [props.clippedButtonText] - Additional class names for the button text.
 * @param {string} [props.clippedButtonIcon] - Additional class names for the button icon.
 * @returns {JSX.Element} The rendered button or link component.
 */
const ClippedButton = memo(({
	tag,
	icon,
	action,
	isLink = false,
	clippedButton = '',
	clippedButtonContent = '',
	clippedButtonText = '',
	clippedButtonIcon = '',
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
		(prev, next) => isEqual(prev, next)
	)
	return (
		<Responder
			action={action}
			tag={tag}
			style={cf(b.clippedButton, clippedButton)}
		>
			<span
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					b.clippedButtonContent,
					clippedButtonContent
				)}
			>
				<span
					className={cf(s.flex, s.flexCenter, b.clippedButtonIcon, clippedButtonIcon)}
				>
					{icon}
				</span>
				<span
					className={cf(s.dInlineBlock, b.clippedButtonText, clippedButtonText)}
				>
					{tag}
				</span>
			</span>
		</Responder>
	)
}, (prev, next) => isEqual(prev, next))

export default ClippedButton
