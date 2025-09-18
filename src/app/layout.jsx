import { inter, manrope, spaceGrotesk, otomanopeeOne } from '@/fonts'
import { cf } from '@/utils'
import 'react-loading-skeleton/dist/skeleton.css'
import './global.css'
import App from './_components/_App'
import ContextWrapper from './_components/_ContextWrapper'

// Configure route segment behavior
export const dynamic = 'force-dynamic'
export const revalidate = 1800 // 30 minutes

// Generate static paths
export async function generateStaticParams() {
	try {
		return []
	} catch (error) {
		console.error('Error generating static params:', error)
		return [] // Fallback to empty array if fetch fails
	}
}

// Generate metadata
export async function generateMetadata() {
	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL || 'https://gp-marketplace.vercel.app'

	try {
		return {
			metadataBase: new URL(
				process.env.NEXT_PUBLIC_SITE_URL || 'https://gp-marketplace.vercel.app'
			),
			title: `ChainBois | Elite Gaming on Avalanche`,
			description:
				'ChainBois is a premier gaming platform on Avalanche, offering elite features and a vibrant community.',
			robots: 'index, follow',
			openGraph: {
				title: `ChainBois | Elite Gaming on Avalanche`,
				description:
					'ChainBois is a premier gaming platform on Avalanche, offering elite features and a vibrant community.',
				url: `${baseUrl}`,
				images: [
					{
						url: `/api/preview`,
						width: 1200, // 1200
						height: 630,
					},
				],
				type: 'website',
				siteName: 'Ghetto Market',
			},
			twitter: {
				card: 'summary_large_image',
				title: `ChainBois | Elite Gaming on Avalanche`,
				description:
					'ChainBois is a premier gaming platform on Avalanche, offering elite features and a vibrant community.',
				images: [`${baseUrl}/api/preview`],
			},
		}
	} catch (error) {
		return {
			title: 'Page Not Found',
			description: 'The page could not be found.',
		}
	}
}

/**
 * @type {import("next").Viewport}
 */
export const viewport = {
	colorScheme: 'dark',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#0F0F0F' },
		{ media: '(prefers-color-scheme: dark)', color: '#0F0F0F' },
	],
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={cf(
					inter.className,
					spaceGrotesk.className,
					manrope.className,
					otomanopeeOne.className,
					inter.variable,
					spaceGrotesk.variable,
					manrope.variable,
					otomanopeeOne.variable
				)}
			>
				<ContextWrapper>
					<App>{children}</App>
				</ContextWrapper>
			</body>
		</html>
	)
}
