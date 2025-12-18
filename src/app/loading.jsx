'use client'

import { cf } from '@/utils'
import s from '@/styles'
import { useEffect, useState } from 'react'
import styles from './loading.module.css'

export default function LoadingPage({
	message = 'Initializing Battle Systems...',
	subMessage = 'Preparing legendary warriors for combat',
	showProgress = true,
	customMessages = [],
}) {
	const [progress, setProgress] = useState(0)
	const [currentMessage, setCurrentMessage] = useState(message)
	const [messageIndex, setMessageIndex] = useState(0)

	const defaultMessages = [
		'Initializing Battle Systems...',
		'Loading Weapons Arsenal...',
		'Connecting to Blockchain...',
		'Summoning Warriors...',
		'Preparing Battleground...',
		'Activating Legendary Mode...',
		'Almost Ready for Combat...',
	]

	const messages = customMessages.length > 0 ? customMessages : defaultMessages

	useEffect(() => {
		// Simulate loading progress
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval)
					return 100
				}
				return prev + Math.random() * 3
			})
		}, 150)

		// Change messages periodically
		const messageInterval = setInterval(() => {
			setMessageIndex((prev) => {
				const nextIndex = (prev + 1) % messages.length
				setCurrentMessage(messages[nextIndex])
				return nextIndex
			})
		}, 2000)

		return () => {
			clearInterval(progressInterval)
			clearInterval(messageInterval)
		}
	}, [messages])

	return (
		<div className={cf(s.flex, s.flex_dColumn, styles.loadingPage)}>
			{/* Animated Background */}
			<div className={styles.backgroundAnimation}>
				<div className={cf(styles.particle, styles.particle1)}></div>
				<div className={cf(styles.particle, styles.particle2)}></div>
				<div className={cf(styles.particle, styles.particle3)}></div>
				<div className={cf(styles.particle, styles.particle4)}></div>
				<div className={cf(styles.particle, styles.particle5)}></div>
			</div>

			{/* Main Content */}
			<section
				className={cf(
					s.flex,
					s.flexCenter,
					s.flex_dColumn,
					s.flexOne,
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
						styles.loadingContainer
					)}
				>
					{/* Main Loading Animation */}
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.loadingContent
						)}
					>
						{/* Spinner/Animation */}
						<div className={cf(s.flex, s.flexCenter, styles.spinnerContainer)}>
							<div className={styles.outerRing}>
								<div className={styles.innerRing}>
									<div className={styles.centerDot}></div>
								</div>
							</div>
							<div className={styles.orbitingDots}>
								<div className={cf(styles.orbitDot, styles.dot1)}></div>
								<div className={cf(styles.orbitDot, styles.dot2)}></div>
								<div className={cf(styles.orbitDot, styles.dot3)}></div>
							</div>
						</div>

						{/* Loading Text */}
						<div
							className={cf(
								s.flex,
								s.flex_dColumn,
								s.flexCenter,
								s.g15,
								styles.textContainer
							)}
						>
							<h1 className={styles.loadingTitle}>{currentMessage}</h1>
							<p className={styles.loadingSubtitle}>{subMessage}</p>
						</div>

						{/* Progress Bar */}
						{showProgress && (
							<div
								className={cf(
									s.flex,
									s.flex_dColumn,
									s.flexCenter,
									s.g10,
									styles.progressContainer
								)}
							>
								<div className={styles.progressBar}>
									<div
										className={styles.progressFill}
										style={{ width: `${Math.min(progress, 100)}%` }}
									></div>
									<div className={styles.progressGlow}></div>
								</div>
								<div className={styles.progressText}>
									{Math.floor(Math.min(progress, 100))}%
								</div>
							</div>
						)}

						{/* Loading Dots */}
						<div className={cf(s.flex, s.flexCenter, s.g5, styles.loadingDots)}>
							<div className={cf(styles.dot, styles.dotDelay1)}></div>
							<div className={cf(styles.dot, styles.dotDelay2)}></div>
							<div className={cf(styles.dot, styles.dotDelay3)}></div>
						</div>

						{/* Tips */}
						<div className={styles.tipContainer}>
							<div className={styles.tip}>
								<strong>Pro Tip:</strong> Legendary warriors are forged in the
								heat of battle. Prepare your strategy!
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
