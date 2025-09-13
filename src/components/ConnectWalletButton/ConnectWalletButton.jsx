'use client'

import { ConnectButton, darkTheme } from 'thirdweb/react'
import { createWallet, inAppWallet } from 'thirdweb/wallets'
import { avalanche } from 'thirdweb/chains'
import { thirdwebClient } from '@/lib'
import s from '@/styles'
import c from './ConnectWalletButton.module.css'
import { cf } from '@/utils'

const wallets = [
	// inAppWallet(), // email/social login (optional)
	// createWallet('io.metamask'),
	createWallet('app.core.extension'),
	createWallet('com.trustwallet.app'),
	// createWallet('app.phantom'),
	// createWallet('io.atomicwallet'),
	// createWallet('com.safepal'),
]

const StandIn = () => {
	return (
		<span className={cf(s.wMax, s.flex, s.flexCenter, s.p_absolute, c.standIn)}>
			<span className={cf(s.flex, c.standInDot)}></span>

			<span className={cf(s.wMax, s.tLeft, c.standInTitle)}>
				Connect Wallet
			</span>

			<span className={cf(s.wMax, s.tLeft, c.standInText)}>
				Securely link your wallet to get started
			</span>

			<span className={cf(s.wMax, s.tLeft, c.standInFooterText)}>Connect</span>
		</span>
	)
}

export default function ConnectWalletButton() {
	return (
		<ConnectButton
			client={thirdwebClient}
			wallets={wallets}
			chain={avalanche} // explicit, in addition to ChainProvider default
			theme={darkTheme({
				colors: {},
			})}
			connectModal={{ size: 'compact' }} // optional
			connectButton={{
				label: <StandIn />,
			}}
		/>
	)
}
