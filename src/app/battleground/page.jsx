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
import { ActiveTournament } from '@/components/BattlegroundCards'
import { useState } from 'react'
import { useMain } from '@/hooks'
import { useMemo } from 'react'

const activeTourneys = [1, 2, 3]

export default function Page() {
	const { query: { isMobile = false } = {} } = useMain()
	const [displayTourneys, setDisplayTourneys] = useState([])
	const ActiveTourneys = useMemo(() => {
		return (
			<>
				{!isMobile ? (
					<MaxWidth
						maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
					>
						<div className={cf(s.wMax, s.flex, s.flexTop, p.activeCards)}>
							{activeTourneys.map((tourney, index) => (
								<ActiveTournament
									pseudoIndex={index}
									key={`active-tourney-${index}`}
								/>
							))}
						</div>
					</MaxWidth>
				) : (
					<MaxWidth
						maxWidth={{ max: '1260px', tablet: '710px', mobile: '330px' }}
					>
						<div className={cf(s.wMax, s.flex, s.flexTop, p.activeCards)}>
							{displayTourneys.map((tourney) => (
								<ActiveTournament
									pseudoIndex={tourney}
									key={`display-tourney-${tourney}`}
								/>
							))}
						</div>
						<PaginationLocal
							array={displayTourneys}
							refArray={activeTourneys}
							step={1}
							setArray={setDisplayTourneys}
							full
						/>
					</MaxWidth>
				)}
			</>
		)
	}, [isMobile, displayTourneys])
	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={
					<>
						Welcome to the <br />
						Battleground
					</>
				}
				subText={
					<>
						Compete in live tournaments and climb the
						<br className={cf(h.xlHidden, h.lgHidden)} /> leaderboard.{' '}
						<br className={cf(h.mdHidden, h.smHidden)} />
						Earn $BATTLE, climb the{' '}
						<br className={cf(h.xlHidden, h.lgHidden, h.smHidden)} />
						ranks.
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
				tag={'Active Tournaments'}
				cusClass={cf(p.container)}
			>
				{ActiveTourneys}
			</Container>
		</div>
	)
}
