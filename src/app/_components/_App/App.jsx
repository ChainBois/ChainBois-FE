'use client'

import { cf } from '@/utils'
import a from './App.module.css'
import s from '@/styles'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function App({ children }) {
	return (
		<>
			<Navbar />
			<main className={cf(s.wMax, s.p_relative, a.main)}>
				{children}
			</main>
			<Footer />
		</>
	)
}
