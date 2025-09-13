'use client'

import s from '@/styles'
import n from './Navbar.module.css'
import { cf } from '@/utils'
import CB from '@/assets/svg/CB.svg'
import CHAINBOIS from '@/assets/svg/CHAINBOIS.svg'
import CBBranding from '@/assets/svg/CBBranding.svg'
import Image from 'next/image'
import { memo, useMemo } from 'react'
import Link from 'next/link'
import { isEqual } from '@/hooks'
import { MdArrowOutward } from 'react-icons/md'

function NavItem({ tag = 'Home', action = '/', isLink = true }) {
	const Responder = memo(
		({ action, tag, style }) =>
			isLink ? (
				<Link
					href={action}
					className={style}
				>
					{tag}
				</Link>
			) : (
				<button
					onClick={action}
					className={style}
				>
					{tag}
				</button>
			),
		(prev, next) => isEqual(prev, next)
	)
	return (
		<li className={cf(s.flex, s.flexCenter, n.navItemWrapper)}>
			<Responder
				action={action}
				tag={tag}
				style={n.navItem}
			/>
		</li>
	)
}

function PlayButton() {
	return (
		<button
			className={cf(s.flex, s.flexCenter, s.g10, n.playButton)}
			onClick={() => {}}
		>
			<span className={s.dInlineBlock}>Play Now</span>
			<MdArrowOutward className={cf(s.dInlineBlock, n.playIcon)} />
		</button>
	)
}

export default function Navbar() {
	return (
		<header className={cf(s.wMax, s.flex, s.flexCenter, n.nav)}>
			<nav className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, n.navItems)}>
				<Link
					href={'/'}
					className={cf(s.flex, s.flexCenter, n.logoContainer)}
				>
					<Image
						src={CBBranding}
						alt='CBBranding Logo'
						width={240}
						height={32.8}
						className={n.logo}
					/>
				</Link>

				<div className={cf(s.flex, s.flexCenter, n.navLinksWrapper)}>
					<ul className={cf(s.flex, s.flexCenter, n.navLinks)}>
						<NavItem
							tag='About'
							action={'/#about'}
						/>
						<NavItem
							tag='Battleground'
							action={'/#battleground'}
						/>
						<NavItem
							tag='Marketplace'
							action={'/#martket'}
						/>
						<NavItem
							tag='Battle Token'
							action={'/#battle'}
						/>
						<NavItem
							tag='Merch'
							action={'/#merch'}
						/>
					</ul>

					<PlayButton />
				</div>
			</nav>
		</header>
	)
}
