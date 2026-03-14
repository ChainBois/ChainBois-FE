'use client'

import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import TrainingCard from '@/components/TrainingCard'
import { useAuth, useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'
import { useEffect, useMemo, useState } from 'react'
import NothingYet from '@/components/NothingYet'

export default function Page() {
	const { user, verifyAssets } = useAuth()
	const {
		showLoading,
		hideLoading,
		showError,
		displayAlert,
		setModal,
		setShowModal,
		setCanCloseModal,
		setTrainingAssetInfo,
	} = useNotifications()
	const assets = useMemo(() => {
		if (user?.assets?.length > 0) {
			return user.assets
		}
		if (user?.hasNft && Number.isInteger(user?.nftTokenId)) {
			return [
				{
					hasNft: user.hasNft,
					nftTokenId: user.nftTokenId,
					level: user.level,
				},
			]
		}
		return []
	}, [user?.assets, user?.hasNft, user?.level, user?.nftTokenId])
	const [visibleAssets, setVisibleAssets] = useState([])

	useEffect(() => {
		setVisibleAssets(assets.slice(0, 9))
	}, [assets])

	const openAssetDetails = (asset) => {
		setTrainingAssetInfo(asset)
		setCanCloseModal(true)
		setModal('trainingAssetDetails')
		setShowModal(true)
	}

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={
					<>
						Welcome to the
						<br />
						Training Room
					</>
				}
				subText={
					<>
						Upgrade your ChainBois. Boost your stats.
						<br className={cf(h.lgHidden)} /> Prepare for the next battle.
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Refresh Assets'}
							action={() =>
								verifyAssets({
									showLoading,
									hideLoading,
									showError,
									displayAlert,
								})
							}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Your ChainBois Collection'}
				cusClass={cf(p.container)}
			>
				<MaxWidth
					maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
				>
					{visibleAssets.length > 0 ? (
						<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
							<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
								{visibleAssets.map((asset, i) => (
									<TrainingCard
										key={`asset-${asset?.nftTokenId ?? i}`}
										pseudoIndex={i}
										asset={asset}
										onDetails={openAssetDetails}
									/>
								))}
								<PaginationLocal
									array={visibleAssets}
									refArray={assets}
									step={9}
									setArray={setVisibleAssets}
									full
								/>
							</div>
						</div>
					) : (
						<NothingYet
							message={`You don’t have any NFT yet`}
							cta={
								<BorderedButton
									tag={'Purchase'}
									action={() => {}}
									borderButtonText={h.heroActionText}
								/>
							}
						/>
					)}
				</MaxWidth>
			</Container>
		</div>
	)
}
