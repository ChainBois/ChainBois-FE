'use client'

import s from '@/styles';
import { cf } from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdExplore, MdHome, MdSearch } from 'react-icons/md';
import styles from './not-found.module.css';

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
					s.pX10
				)}
			>
				<div
					className={cf(
						s.flex,
						s.flex_dColumn,
						s.flexCenter,
						s.g34,
						styles.notFoundContainer
					)}
				>
					{/* 404 Animation */}
					<div className={cf(s.flex, s.flex_dColumn, s.flexCenter, s.g20)}>
						<div className={styles.notFoundCode}>
							<span className={styles.digit}>4</span>
							<span className={cf(styles.digit, styles.zeroGlitch)}>0</span>
							<span className={styles.digit}>4</span>
						</div>
						<div className={styles.statusText}>LOCATION NOT FOUND</div>
					</div>

					{/* Content */}
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.content
						)}
					>
						<h1 className={styles.title}>You&apos;ve Wandered Into The Void</h1>
						<p className={styles.message}>
							This battleground doesn&apos;t exist in our realm. The coordinates
							you&apos;re looking for might have been destroyed in the last battle,
							or perhaps it never existed at all.
						</p>
					</div>

					{/* Floating Elements */}
					<div className={styles.floatingElements}>
						<div className={cf(styles.floatingElement, styles.element1)}>
							⚔️
						</div>
						<div className={cf(styles.floatingElement, styles.element2)}>
							🛡️
						</div>
						<div className={cf(styles.floatingElement, styles.element3)}>
							⚡
						</div>
						<div className={cf(styles.floatingElement, styles.element4)}>
							💎
						</div>
					</div>

					{/* Action Buttons */}
					<div
						className={cf(s.flex, s.flexCenter, s.g20, styles.actionButtons)}
					>
						<Link
							href='/'
							className={cf(s.flex, s.flexCenter, s.g10, styles.primaryButton)}
						>
							<MdHome className={styles.buttonIcon} />
							<span>Return to Base</span>
						</Link>

						<button
							onClick={handleGoBack}
							className={cf(
								s.flex,
								s.flexCenter,
								s.g10,
								styles.secondaryButton
							)}
						>
							<MdArrowBack className={styles.buttonIcon} />
							<span>Go Back</span>
						</button>
					</div>

					{/* Quick Links */}
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g15,
							styles.quickLinks
						)}
					>
						<h3 className={styles.quickLinksTitle}>
							Or explore these legendary locations:
						</h3>
						<div className={cf(s.flex, s.flexCenter, s.g15, styles.linkGrid)}>
							<Link
								href='/#battleground'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Battleground</span>
							</Link>
							<Link
								href='/#armory'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Armory</span>
							</Link>
							<Link
								href='/#marketplace'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Marketplace</span>
							</Link>
							<Link
								href='/#training-room'
								className={styles.quickLink}
							>
								<MdExplore className={styles.linkIcon} />
								<span>Training</span>
							</Link>
						</div>
					</div>

					{/* Search Suggestion */}
					<div
						className={cf(s.flex, s.flexCenter, s.g10, styles.searchSuggestion)}
					>
						<MdSearch className={styles.searchIcon} />
						<span>Maybe try searching from the home base?</span>
					</div>
				</div>
			</section>
		</div>
	)
}
