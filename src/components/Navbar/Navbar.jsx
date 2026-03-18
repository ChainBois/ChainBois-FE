'use client'

import CB from '@/assets/svg/CB.svg'
import CBBranding from '@/assets/svg/CBBranding.svg'
import { useMain, useMediaQuery } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdArrowOutward, MdClose, MdKeyboardArrowUp } from 'react-icons/md'
import n from './Navbar.module.css'
import { TABLET_QUERY } from '@/constants'

/**
 * Render a navigation item that can be a link, button, or static label with an optional hover tooltip.
 *
 * Renders a list item containing either a Next.js Link, a button, or a span depending on `isLink`
 * and `action`. When `showTooltip` is true, displays `tooltipText` in a tooltip while hovered.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.tag="Home"] - Visible text for the nav item.
 * @param {string|Function|null} [props.action=null] - URL string for links, click handler for buttons, or null for a non-interactive label.
 * @param {boolean} [props.isLink=true] - If true, render as a link/span; if false, render as a button.
 * @param {boolean} [props.showTooltip=true] - Whether to show a tooltip on hover.
 * @param {string} [props.tooltipText="Coming Soon"] - Text displayed inside the tooltip.
 * @returns {JSX.Element} The rendered navigation list item.
 */
function NavItem({
	tag = 'Home',
	action = null,
	isLink = true,
	showTooltip = true,
	tooltipText = 'Coming Soon',
}) {
	const [isHovered, setIsHovered] = useState(false)

	const Responder = ({ action, tag, style, onMouseEnter, onMouseLeave }) =>
		isLink ? (
			<>
				{action ? (
					<Link
						href={action}
						className={style}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						{tag}
					</Link>
				) : (
					<span
						className={style}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						{tag}
					</span>
				)}
			</>
		) : (
			<button
				onClick={action}
				className={style}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				{tag}
			</button>
		)

	const handleMouseEnter = () => {
		if (showTooltip) {
			setIsHovered(true)
		}
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	return (
		<li className={cf(s.flex, s.flexCenter, s.p_relative, n.navItemWrapper)}>
			<Responder
				action={action}
				tag={tag}
				style={n.navItem}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>

			{showTooltip && (
				<div
					className={cf(n.tooltip, isHovered && n.fadeIn)}
					style={{
						opacity: isHovered ? 1 : 0,
						pointerEvents: isHovered ? 'auto' : 'none',
					}}
				>
					<span className={n.tooltip__text}>{tooltipText}</span>
				</div>
			)}
		</li>
	)
}

function PlayButton() {
	return (
		<Link
			className={cf(s.flex, s.flexCenter, s.g10, n.playButton)}
			href={'/access-request'}
		>
			<span className={s.dInlineBlock}>Play Now</span>
			<MdArrowOutward className={cf(s.dInlineBlock, n.playIcon)} />
		</Link>
	)
}

/**
 * Full-screen mobile navigation drawer with scroll-to-top support.
 */
function MobileMenu({ isOpen, onClose }) {
	const menuRef = useRef(null)
	const [showScrollTop, setShowScrollTop] = useState(false)

	const handleScroll = useCallback(() => {
		if (menuRef.current) {
			setShowScrollTop(menuRef.current.scrollTop > 80)
		}
	}, [])

	useEffect(() => {
		const el = menuRef.current
		if (!el) return
		el.addEventListener('scroll', handleScroll, { passive: true })
		return () => el.removeEventListener('scroll', handleScroll)
	}, [handleScroll])

	// Lock body scroll when open
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	const scrollToTop = () => {
		menuRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const mobileLinks = [
		{ tag: 'Battleground', action: '/battleground', showTooltip: false },
		{ tag: 'Armory', action: '/armory', showTooltip: false },
		{ tag: 'Training Room', action: '/training-room', showTooltip: false },
		{
			tag: 'Marketplace',
			action: '/marketplace',
			showTooltip: false,
		},
		{
			tag: 'Inventory',
			action: '/inventory',
			showTooltip: false,
		},
	]

	return (
		<div className={cf(n.mobileMenu, isOpen && n.mobileMenuOpen)}>
			<div
				ref={menuRef}
				className={n.mobileMenuInner}
			>
				{/* Close row */}
				<div
					className={cf(
						s.flex,
						s.spaceXBetween,
						s.spaceYCenter,
						n.mobileMenuHeader,
					)}
				>
					<Link
						href='/'
						className={cf(s.flex, s.flexCenter, n.logoContainer)}
						onClick={onClose}
					>
						<Image
							src={CBBranding}
							alt='CBBranding Logo'
							width={160}
							height={21.9}
							className={n.logo}
						/>
					</Link>
					<button
						className={cf(s.flex, s.flexCenter, n.mobileCloseBtn)}
						onClick={onClose}
						aria-label='Close menu'
					>
						<MdClose className={n.mobileCloseIcon} />
					</button>
				</div>

				{/* Nav links */}
				<ul className={cf(n.mobileNavLinks)}>
					{mobileLinks.map(({ tag, action, showTooltip, tooltipText }) => (
						<li
							key={tag}
							className={n.mobileNavItem}
						>
							{action ? (
								<Link
									href={action}
									className={n.mobileNavLink}
									onClick={onClose}
								>
									<span>{tag}</span>
									<MdArrowOutward className={n.mobileNavArrow} />
								</Link>
							) : (
								<span className={cf(n.mobileNavLink, n.mobileNavLinkDisabled)}>
									<span>{tag}</span>
									<span className={n.mobileNavBadge}>
										{tooltipText ?? 'Coming Soon'}
									</span>
								</span>
							)}
						</li>
					))}
				</ul>

				{/* Play button */}
				<div className={n.mobilePlayWrapper}>
					<Link
						href={'/access-request'}
						className={cf(
							s.flex,
							s.flexCenter,
							s.g10,
							n.playButton,
							n.mobilePlayButton,
						)}
					>
						<span className={s.dInlineBlock}>Play Now</span>
						<MdArrowOutward className={cf(s.dInlineBlock, n.playIcon)} />
					</Link>
				</div>
			</div>

			{/* Scroll-to-top */}
			<button
				className={cf(n.scrollTopBtn, showScrollTop && n.scrollTopBtnVisible)}
				onClick={scrollToTop}
				aria-label='Scroll to top'
			>
				<MdKeyboardArrowUp className={n.scrollTopIcon} />
			</button>
		</div>
	)
}

/**
 * Render the site header containing branding, primary navigation links, a play button, and a hamburger menu.
 *
 * Chooses a compact branding asset when the layout is small and arranges navigation items (some with tooltips),
 * the play action, and a responsive hamburger control.
 *
 * @returns {JSX.Element} The navbar header element.
 */
export default function Navbar() {
	const isTablet = useMediaQuery(TABLET_QUERY)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const branding = useMemo(
		() => (true ? CBBranding : isTablet ? CB : CBBranding),
		[isTablet],
	)
	return (
		<>
			<header className={cf(s.wMax, s.flex, s.flexCenter, n.nav)}>
				<nav
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.spaceYCenter,
						n.navItems,
					)}
				>
					<Link
						href={'/'}
						className={cf(s.flex, s.flexCenter, n.logoContainer)}
					>
						<Image
							src={branding}
							alt='CBBranding Logo'
							width={240}
							height={32.8}
							className={n.logo}
						/>
					</Link>

					<div className={cf(s.flex, s.flexCenter, n.navLinksWrapper)}>
						<ul className={cf(s.flex, s.flexCenter, n.navLinks)}>
							<NavItem
								tag='Battleground'
								action={'/battleground'}
								showTooltip={false}
							/>
							<NavItem
								tag='Armory'
								action={'/armory'}
								showTooltip={false}
							/>
							<NavItem
								tag='Training Room'
								action={'/training-room'}
								showTooltip={false}
							/>
							<NavItem
								tag='Marketplace'
								action={'/marketplace'}
								showTooltip={false}
							/>
							<NavItem
								tag='Inventory'
								action={'/inventory'}
								showTooltip={false}
							/>
						</ul>

						<PlayButton />
					</div>

					<button
						className={cf(s.flex, s.flexCenter, n.hamburgerWrapper)}
						onClick={() => setIsMenuOpen(true)}
						aria-label='Open menu'
					>
						<GiHamburgerMenu className={n.hamburger} />
					</button>
				</nav>
			</header>
			<MobileMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
			/>
		</>
	)
}
