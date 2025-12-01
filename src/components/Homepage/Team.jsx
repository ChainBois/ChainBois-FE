'use client'

import { cf } from '@/utils'
import t from './Team.module.css'
import s from '@/styles'
import Container from './Container'
import Link from 'next/link'
import Image from 'next/image'
import { FaXTwitter } from 'react-icons/fa6'
import { GoArrowRight } from 'react-icons/go'
import { MdClose } from 'react-icons/md'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

// Device capability detection hook
function useDeviceCapabilities() {
	const [capabilities, setCapabilities] = useState({
		hasHover: false,
		hasTouch: false,
		isTouchPrimary: false,
	})

	useEffect(() => {
		// Check for hover capability (mouse/trackpad)
		const hasHover = window.matchMedia('(hover: hover)').matches

		// Check for touch capability
		const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

		// Determine if touch is the primary input (mobile-first approach)
		const isTouchPrimary = hasTouch && !hasHover

		setCapabilities({
			hasHover,
			hasTouch,
			isTouchPrimary,
		})
	}, [])

	return capabilities
}

// Cycling highlight animation hook
function useCyclingHighlight(
	totalMembers,
	expandedMember,
	cycleInterval = 3000
) {
	const [highlightedMember, setHighlightedMember] = useState(1)
	const intervalRef = useRef(null)

	const startCycle = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current)

		intervalRef.current = setInterval(() => {
			setHighlightedMember((current) => {
				let next = current + 1

				// Skip expanded cards and wrap around
				while (next === expandedMember || next > totalMembers) {
					if (next > totalMembers) {
						next = 1
					} else {
						next += 1
					}

					// Prevent infinite loop
					if (next === current) break
				}

				return next
			})
		}, cycleInterval)
	}, [expandedMember, totalMembers, cycleInterval])

	useEffect(() => {
		startCycle()
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [startCycle])

	return highlightedMember
}

function Member({
	name,
	role,
	img,
	social,
	expanded,
	setExpanded,
	memberID,
	isHighlighted,
	deviceCapabilities,
}) {
	const { hasHover, isTouchPrimary } = deviceCapabilities

	// Expand handler - respects device capabilities
	const expand = useCallback(() => {
		if (expanded === memberID) return
		setExpanded(memberID)
	}, [expanded, memberID, setExpanded])

	const collapseTimer = useRef(null)

	// Collapse handler - returns to default (member 1)
	const collapse = useCallback(() => {
		if (collapseTimer.current) clearTimeout(collapseTimer.current)
		if (expanded === 1) return
		else collapseTimer.current = setTimeout(() => setExpanded(1), 1000)
		// setExpanded(1)
	}, [expanded, setExpanded])

	// Event handlers based on device capabilities
	const mouseHandlers =
		hasHover && !isTouchPrimary
			? {
					onMouseEnter: expand,
					onMouseLeave: collapse,
			  }
			: {}

	const isExpanded = useMemo(() => expanded === memberID, [expanded, memberID])

	useEffect(() => {
		return () => {
			if (collapseTimer.current) clearTimeout(collapseTimer.current)
			collapseTimer.current = null
		}
	}, [])

	return (
		<article
			className={cf(
				s.flex,
				s.flexStart,
				t.member,
				isExpanded ? t.expanded : '',
				isHighlighted && !isExpanded ? t.highlighted : ''
			)}
			{...mouseHandlers}
		>
			<div className={cf(s.wMax, s.flex, s.flexCenter, t.container)}>
				{/* Image container with semantic figure */}
				<figure className={cf(s.wMax, s.flex, s.flexCenter, t.imageContainer)}>
					{/* Portrait image - visible when collapsed */}
					<Image
						src={img}
						alt={`${name} portrait`}
						width={300}
						height={400}
						className={cf(t.img, t.portrait)}
					/>

					{/* Profile image - visible when expanded */}
					<Image
						src={img}
						alt={`${name} profile view`}
						width={400}
						height={300}
						className={cf(t.img, t.profile)}
					/>
				</figure>

				{/* Content overlay */}
				<div className={cf(s.wMax, s.flex, s.flexRight, t.content)}>
					{/* Member information header */}
					<header className={cf(t.info)}>
						<h3 className={cf(t.name)}>{name}</h3>
						<p className={cf(t.role)}>{role}</p>
					</header>

					{/* Navigation/controls container */}
					<nav className={cf(s.flex, s.flexCenter, s.p_relative, t.controls)}>
						{/* Social link - visible when expanded */}
						<Link
							href={social}
							target='_blank'
							rel='noopener noreferrer'
							className={cf(t.socialLink)}
							aria-label={`${name}'s Twitter profile`}
						>
							<FaXTwitter className={cf(t.socialIcon)} />
						</Link>

						{/* Button container for z-index layering */}
						<div className={cf(s.p_absolute, t.buttonContainer)}>
							{/* Expand button */}
							<button
								className={cf(s.flex, s.flexCenter, t.expandBtn)}
								onClick={expand}
								aria-label={`Expand ${name}'s profile`}
							>
								<GoArrowRight className={cf(t.expandIcon)} />
							</button>

							{/* Close button */}
							{/* <button
								className={cf(s.flex, s.flexCenter, t.closeBtn)}
								onClick={collapse}
								aria-label={`Close ${name}'s profile`}
							>
								<MdClose className={cf(t.closeIcon)} />
							</button> */}
						</div>
					</nav>
				</div>
			</div>
		</article>
	)
}

export default function Team() {
	const [expanded, setExpanded] = useState(1)
	const deviceCapabilities = useDeviceCapabilities()

	// Team members data
	const teamMembers = [
		{
			id: 1,
			name: 'John Doe',
			role: 'Co-Founder',
			img: '/img/JohnDoe.png',
		},
		{
			id: 2,
			name: 'Jane Smith',
			role: 'CEO',
			img: '/img/JaneSmith.png',
		},
		{
			id: 3,
			name: 'Mike Johnson',
			role: 'CTO',
			img: '/img/MikeJohnson.png',
		},
		{
			id: 4,
			name: 'Sarah Wilson',
			role: 'COO',
			img: '/img/JaneSmith.png',
		},
		{
			id: 5,
			name: 'David Brown',
			role: 'CFO',
			img: '/img/DavidBrown.png',
		},
		// {
		// 	id: 6,
		// 	name: 'Emily Davis',
		// 	role: 'CIO',
		// 	img: '/img/EmilyDavis.png',
		// },
	]

	const highlightedMember = useCyclingHighlight(teamMembers.length, expanded)

	return (
		<Container tag={'The Team'}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, t.members)}>
				{teamMembers.map((member) => (
					<Member
						key={member.id}
						name={member.name}
						role={member.role}
						img={member.img}
						social={'https://x.com/ea_aro1914'}
						expanded={expanded}
						setExpanded={setExpanded}
						memberID={member.id}
						isHighlighted={highlightedMember === member.id}
						deviceCapabilities={deviceCapabilities}
					/>
				))}
			</div>
		</Container>
	)
}
