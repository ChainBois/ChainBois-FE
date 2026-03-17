'use client'

import { useEffect, useMemo, useState } from 'react'
import s from '@/styles'
import { cf, getChainBoiImageCandidates } from '@/utils'
import t from './TrainingCard.module.css'
import ChainSwords from '@/assets/svg/ChainSwords.svg'
import Image from 'next/image'
import ChainBoi_1 from '@/assets/img/ChainBoi_1.png'
import ChainBoi_2 from '@/assets/img/ChainBoi_2.png'
import ChainBoi_3 from '@/assets/img/ChainBoi_3.png'
import ChainBoi_4 from '@/assets/img/ChainBoi_4.png'
import PolyButton from '../PolyButton'
import { useAuth } from '@/hooks'

export default function TrainingCard({
	pseudoIndex = 0,
	asset = {},
	onDetails = () => {},
	onLevelUp = () => {},
}) {
	const { makeRequest } = useAuth()
	const fallbackImage = useMemo(() => {
		const index = (pseudoIndex + 1) % 4
		switch (index) {
			case 0:
				return ChainBoi_1
			case 1:
				return ChainBoi_2
			case 2:
				return ChainBoi_3
			case 3:
				return ChainBoi_4
		}
	}, [pseudoIndex])

	const chainBoiImageCandidates = useMemo(
		() => getChainBoiImageCandidates(asset?.nftTokenId),
		[asset?.nftTokenId],
	)

	const [imageIndex, setImageIndex] = useState(0)
	const [assetDetails, setAssetDetails] = useState(null)
	const [assetDetailsIsLoading, setAssetDetailsIsLoading] = useState(false)
	const [assetEligibility, setAssetEligibility] = useState(null)

	useEffect(() => {
		setImageIndex(0)
	}, [asset?.nftTokenId])

	useEffect(() => {
		let isActive = true

		const tokenId = asset?.nftTokenId
		if (!Number.isInteger(tokenId)) {
			setAssetDetails(null)
			setAssetDetailsIsLoading(false)
			return
		}

		setAssetDetailsIsLoading(true)

		const loadAssetDetails = async () => {
			const res = await makeRequest({
				path: `training/nft/${tokenId}`,
				method: 'get',
			})

			// if (!isActive) return

			if (res?.success) {
				setAssetDetails(res?.data?.data ?? null)
			} else {
				setAssetDetails(null)
			}

			setAssetDetailsIsLoading(false)
		}

		loadAssetDetails()

		return () => {
			isActive = false
		}
	}, [asset?.nftTokenId, makeRequest])

	useEffect(() => {
		let isActive = true

		const tokenId = asset?.nftTokenId
		if (!Number.isInteger(tokenId)) {
			setAssetEligibility(null)
			return
		}

		const loadAssetEligibility = async () => {
			const res = await makeRequest({
				path: `training/eligibility/${tokenId}`,
				method: 'get',
			})

			// if (!isActive) return

			if (res?.success) {
				const resData = res?.data?.data
				const isEligible = !!resData?.level && !!resData?.eligibleLevels?.length
				setAssetEligibility(isEligible ?? null)
			} else {
				setAssetEligibility(null)
			}
		}

		loadAssetEligibility()

		return () => {
			isActive = false
		}
	}, [asset?.nftTokenId, makeRequest])

	const isEligibleClass = useMemo(() => {
		return assetEligibility ? t.active : ''
	}, [assetEligibility])

	const currentLevel = useMemo(() => {
		return Number.isFinite(assetDetails?.level)
			? assetDetails.level
			: Number.isFinite(asset?.level)
				? asset.level
				: 1
	}, [asset?.level, assetDetails?.level])

	const progress = useMemo(() => {
		const maxLevel = 7
		return Math.max(1, Math.min((currentLevel / maxLevel) * 100, 100))
	}, [currentLevel])

	const currentRank = assetDetails?.rank ?? asset?.rank ?? null
	const isMaxLevel = assetDetails?.isMaxLevel ?? false
	const nextLevelCost = assetDetails?.nextLevelCost ?? null

	const rankLabel = useMemo(() => {
		if (currentRank) return currentRank
		return assetDetailsIsLoading ? 'Loading…' : 'N/A'
	}, [assetDetailsIsLoading, currentRank])

	const upgradeCostLabel = useMemo(() => {
		if (isMaxLevel) return 'Max level'
		if (
			nextLevelCost !== null &&
			nextLevelCost !== undefined &&
			nextLevelCost !== ''
		) {
			return `${nextLevelCost} AVAX`
		}
		return assetDetailsIsLoading ? 'Loading…' : 'N/A'
	}, [assetDetailsIsLoading, isMaxLevel, nextLevelCost])

	const chainBoiImage = chainBoiImageCandidates[imageIndex] ?? null
	const imageSrc = chainBoiImage ?? fallbackImage

	const handleImageError = () => {
		if (imageIndex < chainBoiImageCandidates.length - 1) {
			setImageIndex((current) => current + 1)
		}
	}

	return (
		<section className={cf(s.flex, s.flexTop, t.trainingCard)}>
			<header
				className={cf(
					s.wMax,
					s.flex,
					s.flexEnd,
					s.p_relative,
					t.trainingCardHeader,
				)}
			>
				<div
					className={cf(
						s.flex,
						s.flexCenter,
						s.p_absolute,
						isEligibleClass,
						t.battleIndicator,
					)}
				>
					<Image
						src={ChainSwords}
						alt='Battle Indicator'
						className={cf(t.chainSwords)}
					/>
				</div>
				<figure
					className={cf(
						s.wMax,
						s.hMax,
						s.flex,
						s.flexCenter,
						s.p_absolute,
						t.trainingCardImageContainer,
					)}
				>
					{typeof imageSrc === 'string' ? (
						<Image
							src={imageSrc}
							alt={`ChainBoi #${asset?.nftTokenId ?? pseudoIndex + 1}`}
							fill
							unoptimized
							className={cf(s.wMax, s.hMax, t.trainingCardImage)}
							onError={handleImageError}
						/>
					) : (
						<Image
							src={imageSrc}
							alt={`ChainBoi #${asset?.nftTokenId ?? pseudoIndex + 1}`}
							fill
							className={cf(s.wMax, s.hMax, t.trainingCardImage)}
						/>
					)}
				</figure>
				<h3 className={cf(s.flex, s.flexCenter, s.p_absolute, t.trainingLevel)}>
					<span className={cf(s.dInlineBlock)}>Level {currentLevel}</span>
				</h3>
			</header>
			<footer className={cf(s.wMax, s.flex, s.flexEnd, t.trainingCardFooter)}>
				<div className={cf(s.wMax, s.flex, s.flexCenter, t.progressContainer)}>
					<p className={cf(s.wMax, s.flex, s.spaceXBetween, t.progressDetails)}>
						<span className={cf(s.flex, s.flexLeft, t.progressValue)}>
							Rank: {rankLabel}
						</span>
						<span className={cf(s.flex, s.flexRight, t.upgradeCost)}>
							Upgrade Cost: {upgradeCostLabel}
						</span>
					</p>
					<div className={cf(s.wMax, s.flex, s.flexLeft, t.progressBar)}>
						<div
							className={cf(s.hMax, s.flex, s.flexCenter, t.progress)}
							style={{ width: `${progress}%`, transition: 'width 1s ease 5s' }}
						></div>
					</div>
				</div>
				<nav
					className={cf(s.wMax, s.flex, s.spaceXBetween, t.trainingCardActions)}
				>
					<PolyButton
						tag='Level Up'
						side='right'
						polyButton={t.polyButton}
						polyButtonText={t.polyButtonText}
						action={() => onLevelUp({ ...asset, assetDetails })}
					/>
					<PolyButton
						tag='Details'
						side='left'
						polyButton={t.polyButton}
						polyButtonText={t.polyButtonText}
						action={() => onDetails({ ...asset, assetDetails })}
					/>
				</nav>
			</footer>
		</section>
	)
}
