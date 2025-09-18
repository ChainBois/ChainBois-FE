import { Inter, Space_Grotesk, Manrope } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-g',
	weight: ['300', '400', '500', '600', '700'],
})

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope',
	weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const otomanopeeOne = localFont({
	src: './OtomanopeeOne-Regular.ttf', // Path to your font file
	variable: '--font-oto',
})

export { inter, spaceGrotesk, manrope, otomanopeeOne }
