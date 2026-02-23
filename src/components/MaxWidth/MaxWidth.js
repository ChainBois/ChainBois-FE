'use client'

import { useMain } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import { useMemo } from 'react'

export default function MaxWidth({
	maxWidth = { max: '100%', tablet: '100%', mobile: '100%' },
	position = 'center',
	children,
}) {
	const { query } = useMain()

	const maxWidthValue = useMemo(() => {
		if (query.isDesktop) {
			return maxWidth.max
		} else if (query.isTablet) {
			return maxWidth.tablet
		} else {
			return maxWidth.mobile
		}
	}, [query, maxWidth])

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

	const paddingValue = useMemo(() => {
		switch (position) {
			case 'left':
				return '0 10px 0 0'
			case 'center':
				return '0 10px'
			case 'right':
				return '0 0 0 10px'
			default:
				return '0 10px'
		}
	}, [position])

	return (
		<div
			className={cf(s.wMax, s.flex, positionClass)}
			style={{ padding: paddingValue }}
		>
			<div
				className={cf(s.wMax, s.flex, s.flexCenter)}
				style={{ width: `min(100%, ${maxWidthValue})` }}
			>
				{children}
			</div>
		</div>
	)
}
