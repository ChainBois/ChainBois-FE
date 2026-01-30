export const BACKEND_BASE_URI = process.env.NEXT_PUBLIC_BACKEND_BASE_URI
export const COLLECTION_RE = /^\/[a-f0-9]{24}$/
export const ENV = process.env.NEXT_PUBLIC_ENV
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS
export const TEMP_WALLET = process.env.NEXT_PUBLIC_TEMP_WALLET
export const DEFAULT_SIZE = process.env.NEXT_PUBLIC_DEFAULT_SIZE
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL
export const PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV
export const MOBILE_QUERY = '(max-width: 480px)'
export const TABLET_QUERY = '(max-width: 834px), (min-width: 600px) and (max-width: 960px) and (orientation: landscape)'
export const PERA_FETCH_PROPERTIES_COLLECTIBLE = {
	asset_id: 1173059803,
	name: 'Gunny Hero: Hazel',
	unit_name: 'GH1GH',
	fraction_decimals: 0,
	total_supply: 2500,
	is_deleted: false,
	creator_address: '5JZDT5RXVRZDMZFOTHJYOR77FV6VXXOB23YAIGTF6PLTUNPVWL4ZWMKWNI',
	url: 'ipfs://QmV5QAyDHzUFfLmFK6HN6wH2ViZoJKVy9i7PBBnXocsBFe',
	logo: null,
	verification_tier: 'unverified',
	usd_value: null,
	is_collectible: true,
	verification_details: null,
	collectible: {
		title: 'Gunny Hero: Hazel',
		description: 'Hazel',
		standards: ['arc69'],
		thumbnail_url:
			'https://mainnet.api.perawallet.app/v1/ipfs-thumbnails/QmV5QAyDHzUFfLmFK6HN6wH2ViZoJKVy9i7PBBnXocsBFe',
		thumbnail_ipfs_cid: 'QmV5QAyDHzUFfLmFK6HN6wH2ViZoJKVy9i7PBBnXocsBFe',
		media: [
			{
				type: 'image',
				url: 'https://ipfs.algonode.xyz/ipfs/QmV5QAyDHzUFfLmFK6HN6wH2ViZoJKVy9i7PBBnXocsBFe',
				ipfs_cid: 'QmV5QAyDHzUFfLmFK6HN6wH2ViZoJKVy9i7PBBnXocsBFe',
				extension: '.png',
			},
		],
		metadata: {
			name: 'Gunny Hero: Hazel',
			standard: 'arc69',
			unitName: 'GH1GH',
			mime_type: 'image/png',
			properties: {
				Name: 'Hazel',
				Element: 'Earth',
				Faction: 'Othila',
				Generation: '1',
			},
			description: 'Hazel',
			external_url: 'https://www.gunnygames.com/',
		},
		traits: [
			{
				display_name: 'Name',
				display_value: 'Hazel',
			},
			{
				display_name: 'Element',
				display_value: 'Earth',
			},
			{
				display_name: 'Faction',
				display_value: 'Othila',
			},
			{
				display_name: 'Generation',
				display_value: '1',
			},
		],
	},
}
export const PERA_FETCH_PROPERTIES_TOKEN = {
	asset_id: 1306013327,
	name: 'SealsToken 🦭',
	unit_name: 'SEALS',
	fraction_decimals: 4,
	total_supply: 4204204204200000,
	is_deleted: false,
	creator_address: 'N2VVXWYHTULC3RCD2XBGNO2ZKHBHZ6HZVJH2GORVVFNZCJPHYHFPLRHUSU',
	url: 'https://www.sealstoken.com',
	logo: 'https://algorand-wallet-mainnet.b-cdn.net/media/asset_verification_requests_logo_png/2023/12/31/b678397e56924804b6d041f1ebfc712b.png',
	verification_tier: 'verified',
	usd_value: '0.000000066990',
	is_collectible: false,
	verification_details: {
		project_name: 'SealsToken 🦭',
		project_url: 'https://www.sealstoken.com',
		project_description: 'Just a seal swimming through the Algorand ecosystem.',
		discord_url: '',
		telegram_url: '',
		twitter_username: 'SealsToken',
	},
	collectible: null,
}
