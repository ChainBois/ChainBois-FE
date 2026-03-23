const IPFS_GATEWAYS = [
	'https://ipfs.io/ipfs',
	'https://gateway.pinata.cloud/ipfs',
	'https://gateway.ipfs.io/ipfs',
]

const CHAINBOIS_CID =
	'bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4'
const WEAPONS_CID =
	'bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe'
const WEAPON_FILE_MAP = {
	'AM-18': '01',
	'AR-M4-MK18': '02',
	'SPAS-12': '03',
	'HK-MP5': '04',
	'Barrett-M82': '05',
	'Sawed-Off-Shotgun': '06',
	'M32A1-MSGL': '07',
	'M9-Bayonet': '08',
	'Stoner-96': '09',
	AK74M: '10',
	'SRS99G-S6-AM': '11',
	'Colt-M1911': '12',
	'UMP-45': '13',
}

const asNonEmptyString = (value) => {
	const normalizedValue = String(value ?? '').trim()
	return normalizedValue || ''
}

const getPreferredGateways = (urls = []) => {
	const preferred = []

	for (const url of urls) {
		const matchedGateway = IPFS_GATEWAYS.find((gateway) =>
			String(url).startsWith(`${gateway}/`),
		)

		if (matchedGateway && !preferred.includes(matchedGateway)) {
			preferred.push(matchedGateway)
		}
	}

	return [...preferred, ...IPFS_GATEWAYS.filter((gateway) => !preferred.includes(gateway))]
}

const normalizeWeaponFileName = (name = '') =>
	String(name)
		.trim()
		.replace(/\s/g, '-')
		.replace(/&/g, '')
		.replace(/M-9-/g, 'M9-')

export const ipfsToGateway = (ipfsUri) => {
	if (!ipfsUri) return []

	const uri = String(ipfsUri).trim()
	if (!uri) return []

	if (uri.startsWith('ipfs://')) {
		const path = uri.replace('ipfs://', '')
		if (!path) return []
		return IPFS_GATEWAYS.map((gateway) => `${gateway}/${path}`)
	}

	if (uri.startsWith('http://') || uri.startsWith('https://')) return [uri]

	return []
}

export const getChainBoiImageUrl = (tokenId) => {
	return getChainBoiImageCandidates(tokenId)[0] ?? null
}

export const getChainBoiImageCandidates = (tokenId) => {
	if (!Number.isInteger(tokenId) || tokenId < 0) return []

	return IPFS_GATEWAYS.map(
		(gateway) => `${gateway}/${CHAINBOIS_CID}/${tokenId}.png`,
	)
}

export const getWeaponImageCandidates = ({ name, imageUrl, imageUri } = {}) => {
	const normalizedName = normalizeWeaponFileName(name)
	const fileNumber = WEAPON_FILE_MAP[normalizedName]

	const providedUrls = [...ipfsToGateway(imageUrl), ...ipfsToGateway(imageUri)]
	const urls = []

	if (normalizedName && fileNumber) {
		const gateways = getPreferredGateways(providedUrls)
		urls.push(
			...gateways.map(
				(gateway) =>
					`${gateway}/${WEAPONS_CID}/${fileNumber}-${normalizedName}.jpeg`,
			),
		)
	}

	urls.push(...providedUrls)

	return [...new Set(urls)]
}

export const normalizeWeaponAsset = (weapon = {}) => {
	if (!weapon || typeof weapon !== 'object' || Array.isArray(weapon))
		return weapon

	const name = asNonEmptyString(weapon?.name || weapon?.weaponName)
	const imageCandidates = [
		...getWeaponImageCandidates({
			name,
			imageUrl: weapon?.imageUrl,
			imageUri: weapon?.imageUri,
		}),
	]

	return {
		...weapon,
		...(name
			? {
					name,
					weaponName: asNonEmptyString(weapon?.weaponName) || name,
				}
			: {}),
		...(imageCandidates[0] ? { imageUrl: imageCandidates[0] } : {}),
	}
}

export const normalizeWeaponAssets = (weapons = []) => {
	if (!Array.isArray(weapons)) return []
	return weapons
		.filter((weapon) => weapon && typeof weapon === 'object')
		.map((weapon) => normalizeWeaponAsset(weapon))
}
