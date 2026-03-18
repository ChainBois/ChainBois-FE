'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth, useNotifications } from '@/hooks'
import s from '@/styles'
import { cf, getChainBoiImageCandidates } from '@/utils'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'
import PolyButton from '../PolyButton'
import p from './Popups.module.css'
import d from './TrainingAssetDetails.module.css'

const getAvatarTokenId = (user) => {
	const directTokenId = Number(user?.activeAvatarTokenId)
	if (Number.isInteger(directTokenId) && directTokenId >= 0)
		return directTokenId

	const metricsTokenId = Number(user?.metrics?.avatar)
	if (Number.isInteger(metricsTokenId) && metricsTokenId >= 0)
		return metricsTokenId

	// Phase 1 convenience fields expose a single owned ChainBoi token ID (`nftTokenId`),
	// but the current Phase 1 API also returns `assets[]` (multiple ChainBois).
	const ownedTokenIdSource =
		user?.nftTokenId ??
		(Array.isArray(user?.assets)
			? user.assets?.[0]?.tokenId
			: user?.assets?.nftTokenId)
	const ownedTokenId = Number(ownedTokenIdSource)
	if (Number.isInteger(ownedTokenId) && ownedTokenId >= 0) return ownedTokenId

	return null
}

export default function TrainingAssetDetails() {
	const {
		user,
		setAvatar,
		fetchTrainingNftDetail,
		fetchTrainingLevelUpCost,
		fetchTrainingEligibility,
	} = useAuth()
	const {
		trainingAssetInfo,
		setShowModal,
		showLoading,
		hideLoading,
		showError,
		displayAlert,
	} = useNotifications()

	const tokenId = trainingAssetInfo?.nftTokenId ?? null
	const level = trainingAssetInfo?.level ?? 1
	const imageCandidates = useMemo(
		() => getChainBoiImageCandidates(tokenId),
		[tokenId],
	)
	const [imageIndex, setImageIndex] = useState(0)
	const activeAvatarTokenId = getAvatarTokenId(user)
	const isActiveAvatar =
		Number.isInteger(activeAvatarTokenId) && activeAvatarTokenId === tokenId
	const imageSrc = imageCandidates[imageIndex] ?? null
	const [nftDetail, setNftDetail] = useState(null)
	const [costInfo, setCostInfo] = useState(null)
	const [eligibility, setEligibility] = useState(null)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		setImageIndex(0)
	}, [tokenId])

	useEffect(() => {
		let isActive = true
		setNftDetail(null)
		setCostInfo(null)
		setEligibility(null)

		const loadDetails = async () => {
			if (!Number.isInteger(tokenId)) return
			setIsFetching(true)

			const [detailRes, costRes, eligibilityRes] = await Promise.allSettled([
				fetchTrainingNftDetail({ tokenId }),
				fetchTrainingLevelUpCost({ tokenId }),
				fetchTrainingEligibility({ tokenId }),
			])

			if (!isActive) return

			if (detailRes.status === 'fulfilled' && detailRes.value?.success) {
				setNftDetail(detailRes.value?.data?.data ?? null)
			}

			if (costRes.status === 'fulfilled' && costRes.value?.success) {
				setCostInfo(costRes.value?.data?.data ?? null)
			}

			if (
				eligibilityRes.status === 'fulfilled' &&
				eligibilityRes.value?.success
			) {
				setEligibility(eligibilityRes.value?.data?.data ?? null)
			}

			setIsFetching(false)
		}

		loadDetails()

		return () => {
			isActive = false
		}
	}, [
		fetchTrainingEligibility,
		fetchTrainingLevelUpCost,
		fetchTrainingNftDetail,
		tokenId,
	])

	const handleImageError = () => {
		if (imageIndex < imageCandidates.length - 1) {
			setImageIndex((current) => current + 1)
		}
	}

	const nextLevelCost = costInfo?.cost ?? null
	const nextLevelCurrency = costInfo?.currency ?? 'AVAX'
	const nextRank = costInfo?.nextRank ?? null
	const rank = nftDetail?.rank ?? trainingAssetInfo?.rank ?? null

	const traits = Array.isArray(nftDetail?.traits) ? nftDetail.traits : []
	const inGameStats = nftDetail?.inGameStats ?? null
	const formatTraitValue = (value) => {
		if (value === null || value === undefined) return ''
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			return String(value)
		}
		try {
			return JSON.stringify(value)
		} catch {
			return String(value)
		}
	}

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, d.popup)}>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.flex_dColumn,
					p.content,
					d.content,
				)}
			>
				<header
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.spaceYCenter,
						p.popupTitleBox,
						d.popupTitleBox,
					)}
				>
					<div className={cf(s.flex, s.flex_dColumn, d.titleGroup)}>
						<h3 className={cf(p.popupTitle, d.popupTitle)}>ChainBoi Details</h3>
						<p className={cf(p.popupMessage, d.popupSubtitle)}>
							Token #{tokenId ?? 'N/A'}
						</p>
					</div>
					<button
						type='button'
						className={cf(s.flex, s.flexCenter, p.closeBtn)}
						onClick={() => setShowModal(false)}
					>
						<IoMdClose className={cf(s.flex, s.flexCenter, p.closeIcon)} />
					</button>
				</header>

				<div className={cf(s.wMax, s.flex, d.assetBody)}>
					<div className={cf(s.flex, s.flexCenter, d.assetImageFrame)}>
						<div className={cf(s.wMax, d.assetImageInner)}>
							{imageSrc ? (
								<Image
									src={imageSrc}
									alt={`ChainBoi #${tokenId ?? 'N/A'}`}
									fill
									unoptimized
									className={cf(d.assetImage)}
									onError={handleImageError}
								/>
							) : null}
						</div>
					</div>

					<div className={cf(s.flex, s.flex_dColumn, d.assetMeta)}>
						<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
							<span className={cf(d.metaLabel)}>Status</span>
							<span className={cf(d.metaValue)}>
								{isActiveAvatar ? 'Active Avatar' : 'Available for Avatar'}
							</span>
						</div>
						<div className={cf(d.metaGrid)}>
							<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
								<span className={cf(d.metaLabel)}>Rank</span>
								<span className={cf(d.metaValue)}>
									{rank ? rank : isFetching ? 'Loading…' : 'N/A'}
								</span>
							</div>
							<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
								<span className={cf(d.metaLabel)}>Level</span>
								<span className={cf(d.metaValue)}>Level {level}</span>
							</div>
							<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
								<span className={cf(d.metaLabel)}>Next Level Cost</span>
								<span className={cf(d.metaValue)}>
									{costInfo?.isMaxLevel
										? 'Max level reached'
										: nextLevelCost
											? `${nextLevelCost} ${nextLevelCurrency}`
											: isFetching
												? 'Loading…'
												: 'N/A'}
								</span>
							</div>
							{nextRank ? (
								<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
									<span className={cf(d.metaLabel)}>Next Rank</span>
									<span className={cf(d.metaValue)}>{nextRank}</span>
								</div>
							) : null}
							{eligibility?.activeTournaments?.length ? (
								<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
									<span className={cf(d.metaLabel)}>Active Tournaments</span>
									<span className={cf(d.metaValue)}>
										{eligibility.activeTournaments.length}
									</span>
								</div>
							) : null}
						</div>
					</div>
				</div>

				{inGameStats ? (
					<section
						className={cf(s.wMax, s.flex, s.flex_dColumn, d.statsSection)}
					>
						<header
							className={cf(s.wMax, s.flex, s.spaceXBetween, d.statsHeader)}
						>
							<span className={cf(d.statsTitle)}>In-Game Stats</span>
						</header>
						<div className={cf(s.wMax, s.flex, d.statsRow)}>
							<article className={cf(s.flex, s.flex_dColumn, d.statTile)}>
								<span className={cf(d.statType)}>Kills</span>
								<span className={cf(d.statValue)}>
									{Number(inGameStats?.kills ?? 0)}
								</span>
							</article>
							<article className={cf(s.flex, s.flex_dColumn, d.statTile)}>
								<span className={cf(d.statType)}>Score</span>
								<span className={cf(d.statValue)}>
									{Number(inGameStats?.score ?? 0)}
								</span>
							</article>
							<article className={cf(s.flex, s.flex_dColumn, d.statTile)}>
								<span className={cf(d.statType)}>Games Played</span>
								<span className={cf(d.statValue)}>
									{Number(inGameStats?.gamesPlayed ?? 0)}
								</span>
							</article>
						</div>
					</section>
				) : null}

				{traits.length ? (
					<section
						className={cf(s.wMax, s.flex, s.flex_dColumn, d.traitsSection)}
					>
						<header
							className={cf(s.wMax, s.flex, s.spaceXBetween, d.traitsHeader)}
						>
							<span className={cf(d.traitsTitle)}>Traits</span>
							<span className={cf(d.traitsCount)}>{traits.length}</span>
						</header>
						<div className={cf(s.wMax, s.flex, d.traitsRow)}>
							{traits.map((trait, index) => (
								<article
									key={
										trait?._id ??
										`${trait?.trait_type}-${String(trait?.value)}-${index}`
									}
									className={cf(s.flex, s.flex_dColumn, d.traitTile)}
								>
									<span className={cf(d.traitType)}>
										{trait?.trait_type ?? 'Trait'}
									</span>
									<span className={cf(d.traitValue)}>
										{formatTraitValue(trait?.value) || '—'}
									</span>
								</article>
							))}
						</div>
					</section>
				) : null}

				<nav
					className={cf(
						s.wMax,
						s.flex,
						s.flexEnd,
						p.popupActionButtonBox,
						d.popupActionButtonBox,
					)}
				>
					<PolyButton
						tag={isActiveAvatar ? 'Active Avatar' : 'Set As Avatar'}
						side='right'
						polyButton={cf(p.polyButton, d.primaryButton)}
						action={() =>
							setAvatar({
								tokenId,
								showLoading,
								hideLoading,
								showError,
								displayAlert,
								onSuccess: () => setShowModal(false),
							})
						}
						disabled={isActiveAvatar || !Number.isInteger(tokenId)}
					/>
					<PolyButton
						tag='Close'
						side='left'
						polyButton={cf(p.polyButton)}
						action={() => setShowModal(false)}
					/>
				</nav>
			</div>
		</section>
	)
}
