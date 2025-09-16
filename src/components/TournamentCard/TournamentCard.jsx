'use client'

import t from './TournamentCard.module.css'
import './TournamentCard.module.css'
import s from '@/styles'
import { cf } from '@/utils'
import { BsCaretRightFill } from 'react-icons/bs'
import { FaRegFlag } from 'react-icons/fa6'
import { HiOutlineTrophy } from 'react-icons/hi2'
import { useCallback, useRef, useState, useEffect } from 'react'
import BorderedButton from '../BorderedButton'

function TournamentStat({ tag, value, icon }) {
	return (
		<div
			className={cf(
				s.flex,
				s.spaceXStart,
				s.spaceYStart,
				s.flex_dColumn,
				t.card__stat
			)}
		>
			<span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__tag)}>
				{tag}
			</span>
			<div
				className={cf(
					s.flex,
					s.flexStart,
					s.dInlineBlock,
					t.card__stat__inner__wrapper
				)}
			>
				<span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__icon)}>
					{icon}
				</span>
				<span className={cf(s.tLeft, s.dInlineBlock, t.card__stat__value)}>
					{value}
				</span>
			</div>
		</div>
	)
}

export default function TournamentCard() {
	const circle = useRef(null)
	const [progress, setProgress] = useState(65)

	const circlePercent = useCallback(() => {
		if (!circle) return
		let change = 565.49 - (565.49 * progress) / 100
		circle.current.style.strokeDashoffset = change
	}, [progress])

	// const isNumeric = useCallback(
	// 	function (event) {
	// 		if (!/^\d$/.test(event.key)) {
	// 			return false
	// 		}
	// 		if (event.keyCode === 13) {
	// 			changePercent()
	// 		}
	// 	},
	// 	[]
	// )

	const changePercent = useCallback(
		function () {
			if (progress > 100) {
				setProgress(() => 0)
			} else {
				circlePercent()
				// setProgress(() => 0)
			}
		},
		[progress, circlePercent]
	)

	useEffect(() => {
		changePercent()
	}, [changePercent])

	return (
		<article
			className={cf(
				s.flex,
				s.spaceXEnd,
				s.spaceYStart,
				s.p_relative,
				t.tournamentCard
			)}
		>
			<div className={cf(t.card__percent)}>
				<svg className={cf(t.svg)}>
					<defs>
						<radialGradient
							id='gradient'
							cx='50%'
							cy='50%'
							r='60%'
							fx='50%'
							fy='50%'
						>
							<stop
								offset='30%'
								stopColor='var(--primary-dark)'
							/>
							<stop
								offset='100%'
								stopColor='var(--primary-light)'
							/>
						</radialGradient>
					</defs>
					<circle
						cx='90'
						cy='90'
						r='90'
						stroke='url(#gradient)'
						id='circle'
						ref={circle}
						className={cf(t.circle)}
					></circle>
				</svg>
				<div className={cf(t.circle)}></div>
				<div className={cf(t.card__number)}>
					<p>
						{progress}
						<span>Day{progress !== 1 ? 's' : ''}</span>
					</p>
				</div>
			</div>

			<div className={cf(s.flex, s.flexStart, s.p_relative, t.tournamentInfo)}>
				<h3 className={cf(t.tournamentTitle)}>Survival Battle</h3>
				<p className={cf(t.tournamentLore)}>
					The point of using Lorem Ipsum is that it has a more-or-less normal
					distribution of letters, as opposed to using.
				</p>
				<BorderedButton
					tag={'Join Tournament'}
					icon={<BsCaretRightFill className={cf(t.playIcon)} />}
					isLink={false}
					action={() => {}}
					borderButton={cf(t.borderButton)}
					borderButtonContent={cf(t.borderButtonContent)}
					borderButtonText={cf(t.borderButtonText)}
					borderButtonIcon={cf(t.borderButtonIcon)}
					type={'button'}
				/>
			</div>

			<footer className={cf(s.flex, s.flexStart, t.tournamentMeta)}>
				<TournamentStat
					tag={'Competition Status'}
					value={'Active'}
					icon={<div className={cf(t.statusIndicator)}></div>}
				/>
				<TournamentStat
					tag={'Prize Pool'}
					value={'203,020 Ꝑ'}
					icon={<HiOutlineTrophy className={cf(t.trophy)} />}
				/>
				<TournamentStat
					tag={'Submission Due  Date'}
					value={
						<time dateTime='2023-06-23T12:00:00'>23rd June, 12:00 CAT</time>
					}
					icon={<FaRegFlag className={cf(t.flag)} />}
				/>
			</footer>
		</article>
	)
}
