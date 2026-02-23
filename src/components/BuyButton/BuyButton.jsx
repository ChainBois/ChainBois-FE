'use client'

import { cf } from '@/utils'
import s from '@/styles'
import b from './BuyButton.module.css'

export default function BuyButton({}) {
	return (
		<button className={cf(s.flex, s.flexCenter, s.g10, b.buyButton)}>
			<span className={s.dInlineBlock}>Buy</span>
		</button>
	)
}
