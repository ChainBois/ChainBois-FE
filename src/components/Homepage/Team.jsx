'use client'

import s from '@/styles';
import { cf } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { GoArrowRight } from 'react-icons/go';
import Container from './Container';
import t from './Team.module.css';

// Team members data
const teamMembers = [
	{ id: 1, name: 'John Doe', role: 'Co-Founder', img: '/img/JohnDoe.png' },
	{ id: 2, name: 'Jane Smith', role: 'CEO', img: '/img/JaneSmith.png' },
	{ id: 3, name: 'Mike Johnson', role: 'CTO', img: '/img/MikeJohnson.png' },
	{ id: 4, name: 'Sarah Wilson', role: 'COO', img: '/img/JaneSmith.png' },
	{ id: 5, name: 'David Brown', role: 'CFO', img: '/img/DavidBrown.png' },
]

// device capability detection
function useDeviceCapabilities() {
	const [capabilities, set] = useState({
		hasHover: false,
		hasTouch: false,
		isTouchPrimary: false,
	})

	useEffect(() => {
		const hasHover = window.matchMedia('(hover: hover)').matches
		const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
		const isTouchPrimary = hasTouch && !hasHover
		set({ hasHover, hasTouch, isTouchPrimary })
	}, [])

	return capabilities
}

// cycling highlight logic
function useCyclingHighlight(total, expanded, interval = 3000) {
	const [highlight, set] = useState(1)
	const ref = useRef(null)

	useEffect(() => {
		if (ref.current) clearInterval(ref.current)

		ref.current = setInterval(() => {
			set((cur) => {
				let next = cur + 1
				if (next > total) next = 1
				if (next === expanded) next = next + 1 > total ? 1 : next + 1
				return next
			})
		}, interval)

		return () => clearInterval(ref.current)
	}, [total, expanded, interval])

	return highlight
}

function Member({
	name,
	role,
	img,
	social,
	expanded,
	memberID,
	isHighlighted,
	expand,
	mouseHandlers,
}) {
	const isExpanded = expanded === memberID

	return (
		<article
			className={cf(
				s.flex,
				s.flexStart,
				t.member,
				isExpanded ? t.expanded : '',
				isHighlighted && !isExpanded ? t.highlighted : ''
			)}
			data-memberid={memberID}
			{...mouseHandlers}
		>
			<div className={cf(s.wMax, s.flex, s.flexCenter, t.container)}>
				<figure className={cf(s.wMax, s.flex, s.flexCenter, t.imageContainer)}>
					<Image
						src={img}
						alt={`${name} portrait`}
						width={300}
						height={400}
						className={cf(t.img, t.portrait)}
					/>

					<Image
						src={img}
						alt={`${name} profile view`}
						width={400}
						height={300}
						className={cf(t.img, t.profile)}
					/>
				</figure>

				<div className={cf(s.wMax, s.flex, s.flexRight, t.content)}>
					<header className={cf(t.info)}>
						<h3 className={cf(t.name)}>{name}</h3>
						<p className={cf(t.role)}>{role}</p>
					</header>

					<nav className={cf(s.flex, s.flexCenter, s.p_relative, t.controls)}>
						<Link
							href={social}
							target='_blank'
							rel='noopener noreferrer'
							className={cf(t.socialLink)}
						>
							<FaXTwitter className={cf(t.socialIcon)} />
						</Link>

						<button
							className={cf(s.flex, s.flexCenter, t.expandBtn)}
							onClick={() => expand(memberID)}
						>
							<GoArrowRight className={cf(t.expandIcon)} />
						</button>
					</nav>
				</div>
			</div>
		</article>
	)
}

export default function Team() {
	// default expanded is ALWAYS member 1
	const [expanded, setExpanded] = useState(1)
	const device = useDeviceCapabilities()
	const { hasHover, isTouchPrimary } = device
	const highlighted = useCyclingHighlight(teamMembers.length, expanded)

	const expand = useCallback((id) => setExpanded(id), [])

	// collapse back to default when user leaves container
	const collapseToDefault = useCallback(() => setExpanded(1), [])

	const mouseHandlers =
		hasHover && !isTouchPrimary ? { onMouseLeave: collapseToDefault } : {}

	const memberMouseHandlers =
		hasHover && !isTouchPrimary
			? {
					onMouseEnter: (e) => {
						const id = Number(e.currentTarget.dataset.memberid)
						expand(id)
					},
			  }
			: {}

	return (
		<Container tag={'The Team'}>
			<div
				className={cf(s.wMax, s.flex, s.flexCenter, t.members)}
				{...mouseHandlers}
			>
				{teamMembers.map((m) => (
					<Member
						key={m.id}
						name={m.name}
						role={m.role}
						img={m.img}
						social={'https://x.com/ea_aro1914'}
						expanded={expanded}
						memberID={m.id}
						isHighlighted={highlighted === m.id}
						expand={expand}
						mouseHandlers={memberMouseHandlers}
					/>
				))}
			</div>
		</Container>
	)
}
