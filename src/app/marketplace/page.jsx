'use client'

import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import MarketCard from '@/components/MarketCard'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'

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
