'use client'

import BorderedButton from '@/components/BorderedButton'
import PolyButton from '@/components/PolyButton'
import s from '@/styles'
import { cf } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdArrowBack, MdExplore } from 'react-icons/md'
import styles from './not-found.module.css'

export default function NotFoundPage() {
	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	return (
		<div className={cf(s.flex, s.flex_dColumn, styles.notFoundPage)}>
			<section
				className={cf(
					s.flexOne,
					s.flex,
					s.flexCenter,
					s.flex_dColumn,
					s.tCenter,
					s.pX10,
				)}
			>
				<div
					className={cf(
						s.flex,
						s.flex_dColumn,
						s.flexCenter,
						s.g34,
						styles.notFoundContainer,
					)}
				>
					<div className={cf(s.flex, s.flex_dColumn, s.flexCenter, s.g20)}>
						<div className={styles.notFoundCode}>404</div>
						<div className={styles.statusText}>LOCATION NOT FOUND</div>
					</div>

					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.content,
						)}
					>
						<h1 className={styles.title}>You&apos;ve Wandered Into The Void</h1>
						<p className={styles.message}>
							This battleground doesn&apos;t exist in our realm. The coordinates
							you&apos;re looking for may have been lost after the last battle.
						</p>
					</div>

					<div className={cf(s.flex, s.flexCenter, s.g20, styles.actionButtons)}>
						<PolyButton
							tag='Return to Base'
							action='/'
							isLink
							side='right'
							polyButton={styles.polyButton}
							polyButtonText={styles.polyButtonText}
						/>

						<BorderedButton
							tag='Go Back'
							action={handleGoBack}
							icon={<MdArrowBack className={styles.buttonIcon} />}
							borderButton={styles.borderButton}
							borderButtonContent={styles.borderButtonContent}
							borderButtonText={styles.borderButtonText}
						/>
					</div>

					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g15,
							styles.quickLinks,
						)}
					>
						<h3 className={styles.quickLinksTitle}>
							Or explore these locations:
						</h3>
						<div className={cf(s.flex, s.flexCenter, s.g15, styles.linkGrid)}>
							<Link
								href='/battleground'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Battleground</span>
							</Link>
							<Link
								href='/armory'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Armory</span>
							</Link>
							<Link
								href='/marketplace'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Marketplace</span>
							</Link>
							<Link
								href='/training-room'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Training</span>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
