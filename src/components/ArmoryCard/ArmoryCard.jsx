'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import DefaultArmoryImage from '@/assets/img/AR.png'
import s from '@/styles'
import { cf } from '@/utils'
import FloatingStars from '../FloatingStars'
import BuyButton from '../BuyButton'
import a from './ArmoryCard.module.css'

const formatPriceLabel = (price) => {
	const numericValue = Number(price)
	if (Number.isFinite(numericValue) && numericValue >= 0) {
		return `${numericValue.toLocaleString('en-US', {
			maximumFractionDigits: 2,
		})} $BATTLE`
	}

	const fallbackLabel = String(price ?? '').trim()
	return fallbackLabel || 'Price TBA'
}

export default function ArmoryCard({
	image,
	fallbackImage = DefaultArmoryImage,
	name,
	description,
	price,
}) {
	const [showFallbackImage, setShowFallbackImage] = useState(false)

	useEffect(() => {
		setShowFallbackImage(false)
	}, [image])

	const imageSrc =
		!showFallbackImage && image ? image : fallbackImage || DefaultArmoryImage
	const priceLabel = useMemo(() => formatPriceLabel(price), [price])

	return (
		<article className={cf(s.flex, s.flexCenter, a.card)}>
			<div
				className={cf(
					s.wMax,
					s.hMax,
					s.flex,
					s.flexTop,
					s.p_relative,
					a.content,
				)}
			>
				<div
					className={cf(s.wMax, s.flex, s.flexCenter, s.p_relative, a.showcase)}
				>
					<FloatingStars
						count={12}
						static={true}
						duration={1500}
						colorScheme='red'
						containerStyle={{
							position: 'absolute',
							inset: 0,
							pointerEvents: 'none',
							zIndex: 0,
						}}
						starBaseStyle={{ opacity: 0.2 }}
					/>
					<figure
						className={cf(
							s.wMax,
							s.hMax,
							s.flex,
							s.m0,
							s.flexCenter,
							a.imageContainer,
						)}
					>
						<Image
							src={imageSrc}
							alt={name || 'Armory piece'}
							fill
							sizes='(max-width: 480px) 156px, (max-width: 834px) 310px, 400px'
							unoptimized={typeof imageSrc === 'string'}
							className={cf(s.wMax, s.hMax, a.image)}
							onError={() => setShowFallbackImage(true)}
						/>
					</figure>
					<FloatingStars
						count={6}
						static={true}
						duration={1500}
						colorScheme='red'
						containerStyle={{
							position: 'absolute',
							inset: 0,
							zIndex: 2,
							pointerEvents: 'none',
						}}
					/>
				</div>
				<header
					className={cf(s.wMax, s.flex, s.flexLeft, s.flex_dColumn, a.header)}
				>
					<h3 className={cf(s.wMax, s.tCenter, a.name)}>{name}</h3>
					<p className={cf(s.wMax, s.tCenter, a.description)}>{description}</p>
					<p className={cf(s.wMax, s.tCenter, a.price)}>{priceLabel}</p>
				</header>
				<footer className={cf(s.wMax, s.flex, s.flexCenter, a.footer)}>
					<BuyButton
						isLink
						action={`https://chainbois-testnet-faucet.vercel.app/`}
						target={'_blank'}
					/>
				</footer>
			</div>
		</article>
	)
}
