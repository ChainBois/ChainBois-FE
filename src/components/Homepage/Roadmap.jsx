'use client'

import Container from './Container'
import s from '@/styles'
import r from './Roadmap.module.css'
import { cf } from '@/utils'

function RoadmapCard({ title, isRed = false }) {
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
						Launch
					</h4>
				</header>
				<p className={cf(r.text, isRed ? r.red : '')}>
					The point of using Lorem Ipsum is that it has a more-or-less normal
					distribution of letters, as opposed to using 'Content here, content
					here', making it look like readable English. Many desktop publishing
					packages and web page editors
				</p>
			</article>
		</div>
	)
}

export default function Roadmap() {
	return (
		<Container tag={'Project Roadmap'}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, r.roadmap)}>
				<RoadmapCard title={'Q1 2025'}/>
				<RoadmapCard title={'Q2 2025'}/>
				<RoadmapCard title={'Q3 2025'}/>
				<RoadmapCard title={'Q4 2005'} isRed />
			</div>
		</Container>
	)
}
