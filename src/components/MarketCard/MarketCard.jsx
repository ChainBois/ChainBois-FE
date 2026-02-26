'use client'

import { cf, formatAsCurrency } from '@/utils'
import s from '@/styles'
import m from './MarketCard.module.css'
import Image from 'next/image'
import Market_1 from '@/assets/img/Market_1.png'
import Market_2 from '@/assets/img/Market_2.png'
import Market_3 from '@/assets/img/Market_3.png'
import BuyButton from '../BuyButton'
import { useMemo } from 'react'

export default function MarketCard({ pseudoIndex }) {
	const currentStep = useMemo(() => {
		return Math.floor((pseudoIndex + 1) / 2)
	}, [pseudoIndex])

	const showcase = useMemo(() => {
		const index = (pseudoIndex + 1) % 3
		switch (index) {
			case 0:
				return Market_1
			case 1:
				return Market_2
			case 2:
				return Market_3
		}
	}, [pseudoIndex])

    const title = useMemo(() => {
        const index = (pseudoIndex + 1) % 3
		switch (index) {
			case 0:
				return 'Katana'
			case 1:
				return 'Assault Rifle'
			case 2:
				return 'Demo Kit'
		}
    }, [pseudoIndex])

	const price = useMemo(() => {
		const value = currentStep * 300 + 300
		return formatAsCurrency({
			value: value,
			depth: 1e6,
			dp: 2,
			trim: true,
		})
	}, [currentStep])

	return (
		<section className={cf(s.flex, s.flexCenter, m.marketCard)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, m.cardWrapper)}>
				<figure className={cf(s.wMax, s.flex, s.flexCenter, m.showcase)}>
					<Image
						src={showcase}
						alt={'Item showcase'}
						className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, m.img)}
					/>
				</figure>
				<div className={cf(s.wMax, s.flex, s.flexCenter, m.content)}>
					<header className={cf(s.wMax, s.flex, s.flexCenter, m.header)}>
						<h3 className={cf(s.wMax, s.tLeft, m.title)}>{title}</h3>
						<p className={cf(s.wMax, s.tLeft, m.description)}>
							Swift melee weapon with deadly precision and quick strikes.
						</p>
					</header>
					<footer
						className={cf(
							s.wMax,
							s.flex,
							s.spaceXBetween,
							s.spaceYCenter,
							m.footer,
						)}
					>
						<p className={cf(s.dInlineBlock, s.tLeft, m.price)}>
							{price} $BATTLE
						</p>
						<BuyButton buyButton={m.buyButton} />
					</footer>
				</div>
			</div>
		</section>
	)
}
