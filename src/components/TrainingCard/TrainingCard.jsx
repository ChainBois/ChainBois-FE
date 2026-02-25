'use client'

import { useState, useEffect, useMemo } from 'react'
import s from '@/styles'
import { cf } from '@/utils'
import t from './TrainingCard.module.css'
import ChainSwords from '@/assets/svg/ChainSwords.svg'
import Image from 'next/image'
import ChainBoi_1 from '@/assets/img/ChainBoi_1.png'
import ChainBoi_2 from '@/assets/img/ChainBoi_2.png'
import ChainBoi_3 from '@/assets/img/ChainBoi_3.png'
import ChainBoi_4 from '@/assets/img/ChainBoi_4.png'
import PolyButton from '../PolyButton'

export default function TrainingCard({ pseudoIndex }) {
	const currentStep = useMemo(() => {
		return Math.floor((pseudoIndex + 1) / 4)
	}, [pseudoIndex])

	const chainBoi = useMemo(() => {
		const index = (pseudoIndex + 1) % 4
		switch (index) {
			case 0:
				return ChainBoi_1
			case 1:
				return ChainBoi_2
			case 2:
				return ChainBoi_3
			case 3:
				return ChainBoi_4
		}
	}, [pseudoIndex])

	const activeClass = useMemo(() => {
		const index = (pseudoIndex + 1) % 3
		return index === 0 ? t.active : ''
	}, [pseudoIndex])

	const progress = useMemo(() => {
		return Math.floor(Math.random() * 100 + 1)
	}, [])

	return (
		<section className={cf(s.flex, s.flexTop, t.trainingCard)}>
			<header
				className={cf(
					s.wMax,
					s.flex,
					s.flexEnd,
					s.p_relative,
					t.trainingCardHeader,
				)}
			>
				<div
					className={cf(
						s.flex,
						s.flexCenter,
						s.p_absolute,
						activeClass,
						t.battleIndicator,
					)}
				>
					<Image
						src={ChainSwords}
						alt='Battle Indicator'
						className={cf(t.chainSwords)}
					/>
				</div>
				<figure
					className={cf(
						s.wMax,
						s.hMax,
						s.flex,
						s.flexCenter,
						s.p_absolute,
						t.trainingCardImageContainer,
					)}
				>
					<Image
						src={chainBoi}
						alt='ChainBoi'
						className={cf(s.wMax, s.hMax, t.trainingCardImage)}
					/>
				</figure>
				<h3 className={cf(s.flex, s.flexCenter, s.p_absolute, t.trainingLevel)}>
					<span className={cf(s.dInlineBlock)}>Level {currentStep}</span>
				</h3>
			</header>
			<footer className={cf(s.wMax, s.flex, s.flexEnd, t.trainingCardFooter)}>
				<div className={cf(s.wMax, s.flex, s.flexCenter, t.progressContainer)}>
					<p className={cf(s.wMax, s.flex, s.spaceXBetween, t.progressDetails)}>
						<span className={cf(s.flex, s.flexLeft, t.progressValue)}>
							{progress}% to Level {currentStep + 1}
						</span>
						<span className={cf(s.flex, s.flexRight, t.upgradeCost)}>
							Upgrade Cost: {currentStep * 15 + 15} AVAX
						</span>
					</p>
					<div className={cf(s.wMax, s.flex, s.flexLeft, t.progressBar)}>
						<div
							className={cf(s.hMax, s.flex, s.flexCenter, t.progress)}
							style={{ width: `${progress}%`, transition: 'width 1s ease 5s' }}
						></div>
					</div>
				</div>
				<nav
					className={cf(s.wMax, s.flex, s.spaceXBetween, t.trainingCardActions)}
				>
					<PolyButton
						tag='Level Up'
						side='right'
						polyButton={t.polyButton}
						polyButtonText={t.polyButtonText}
					/>
					<PolyButton
						tag='Details'
						side='left'
						polyButton={t.polyButton}
						polyButtonText={t.polyButtonText}
					/>
				</nav>
			</footer>
		</section>
	)
}
