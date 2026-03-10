'use client'

import { createWallet } from 'thirdweb/wallets'

export const thirdwebWallets = [
	// inAppWallet(), // email/social login (optional)
	createWallet('io.metamask'),
	createWallet('app.keplr'),
	createWallet('app.phantom'),
	createWallet('com.coinbase.wallet'),
	createWallet('com.trustwallet.app'),
]

export const thirdwebAppMetadata = {
	name: 'ChainBois',
	url: process.env.NEXT_PUBLIC_SITE_URL || 'https://chain-bois.vercel.app',
	description: 'ChainBois gaming platform',
	logoUrl: 'https://chain-bois.vercel.app/img/CB.svg',
}

