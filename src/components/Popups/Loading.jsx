'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import p from './Popups.module.css'
import l from './Loading.module.css'

const Loading = () => {
	const { loadingInfo, hideLoading, canCloseModal } = useNotifications()

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, l.popup)}>
			<div className={cf(s.wMax, s.flex, s.flex_dColumn, p.content, l.content)}>
				<header className={cf(s.wMax, s.flex, s.flex_dColumn, l.header)}>
					<h3 className={cf(s.wMax, s.tCenter, p.popupTitle, l.popupTitle)}>
						{loadingInfo?.title ?? 'Processing Request'}
					</h3>
					<p className={cf(s.wMax, s.tCenter, p.popupMessage, l.popupMessage)}>
						{loadingInfo?.message ?? 'Please wait while we process this action.'}
					</p>
				</header>

				<div className={cf(l.progressTrack)} aria-hidden="true">
					<div className={cf(l.progressBar)} />
				</div>

				{canCloseModal && (
					<div className={cf(s.wMax, s.flex, s.flexCenter, p.popupActionButtonBox, l.actions)}>
						<button
							type="button"
							className={cf(s.flex, s.flexCenter, l.closeButton)}
							onClick={hideLoading}
						>
							Close
						</button>
					</div>
				)}
			</div>
		</section>
	)
}

export default Loading
