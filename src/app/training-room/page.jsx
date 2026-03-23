'use client'

import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import TrainingCard from '@/components/TrainingCard'
import { useAuth, useNotifications } from '@/hooks'
import {
	ACTIVE_CHAIN,
	ACTIVE_CHAIN_NAME,
	PRIZE_POOL_ADDRESS,
	thirdwebClient,
} from '@/lib'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'
import { useEffect, useMemo, useState } from 'react'
import NothingYet from '@/components/NothingYet'
import { useActiveAccount } from 'thirdweb/react'
import { prepareTransaction, sendAndConfirmTransaction, toWei } from 'thirdweb'

export default function Page() {
	const {
		user,
		verifyAssets,
		syncTrainingNfts,
		fetchTrainingNftDetail,
		submitTrainingLevelUp,
	} = useAuth()
	const activeAccount = useActiveAccount()
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
		const ownedAssets = Array.isArray(user?.assets)
			? user.assets.filter(Boolean)
			: []
		if (ownedAssets.length > 0) {
			return ownedAssets.map((asset) => {
				const derivedTokenId = asset?.tokenId ?? asset?.nftTokenId
				const tokenIdNum =
					derivedTokenId === null ||
					derivedTokenId === undefined ||
					derivedTokenId === ''
						? NaN
						: Number(derivedTokenId)
				const normalizedTokenId =
					Number.isInteger(tokenIdNum) && tokenIdNum >= 0 ? tokenIdNum : null

				return {
					...asset,
					...(normalizedTokenId !== null
						? { tokenId: normalizedTokenId, nftTokenId: normalizedTokenId }
						: {}),
				}
			})
		}
		if (user?.hasNft && Number.isInteger(user?.nftTokenId)) {
			return [
				{
					hasNft: user.hasNft,
					tokenId: user.nftTokenId,
					nftTokenId: user.nftTokenId,
					level: user.level,
				},
			]
		}
		return []
	}, [user?.assets, user?.hasNft, user?.level, user?.nftTokenId])
	const [visibleAssets, setVisibleAssets] = useState([])

	useEffect(() => {
		if (!activeAccount?.address) return
		syncTrainingNfts({ address: activeAccount.address })
	}, [activeAccount?.address, syncTrainingNfts])

	useEffect(() => {
		setVisibleAssets(assets.slice(0, 9))
	}, [assets])

	const openAssetDetails = (asset) => {
		setTrainingAssetInfo({ ...(asset ?? {}) })
		setCanCloseModal(true)
		setModal('trainingAssetDetails')
		setShowModal(true)
	}

	const handleLevelUp = async (asset) => {
		const tokenId = asset?.nftTokenId
		if (!Number.isInteger(tokenId)) return

		if (!activeAccount) {
			showError?.({
				title: 'Wallet Required',
				message: 'Connect a wallet before leveling up a ChainBoi.',
			})
			return
		}

		const detailsFromCard = asset?.assetDetails ?? null
		let detail = detailsFromCard

		if (!detail) {
			showLoading?.({
				title: 'Preparing Level Up',
				message: 'Fetching the latest upgrade details.',
			})

			const detailRes = await fetchTrainingNftDetail({ tokenId })
			if (!detailRes?.success) {
				hideLoading?.()
				showError?.({
					title: 'Details Unavailable',
					message:
						detailRes?.message ||
						detailRes?.error ||
						'Unable to fetch the upgrade details.',
				})
				return
			}
			detail = detailRes?.data?.data ?? null
		}

		if (detail?.isMaxLevel) {
			hideLoading?.()
			displayAlert?.({
				title: 'Max Level',
				message: `ChainBoi #${tokenId} is already at maximum level.`,
			})
			return
		}

		const costValue = detail?.nextLevelCost
		const costString =
			costValue === null || costValue === undefined ? '' : String(costValue)
		if (!costString || costString === '0') {
			hideLoading?.()
			showError?.({
				title: 'Cost Unavailable',
				message: 'Unable to determine the next level cost. Please try again.',
			})
			return
		}

		if (!PRIZE_POOL_ADDRESS) {
			hideLoading?.()
			showError?.({
				title: 'Training Unavailable',
				message: `Training payments are not configured for ${ACTIVE_CHAIN_NAME} yet.`,
			})
			return
		}

		showLoading?.({
			title: 'Leveling Up',
			message: 'Confirm the AVAX payment in your wallet.',
		})

		let paymentTxHash = null
		try {
			const transaction = prepareTransaction({
				client: thirdwebClient,
				chain: ACTIVE_CHAIN,
				to: PRIZE_POOL_ADDRESS,
				value: toWei(costString),
			})
			const receipt = await sendAndConfirmTransaction({
				account: activeAccount,
				transaction,
			})
			paymentTxHash = receipt?.transactionHash ?? receipt?.hash ?? null
		} catch (error) {
			hideLoading?.()
			showError?.({
				title: 'Payment Failed',
				message:
					error?.message ||
					'Payment was not completed. Please try again and confirm the transaction in your wallet.',
			})
			return
		}

		if (!paymentTxHash) {
			hideLoading?.()
			showError?.({
				title: 'Payment Failed',
				message:
					'Unable to read the payment transaction hash. Please try again.',
			})
			return
		}

		showLoading?.({
			title: 'Finalizing Level Up',
			message: 'Verifying payment and updating your ChainBoi on-chain.',
		})

		const levelUpRes = await submitTrainingLevelUp({
			tokenId,
			txHash: paymentTxHash,
		})
		hideLoading?.()

		if (!levelUpRes?.success) {
			showError?.({
				title: 'Level Up Failed',
				message:
					levelUpRes?.message ||
					levelUpRes?.error ||
					'Unable to level up right now.',
			})
			return
		}

		displayAlert?.({
			title: 'Level Up Complete',
			message: `ChainBoi #${tokenId} leveled up successfully.`,
			type: 'success',
		})
		verifyAssets({
			showLoading: null,
			hideLoading: null,
			showError: null,
			displayAlert: null,
		})
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
										onLevelUp={handleLevelUp}
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
									action={'https://chainbois-testnet-faucet.vercel.app'}
									isLink
									target={'_blank'}
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
