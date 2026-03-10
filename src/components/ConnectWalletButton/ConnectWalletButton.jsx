'use client'

import { thirdwebClient } from '@/lib'
import { thirdwebAppMetadata, thirdwebWallets } from '@/lib/thirdwebWallets'
import s from '@/styles'
import { cf } from '@/utils'
import { avalancheFuji } from 'thirdweb/chains'
import {
	ConnectButton,
	darkTheme,
	useActiveAccount,
	useWalletBalance,
} from 'thirdweb/react'
import c from './ConnectWalletButton.module.css'
import { BATTLE_TOKEN } from '@/constants'
import { useAuth, useNotifications } from '@/hooks'

const StandIn = ({ center = false }) => {
	return (
		<span
			className={cf(
				s.wMax,
				s.flex,
				s.flexCenter,
				s.p_absolute,
				c.standIn,
				center ? c.center : '',
			)}
		>
			<span className={cf(s.flex, c.standInDot, c.notConnected)}></span>

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

const DetailsStandIn = () => {
	const activeAccount = useActiveAccount()
	const { data, isLoading, isError } = useWalletBalance({
		chain: avalancheFuji,
		address: activeAccount?.address,
		client: thirdwebClient,
		tokenAddress: BATTLE_TOKEN,
	})

	return (
		<span className={cf(s.wMax, s.flex, s.flexCenter, s.p_absolute, c.standIn)}>
			<span className={cf(s.flex, c.standInDot, c.connected)}></span>

			<span className={cf(s.wMax, s.tLeft, c.standInTitle)}>
				{isLoading ? 'Loading...' : isError ? 'Error' : data?.displayValue}
			</span>
			<span className={cf(s.wMax, s.tLeft, c.standInText)}>
				Your wallet balance
			</span>

			<button className={cf(s.wMax, s.tLeft, c.standInFooterText)}>
				View Details
			</button>
		</span>
	)
}

/**
 * A custom Connect Wallet button for Chainbois.
 * @param {object} props - Optional props.
 * @param {boolean} props.isLanding - Whether the button should be displayed in a landing page or not.
 * @returns {JSX.Element} - The Connect Wallet button.
 */
export default function ConnectWalletButton({
	isLanding = false,
	center = false,
}) {
	const { logout } = useAuth()
	const { displayAlert } = useNotifications()

	return true ? (
		<ConnectButton
			client={thirdwebClient}
			wallets={thirdwebWallets}
			chain={avalancheFuji} // explicit, in addition to ChainProvider default
			appMetadata={thirdwebAppMetadata}
			theme={darkTheme({
				colors: {},
			})}
			connectButton={{
				label: <StandIn center={center} />,
				className: c.connectButton,
			}}
			detailsButton={{
				className: c.detailsButton,
				displayBalanceToken: {
					[avalancheFuji.id]: BATTLE_TOKEN,
				},
			}}
			connectModal={{
				title: 'Sign in to Chainbois',
				titleIcon: 'https://chain-bois.vercel.app/img/CB.svg',
				size: 'compact',
			}}
			connectedAccountAvatarUrl={'https://chain-bois.vercel.app/img/CB.svg'}
			doLogout={async () => {
				await logout(false, [
					() =>
						displayAlert({
							title: 'Logged out',
							message: 'You have been successfully logged out.',
						}),
				])
			}}
		/>
	) : (
		<DetailsStandIn />
	)
}
