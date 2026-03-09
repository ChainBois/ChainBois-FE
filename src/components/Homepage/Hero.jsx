'use client'

import s from '@/styles'
import { cf } from '@/utils'
import { DESKTOP_BUILD_URL, MOBILE_BUILD_URL } from '@/constants'
import { MdDesktopWindows, MdPhoneIphone } from 'react-icons/md'
import ConnectWalletButton from '../ConnectWalletButton'
import BorderedButton from './../BorderedButton'
import h from './Hero.module.css'

/**
 * Render a hero section with a title, descriptive text, action links, and a wallet CTA.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.welcomeText - Content rendered as the hero title.
 * @param {React.ReactNode} props.subText - Content rendered as the hero descriptive text.
 * @param {React.ReactNode} props.links - Action elements (buttons/links) rendered inside the hero actions navigation.
 * @param {boolean} [props.isLanding=false] - If true, renders the hero for the landing page.
 * @returns {JSX.Element} The hero section element.
 */
export default function Hero({
	welcomeText,
	subText,
	links,
	isLanding = false,
}) {
	return (
		<section className={cf(s.wMax, s.flex, s.spaceXBetween, h.hero)}>
			<div
				className={cf(
					s.flex,
					s.spaceXCenter,
					s.spaceYStart,
					s.flex_dColumn,
					h.heroContent,
				)}
			>
				<h1 className={cf(h.heroTitle)}>{welcomeText}</h1>
				<p className={cf(h.heroText)}>{subText}</p>
				<nav
					aria-label='Hero actions'
					className={cf(s.flex, s.flexCenter, h.heroActions)}
				>
					{links}
				</nav>
			</div>
			<div className={cf(s.flex, s.flexEnd, s.p_relative, h.heroCTA)}>
				{/* TODO implement dynamic isLanding state switch */}
				<ConnectWalletButton isLanding={isLanding} />
			</div>
		</section>
	)
}

export const HomePageHero = () => {
	const desktopBuildUrl = DESKTOP_BUILD_URL ?? '#'
	const mobileBuildUrl = MOBILE_BUILD_URL ?? '#'

	return (
		<Hero
			welcomeText={
				<>
					Where heroes <br />
					become legends
				</>
			}
			subText={
				<>
					ChainBois is a 3rd person shooter P2E{' '}
					<br className={cf(h.lgHidden)} /> game on Avalanche{' '}
					<br className={cf(h.mdHidden)} />
					available on Mobile & PC.
				</>
			}
			links={
				<>
					<BorderedButton
						tag={'Download Desktop Build'}
						action={desktopBuildUrl}
						isLink={true}
						borderButtonText={h.heroActionText}
						icon={<MdDesktopWindows className={h.heroActionIcon} />}
					/>
					<BorderedButton
						tag={'Download Mobile Build'}
						action={mobileBuildUrl}
						isLink={true}
						borderButtonText={h.heroActionText}
						icon={<MdPhoneIphone className={h.heroActionIcon} />}
					/>
				</>
			}
			isLanding={true}
		/>
	)
}
