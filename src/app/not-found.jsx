'use client'

import BorderedButton from '@/components/BorderedButton'
import ClippedButton from '@/components/ClippedButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdArrowBack, MdExplore, MdHome } from 'react-icons/md'
import styles from './not-found.module.css'

const destinations = [
	{
		href: '/battleground',
		label: 'Battleground',
		description: 'Drop into live tournaments and active clashes.',
	},
	{
		href: '/armory',
		label: 'Armory',
		description: 'Re-arm, inspect your loadout, and prep your next move.',
	},
	{
		href: '/inventory',
		label: 'Inventory',
		description: 'Check the assets and rewards still on your grid.',
	},
	{
		href: '/training-room',
		label: 'Training Room',
		description: 'Send your squad back into drills and upgrade paths.',
	},
]

const telemetry = [
	{
		label: 'Status',
		value: 'Route Unresolved',
		meta: 'The coordinates never matched a live sector.',
	},
	{
		label: 'Beacon',
		value: 'Base Is Online',
		meta: 'A safe path home is still locked and stable.',
	},
	{
		label: 'Recovery',
		value: 'Manual Override',
		meta: 'Use a live zone or jump back one step.',
	},
]

export default function NotFoundPage() {
	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	return (
		<main className={styles.notFoundPage}>
			<section className={styles.panel}>
				<div className={styles.stageColumn}>
					<div className={styles.stage}>
						<div className={styles.stageGlow}></div>
						<div className={styles.starfield}></div>
						<div className={styles.grid}></div>
						<div className={styles.scanline}></div>
						<div className={styles.orbitOuter}></div>
						<div className={styles.orbitInner}></div>
						<div className={styles.signalRing}></div>

						<div className={styles.notFoundCode} aria-hidden='true'>
							<span className={styles.digit}>4</span>
							<span
								className={`${styles.digit} ${styles.zeroDigit}`}
								data-shadow='0'
							>
								0
							</span>
							<span className={styles.digit}>4</span>
						</div>

						<div className={`${styles.stageChip} ${styles.stageChipTop}`}>
							Null Zone
						</div>
						<div className={`${styles.stageChip} ${styles.stageChipRight}`}>
							Signal Lost
						</div>
						<div className={`${styles.stageChip} ${styles.stageChipBottom}`}>
							Retrying Scan
						</div>
						<div className={`${styles.stageChip} ${styles.stageChipLeft}`}>
							Ghost Route
						</div>

						<span className={`${styles.spark} ${styles.sparkOne}`}></span>
						<span className={`${styles.spark} ${styles.sparkTwo}`}></span>
						<span className={`${styles.spark} ${styles.sparkThree}`}></span>
						<span className={`${styles.spark} ${styles.sparkFour}`}></span>
					</div>

					<p className={styles.statusText}>Location Not Found</p>
					<p className={styles.stageCaption}>
						This page either moved, vanished, or was never on the grid to begin
						with. We can get you back to a live zone without making the detour
						feel like a dead end.
					</p>
				</div>

				<div className={styles.copyColumn}>
					{/* <div className={styles.copyIntro}>
						<p className={styles.eyebrow}>ChainBoi Navigation</p>
						<h1 className={styles.title}>
							You&apos;ve drifted into unmapped space.
						</h1>
						<p className={styles.message}>
							This page either moved, vanished, or was never on the grid to begin
							with. We can get you back to a live zone without making the detour
							feel like a dead end.
						</p>
					</div> */}

					{/* <div className={styles.telemetryRow}>
						{telemetry.map(({ label, value, meta }) => (
							<div
								key={label}
								className={styles.telemetryCard}
							>
								<span className={styles.telemetryLabel}>{label}</span>
								<span className={styles.telemetryValue}>{value}</span>
								<span className={styles.telemetryMeta}>{meta}</span>
							</div>
						))}
					</div> */}

					<div className={styles.actionButtons}>
						{/* <ClippedButton
							tag='Return to Base'
							action='/'
							isLink
							icon={<MdHome className={styles.buttonIcon} />}
							clippedButton={styles.primaryButton}
							clippedButtonContent={styles.primaryButtonContent}
							clippedButtonText={styles.primaryButtonText}
							clippedButtonIcon={styles.primaryButtonIcon}
						/> */}

						<BorderedButton
							tag='Go Back'
							action={handleGoBack}
							icon={<MdArrowBack className={styles.buttonIcon} />}
							borderButton={styles.secondaryButton}
							borderButtonContent={styles.secondaryButtonContent}
							borderButtonText={styles.secondaryButtonText}
							borderButtonIcon={styles.secondaryButtonIcon}
						/>
					</div>

					<div className={styles.quickLinks}>
						<div className={styles.quickLinksHeader}>
							<h2 className={styles.quickLinksTitle}>Explore Active Zones</h2>
							<p className={styles.quickLinksSubtitle}>
								Fresh routes if you want to keep moving.
							</p>
						</div>

						<div className={styles.linkGrid}>
							{destinations.map(({ href, label, description }) => (
								<Link
									key={href}
									href={href}
									className={styles.quickLink}
								>
									<span className={styles.quickLinkIconWrap}>
										<MdExplore className={styles.linkIcon} />
									</span>

									<span className={styles.quickLinkCopy}>
										<span className={styles.quickLinkLabel}>{label}</span>
										<span className={styles.quickLinkMeta}>{description}</span>
									</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
