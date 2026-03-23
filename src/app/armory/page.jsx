'use client'

import AR from '@/assets/img/AR.png'
import MKR from '@/assets/img/MKR.png'
import SMG from '@/assets/img/SMG.png'
import ArmoryCard from '@/components/ArmoryCard'
import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import LootBoxes from '@/components/LootBoxes'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import ScrollMenu from '@/components/ScrollMenu'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'
import { useNotifications } from '@/hooks'

const cards = [
	{
		id: 1,
		name: 'AR-47 “Tempest”',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 2,
		name: 'AR-47 “Tempest”',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 3,
		name: 'AR-47 “Tempest”',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 4,
		name: 'AR-47 “Tempest”',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 5,
		name: 'AR-47 “Tempest”',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 6,
		name: 'AR-47 “Tempest”',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 7,
		name: 'AR-47 “Tempest”',
		image: AR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 8,
		name: 'AR-47 “Tempest”',
		image: MKR,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
	{
		id: 9,
		name: 'AR-47 “Tempest”',
		image: SMG,
		description: 'Balanced rifle with storm-burst recoil pattern.',
		price: 699,
	},
]

export default function Page() {
	const { setCanCloseModal, setModal, setShowModal } = useNotifications()
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
				<ScrollMenu />
				<MaxWidth
					maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
				>
					<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
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
				</MaxWidth>
			</Container>
			<LootBoxes />
		</div>
	)
}
