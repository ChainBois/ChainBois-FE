import styles from './SectionLoading.module.css'

export default function SectionLoading({
	message = 'Loading this section...',
	subMessage = 'Please wait while we prepare the latest data.',
	label = 'System Sync In Progress',
	minHeight = '340px',
	className = '',
}) {
	const rootClassName = [styles.sectionLoading, className]
		.filter(Boolean)
		.join(' ')

	return (
		<section
			className={rootClassName}
			style={{ minHeight }}
			role='status'
			aria-live='polite'
			aria-busy='true'
		>
			<div className={styles.content}>
				<div className={styles.spinnerContainer} aria-hidden='true'>
					<div className={styles.outerRing}></div>
					<div className={styles.innerRingWrap}>
						<div className={styles.innerRing}></div>
					</div>
					<div className={styles.centerDot}></div>
				</div>

				<div className={styles.copy}>
					<p className={styles.label}>{label}</p>
					<h2 className={styles.message}>{message}</h2>
					{subMessage ? (
						<p className={styles.subMessage}>{subMessage}</p>
					) : null}
				</div>

				<div className={styles.loadingDots} aria-hidden='true'>
					<span className={styles.dot}></span>
					<span className={`${styles.dot} ${styles.dotDelay1}`}></span>
					<span className={`${styles.dot} ${styles.dotDelay2}`}></span>
				</div>
			</div>
		</section>
	)
}
