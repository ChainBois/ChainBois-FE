'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import { Hero } from '@/components/Homepage'
import h from '../../components/Homepage/Homepage.module.css'
import BorderedButton from '@/components/BorderedButton'
import Container from '@/components/Homepage/Container'
import ScrollMenu from '@/components/ScrollMenu'
import InventoryCard from '@/components/InventoryCard'
import SMG from '@/assets/img/SMG.png'
import AR from '@/assets/img/AR.png'
import MKR from '@/assets/img/MKR.png'
import { PaginationLocal } from '@/components/Pagination'
import LootBox from '@/components/LootBox'
import LootBoxes from '@/components/LootBoxes'
import MaxWidth from '@/components/MaxWidth'
import PaddedContainer from '@/components/PaddedContainer'

const cards = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]

export default function Page() {
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
							tag={'Convert'}
							action={() => {}}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Your Weapons'}
				cusClass={cf(p.container)}
			>
				<ScrollMenu />
				<MaxWidth
					maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
				>
					<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
							{cards.map((card, i) => (
								<InventoryCard
									key={`card-${i}`}
									pseudoIndex={i}
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
		</div>
	)
}
