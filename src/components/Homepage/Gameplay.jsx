'use client'

import GameplayBg from '@/assets/img/Gameplay.png'
import s from '@/styles'
import { cf } from '@/utils'
import Image from 'next/image'
import { useMemo } from 'react'
import { BsCaretRightFill } from 'react-icons/bs'
import BorderedButton from '../BorderedButton'
import g from './Gameplay.module.css'
import GameplayVideo from './GameplayVideo'
import { useMain } from '@/hooks'

function OddTile({ title, number, text }) {
	return (
		<article
			className={cf(s.flex, s.flexCenter, s.p_relative, g.oddTile, g.cutIn)}
		>
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
					g.tileContainer,
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
						g.tileHeader,
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
	const { platformSettings } = useMain()
	const trailer = useMemo(
		() => platformSettings?.trailer ?? null,
		[platformSettings],
	)
	const Trailer = useMemo(() => {
		return !!trailer ? (
			<GameplayVideo videoId={trailer} />
		) : (
			<Image
				src={GameplayBg}
				alt='Gameplay'
				className={cf(s.p_absolute, g.gameplayBg)}
			/>
		)
	}, [trailer])
	const tiles = useMemo(
		() => [
			{
				title: 'SIGN UP',
				number: '01',
				text: `Create your gamer account, connect your wallet, and lock in your profile. Once you're linked, you're ready to compete.`,
			},
			{
				title: 'Join Tournament',
				number: '02',
				text: `Enter the battleground, queue into tournaments, and climb the ranks. Your performance feeds the leaderboard.`,
			},
			{
				title: 'Earn Tokens',
				number: '03',
				text: `Score climbs over time. Points accumulate alongside gameplay and will power the economy as future phases roll out.`,
			},
			{
				title: 'Level Up',
				number: '04',
				text: `Level your ChainBoi, refresh your on-chain assets when needed, and set your active avatar for the dashboard.`,
			},
		],
		[],
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
				),
			),
		[tiles],
	)

	return (
		<section className={cf(s.wMax, s.flex, s.flexTop, g.section)}>
			<aside
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.p_relative,
					g.labelContainer,
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
				{Trailer}
				<div className={cf(g.gameplayButtonContainer)}>
					<BorderedButton
						tag={'Enter Battleground'}
						action={'/battleground'}
						isLink={true}
						icon={<BsCaretRightFill />}
						borderButtonContent={g.gameplayButtonContent}
						borderButtonText={g.gameplayButtonText}
						borderButtonIcon={g.gameplayButtonText}
					/>
				</div>
			</div>

			<div
				className={cf(
					s.wMax,
					s.flex,
					s.spaceXCenter,
					s.spaceYEnd,
					g.tilesWrapper,
				)}
			>
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flex_dColumn,
						s.spaceXEnd,
						s.spaceYCenter,
						g.tiles,
					)}
				>
					{Tiles}
				</div>
			</div>
		</section>
	)
}
