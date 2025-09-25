'use client'

import { cf } from '@/utils'
import p from './Homepage.module.css'
import s from '@/styles'
import Image from 'next/image'
import partnership from '@/assets/img/partners.png'

export default function Partnership() {
	return (
		<figure className={cf(s.wMax, s.flex, s.flexCenter, p.partnership)}>
			<Image src={partnership} className={cf(p.brands)}/>
		</figure>
	)
}
