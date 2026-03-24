import { getChainBoiImageCandidates, ipfsToGateway } from './ipfsAssetUrls'
import { request } from './request'

const normalizeCategory = (category) => String(category ?? '').trim().toLowerCase()
const normalizeAddress = (address) => String(address ?? '').trim()
const normalizeTokenId = (value) => {
	const tokenId = Number(value)
	return Number.isInteger(tokenId) && tokenId >= 0 ? tokenId : null
}
const asFiniteNumber = (value) => {
	const numericValue = Number(value)
	return Number.isFinite(numericValue) ? numericValue : null
}
const normalizeText = (value) => String(value ?? '').trim()

const toTitleCase = (value) =>
	normalizeText(value)
		.split(/[_\s-]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

const normalizeTraits = (traits = []) => {
	if (!Array.isArray(traits)) return []

	return traits
		.filter((trait) => trait && typeof trait === 'object')
		.map((trait) => ({
			...trait,
			trait_type: normalizeText(trait?.trait_type),
			value:
				typeof trait?.value === 'number'
					? trait.value
					: normalizeText(trait?.value),
		}))
}

const getTraitValue = (traits = [], traitType = '') => {
	const normalizedTraitType = normalizeText(traitType).toLowerCase()
	if (!normalizedTraitType || !Array.isArray(traits)) return null

	const matchedTrait = traits.find(
		(trait) =>
			normalizeText(trait?.trait_type).toLowerCase() === normalizedTraitType,
	)

	return matchedTrait?.value ?? null
}

export const normalizeChainBoiListing = (listing = {}, context = {}) => {
	if (!listing || typeof listing !== 'object' || Array.isArray(listing)) {
		return listing
	}

	const tokenId =
		normalizeTokenId(listing?.tokenId ?? listing?.nftTokenId) ??
		normalizeTokenId(context?.tokenId)
	const traits = normalizeTraits(listing?.traits)
	const badge = normalizeText(listing?.badge || getTraitValue(traits, 'Rank'))
	const imageCandidates = [
		...ipfsToGateway(listing?.imageUrl),
		...ipfsToGateway(listing?.imageUri),
		...(tokenId !== null ? getChainBoiImageCandidates(tokenId) : []),
	]
	const rawLevel =
		asFiniteNumber(listing?.level) ?? asFiniteNumber(getTraitValue(traits, 'Level'))

	return {
		...listing,
		...(tokenId !== null ? { tokenId, nftTokenId: tokenId } : {}),
		level: rawLevel ?? 0,
		badge,
		rank: badge ? toTitleCase(badge) : '',
		traits,
		imageUrl: imageCandidates[0] ?? null,
		imageCandidates,
		price:
			asFiniteNumber(listing?.price) ?? asFiniteNumber(context?.price) ?? null,
		currency: normalizeText(listing?.currency ?? context?.currency),
		available:
			typeof listing?.available === 'boolean'
				? listing.available
				: (context?.available ?? true),
		paymentAddress: normalizeAddress(
			listing?.paymentAddress ?? context?.paymentAddress,
		),
	}
}

export const normalizeChainBoiListingsPayload = (payload = {}) => {
	const price = asFiniteNumber(payload?.price)
	const currency = normalizeText(payload?.currency)
	const paymentAddress = normalizeAddress(payload?.paymentAddress)
	const normalizedNfts = Array.isArray(payload?.nfts)
		? payload.nfts
				.map((listing) =>
					normalizeChainBoiListing(listing, {
						price,
						currency,
						paymentAddress,
						available: true,
					}),
				)
				.filter(Boolean)
		: []

	return {
		...payload,
		nfts: normalizedNfts,
		price,
		currency,
		available:
			Math.max(
				0,
				Math.floor(asFiniteNumber(payload?.available) ?? normalizedNfts.length),
			) ?? 0,
		paymentAddress,
	}
}

export const normalizeArmoryBalance = (payload = {}) => ({
	address: normalizeAddress(payload?.address),
	pointsBalance: Math.max(
		0,
		Math.floor(asFiniteNumber(payload?.pointsBalance) ?? 0),
	),
	battleBalance: asFiniteNumber(payload?.battleBalance) ?? 0,
	battleBalanceRaw: normalizeText(
		payload?.battleBalanceRaw ?? payload?.battleBalance ?? '0',
	),
})

export const normalizePointsBalancePayload = (payload = {}) => ({
	address: normalizeAddress(payload?.address),
	pointsBalance: Math.max(
		0,
		Math.floor(asFiniteNumber(payload?.pointsBalance) ?? 0),
	),
	conversionRate: asFiniteNumber(payload?.conversionRate) ?? 1,
	maxConvertible: Math.max(
		0,
		Math.floor(
			asFiniteNumber(payload?.maxConvertible ?? payload?.pointsBalance) ?? 0,
		),
	),
})

export const normalizePointsHistoryPayload = (payload = {}) => ({
	...payload,
	history: Array.isArray(payload?.history)
		? payload.history
				.filter((entry) => entry && typeof entry === 'object')
				.map((entry) => ({
					...entry,
					type: normalizeText(entry?.type),
					amount: asFiniteNumber(entry?.amount) ?? 0,
					currency: normalizeText(entry?.currency),
					txHash: normalizeText(entry?.txHash),
					status: normalizeText(entry?.status),
					createdAt: normalizeText(entry?.createdAt),
				}))
		: [],
	total: Math.max(0, Math.floor(asFiniteNumber(payload?.total) ?? 0)),
	page: Math.max(1, Math.floor(asFiniteNumber(payload?.page) ?? 1)),
	totalPages: Math.max(1, Math.floor(asFiniteNumber(payload?.totalPages) ?? 1)),
})

export const fetchArmoryWeapons = async ({ category, cancelToken } = {}) => {
	const normalizedCategory = normalizeCategory(category)

	return await request({
		path: normalizedCategory
			? `armory/weapons/${normalizedCategory}`
			: 'armory/weapons',
		method: 'get',
		cancelToken,
	})
}

export const fetchArmoryWeapon = async ({ weaponId, cancelToken } = {}) => {
	const normalizedWeaponId = String(weaponId ?? '').trim()
	if (!normalizedWeaponId) {
		return { success: false, message: 'Weapon ID required' }
	}

	return await request({
		path: `armory/weapon/${normalizedWeaponId}`,
		method: 'get',
		cancelToken,
	})
}

export const fetchArmoryNfts = async ({ cancelToken } = {}) =>
	await request({
		path: 'armory/nfts',
		method: 'get',
		cancelToken,
	})

export const fetchArmoryNft = async ({ tokenId, cancelToken } = {}) => {
	const normalizedTokenId = normalizeTokenId(tokenId)
	if (normalizedTokenId === null) {
		return { success: false, message: 'Valid tokenId required' }
	}

	return await request({
		path: `armory/nft/${normalizedTokenId}`,
		method: 'get',
		cancelToken,
	})
}

export const fetchArmoryBalance = async ({ address, cancelToken } = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	return await request({
		path: `armory/balance/${walletAddress}`,
		method: 'get',
		cancelToken,
	})
}

export const purchaseArmoryWeapon = async ({
	address,
	weaponName,
	txHash,
	cancelToken,
} = {}) => {
	const walletAddress = normalizeAddress(address)
	const normalizedWeaponName = normalizeText(weaponName)
	const normalizedTxHash = normalizeText(txHash)

	if (!walletAddress || !normalizedWeaponName || !normalizedTxHash) {
		return {
			success: false,
			message: 'address, weaponName, and txHash are required',
		}
	}

	return await request({
		path: 'armory/purchase/weapon',
		method: 'post',
		body: {
			address: walletAddress,
			weaponName: normalizedWeaponName,
			txHash: normalizedTxHash,
		},
		cancelToken,
	})
}

export const purchaseArmoryNft = async ({
	address,
	txHash,
	tokenId,
	cancelToken,
} = {}) => {
	const walletAddress = normalizeAddress(address)
	const normalizedTxHash = normalizeText(txHash)
	const normalizedTokenId = normalizeTokenId(tokenId)

	if (!walletAddress || !normalizedTxHash) {
		return { success: false, message: 'address and txHash are required' }
	}

	return await request({
		path: 'armory/purchase/nft',
		method: 'post',
		body: {
			address: walletAddress,
			txHash: normalizedTxHash,
			...(normalizedTokenId !== null ? { tokenId: normalizedTokenId } : {}),
		},
		cancelToken,
	})
}

export const fetchPointsBalance = async ({ address, cancelToken } = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	return await request({
		path: `points/${walletAddress}`,
		method: 'get',
		cancelToken,
	})
}

export const convertPointsToBattle = async ({
	address,
	amount,
	cancelToken,
} = {}) => {
	const walletAddress = normalizeAddress(address)
	const normalizedAmount = Math.floor(asFiniteNumber(amount) ?? 0)

	if (!walletAddress) {
		return { success: false, message: 'Valid wallet address is required' }
	}

	if (normalizedAmount <= 0) {
		return { success: false, message: 'amount must be a positive integer' }
	}

	return await request({
		path: 'points/convert',
		method: 'post',
		body: {
			address: walletAddress,
			amount: normalizedAmount,
		},
		cancelToken,
	})
}

export const fetchPointsHistory = async ({
	address,
	page = 1,
	limit = 20,
	cancelToken,
} = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	const params = new URLSearchParams()
	const normalizedPage = Math.max(1, Math.floor(asFiniteNumber(page) ?? 1))
	const normalizedLimit = Math.min(
		100,
		Math.max(1, Math.floor(asFiniteNumber(limit) ?? 20)),
	)

	params.set('page', String(normalizedPage))
	params.set('limit', String(normalizedLimit))

	return await request({
		path: `points/history/${walletAddress}?${params.toString()}`,
		method: 'get',
		cancelToken,
	})
}
