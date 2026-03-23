import { avalanche, avalancheFuji } from 'thirdweb/chains'

const DEFAULT_TESTNET_BATTLE_TOKEN =
	'0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0'
const DEFAULT_TESTNET_PRIZE_POOL_ADDRESS =
	'0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e'

const normalizedNetwork = String(
	process.env.NEXT_PUBLIC_NETWORK ?? '',
).trim().toLowerCase()

const getConfiguredAddress = (value, fallback = '') => {
	const normalizedValue = String(value ?? '').trim()
	return normalizedValue || fallback
}

export const IS_MAINNET = normalizedNetwork === 'mainnet'
export const ACTIVE_CHAIN = IS_MAINNET ? avalanche : avalancheFuji
export const ACTIVE_CHAIN_NAME =
	ACTIVE_CHAIN?.name ?? (IS_MAINNET ? 'Avalanche Mainnet' : 'Avalanche Fuji')

export const BATTLE_TOKEN_ADDRESS = getConfiguredAddress(
	process.env.NEXT_PUBLIC_BATTLE_TOKEN,
	IS_MAINNET ? '' : DEFAULT_TESTNET_BATTLE_TOKEN,
)

export const PRIZE_POOL_ADDRESS = getConfiguredAddress(
	process.env.NEXT_PUBLIC_PRIZE_POOL_ADDRESS,
	IS_MAINNET ? '' : DEFAULT_TESTNET_PRIZE_POOL_ADDRESS,
)
