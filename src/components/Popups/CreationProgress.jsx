'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import p from './Popups.module.css'
import c from './CreationProgress.module.css'

const CreationStage = ({ stage }) => {
	const stateClass = stage?.complete
		? c.stageComplete
		: stage?.processing
			? c.stageProcessing
			: c.stagePending

	return (
		<li className={cf(s.wMax, s.flex, s.flex_dColumn, c.stageItem, stateClass)}>
			<div className={cf(s.wMax, s.flex, s.spaceXBetween, s.spaceYCenter, c.stageTop)}>
				<span className={cf(c.stageTag)}>{stage?.tag ?? 'Stage'}</span>
				<span className={cf(c.stageState)}>
					{stage?.complete ? 'Complete' : stage?.processing ? 'Processing' : 'Queued'}
				</span>
			</div>
			<p className={cf(s.wMax, s.tLeft, c.stageDescription)}>
				{stage?.description ?? ''}
			</p>
		</li>
	)
}

const CreationProgress = () => {
	const {
		loadingInfo,
		hideCreationProgress,
		canCloseModal,
		stage1,
		stage2,
		stage3,
		complete,
	} = useNotifications()

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, c.popup)}>
			<div className={cf(s.wMax, s.flex, s.flex_dColumn, p.content, c.content)}>
				<header className={cf(s.wMax, s.flex, s.flex_dColumn, c.header)}>
					<div className={cf(s.flex, s.flexCenter, c.loader)} aria-hidden="true" />
					<h3 className={cf(s.wMax, s.tCenter, p.popupTitle, c.popupTitle)}>
						{loadingInfo?.title ?? 'Processing Request'}
					</h3>
					<p className={cf(s.wMax, s.tCenter, p.popupMessage, c.popupMessage)}>
						{complete
							? loadingInfo?.successMessage ?? 'Done. Finalizing...'
							: loadingInfo?.message ?? 'Please wait while we process this action.'}
					</p>
				</header>

				<ul className={cf(s.wMax, s.flex, s.flex_dColumn, c.stageList)}>
					<CreationStage stage={stage1} />
					<CreationStage stage={stage2} />
					<CreationStage stage={stage3} />
				</ul>

				{canCloseModal && (
					<div className={cf(s.wMax, s.flex, s.flexCenter, p.popupActionButtonBox, c.actions)}>
						<button
							type="button"
							className={cf(s.flex, s.flexCenter, c.closeButton)}
							onClick={hideCreationProgress}
						>
							Close
						</button>
					</div>
				)}
			</div>
		</section>
	)
}

export default CreationProgress
