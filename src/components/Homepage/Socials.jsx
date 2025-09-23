'use client'

import Link from 'next/link'
import ClippedButton from '../ClippedButton'
import s from '@/styles'
import { cf } from '@/utils'
import x from './Socials.module.css'
import { FaXTwitter } from 'react-icons/fa6'
import { BsDiscord } from 'react-icons/bs'

export default function Socials() {
	return (
		<section
			className={cf(s.wMax, s.flex, s.flexLeft, s.flex_dColumn, x.socials)}
		>
			<div className={cf(x.topSeparator)}></div>
			<div className={cf(s.wMax, s.flex, s.flexCenter, x.links)}>
				<ClippedButton
					tag='Discord'
					action='https://discord.com/invite/chainbois'
					icon={<BsDiscord className={cf(x.socialIcon)} />}
					isLink
				/>
				<ClippedButton
					tag='Twitter'
					action='https://twitter.com/chainbois'
					icon={<FaXTwitter className={cf(x.socialIcon, x.socialIconTwitter)} />}
					isLink
					clippedButton={cf(x.socialButton)}
					clippedButtonText={cf(x.socialButtonText)}
                    clippedButtonIcon={ cf(x.socialButtonIcon) }
                    clippedButtonContent={ cf(x.socialButtonContent) }
				/>
			</div>
			<div className={cf(x.bottomSeparator)}></div>
		</section>
	)
}
