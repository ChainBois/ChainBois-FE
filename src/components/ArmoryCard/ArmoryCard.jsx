'use client'

import s from '@/styles'
import a from './ArmoryCard.module.css'
import { cf } from '@/utils'
import FloatingStars from '../FloatingStars'
import BuyButton from '../BuyButton'
import Image from 'next/image'

export default function ArmoryCard({ image, name, description, price }) {
	return (
		<article className={cf(s.flex, s.flexCenter, a.card)}>
			<div
				className={cf(
					s.wMax,
					s.hMax,
					s.flex,
					s.flexTop,
					s.p_relative,
					a.content,
				)}
			>
				<div
					className={cf(s.wMax, s.flex, s.flexCenter, s.p_relative, a.showcase)}
				>
					<FloatingStars
						count={12}
						static={true}
						colorScheme='red'
						containerStyle={{
							position: 'absolute',
							inset: 0,
							pointerEvents: 'none',
							zIndex: 0,
						}}
						starBaseStyle={{ opacity: 0.2 }}
					/>
					<figure
						className={cf(
							s.wMax,
							s.hMax,
							s.flex,
							s.m0,
							s.flexCenter,
							a.imageContainer,
						)}
						style={{ position: 'relative', zIndex: 1 }}
					>
						<Image
							src={image}
							alt={'armory piece'}
							className={cf(s.wMax, s.hMax, a.image)}
						/>
					</figure>
					<FloatingStars
						count={6}
						static={true}
						colorScheme='red'
						containerStyle={{
							position: 'absolute',
							inset: 0,
							zIndex: 2,
							pointerEvents: 'none',
						}}
					/>
				</div>
				<header
					className={cf(s.wMax, s.flex, s.flexLeft, s.flex_dColumn, a.header)}
				>
					<h3 className={cf(s.wMax, s.tCenter, a.name)}>{name}</h3>
					<p className={cf(s.wMax, s.tCenter, a.description)}>{description}</p>
					<p className={cf(s.wMax, s.tCenter, a.price)}>{price} $BATTLE</p>
				</header>
				<footer
					className={cf(s.wMax, s.flex, s.flexCenter, a.footer)}
				>
					<BuyButton />
				</footer>
			</div>
		</article>
	)
}
