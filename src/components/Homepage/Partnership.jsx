'use client'

import partnership from '@/assets/img/partners.png';
import s from '@/styles';
import { cf } from '@/utils';
import Image from 'next/image';
import p from './Homepage.module.css';

export default function Partnership() {
	return (
		<figure className={cf(s.wMax, s.flex, s.flexCenter, p.partnership)}>
			<Image src={partnership} className={cf(p.brands)}/>
		</figure>
	)
}
