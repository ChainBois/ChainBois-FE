'use client'

import { cf } from '@/utils'
import s from '@/styles'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CBBranding from '@/assets/svg/CBBranding.svg'
import { MdRefresh, MdHome, MdArrowBack } from 'react-icons/md'
import styles from './error.module.css'

export default function ErrorPage({
	errorCode = 500,
	title = 'System Malfunction',
	message = 'Our battle systems have encountered an unexpected error. The legendary warriors are working to restore order.',
	showRetry = true,
}) {
	const router = useRouter()

	const handleRetry = () => {
		window.location.reload()
	}

	const handleGoBack = () => {
		router.back()
	}

	return (
		<div className={cf(s.flex, s.flex_dColumn, styles.errorPage)}>
			{/* Main Content */}
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
						styles.errorContainer
					)}
				>
					{/* Error Icon/Code */}
					<div className={cf(s.flex, s.flex_dColumn, s.flexCenter, s.g20)}>
						<div className={styles.errorCode}>{errorCode}</div>
						<div className={styles.glitchEffect}>SYSTEM ERROR</div>
					</div>

					{/* Error Content */}
					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.errorContent
						)}
					>
						<h1 className={styles.errorTitle}>{title}</h1>
						<p className={styles.errorMessage}>{message}</p>
					</div>

					{/* Action Buttons */}
					<div
						className={cf(s.flex, s.flexCenter, s.g20, styles.actionButtons)}
					>
						{showRetry && (
							<button
								onClick={handleRetry}
								className={cf(
									s.flex,
									s.flexCenter,
									s.g10,
									styles.primaryButton
								)}
							>
								<MdRefresh className={styles.buttonIcon} />
								<span>Retry Mission</span>
							</button>
						)}

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

						<Link
							href='/'
							className={cf(
								s.flex,
								s.flexCenter,
								s.g10,
								styles.secondaryButton
							)}
						>
							<MdHome className={styles.buttonIcon} />
							<span>Home Base</span>
						</Link>
					</div>

					{/* Additional Info */}
					<div className={styles.errorInfo}>
						<p>
							If this problem persists, contact our support team at the base
							camp.
						</p>
						<code className={styles.errorId}>
							Error ID: {Date.now().toString(36).toUpperCase()}
						</code>
					</div>
				</div>
			</section>
		</div>
	)
}
