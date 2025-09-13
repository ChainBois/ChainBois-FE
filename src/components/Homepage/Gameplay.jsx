'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './Homepage.module.css'
import g from './Gameplay.module.css'
import Container from './Container'
import GameplayBg from '@/assets/img/Gameplay.png'
import Image from 'next/image'
import { BsCaretRightFill } from 'react-icons/bs'
import { useMemo } from 'react'
import BorderedButton from '../BorderedButton'

function OddTile({ title, number, text }) {
	return (
		<article className={cf(s.flex, s.flexCenter, s.p_relative, g.oddTile, g.cutIn)}>
			<header className={cf(s.wMax, s.flex, s.flexLeft, g.oddTileHeader)}>
				<p className={cf(s.wMax, s.tLeft, g.oddTileTitleNumber)}>{number}</p>
				<h3 className={cf(s.wMax, s.tLeft, g.oddTileTitle)}>{title}</h3>
			</header>

			<p className={cf(s.wMax, g.oddTileText)}>{text}</p>
		</article>
	)
}

function Tile({ title, number, text }) {
	return (
		<article className={cf(s.flex, s.flexCenter, g.tile)}>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.flex_dColumn,
					s.g10,
					g.tileContainer
				)}
			>
				<header
					className={cf(
						s.wMax,
						s.flex,
						s.flex_dColumn,
						s.spaceXBetween,
						s.spaceYStart,
						s.flexOne,
						g.tileHeader
					)}
				>
					<p className={cf(s.wMax, s.tLeft, g.tileTitleNumber)}>{number}</p>
					<h3 className={cf(s.wMax, s.tLeft, g.tileTitle)}>{title}</h3>
				</header>
				<p className={cf(s.wMax, s.tLeft, g.tileText)}>{text}</p>
			</div>
		</article>
	)
}

export default function Gameplay() {
	const tiles = useMemo(
		() => [
			{
				title: 'SIGN UP',
				number: '01',
				text: `Create an account and we'll give you a free access. Join and let's $Battle`,
			},
			{
				title: 'Join Tournament',
				number: '02',
				text: `Once you've joined, follow the prompts to select your character and equip them with some badass weapons.`,
			},
			{
				title: 'Earn Tokens',
				number: '03',
				text: `When you finish the game, you are rewarded with $Battle tokens that can be used in the marketplace.`,
			},
			{
				title: 'Level Up',
				number: '04',
				text: `Earn enough XP to level up and unlock new adventures. You can always pick up where you left off. `,
			},
		],
		[]
	)

	const Tiles = useMemo(
		() =>
			tiles.map((tile, index) =>
				index === 0 ? (
					<OddTile
						key={index}
						title={tile.title}
						number={tile.number}
						text={tile.text}
					/>
				) : (
					<Tile
						key={index}
						title={tile.title}
						number={tile.number}
						text={tile.text}
					/>
				)
			),
		[tiles]
	)

	return (
		<section className={cf(s.wMax, s.flex, s.flexTop, g.section)}>
			<aside
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.p_relative,
					g.labelContainer
				)}
			>
				<h2 className={cf(s.p_absolute, g.title)}>
					<span className={cf(g.white)}>READY</span> CONNECT{' '}
					<span className={cf(g.white)}>PLAY</span> CONNECT
				</h2>
			</aside>
			<div
				className={cf(s.wMax, s.flex, s.flexCenter, s.p_relative, g.gameplay)}
			>
				<Image
					src={GameplayBg}
					alt='Gameplay'
					className={cf(s.p_absolute, g.gameplayBg)}
				/>
				<div className={cf(g.gameplayButtonContainer)}>
					<BorderedButton
						tag={'Watch Gameplay'}
						action={() => {}}
						icon={<BsCaretRightFill className={cf(s.dInlineBlock)} />}
						borderButtonContent={g.gameplayButtonContent}
						borderButtonText={g.gameplayButtonText}
					/>
				</div>
			</div>

			<div
				className={cf(
					s.wMax,
					s.flex,
					s.spaceXCenter,
					s.spaceYEnd,
					g.tilesWrapper
				)}
			>
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flex_dColumn,
						s.spaceXEnd,
						s.spaceYCenter,
						g.tiles
					)}
				>
					{Tiles}
				</div>
			</div>
		</section>
	)
}
