'use client'

import { cf } from '@/utils'
import b from './BorderedButton.module.css'
import s from '@/styles'
import { memo } from 'react'

/**
 * Renders a bordered button or link with customizable content and styles.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.tag - The text or element to display inside the button.
 * @param {React.ReactNode} props.icon - The icon to display alongside the text.
 * @param {function|string} props.action - The click handler function (for button) or URL (for link).
 * @param {boolean} [props.isLink=false] - If true, renders as a link; otherwise, as a button.
 * @param {string} [props.borderButton] - Additional class names for the button container.
 * @param {string} [props.borderButtonContent] - Additional class names for the button content wrapper.
 * @param {string} [props.borderButtonText] - Additional class names for the button text.
 * @param {string} [props.borderButtonIcon] - Additional class names for the button icon.
 * @returns {JSX.Element} The rendered bordered button or link component.
 */
export default function BorderedButton({
	tag,
	icon,
	action,
	isLink = false,
	borderButton = '',
	borderButtonContent = '',
	borderButtonText = '',
	borderButtonIcon = '',
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
		(prev, next) => isEqual(prev, next)
	)
	return (
		<Responder
			action={action}
			tag={tag}
			style={cf(b.borderButton, borderButton)}
		>
			<span
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					b.borderButtonContent,
					borderButtonContent
				)}
			>
				<span
					className={cf(s.dInlineBlock, b.borderButtonText, borderButtonText)}
				>
					{tag}
				</span>
				<span
					className={cf(s.dInlineBlock, b.borderButtonIcon, borderButtonIcon)}
				>
					{icon}
				</span>
			</span>
		</Responder>
	)
}
