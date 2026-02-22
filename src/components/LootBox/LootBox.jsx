'use client'

import s from '@/styles'
import l from './LootBox.module.css'
import { cap, cf } from '@/utils'
import { useMemo } from 'react'
import PolyButton from '../PolyButton'
import Bronze from '@/assets/img/Bronze.png'
import Silver from '@/assets/img/Silver.png'
import Gold from '@/assets/img/Gold.png'
import Epic from '@/assets/img/Epic.png'
import BronzeMb from '@/assets/img/BronzeMb.png'
import SilverMb from '@/assets/img/SilverMb.png'
import GoldMb from '@/assets/img/GoldMb.png'
import EpicMb from '@/assets/img/EpicMb.png'
import { useMain } from '@/hooks'
import Image from 'next/image'

const descriptions = {
	bronze: 'Basic lootbox with common weapons.',
	silver: 'Improved lootbox with better rewards.',
	gold: 'Premium lootbox with rare weapons.',
	epic: 'Ultra-rare lootbox with epic & legendary weapons.',
}

const probabilities = {
	bronze: {
		common: 0.7,
		uncommon: 0.25,
		rare: 0.05,
		epic: 0,
		legendary: 0,
	},
	silver: {
		common: 0.4,
		uncommon: 0.5,
		rare: 0.1,
		epic: 0,
		legendary: 0,
	},
	gold: {
		common: 0,
		uncommon: 0,
		rare: 0.6,
		epic: 0.3,
		legendary: 0.1,
	},
	epic: {
		common: 0,
		uncommon: 0,
		rare: 0,
		epic: 0.8,
		legendary: 0.2,
	},
}

const Probabilities = ({ rarity = 'bronze' }) => {
	const prob = probabilities[rarity]
	const values = useMemo(() => {
		return Object.keys(prob)
			.filter((key) => Number(prob[key]))
			.map((key) => {
				return (
					<li
						key={key}
						className={cf(l.probability)}
					>
						<span className={cf(l.probabilityName)}>{cap(key)}:</span>{' '}
						<span className={cf(l.probabilityValue)}>
							{Math.round(prob[key] * 100)}%
						</span>
					</li>
				)
			})
	}, [])
	return <ul className={cf(l.probabilities)}>{values}</ul>
}

/**
 * A component that renders a Loot Box based on a given rarity.
 *
 * @param {('bronze'|'silver'|'gold'|'epic')} [rarity='bronze'] - The rarity of the Loot Box.
 *
 * @returns {JSX.Element} The Loot Box element.
 */
export default function LootBox({ rarity = 'bronze' }) {
	const { dimensions, query } = useMain()

	const rarityClass = useMemo(() => {
		switch (rarity) {
			case 'bronze':
				return l.bronze
			case 'silver':
				return l.silver
			case 'gold':
				return l.gold
			case 'epic':
				return l.epic
			default:
				return l.bronze
		}
	}, [rarity])

	const lootBox = useMemo(() => {
		switch (rarity) {
			case 'bronze':
				return query.isMobile ? BronzeMb : Bronze
			case 'silver':
				return query.isMobile ? SilverMb : Silver
			case 'gold':
				return query.isMobile ? GoldMb : Gold
			case 'epic':
				return query.isMobile ? EpicMb : Epic
			default:
				return query.isMobile ? BronzeMb : Bronze
		}
	}, [rarity, query.isMobile])

	const price = useMemo(() => {
		switch (rarity) {
			case 'bronze':
				return 100
			case 'silver':
				return 200
			case 'gold':
				return 300
			case 'epic':
				return 500
			default:
				return 100
		}
	}, [rarity])
	return (
		<article className={cf(s.flex, s.flexLeft, l.container, rarityClass)}>
			<div
				className={cf(
					s.wMax,
					s.hMax,
					s.p_absolute,
					s.flex,
					s.flexCenter,
					l.shadowWrapper,
				)}
			>
				<div
					className={cf(
						s.wMax,
						s.hMax,
						s.flex,
						s.flexRight,
						s.p_relative,
						l.shadowContainer,
					)}
				>
					<div className={cf(l.shadow, rarityClass)}></div>
					<div className={cf(l.shadow, l.shadowClone, rarityClass)}></div>
				</div>
			</div>
			<figure className={cf(s.wMax, s.flex, s.flexCenter, l.imageContainer)}>
				<Image
					src={lootBox}
					alt={`${cap(rarity)} Loot Box`}
					className={cf(l.lootBox)}
				/>
			</figure>
			<div className={cf(s.flex, s.flexStart, l.content)}>
				<header className={cf(s.wMax, s.flex, s.flexStart, l.header)}>
					<h3
						className={cf(
							s.wMax,
							s.tLeft,
							s.dInlineBlock,
							l.title,
							rarityClass,
						)}
					>
						{cap(rarity ?? 'bronze')}
					</h3>
					<p className={cf(s.wMax, s.tLeft, s.dInlineBlock, l.description)}>
						{descriptions[rarity] ?? descriptions.bronze}
					</p>
				</header>
				<footer className={cf(s.wMax, s.flex, s.flexStart, l.footer)}>
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexStart,
							l.purchaseContainer,
						)}
					>
						<span className={cf(s.tLeft, s.dInlineBlock, l.price)}>
							{price} $BATTLE
						</span>
						<PolyButton
							tag='Buy Now'
							side='right'
							polyButton={ l.polyButton }
							polyButtonContainer={l.polyButtonContainer}
							polyButtonContent={l.polyButtonContent}
							polyButtonText={l.polyButtonText}
						/>
						{/* TODO: Add action and isLink */}
					</div>
					<section
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexStart,
							l.probabilitiesContainer,
						)}
					>
						<h4 className={cf(s.tLeft, s.dInlineBlock, l.probabilitiesTitle)}>
							Probabilities:
						</h4>
						<Probabilities rarity={rarity} />
					</section>
				</footer>
			</div>
		</article>
	)
}
