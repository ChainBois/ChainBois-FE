import { Inter, Space_Grotesk, Manrope } from 'next/font/google'

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope',
	weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-g',
	weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export { inter, spaceGrotesk, manrope }
