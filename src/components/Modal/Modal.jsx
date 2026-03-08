'use client'

import { useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import {
	Alert,
	// Loading,
} from '../Popups'
import m from './Modal.module.css'

const Modal = () => {
	const { modal, showModal, setShowModal, canCloseModal } = useNotifications()

	const modals = {
		// loading: <Loading />,
		alert: <Alert />,
	}

	return (
		!!showModal && (
			<div className={cf(s.flex, s.flexCenter, s.wMax, s.hMax, m.modal)}>
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.p_relative,
						s.flex_dColumn,
						m.modalWrapper,
					)}
				>
					<div
						className={cf(s.flex, s.wMax, s.hMax, s.p_absolute, m.modalMask)}
						onClick={() => {
							if (canCloseModal) setShowModal((x) => false)
						}}
					></div>
					<div className={cf(s.wMax, s.flex, s.flexCenter, m.modalContent)}>
						<div className={cf(s.wMax, s.flex, s.flexCenter)}>
							{modals[modal]}
						</div>
					</div>
				</div>
			</div>
		)
	)
}

export default Modal
