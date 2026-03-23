import { request } from './request'

const normalizeAddress = (address) => String(address ?? '').trim()

export const fetchInventory = async ({ address, cancelToken } = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	return await request({
		path: `inventory/${walletAddress}`,
		method: 'get',
		cancelToken,
	})
}

export const fetchInventoryNfts = async ({ address, cancelToken } = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	return await request({
		path: `inventory/${walletAddress}/nfts`,
		method: 'get',
		cancelToken,
	})
}

export const fetchInventoryWeapons = async ({ address, cancelToken } = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	return await request({
		path: `inventory/${walletAddress}/weapons`,
		method: 'get',
		cancelToken,
	})
}

export const fetchInventoryHistory = async ({
	address,
	page = 1,
	limit = 20,
	type,
	cancelToken,
} = {}) => {
	const walletAddress = normalizeAddress(address)
	if (!walletAddress) {
		return { success: false, message: 'Wallet address required' }
	}

	const params = new URLSearchParams()
	const normalizedPage = Number(page)
	const normalizedLimit = Number(limit)

	if (Number.isFinite(normalizedPage) && normalizedPage > 0) {
		params.set('page', String(Math.floor(normalizedPage)))
	}
	if (Number.isFinite(normalizedLimit) && normalizedLimit > 0) {
		params.set('limit', String(Math.min(100, Math.floor(normalizedLimit))))
	}
	if (type) {
		const cleanedType = String(type).trim()
		if (cleanedType) params.set('type', cleanedType)
	}

	const query = params.toString()

	return await request({
		path: `inventory/${walletAddress}/history${query ? `?${query}` : ''}`,
		method: 'get',
		cancelToken,
	})
}

