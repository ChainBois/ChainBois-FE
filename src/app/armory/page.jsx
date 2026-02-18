'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import { Hero } from '@/components/Homepage'
import h from '../../components/Homepage/Homepage.module.css'
import BorderedButton from '@/components/BorderedButton'
import Container from '@/components/Homepage/Container'
import ScrollMenu from '@/components/ScrollMenu'
import ArmoryCard from '@/components/ArmoryCard'
import SMG from '@/assets/img/SMG.png'
import AR from '@/assets/img/AR.png'
import MKR from '@/assets/img/MKR.png'
import { PaginationLocal } from '@/components/Pagination'
import LootBox from '@/components/LootBox'
import LootBoxes from '@/components/LootBoxes';

const cards = [
	{
		id: 1,
		name: 'SMG',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 2,
		name: 'AR',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 3,
		name: 'MKR',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 4,
		name: 'AR',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 5,
		name: 'SMG',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 6,
		name: 'MKR',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 7,
		name: 'AR',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 8,
		name: 'MKR',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 9,
		name: 'SMG',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
]

export default function Page() {
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
						Purchase weapons, armor, loot boxes,{' '}
						<br className={cf(h.lgHidden)} />
						and convert points.
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Convert'}
							action={() => {}}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Weapons'}
				cusClass={cf(p.container)}
			>
				<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
					<ScrollMenu />
					<div className={cf(s.wMax, s.flex, s.spaceXBetween, p.cards)}>
						{cards.map((card) => (
							<ArmoryCard
								key={card.id}
								image={card.image}
								name={card.name}
								description={card.description}
								price={card.price}
							/>
						))}
						<PaginationLocal
							array={[]}
							refArray={cards}
							step={9}
							setArray={() => {}}
							full
						/>
					</div>
				</div>
			</Container>
			<LootBoxes />
		</div>
	)
}
