'use client'

import BorderedButton from '@/components/BorderedButton'
import ClippedButton from '@/components/ClippedButton'
import PolyButton from '@/components/PolyButton'
import s from '@/styles'
import { cf } from '@/utils'
import { useRouter } from 'next/navigation'
import { MdHome, MdRefresh } from 'react-icons/md'
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
						styles.errorContainer,
					)}
				>
					<div className={cf(s.flex, s.flex_dColumn, s.flexCenter, s.g20)}>
						<div className={styles.errorCode}>{errorCode}</div>
						<div className={styles.statusText}>SYSTEM ERROR</div>
					</div>

					<div
						className={cf(
							s.flex,
							s.flex_dColumn,
							s.flexCenter,
							s.g20,
							styles.errorContent,
						)}
					>
						<h1 className={styles.errorTitle}>{title}</h1>
						<p className={styles.errorMessage}>{message}</p>
					</div>

					<div className={cf(s.flex, s.flexCenter, s.g20, styles.actionButtons)}>
						{showRetry && (
							<ClippedButton
								tag='Retry Mission'
								action={handleRetry}
								icon={<MdRefresh className={styles.buttonIcon} />}
								clippedButton={styles.clippedButton}
								clippedButtonContent={styles.clippedButtonContent}
								clippedButtonText={styles.clippedButtonText}
								clippedButtonIcon={styles.clippedButtonIcon}
							/>
						)}

						<PolyButton
							tag='Go Back'
							action={handleGoBack}
							side='left'
							polyButton={styles.polyButton}
							polyButtonText={styles.polyButtonText}
						/>

						<BorderedButton
							tag='Home Base'
							action='/'
							isLink
							icon={<MdHome className={styles.buttonIcon} />}
							borderButton={styles.borderButton}
							borderButtonContent={styles.borderButtonContent}
							borderButtonText={styles.borderButtonText}
						/>
					</div>

					<div className={styles.errorInfo}>
						<p>If this problem persists, contact the support team at base camp.</p>
						<code className={styles.errorId}>
							Error ID: {Date.now().toString(36).toUpperCase()}
						</code>
					</div>
				</div>
			</section>
		</div>
	)
}
