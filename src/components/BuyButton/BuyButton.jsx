'use client'

import { cf } from '@/utils'
import s from '@/styles'
import b from './BuyButton.module.css'

export default function BuyButton({ action = null, buyButton = '' }) {
	return (
		<button
			className={cf(s.flex, s.flexCenter, s.g10, b.buyButton, buyButton)}
			onClick={action?.()}
		>
			<span className={s.dInlineBlock}>Buy</span>
		</button>
	)
}
