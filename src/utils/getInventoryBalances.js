const EMPTY_BALANCES = {}

const asFiniteNumber = (value) => {
	const numericValue = Number(value)
	return Number.isFinite(numericValue) ? numericValue : null
}

const mergeBalanceSource = (accumulator, source = {}) => {
	if (!source || typeof source !== 'object') return accumulator

	const nextBalances = { ...accumulator }
	const pointsValue = asFiniteNumber(
		source?.points ?? source?.pointsBalance ?? source?.pointBalance,
	)
	const battleValue = asFiniteNumber(
		source?.battle ?? source?.battleBalance ?? source?.battleTokenBalance,
	)
	const battleRawValue =
		source?.battleRaw ??
		source?.battleBalanceRaw ??
		source?.battleTokenBalanceRaw ??
		null

	if (pointsValue !== null) nextBalances.points = Math.max(0, Math.floor(pointsValue))
	if (battleValue !== null) nextBalances.battle = battleValue
	if (battleRawValue !== null && battleRawValue !== undefined) {
		nextBalances.battleRaw = String(battleRawValue).trim()
	}

	return nextBalances
}

export const getInventoryBalances = (user = {}) => {
	const mergedBalances = [
		user?.inventory?.balances,
		user?.inventoryBalances,
		user?.pointsInfo,
		user?.armoryBalance,
	].reduce(mergeBalanceSource, EMPTY_BALANCES)

	return Object.keys(mergedBalances).length ? mergedBalances : EMPTY_BALANCES
}
