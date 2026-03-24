'use client'

import { cf, getChainBoiImageCandidates, ipfsToGateway } from '@/utils'
import s from '@/styles'
import m from './MarketCard.module.css'
import Image from 'next/image'
import Market_1 from '@/assets/img/Market_1.png'
import Market_2 from '@/assets/img/Market_2.png'
import Market_3 from '@/assets/img/Market_3.png'
import BuyButton from '../BuyButton'
import { useEffect, useMemo, useState } from 'react'

const formatPrice = (value, currency = 'AVAX') => {
	const numericValue = Number(value)
	if (Number.isFinite(numericValue) && numericValue >= 0) {
		return `${numericValue.toLocaleString('en-US', {
			maximumFractionDigits: 4,
		})} ${currency}`
	}

	const fallbackValue = String(value ?? '').trim()
	return fallbackValue || 'Price TBA'
}

const formatBadge = (value) =>
	String(value ?? '')
		.trim()
		.split(/[_\s-]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

const buildDescription = (listing = {}) => {
	const traits = Array.isArray(listing?.traits) ? listing.traits : []
	const featuredTraits = traits
		.filter((trait) => {
			const traitType = String(trait?.trait_type ?? '').trim().toLowerCase()
			return !['level', 'rank', 'kills', 'score', 'games played'].includes(
				traitType,
			)
		})
		.slice(0, 2)
		.map((trait) => `${trait?.trait_type}: ${trait?.value}`)

	if (featuredTraits.length) return featuredTraits.join(' • ')

	return 'Fresh from the Primary Market and ready for your squad.'
}

/**
 * A card component to display ChainBoi listings in the marketplace.
 *
 * @param {number} pseudoIndex - a pseudo-index to determine the fallback image.
 * @param {object} listing - the ChainBoi listing object.
 * @param {string} actionLabel - the label for the buy button.
 * @param {boolean} disabled - whether the buy button should be disabled.
 * @param {boolean} isProcessing - whether the buy button is currently processing.
 * @param {function} onAction - the callback function when the buy button is clicked.
 */
export default function MarketCard({
	pseudoIndex = 0,
	listing = {},
	actionLabel = 'Buy ChainBoi',
	disabled = false,
	isProcessing = false,
	onAction = null,
}) {
	const fallbackImage = useMemo(() => {
		const index = (pseudoIndex + 1) % 3
		switch (index) {
			case 0:
				return Market_1
			case 1:
				return Market_2
			case 2:
			default:
				return Market_3
		}
	}, [pseudoIndex])

	const tokenId = useMemo(() => {
		const derivedTokenId = listing?.tokenId ?? listing?.nftTokenId
		const normalizedTokenId = Number(derivedTokenId)
		return Number.isInteger(normalizedTokenId) && normalizedTokenId >= 0
			? normalizedTokenId
			: null
	}, [listing?.nftTokenId, listing?.tokenId])

	const showcaseCandidates = useMemo(
		() => [
			...ipfsToGateway(listing?.imageUrl),
			...ipfsToGateway(listing?.imageUri),
			...(tokenId !== null ? getChainBoiImageCandidates(tokenId) : []),
		],
		[listing?.imageUri, listing?.imageUrl, tokenId],
	)
	const [imageIndex, setImageIndex] = useState(0)

	useEffect(() => {
		setImageIndex(0)
	}, [tokenId])

	const imageSrc = showcaseCandidates[imageIndex] ?? fallbackImage
	const title = tokenId !== null ? `ChainBoi #${tokenId}` : 'ChainBoi'
	const level = Number.isFinite(Number(listing?.level))
		? Number(listing.level)
		: 0
	const badgeLabel = formatBadge(listing?.rank || listing?.badge || 'Recruit')
	const description = buildDescription(listing)
	const priceLabel = useMemo(
		() => formatPrice(listing?.price, listing?.currency || 'AVAX'),
		[listing?.currency, listing?.price],
	)

	const handleImageError = () => {
		if (imageIndex < showcaseCandidates.length - 1) {
			setImageIndex((currentValue) => currentValue + 1)
		}
	}

	return (
		<section className={cf(s.flex, s.flexCenter, m.marketCard)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, m.cardWrapper)}>
				<figure className={cf(s.wMax, s.flex, s.flexCenter, m.showcase)}>
					{typeof imageSrc === 'string' ? (
						<Image
							src={imageSrc}
							alt={title}
							fill
							unoptimized
							className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, m.img)}
							onError={handleImageError}
						/>
					) : (
						<Image
							src={imageSrc}
							alt={title}
							fill
							className={cf(s.wMax, s.hMax, s.flex, s.flexCenter, m.img)}
						/>
					)}
				</figure>
				<div className={cf(s.wMax, s.flex, s.flexCenter, m.content)}>
					<header className={cf(s.wMax, s.flex, s.flexCenter, m.header)}>
						<div className={cf(s.wMax, s.flex, m.metaRow)}>
							<span className={cf(m.metaPill)}>Level {level}</span>
							<span className={cf(m.metaPill)}>{badgeLabel}</span>
						</div>
						<h3 className={cf(s.wMax, s.tLeft, m.title)}>{title}</h3>
						<p className={cf(s.wMax, s.tLeft, m.description)}>{description}</p>
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
						<p className={cf(s.dInlineBlock, s.tLeft, m.price)}>{priceLabel}</p>
						<BuyButton
							buyButton={m.buyButton}
							action={typeof onAction === 'function' ? onAction : undefined}
							tag={isProcessing ? 'Processing...' : actionLabel}
							disabled={disabled || isProcessing}
						/>
					</footer>
				</div>
			</div>
		</section>
	)
}
