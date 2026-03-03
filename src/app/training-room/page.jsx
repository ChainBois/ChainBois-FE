'use client'

import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import TrainingCard from '@/components/TrainingCard'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'

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
							tag={'Convert'}
							action={() => {}}
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
					<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
							{cards.map((card, i) => (
								<TrainingCard
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
