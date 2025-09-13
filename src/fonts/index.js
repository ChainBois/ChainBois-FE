import { Inter, Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-g',
	weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export { inter, spaceGrotesk }
