'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import { Hero } from '@/components/Homepage'
import h from '../../components/Homepage/Homepage.module.css'
import BorderedButton from '@/components/BorderedButton'
import Container from '@/components/Homepage/Container'
import ScrollMenu from '@/components/ScrollMenu'
import MarketCard from '@/components/MarketCard'
import SMG from '@/assets/img/SMG.png'
import AR from '@/assets/img/AR.png'
import MKR from '@/assets/img/MKR.png'
import { PaginationLocal } from '@/components/Pagination'
import LootBox from '@/components/LootBox'
import LootBoxes from '@/components/LootBoxes'
import MaxWidth from '@/components/MaxWidth'
import PaddedContainer from '@/components/PaddedContainer'

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function Page() {
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
						<br classNam={cf(h.xlHidden, h.lgHidden, h.mdHidden)} /> trade
						<br className={cf(h.xlHidden, h.lgHidden, h.smHidden)} /> with the community
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'View Inventory'}
							action={() => {}}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Primary Marketplace'}
				cusClass={cf(p.container)}
			>
				<MaxWidth
					maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
				>
					<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
							{cards.map((card, i) => (
								<MarketCard
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
			<Container
				tag={'Secondary Marketplace'}
				cusClass={cf(p.container)}
			>
				<MaxWidth
					maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
				>
					<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
							{cards.map((card, i) => (
								<MarketCard
									key={`secondary-card-${i}`}
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
