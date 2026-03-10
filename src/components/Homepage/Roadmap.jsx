'use client'

import s from '@/styles';
import { cf } from '@/utils';
import Container from './Container';
import r from './Roadmap.module.css';

function RoadmapCard({ title, subtitle, text, isRed = false }) {
	return (
		<div className={cf(s.flex, s.flexCenter, r.parent)}>
			<article className={cf(s.flex, s.flexCenter, r.card, isRed ? r.red : '')}>
				<header
					className={cf(s.wMax, s.flex, s.flexStart, s.flex_dColumns, r.header)}
				>
					<h3
						className={cf(
							s.wMax,
							s.tLeft,
							s.dInlineBlock,
							r.title,
							isRed ? r.red : ''
						)}
					>
						{title}
					</h3>
					<h4 className={cf(s.wMax, s.tLeft, s.dInlineBlock, r.subtitle)}>
						{subtitle}
					</h4>
				</header>
				<p className={cf(r.text, isRed ? r.red : '')}>
					{text}
				</p>
			</article>
		</div>
	)
}

export default function Roadmap() {
	return (
		<Container tag={'Project Roadmap'}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, r.roadmap)}>
				<RoadmapCard
					title={'Phase 1'}
					subtitle={'Live'}
					text={
						'Wallet connect + login, profile sync, inventory and training room. Refresh assets on demand and set your ChainBoi avatar.'
					}
				/>
				<RoadmapCard
					title={'Phase 2'}
					subtitle={'Next'}
					text={
						'Battleground tournaments with real schedules, prizes, and entry. Replace placeholder tournaments with live data and matchmaking flows.'
					}
				/>
				<RoadmapCard
					title={'Phase 3'}
					subtitle={'Planned'}
					text={
						'Armory and Marketplace go live: weapon NFTs, listings, and ownership-driven UI. Post-purchase refresh and premium unlocks.'
					}
				/>
				<RoadmapCard
					title={'Phase 4–5'}
					subtitle={'Planned'}
					text={
						'Expanded leaderboards (period/rank) and the points economy: earn points from gameplay and convert to $BATTLE when Phase 5 lands.'
					}
					isRed
				/>
			</div>
		</Container>
	)
}
