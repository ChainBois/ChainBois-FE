'use client'

import ClippedButton from '@/components/ClippedButton'
import { MdRefresh } from 'react-icons/md'
import styles from './SectionError.module.css'

export default function SectionError({
	title = 'System Malfunction',
	message = 'We hit an unexpected issue while loading this section.',
	status = 'Section Error',
	graphicText = 'ERR',
	actionLabel = 'Retry Section',
	onAction,
	minHeight = '320px',
	className = '',
}) {
	const rootClassName = [styles.sectionError, className].filter(Boolean).join(' ')
	const resolvedMessage =
		String(message ?? '').trim() ||
		'We hit an unexpected issue while loading this section.'

	return (
		<section
			className={rootClassName}
			style={{ minHeight }}
			role='alert'
			aria-live='assertive'
		>
			<div className={styles.content}>
				<div className={styles.graphicWrap} aria-hidden='true'>
					<div className={styles.graphicHalo}>
						<div className={styles.graphicRing}></div>
						<div className={styles.graphicRingSecondary}></div>
						<div className={styles.graphicSlash}></div>
						<div className={styles.graphicCore}>
							<span className={styles.graphicText}>{graphicText}</span>
						</div>
					</div>
					<p className={styles.status}>{status}</p>
				</div>

				<div className={styles.copy}>
					<h2 className={styles.title}>{title}</h2>
					<p className={styles.message}>{resolvedMessage}</p>
				</div>

				{onAction ? (
					<ClippedButton
						tag={actionLabel}
						action={onAction}
						icon={<MdRefresh className={styles.buttonIcon} />}
						clippedButton={styles.clippedButton}
						clippedButtonContent={styles.clippedButtonContent}
						clippedButtonText={styles.clippedButtonText}
						clippedButtonIcon={styles.clippedButtonIcon}
					/>
				) : null}
			</div>
		</section>
	)
}
