import { request } from './request'

const normalizeCategory = (category) => String(category ?? '').trim().toLowerCase()

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
