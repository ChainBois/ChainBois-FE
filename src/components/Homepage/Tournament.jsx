'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './Homepage.module.css'
import t from './Tournament.module.css'
import Container from './Container'
import TournamentCard from '../TournamentCard';

export default function Tournament() {
	return <Container tag='Tournament'>
		<TournamentCard tournament={1} />
		<TournamentCard tournament={2} />
		<TournamentCard tournament={3} />
	</Container>
}
