'use client'

import s from '@/styles'
import { cf } from '@/utils'
import c from './Common.module.css'
import { useMemo } from 'react'

export function TitleSection({ tag, title, infoText, position }) {
	const positionClass = useMemo(() => {
		switch (position) {
			case 'center':
				return s.flexCenter
			case 'left':
				return s.flexTop
			case 'right':
				return s.flexBottom
			default:
				return s.flexCenter
		}
	}, [position])
	return (
		<div
			className={cf(
				s.wMax,
				s.flex,
				s.flex_dColumn,
				positionClass,
				c.titleSection,
			)}
		>
			<p className={cf(c.titleTag)}>{tag}</p>
			<h3 className={cf(c.title)}>{title}</h3>
			<p className={cf(c.infoText)}>{infoText}</p>
		</div>
	)
}

export function Unit({ tag, value }) {
	return (
		<div className={cf(s.flex, s.flexCenter, s.flex_dColumn, c.unit)}>
			<p className={cf(s.wMax, s.flex, s.flexCenter, c.value)}>{value}</p>
			<p className={cf(s.wMax, s.flex, s.flexCenter, c.tag)}>{tag}</p>
		</div>
	)
}

export function CountdownSection({ days, hours, minutes, seconds }) {
	return (
		<section className={cf(s.wMax, s.flex, s.flexCenter, c.countdownSection)}>
			<Unit
				tag={`Day${days !== 1 ? 's' : ''}`}
				value={days}
			/>
			<Unit
				tag={`Hour${hours !== 1 ? 's' : ''}`}
				value={hours}
			/>
			<Unit
				tag={`Min${minutes !== 1 ? 's' : ''}`}
				value={minutes}
			/>
			<Unit
				tag={`Sec${seconds !== 1 ? 's' : ''}`}
				value={seconds}
			/>
		</section>
	)
}

export function Description({ text }) {
	return <p className={cf(c.description)}>{text}</p>
}
