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
	if (Number.isInteger(directTokenId) && directTokenId >= 0) return directTokenId

	const metricsTokenId = Number(user?.metrics?.avatar)
	if (Number.isInteger(metricsTokenId) && metricsTokenId >= 0) return metricsTokenId

	// Phase 1 API shape only exposes a single owned ChainBoi token ID (`nftTokenId`),
	// so we treat it as the effective avatar when no explicit avatar field exists.
	const ownedTokenId = Number(user?.assets?.nftTokenId ?? user?.nftTokenId)
	if (Number.isInteger(ownedTokenId) && ownedTokenId >= 0) return ownedTokenId

	return null
}

export default function TrainingAssetDetails() {
	const { user, setAvatar } = useAuth()
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

	useEffect(() => {
		setImageIndex(0)
	}, [tokenId])

	const handleImageError = () => {
		if (imageIndex < imageCandidates.length - 1) {
			setImageIndex((current) => current + 1)
		}
	}

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, d.popup)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.flex_dColumn, p.content, d.content)}>
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
						<h3 className={cf(p.popupTitle, d.popupTitle)}>
							ChainBoi Details
						</h3>
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

				<div className={cf(s.wMax, s.flex, s.flexCenter, d.assetBody)}>
					<div className={cf(s.flex, s.flexCenter, d.assetImageFrame)}>
						<div className={cf(s.wMax, s.hMax, d.assetImageInner)}>
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
						<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
							<span className={cf(d.metaLabel)}>Level</span>
							<span className={cf(d.metaValue)}>Level {level}</span>
						</div>
						<div className={cf(s.flex, s.flex_dColumn, d.metaBlock)}>
							<span className={cf(d.metaLabel)}>Ownership</span>
							<span className={cf(d.metaValue)}>Verified from your connected wallet</span>
						</div>
					</div>
				</div>

				<nav className={cf(s.wMax, s.flex, s.flexEnd, p.popupActionButtonBox, d.popupActionButtonBox)}>
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
