'use client'

import { cf } from '@/utils'
import a from './App.module.css'
import s from '@/styles'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Modal from '@/components/Modal'
import ModalParent from '@/components/ModalParent'
import ToastContainer from '@/components/ToastContainer'

const Container = ({ c, children }) => {
	return <div className={cf(s.flex, c)}>{children}</div>
}

export default function App({ children }) {
	return (
		<>
			<Navbar />
			<main className={cf(s.wMax, s.p_relative, a.main)}>
				{children}
			</main>
			<Footer />
			<Container c={cf(s.wMax, s.flexTop, a.modalParent)}>
				<ModalParent />
			</Container>
			<Container c={cf(s.wMax, s.flexTop, a.modal)}>
				<Modal />
				<ToastContainer />
			</Container>
		</>
	)
}
