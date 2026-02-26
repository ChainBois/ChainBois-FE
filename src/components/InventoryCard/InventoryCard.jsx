'use client'

import { cf, formatAsCurrency } from '@/utils'
import s from '@/styles'
import i from './InventoryCard.module.css'
import Image from 'next/image'
import Inventory_1 from '@/assets/img/Inventory_1.png'
import Inventory_2 from '@/assets/img/Inventory_2.png'
import Inventory_3 from '@/assets/img/Inventory_3.png'
import Inventory_4 from '@/assets/img/Inventory_4.png'
import BuyButton from '../BuyButton'
import { useMemo } from 'react'

export default function InventoryCard({ pseudoIndex }) {
	const currentStep = useMemo(() => {
		return Math.floor((pseudoIndex + 1) / 2)
	}, [pseudoIndex])

	const showcase = useMemo(() => {
		const index = (pseudoIndex + 1) % 3
		switch (index) {
			case 0:
				return Inventory_1
			case 1:
				return Inventory_2
			case 2:
				return Inventory_3
			case 3:
				return Inventory_4
		}
	}, [pseudoIndex])

	const title = useMemo(() => {
		return 'AR-47 “Tempest”'
	}, [pseudoIndex])

	return (
		<section className={cf(s.flex, s.flexCenter, i.inventoryCard)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, i.cardWrapper)}>
				<figure className={cf(s.wMax, s.flex, s.flexCenter, i.showcase)}>
					<Image
						src={showcase}
						alt={'Item showcase'}
						className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, i.img)}
					/>
				</figure>
				<div className={cf(s.wMax, s.flex, s.flexCenter, i.content)}>
					<header className={cf(s.wMax, s.flex, s.flexCenter, i.header)}>
						<h3 className={cf(s.wMax, s.tLeft, i.title)}>{title}</h3>
						<p className={cf(s.wMax, s.tLeft, i.description)}>
							Balanced rifle with storm-burst recoil pattern.
						</p>
					</header>
					<footer className={cf(s.wMax, s.flex, s.flexCenter, i.footer)}>
						<BuyButton buyButton={i.buyButton} />
					</footer>
				</div>
			</div>
		</section>
	)
}
