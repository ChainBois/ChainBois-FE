'use client'

import { cf, getWeaponImageCandidates } from '@/utils'
import s from '@/styles'
import i from './InventoryCard.module.css'
import Image from 'next/image'
import Inventory_1 from '@/assets/img/Inventory_1.png'
import Inventory_2 from '@/assets/img/Inventory_2.png'
import Inventory_3 from '@/assets/img/Inventory_3.png'
import Inventory_4 from '@/assets/img/Inventory_4.png'
import BuyButton from '../BuyButton'
import { useEffect, useMemo, useState } from 'react'

	export default function InventoryCard({ pseudoIndex = 0, weapon = {} }) {
		const weaponName = weapon?.weaponName ?? weapon?.name ?? ''

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

		const imageCandidates = useMemo(
			() =>
				getWeaponImageCandidates({
					tokenId: weapon?.tokenId,
					name: weaponName,
				}),
			[weaponName, weapon?.tokenId],
		)

	const [imageIndex, setImageIndex] = useState(0)

		useEffect(() => {
			setImageIndex(0)
		}, [weaponName, weapon?.tokenId])

	const imageSrc = imageCandidates[imageIndex] ?? showcase

		const title = useMemo(() => {
			return weaponName || 'Weapon NFT'
		}, [weaponName])

	const description = useMemo(() => {
		if (Number.isInteger(weapon?.tokenId)) {
			return `Weapon token #${weapon.tokenId}`
		}
		return 'Weapon NFT linked to your wallet.'
	}, [weapon?.tokenId])

	const handleImageError = () => {
		if (imageIndex < imageCandidates.length - 1) {
			setImageIndex((current) => current + 1)
		}
	}

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
						onError={handleImageError}
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
