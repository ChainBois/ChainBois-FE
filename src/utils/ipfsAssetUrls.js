const IPFS_GATEWAYS = [
	'https://ipfs.io/ipfs',
	'https://gateway.pinata.cloud/ipfs',
	'https://gateway.ipfs.io/ipfs',
]

const CHAINBOIS_CID =
	'bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4'
const WEAPONS_CID =
	'bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe'

const normalizeWeaponFileName = (name = '') =>
	String(name)
		.trim()
		.replace(/\s/g, '-')
		.replace(/-9-/g, '9-')
		.replace(/&/g, '')

export const getChainBoiImageUrl = (tokenId) => {
	return getChainBoiImageCandidates(tokenId)[0] ?? null
}

export const getChainBoiImageCandidates = (tokenId) => {
	if (!Number.isInteger(tokenId) || tokenId < 0) return []

	return IPFS_GATEWAYS.map(
		(gateway) => `${gateway}/${CHAINBOIS_CID}/${tokenId}.png`,
	)
}

export const getWeaponImageCandidates = ({ tokenId, name }) => {
	const urls = []

	const normalizedName = normalizeWeaponFileName(name)
	if (normalizedName) {
		urls.push(
			...IPFS_GATEWAYS.map(
				(gateway) =>
					`${gateway}/${WEAPONS_CID}/${String(tokenId).padStart(2, '0')}-${normalizedName}.jpeg`,
			),
		)
	}

	return [...new Set(urls)]
}
