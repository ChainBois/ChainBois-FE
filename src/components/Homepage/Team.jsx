'use client'

import s from '@/styles'
import { cf } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { GoArrowRight } from 'react-icons/go'
import Container from './Container'
import t from './Team.module.css'

// Team members data
const teamMembers = [
	{
		id: 1,
		name: 'Mark Barber',
		role: 'Founder',
		img: '/img/PFP_Mark_Slim.png',
		imgExpanded: '/img/PFP_Mark_Mid.png',
		social: 'https://x.com/ea_aro1914',
	},
	{
		id: 2,
		name: `Declan O'Callahan`,
		role: 'Co-Founder and Artist',
		img: '/img/PFP_Dec_Slim.png',
		imgExpanded: '/img/PFP_Dec_Mid.png',
		social: 'https://x.com/Ghettopigeons',
	},
	{
		id: 3,
		name: 'Goonerlabs',
		role: 'Backend Developer',
		img: '/img/PFP_Goon_Slim.png',
		imgExpanded: '/img/PFP_Goon_Mid.png',
		social: 'https://x.com/hanswolfhart',
	},
	{
		id: 4,
		name: 'Emmanuel Agbavwe',
		role: 'Frontend Developer',
		img: '/img/PFP_Aro_Slim.png',
		imgExpanded: '/img/PFP_Aro_Mid.png',
		social: 'https://x.com/ea_aro1914',
	},
	{
		id: 5,
		name: 'Francis O. Samuel',
		role: 'Marketing Lead',
		img: '/img/PFP_Preach_Slim.png',
		imgExpanded: '/img/PFP_Preach_Mid.png',
		social: 'https://x.com/bullpreacher',
	},
	{
		id: 6,
		name: 'Oceanic',
		role: 'Quality Assurance Lead',
		img: '/img/PFP_Oceanic_Slim.png',
		imgExpanded: '/img/PFP_Oceanic_Mid.png',
		social: 'https://x.com/Oceanic_9000',
	},
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
	imgExpanded,
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
				isHighlighted && !isExpanded ? t.highlighted : '',
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
						src={imgExpanded}
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
						imgExpanded={m.imgExpanded}
						social={m.social}
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
