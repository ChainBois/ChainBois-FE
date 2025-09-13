/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ipfs.io',
				port: '',
				pathname: '/**/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**/**',
			},
			{
				protocol: 'https',
				hostname: 'gateway.ipfs.io',
				port: '',
				pathname: '/**/**',
			},
		],

		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		qualities: [75, 100],

		dangerouslyAllowSVG: false,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=180, must-revalidate',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
			{
				source: '/api/preview/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, stale-while-revalidate=86400',
					},
				],
			},
			{
				source: '/sitemap.xml',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/xml',
					},
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600, stale-while-revalidate=86400',
					},
				],
			},
		]
	},

	async rewrites() {
		return [
			{
				source: '/sitemap.xml',
				destination: '/sitemap.xml',
			},
			{
				source: '/robots.txt',
				destination: '/api/robots',
			},
		]
	},

	experimental: {
		optimizeCss: false,
	},

	// Webpack fallback - PRODUCTION SAFE
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
			}
		}
		return config
	},

	turbopack: {
		resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
	},
}

export default nextConfig
