'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import MarketCard from '@/components/MarketCard'
import SectionError from '@/components/SectionError'
import MaxWidth from '@/components/MaxWidth'
import NothingYet from '@/components/NothingYet'
import { PaginationLocal } from '@/components/Pagination'
import SectionLoading from '@/components/SectionLoading'
import { useArmoryTransactions, useMain } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'

export default function Page() {
	const activeAccount = useActiveAccount()
	const { marketplaceContent, loadPrimaryMarket } = useMain()
	const { isPending, purchaseChainBoi, refreshWalletSnapshot } =
		useArmoryTransactions()
	const [visibleListings, setVisibleListings] = useState([])
	const marketData = useMemo(
		() =>
			marketplaceContent?.marketData ?? {
				nfts: [],
				price: null,
				currency: 'AVAX',
				available: 0,
				paymentAddress: '',
			},
		[marketplaceContent?.marketData],
	)
	const isLoadingListings = marketplaceContent?.isLoading ?? true
	const loadError = marketplaceContent?.error ?? ''

	useEffect(() => {
		void loadPrimaryMarket()
	}, [loadPrimaryMarket])

	useEffect(() => {
		if (!activeAccount?.address) return
		refreshWalletSnapshot({ address: activeAccount.address })
	}, [activeAccount?.address, refreshWalletSnapshot])

	const primaryListings = useMemo(
		() => (Array.isArray(marketData?.nfts) ? marketData.nfts : []),
		[marketData?.nfts],
	)

	useEffect(() => {
		setVisibleListings(primaryListings.slice(0, 9))
	}, [primaryListings])

	const handlePurchase = useCallback(
		async (listing) => {
			const res = await purchaseChainBoi({ listing })

			if (res?.success) {
				await loadPrimaryMarket({ force: true })
			}
		},
		[loadPrimaryMarket, purchaseChainBoi],
	)

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={
					<>
						Welcome to the
						<br />
						Marketplace
					</>
				}
				subText={
					<>
						Own powerful ChainBois assets &
						<br className={cf(h.xlHidden, h.lgHidden, h.mdHidden)} /> trade
						<br className={cf(h.xlHidden, h.lgHidden, h.smHidden)} /> with the
						community
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'View Inventory'}
							isLink
							action={'/inventory'}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Primary Marketplace'}
				cusClass={cf(p.container)}
			>
				{isLoadingListings ? (
					<MaxWidth
						maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
					>
						<SectionLoading
							message='Loading ChainBoi listings from the Primary Market...'
							subMessage='Checking available drops, pricing, and wallet-ready inventory.'
							label='Primary Market Feed Active'
							minHeight='360px'
						/>
					</MaxWidth>
				) : primaryListings.length > 0 ? (
					<>
						<MaxWidth
							maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
						>
							<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
								<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
									{visibleListings.map((listing, i) => {
										const tokenId = Number(
											listing?.tokenId ?? listing?.nftTokenId,
										)
										const purchaseKey = Number.isInteger(tokenId)
											? `nft-${tokenId}`
											: 'nft'

										return (
											<MarketCard
												key={`primary-listing-${tokenId ?? i}`}
												pseudoIndex={i}
												listing={listing}
												actionLabel='Purchase'
												isProcessing={isPending('nft', purchaseKey)}
												disabled={isPending('nft')}
												onAction={() => handlePurchase(listing)}
											/>
										)
									})}
									<PaginationLocal
										array={visibleListings}
										refArray={primaryListings}
										step={9}
										setArray={setVisibleListings}
										full
									/>
								</div>
							</div>
							</MaxWidth>
							<MaxWidth
							maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
						>
							<div className={cf(p.marketSummary)}>
								<span>
									{marketData?.available || primaryListings.length} ChainBoi
									{(marketData?.available || primaryListings.length) === 1
										? ''
										: 's'}{' '}
									available
								</span>
								<span>
									Fixed price: {marketData?.price ?? 'TBA'}{' '}
									{marketData?.currency || 'AVAX'}
								</span>
								<span>One click to pay, confirm, and receive your ChainBoi.</span>
							</div>
						</MaxWidth>
					</>
				) : (
					<MaxWidth
						maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
					>
						<SectionError
							title='Primary Market Offline'
							message={loadError}
							status='Marketplace Error'
							graphicText='MKT'
							actionLabel='Retry Market Feed'
							onAction={() => loadPrimaryMarket({ force: true })}
							minHeight='320px'
						/>
					</MaxWidth>
				)}
			</Container>
			<Container
				tag={'Secondary Marketplace'}
				cusClass={cf(p.container)}
			>
				<MaxWidth
					maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
				>
					<NothingYet
						message='Community listings are not live yet. Purchasable ChainBois are shown only in the Primary Market section.'
					/>
				</MaxWidth>
			</Container>
		</div>
	)
}
