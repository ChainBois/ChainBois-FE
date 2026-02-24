'use client'

import { useMain, useMediaQuery } from '@/hooks'
import p from './PaddedContainer.module.css'
import s from '@/styles'
import { cf } from '@/utils'
import { useMemo } from 'react'

export default function PaddedContainer({
	paddingValue = {
		max: '0 170px',
		tablet: '0 64px',
		mobile: '0 24px',
	},
	position = 'center',
	children,
}) {
	const { query } = useMain()

	const padding = useMemo(() => {
		if (query.isMobile) {
			return paddingValue.mobile
		} else if (query.isTablet) {
			return paddingValue.tablet
		} else {
			return paddingValue.max
		}
	}, [query, paddingValue])

	const positionClass = useMemo(() => {
		switch (position) {
			case 'left':
				return s.flexLeft
			case 'center':
				return s.flexCenter
			case 'right':
				return s.flexRight
			default:
				return s.flexCenter
		}
	}, [position])

	return (
		<div
			className={cf(s.wMax, s.flex, positionClass, p.paddedContainer)}
			style={{ padding: padding }}
		>
			{children}
		</div>
	)
}
