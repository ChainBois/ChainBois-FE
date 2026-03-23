const EMPTY_BALANCES = {}

export const getInventoryBalances = (user = {}) => {
	if (user?.inventoryBalances && typeof user.inventoryBalances === 'object') {
		return user.inventoryBalances
	}

	if (user?.inventory?.balances && typeof user.inventory.balances === 'object') {
		return user.inventory.balances
	}

	return EMPTY_BALANCES
}
