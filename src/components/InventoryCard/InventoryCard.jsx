'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import BuyButton from '../BuyButton'
import Inventory_1 from '@/assets/img/Inventory_1.png'
import Inventory_2 from '@/assets/img/Inventory_2.png'
import Inventory_3 from '@/assets/img/Inventory_3.png'
import Inventory_4 from '@/assets/img/Inventory_4.png'
import s from '@/styles'
import { cf } from '@/utils'
import i from './InventoryCard.module.css'

const SHOWCASE_IMAGES = [Inventory_1, Inventory_2, Inventory_3, Inventory_4]

export default function InventoryCard({ pseudoIndex = 0, weapon = {} }) {
	const [showFallbackImage, setShowFallbackImage] = useState(false)

	const showcase = useMemo(
		() => SHOWCASE_IMAGES[pseudoIndex % SHOWCASE_IMAGES.length] ?? Inventory_1,
		[pseudoIndex],
	)

	const title = useMemo(
		() => weapon?.name || weapon?.weaponName || 'Weapon NFT',
		[weapon?.name, weapon?.weaponName],
	)

	const description = useMemo(() => {
		if (Number.isInteger(weapon?.tokenId)) {
			return `Weapon token #${weapon.tokenId}`
		}
		return 'Weapon NFT linked to your wallet.'
	}, [weapon?.tokenId])

	useEffect(() => {
		setShowFallbackImage(false)
	}, [weapon?.imageUrl, weapon?.tokenId])

	const imageSrc =
		!showFallbackImage && weapon?.imageUrl ? weapon.imageUrl : showcase

	return (
		<section className={cf(s.flex, s.flexCenter, i.inventoryCard)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, i.cardWrapper)}>
				<figure className={cf(s.wMax, s.flex, s.flexCenter, i.showcase)}>
					<Image
						src={imageSrc}
						alt={title}
						fill
						unoptimized={typeof imageSrc === 'string'}
						className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, i.img)}
						onError={() => setShowFallbackImage(true)}
					/>
				</figure>
				<div className={cf(s.wMax, s.flex, s.flexCenter, i.content)}>
					<header className={cf(s.wMax, s.flex, s.flexCenter, i.header)}>
						<h3 className={cf(s.wMax, s.tLeft, i.title)}>{title}</h3>
						<p className={cf(s.wMax, s.tLeft, i.description)}>
							{description}
						</p>
					</header>
					<footer className={cf(s.wMax, s.flex, s.flexCenter, i.footer)}>
						<BuyButton buyButton={i.buyButton} sell />
					</footer>
				</div>
			</div>
		</section>
	)
}
