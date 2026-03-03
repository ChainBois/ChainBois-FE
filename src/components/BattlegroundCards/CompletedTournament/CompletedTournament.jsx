'use client'

import s from '@/styles'
import { cf } from '@/utils'
import a from './CompletedTournament.module.css'

export default function CompletedTournament({}) {
	return (
		<section
			className={cf(s.wMax, s.flex, s.spaceXCenter, a.tournamentCard)}
		></section>
	)
}
