'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AR from '@/assets/img/AR.png'
import MKR from '@/assets/img/MKR.png'
import SMG from '@/assets/img/SMG.png'
import ArmoryCard from '@/components/ArmoryCard'
import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import LootBoxes from '@/components/LootBoxes'
import MaxWidth from '@/components/MaxWidth'
import NothingYet from '@/components/NothingYet'
import { PaginationLocal } from '@/components/Pagination'
import ScrollMenu from '@/components/ScrollMenu'
import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf, fetchArmoryWeapons, normalizeWeaponAssets } from '@/utils'
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

const FALLBACK_ARMORY_IMAGES = [SMG, AR, MKR]

const normalizeCategory = (category) => String(category ?? '').trim().toLowerCase()

const formatDescriptor = (value) =>
	String(value ?? '')
		.trim()
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

const flattenArmoryWeapons = (payload = {}) => {
	if (Array.isArray(payload)) {
		return normalizeWeaponAssets(payload)
	}
	if (!payload || typeof payload !== 'object') return []

	const weapons = []

	for (const [category, items] of Object.entries(payload)) {
		if (!Array.isArray(items)) continue

		for (const weapon of items) {
			weapons.push({
				category: weapon?.category ?? category,
				...weapon,
			})
		}
	}

	return normalizeWeaponAssets(weapons)
}

const getWeaponDescription = (weapon = {}) => {
	const directDescription = String(weapon?.description ?? '').trim()
	if (directDescription) return directDescription

	const details = []
	const category = normalizeCategory(weapon?.category)
	const tier = String(weapon?.tier ?? '').trim()

	if (CATEGORY_LABELS[category]) {
		details.push(CATEGORY_LABELS[category])
	}
	if (tier) {
		details.push(`${formatDescriptor(tier)} tier`)
	}

	return details.join(' / ') || 'Weapon ready for battle.'
}

export default function Page() {
	const { setCanCloseModal, setModal, setShowModal } = useNotifications()
	const [weapons, setWeapons] = useState([])
	const [visibleWeapons, setVisibleWeapons] = useState([])
	const [activeCategory, setActiveCategory] = useState(null)
	const [isLoadingWeapons, setIsLoadingWeapons] = useState(true)
	const [loadError, setLoadError] = useState('')

	const loadArmoryWeapons = useCallback(async () => {
		setIsLoadingWeapons(true)
		setLoadError('')

		const res = await fetchArmoryWeapons()

		if (!res?.success) {
			setWeapons([])
			setLoadError(
				res?.message ||
					res?.error ||
					'We could not load the armory weapons right now.',
			)
			setIsLoadingWeapons(false)
			return res
		}

		const nextWeapons = flattenArmoryWeapons(res?.data?.data ?? {})
		setWeapons(nextWeapons)
		setLoadError(
			nextWeapons.length ? '' : 'No weapons are currently available in the armory.',
		)
		setIsLoadingWeapons(false)

		return res
	}, [])

	useEffect(() => {
		loadArmoryWeapons()
	}, [loadArmoryWeapons])

	const availableCategories = useMemo(() => {
		const categories = new Set()

		for (const weapon of weapons) {
			const category = normalizeCategory(weapon?.category)
			if (category && CATEGORY_LABELS[category]) {
				categories.add(category)
			}
		}

		return CATEGORY_ORDER.filter((category) => categories.has(category))
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

		for (const category of availableCategories) {
			options.push({
				tag: CATEGORY_LABELS[category] ?? category,
				action: () => setActiveCategory(category),
			})
		}

		return options
	}, [availableCategories])

	useEffect(() => {
		if (activeCategory && !availableCategories.includes(activeCategory)) {
			setActiveCategory(null)
		}
	}, [activeCategory, availableCategories])

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
						Armory
					</>
				}
				subText={
					<>
						Gear up. Upgrade. Dominate the battlefield.
						<br />
						Purchase weapons, armor, loot boxes, and{' '}
						<br className={cf(h.lgHidden)} />
						convert points.
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Convert'}
							action={() => {
								setCanCloseModal(true)
								setModal('convertPoints')
								setShowModal(true)
							}}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Weapons'}
				cusClass={cf(p.container)}
			>
				{isLoadingWeapons ? (
					<MaxWidth
						maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
					>
						<NothingYet message='Loading the weapons armory...' />
					</MaxWidth>
				) : weapons.length > 0 ? (
					<>
						<ScrollMenu options={weaponCategoryOptions} />
						<MaxWidth
							maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
						>
							<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
								<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
									{visibleWeapons.map((weapon, index) => (
										<ArmoryCard
											key={`armory-weapon-${weapon?.tokenId ?? weapon?.id ?? index}`}
											image={weapon?.imageUrl}
											fallbackImage={
												FALLBACK_ARMORY_IMAGES[
													index % FALLBACK_ARMORY_IMAGES.length
												]
											}
											name={weapon?.name || weapon?.weaponName || 'Weapon NFT'}
											description={getWeaponDescription(weapon)}
											price={weapon?.price}
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
						maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
					>
						<NothingYet
							message={loadError || 'No weapons are currently available.'}
							cta={
								<BorderedButton
									tag={'Reload'}
									action={loadArmoryWeapons}
									borderButtonText={h.heroActionText}
								/>
							}
						/>
					</MaxWidth>
				)}
			</Container>
			<LootBoxes />
		</div>
	)
}
