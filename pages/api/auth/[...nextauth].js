import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { request } from '@/utils'

export const authProviders = {
	providers: [
		CredentialsProvider({
			credentials: {
				username: { label: 'Email', type: 'email', placeholder: '' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error('Email and password are required.')
					}

					const userCredential = await signInWithEmailAndPassword(
						auth,
						credentials.email,
						credentials.password
					)

					if (!userCredential.user) {
						return null
					}

					const response = await request({
						path: `login`,
						method: 'post',
						body: {
							address: credentials.address || '',
						},
						accessToken: userCredential.user.accessToken,
					})

					if (response.success && response.data.user) {
						return {
							...response.data.user,
							assets: response.data?.assets ?? [],
							accessToken: userCredential.user.accessToken,
						}
					}

					return null
				} catch (error) {
					console.error('Authorize error:', error.message)
					return null
				}
			},
		}),
	],
	pages: {
		signIn: '/?success=true&modal=connectWallet',
	},
	callbacks: {
		async jwt({ token, user }) {
			return user ? { ...token, ...user } : token
		},
		async session({ session, token }) {
			session.user = { ...token }
			return session
		},
	},
	session: {
		strategy: 'jwt', // Use JWT to avoid persistent cookies entirely
		maxAge: 60 * 20, // 1 hour session expiry
		updateAge: 2 * 60, // Use JWT to avoid cookie caching issues
	},
	jwt: {
		maxAge: 60 * 20, // 30 minutes
	},
	// debug: true,
}

// export default NextAuth(authProviders)

export default async function handler(req, res) {
	// Prevent caching of the session endpoint
	res.setHeader('Cache-Control', 'no-store')
	return NextAuth(req, res, authProviders)
}

// export const config = {
// 	api: {
// 		bodyParser: false, // Disable body parsing for caching issues
// 	},
// }
