'use client'

import { cf } from '@/utils'
import s from '@/styles'
import f from './Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import chainbois from '@/assets/svg/chainboisFooter.svg'
import MaxWidth from '../MaxWidth'
import { Partnership } from '../Homepage'

const FooterNav = ({ tag, links }) => {
	return (
		<ul className={cf(f.footerNav)}>
			<li className={cf(f.footerNavTitle)}>{tag}</li>
			{links.map((link, index) => (
				<li
					key={index}
					className={cf(f.footerNavLink)}
				>
					<Link
						className={cf(f.navLink)}
						href={link.link}
					>
						{link.title}
					</Link>
				</li>
			))}
		</ul>
	)
}

export default function Footer() {
	const ecosystem = [
		{
			title: 'NFT Collections',
			link: '/#nft-collections',
		},
		{
			title: 'Game',
			link: '/#game',
		},
		{
			title: 'Token',
			link: '/#token',
		},
		{
			title: 'Staking',
			link: '/#staking',
		},
		{
			title: 'Market Place',
			link: '/#market-place',
		},
	]

	const account = [
		{
			title: 'Tournament',
			link: '/#tournament',
		},
		{
			title: 'Game Access',
			link: '/#game-access',
		},
		{
			title: 'Mystery Box',
			link: '/#mystery-box',
		},
		{
			title: 'Level Up',
			link: '/#level-up',
		},
	]

	const community = [
		{
			title: 'Discord',
			link: '/#tournament',
		},
		{
			title: 'X',
			link: '/#x',
		},
		{
			title: 'Youtube',
			link: '/#mystery-box',
		},
		{
			title: 'Twitch',
			link: '/#twitch',
		},
	]
	return (
		<>
			<Partnership />
			<footer className={cf(s.wMax, s.flex, s.flexCenter, f.footer)}>
				<MaxWidth
					maxWidth={{ max: '1280px', tablet: '540px', mobile: '265px' }}
				>
					<section
						className={cf(s.wMax, s.flex, s.spaceXBetween, f.topContainer)}
					>
						<article
							className={cf(
								s.flex,
								s.spaceXBetween,
								s.flex_dColumn,
								f.contactUs,
							)}
						>
							<h2 className={cf(f.contactUsTitle)}>Contact Us</h2>
							<Link
								href={`mailto:contact@chainbois.com`}
								target={'_top'}
								className={cf(f.contactUsLink)}
							>
								contact@chainbois.com
							</Link>
						</article>
						<div className={cf(f.separator)}></div>
						<article
							className={cf(
								s.flex,
								s.spaceXBetween,
								s.flex_dColumn,
								f.newsLetter,
							)}
						>
							<h2 className={cf(f.newsLetterTitle)}>
								Sign up
								<br />
								for Updates
							</h2>
							<Link
								href={`https://chainbois.com`}
								target={'_blank'}
								className={cf(f.newsLetterLink)}
							>
								Submit
							</Link>
						</article>
					</section>
				</MaxWidth>
				<nav
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXEnd,
						s.spaceYStart,
						f.bottomContainer,
					)}
				>
					<FooterNav
						tag='Ecosystem'
						links={ecosystem}
					/>
					<FooterNav
						tag='Account'
						links={account}
					/>
					<FooterNav
						tag='Community'
						links={ecosystem}
					/>
				</nav>
				<figure
					className={cf(s.wMax, s.flex, s.flexCenter, f.chainboisContainer)}
				>
					<Image
						src={chainbois}
						alt={'chainbois footer text'}
						className={cf(f.chainbois)}
					/>
				</figure>
			</footer>
		</>
	)
}
