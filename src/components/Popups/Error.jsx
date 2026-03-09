'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import { IoMdClose } from 'react-icons/io'
import p from './Popups.module.css'
import e from './Error.module.css'

const Error = () => {
	const {
		errorInfo,
		hideError,
		setShowModal,
		promiseOfConfirmation,
	} = useNotifications()

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, e.popup)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.flex_dColumn, p.content, e.content)}>
				<header
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.spaceYCenter,
						p.popupTitleBox,
						e.popupTitleBox,
					)}
				>
					<h3 className={cf(s.tLeft, p.popupTitle, e.popupTitle)}>
						{errorInfo?.title ?? 'Action Failed'}
					</h3>
					<button
						type="button"
						className={cf(s.flex, s.flexCenter, p.closeBtn, e.closeBtn)}
						onClick={() => {
							if (promiseOfConfirmation?.reject)
								promiseOfConfirmation.reject(errorInfo?.code ?? null)
							hideError()
							setShowModal(() => false)
						}}
					>
						<IoMdClose className={cf(s.flex, s.flexCenter, p.closeIcon, e.closeIcon)} />
					</button>
				</header>

				<div className={cf(s.wMax, s.tLeft, p.popupMessageCon, e.popupMessageCon)}>
					<p className={cf(s.wMax, s.tLeft, p.popupMessage, e.popupMessage)}>
						{errorInfo?.message ?? 'Something went wrong.'}
					</p>
					{!!errorInfo?.details && (
						<pre className={cf(s.wMax, e.errorDetails)}>{errorInfo.details}</pre>
					)}
				</div>

				<nav
					className={cf(
						s.wMax,
						s.flex,
						s.flexLeft,
						p.popupActionButtonBox,
						e.popupActionButtonBox,
					)}
				>
					{!!errorInfo?.action && (
						<button
							type="button"
							className={cf(s.flex, s.flexCenter, e.secondaryAction)}
							onClick={() => {
								errorInfo.action?.()
								hideError()
							}}
						>
							{errorInfo?.actionTag ?? 'Retry'}
						</button>
					)}

					<button
						type="button"
						className={cf(s.flex, s.flexCenter, e.primaryAction)}
						onClick={hideError}
					>
						Dismiss
					</button>
				</nav>
			</div>
		</section>
	)
}

export default Error
