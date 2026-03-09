'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import Image from 'next/image'
import { cf } from '@/utils'
import { PolyButton } from '../PolyButton'
import p from './Popups.module.css'
import a from './Alert.module.css'
import { IoMdClose } from 'react-icons/io'

const Alert = ({ children }) => {
	const {
		alertInfo: { forConfirmation = false, neg, pos, ...alertInfo },
		setShowModal,
		promiseOfConfirmation,
	} = useNotifications()

	return (
		<section className={cf(s.flex, s.flexCenter, p.popup, a.popup)}>
			<div className={cf(s.wMax, s.flex, s.flexCenter, p.content, a.content)}>
				<header
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						p.popupTitleBox,
						a.popupTitleBox,
					)}
				>
					<h3
						className={cf(
							s.flex,
							s.flexOne,
							s.tLeft,
							s.flexLeft,
							p.popupTitle,
							a.popupTitle,
						)}
					>
						{alertInfo?.title ?? 'Alert!'}
					</h3>
					<button
						className={cf(s.flex, s.flexCenter, p.closeBtn)}
						onClick={() => {
							if (forConfirmation && promiseOfConfirmation?.reject)
								promiseOfConfirmation.reject(neg?.value)
							setShowModal(() => false)
						}}
					>
						<IoMdClose className={cf(s.flex, s.flexCenter, p.closeIcon)} />
					</button>
				</header>
				<div
					className={cf(s.wMax, s.tLeft, p.popupMessageCon, a.popupMessageCon)}
				>
					<p className={cf(s.wMax, s.tLeft, p.popupMessage, a.popupMessage)}>
						{alertInfo?.message ?? 'Hi'}
					</p>
					{children}
				</div>
				<nav
					className={cf(
						s.wMax,
						s.flex,
						s.flexLeft,
						p.popupActionButtonBox,
						a.popupActionButtonBox,
					)}
				>
					<PolyButton
						polyButton={cf(p.polyButton)}
						tag={forConfirmation ? neg?.tag : 'Okay'}
						isLink={false}
						action={() => {
							if (promiseOfConfirmation?.reject)
								promiseOfConfirmation.reject(neg?.value)
							setShowModal(() => false)
						}}
						side={forConfirmation ? 'left' : 'right'}
					/>
					{!!forConfirmation && (
						<PolyButton
							polyButton={cf(p.polyButton)}
							tag={pos?.tag}
							isLink={false}
							action={() => {
								if (forConfirmation && promiseOfConfirmation?.resolve)
									promiseOfConfirmation.resolve(pos?.value)
								setShowModal(() => false)
							}}
							side={'left'}
						/>
					)}
				</nav>
			</div>
		</section>
	)
}

export default Alert
