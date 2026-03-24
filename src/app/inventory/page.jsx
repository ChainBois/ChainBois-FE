'use client'

import { useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import BorderedButton from '@/components/BorderedButton'
import ConvertPointsPanel from '@/components/ConvertPointsPanel'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import InventoryCard from '@/components/InventoryCard'
import MaxWidth from '@/components/MaxWidth'
import NothingYet from '@/components/NothingYet'
import { PaginationLocal } from '@/components/Pagination'
import ScrollMenu from '@/components/ScrollMenu'
import {
	useArmoryTransactions,
	useAuth,
	useMain,
	useNotifications,
} from '@/hooks'
import s from '@/styles'
import { cf, getInventoryBalances } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'

const CATEGORY_LABELS = {
	assault: 'Assault Rifles',
	smg: 'SMGs',
	lmg: 'LMGs',
	shotgun: 'Shotguns',
	marksman: 'Marksman Rifles',
	handgun: 'Handguns',
	launcher: 'Launchers',
	melee: 'Melee',
}

const CATEGORY_ORDER = [
	'assault',
	'smg',
	'lmg',
	'shotgun',
	'marksman',
	'handgun',
	'launcher',
	'melee',
]

const normalizeCategory = (category) =>
	String(category ?? '')
		.trim()
		.toLowerCase()

export default function Page() {
	const activeAccount = useActiveAccount()
	const { user, verifyAssets } = useAuth()
	const { getUserInventoryData } = useMain()
	const { showLoading, hideLoading, showError, displayAlert } =
		useNotifications()
	const { convertPoints, isPending, refreshWalletSnapshot } =
		useArmoryTransactions()
	const weapons = useMemo(
		() => (Array.isArray(user?.weapons) ? user.weapons : []),
		[user?.weapons],
	)
	const inventoryBalances = getInventoryBalances(user)
	const pointsInfo = user?.pointsInfo ?? {}
	const [activeCategory, setActiveCategory] = useState(null)
	const [visibleWeapons, setVisibleWeapons] = useState([])

	useEffect(() => {
		if (!activeAccount?.address) return
		refreshWalletSnapshot({
			address: activeAccount.address,
			includeHistory: true,
		})
	}, [activeAccount?.address, refreshWalletSnapshot])

	const possessedCategories = useMemo(() => {
		const categories = new Set()
		for (const weapon of weapons) {
			const key = normalizeCategory(weapon?.category)
			if (key && CATEGORY_LABELS[key]) categories.add(key)
		}
		return CATEGORY_ORDER.filter((key) => categories.has(key))
	}, [weapons])

	const filteredWeapons = useMemo(() => {
		if (!activeCategory) return weapons
		return weapons.filter(
			(weapon) => normalizeCategory(weapon?.category) === activeCategory,
		)
	}, [activeCategory, weapons])

	const weaponCategoryOptions = useMemo(() => {
		const options = [
			{
				tag: 'All',
				action: () => setActiveCategory(null),
			},
		]

		for (const category of possessedCategories) {
			options.push({
				tag: CATEGORY_LABELS[category] ?? category,
				action: () => setActiveCategory(category),
			})
		}

		return options
	}, [possessedCategories])

	useEffect(() => {
		if (activeCategory && !possessedCategories.includes(activeCategory)) {
			setActiveCategory(null)
		}
	}, [activeCategory, possessedCategories])

	useEffect(() => {
		setVisibleWeapons(filteredWeapons.slice(0, 9))
	}, [filteredWeapons])

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={
					<>
						Welcome to the
						<br />
						Inventory
					</>
				}
				subText={
					<>
						Your complete collection of weapons,{' '}
						<br className={cf(h.xlHidden, h.lgHidden)} />
						armor, and rewards. <br className={cf(h.mdHidden, h.smHidden)} />
						Sell your weapons
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Refresh Assets'}
							action={async () => {
								showLoading?.({
									title: 'Refreshing Inventory',
									message: 'Syncing your wallet inventory and balances.',
								})

								const [inventoryRes] = await Promise.all([
									getUserInventoryData?.(),
									refreshWalletSnapshot({
										address: activeAccount?.address ?? user?.address,
										includeHistory: true,
									}),
								])
								hideLoading?.()

								if (!inventoryRes?.success) {
									showError?.({
										title: 'Inventory Refresh Failed',
										message:
											inventoryRes?.message ||
											inventoryRes?.error ||
											'Unable to refresh your inventory right now.',
									})
									return
								}

								if (user?.accessToken) {
									await verifyAssets({
										showLoading,
										hideLoading,
										showError,
										displayAlert,
									})
								}
							}}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Points'}
				cusClass={cf(p.container)}
			>
				<MaxWidth
					maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
				>
					<ConvertPointsPanel
						pointsBalance={inventoryBalances?.points}
						battleBalance={
							inventoryBalances?.battle ?? inventoryBalances?.battleRaw
						}
						ratePoints={1}
						rateBattle={pointsInfo?.conversionRate ?? 1}
						maxConvertible={pointsInfo?.maxConvertible}
						history={user?.pointsHistory}
						isConverting={isPending('points')}
						onConvert={({ points }) => convertPoints({ amount: points })}
					/>
				</MaxWidth>
			</Container>
			<Container
				tag={'Your Weapons'}
				cusClass={cf(p.container)}
			>
				{visibleWeapons?.length > 0 ? (
					<>
						<ScrollMenu options={weaponCategoryOptions} />
						<MaxWidth
							maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
						>
							<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
								<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
									{visibleWeapons.map((weapon, i) => (
										<InventoryCard
											key={`weapon-${weapon?.tokenId ?? i}`}
											pseudoIndex={i}
											weapon={weapon}
										/>
									))}
									<PaginationLocal
										array={visibleWeapons}
										refArray={filteredWeapons}
										step={9}
										setArray={setVisibleWeapons}
										full
									/>
								</div>
							</div>
						</MaxWidth>
					</>
				) : (
					<MaxWidth
						maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
					>
						<NothingYet
							message={
								activeAccount?.address
									? `You don't have any NFT yet`
									: 'Connect a wallet to view your inventory'
							}
							cta={
								<BorderedButton
									tag={'Purchase'}
									action={'/marketplace'}
									isLink
									borderButtonText={h.heroActionText}
								/>
							}
						/>
					</MaxWidth>
				)}
			</Container>
		</div>
	)
}
