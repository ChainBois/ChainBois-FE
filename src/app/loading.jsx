'use client'

import BorderedButton from '@/components/BorderedButton'
import s from '@/styles'
import { cf } from '@/utils'
import { useEffect, useState } from 'react'
import { MdHome } from 'react-icons/md'
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
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval)
					return 100
				}
				return prev + Math.random() * 3
			})
		}, 150)

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
			<section
				className={cf(
					s.flex,
					s.flexCenter,
					s.flex_dColumn,
					s.flexOne,
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
						styles.loadingContainer,
					)}
				>
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.loadingContent,
						)}
					>
						<div className={cf(s.flex, s.flexCenter, styles.spinnerContainer)}>
							<div className={styles.outerRing}>
								<div className={styles.innerRing}>
									<div className={styles.centerDot}></div>
								</div>
							</div>
						</div>

						<div
							className={cf(
								s.flex,
								s.flex_dColumn,
								s.flexCenter,
								s.g15,
								styles.textContainer,
							)}
						>
							<h1 className={styles.loadingTitle}>{currentMessage}</h1>
							<p className={styles.loadingSubtitle}>{subMessage}</p>
						</div>

						{showProgress && (
							<div
								className={cf(
									s.flex,
									s.flex_dColumn,
									s.flexCenter,
									s.g10,
									styles.progressContainer,
								)}
							>
								<div className={styles.progressBar}>
									<div
										className={styles.progressFill}
										style={{ width: `${Math.min(progress, 100)}%` }}
									></div>
								</div>
								<div className={styles.progressText}>
									{Math.floor(Math.min(progress, 100))}%
								</div>
							</div>
						)}

						<div className={cf(s.flex, s.flexCenter, s.g5, styles.loadingDots)}>
							<div className={cf(styles.dot, styles.dotDelay1)}></div>
							<div className={cf(styles.dot, styles.dotDelay2)}></div>
							<div className={cf(styles.dot, styles.dotDelay3)}></div>
						</div>

						<div className={styles.tipContainer}>
							<div className={styles.tip}>
								<strong>Pro Tip:</strong> Prepare your strategy while systems boot.
							</div>
						</div>

						<BorderedButton
							tag='Go to Home Base'
							action='/'
							isLink
							icon={<MdHome className={styles.buttonIcon} />}
							borderButton={styles.borderButton}
							borderButtonContent={styles.borderButtonContent}
							borderButtonText={styles.borderButtonText}
						/>
					</div>
				</div>
			</section>
		</div>
	)
}
