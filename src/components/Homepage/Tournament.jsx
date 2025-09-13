'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './Homepage.module.css'
import t from './Tournament.module.css'
import Container from './Container'

function TournamentCard({ tournament: x }) {
	return (
		<section
			className={cf(
				s.wMax,
				s.flex,
				s.flexStart,
				s.p_relative,
				p.tournamentCard
			)}
		></section>
	)
}

export default function Tournament() {
	return <Container tag='Tournament'></Container>
}
