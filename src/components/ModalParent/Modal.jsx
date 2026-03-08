'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import m from './Modal.module.css'
import { useMemo } from 'react'

const Modal = () => {
	const {
		modalParent,
		showModalParent,
		setShowModalParent,
		canCloseModalParent,
	} = useNotifications()

	const modals = useMemo(() => ({}), [])

	return (
		!!showModalParent && (
			<div className={cf(s.flex, s.flexCenter, s.wMax, s.hMax, m.modal)}>
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.p_relative,
						m.modalWrapper,
					)}
				>
					<div
						className={cf(s.flex, s.wMax, s.hMax, s.p_absolute, m.modalMask)}
						onClick={() => {
							if (canCloseModalParent) setShowModalParent(() => false)
						}}
					></div>
					{modals[modalParent]}
				</div>
			</div>
		)
	)
}

export default Modal
