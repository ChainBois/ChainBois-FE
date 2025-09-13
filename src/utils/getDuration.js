/**
 * Takes a given number of days and returns an easily readable time period
 * @param {number} days a given number of days
 * @returns {string} a time period
 */
export const getDuration = (days, capitalize = true) => {
	if (days < 1) return capitalize ? 'Less than a day' : `less than a day`
	const durations = [
		{ value: 1, symbol: capitalize ? 'Day' : 'day' },
		{ value: 7, symbol: capitalize ? 'Week' : 'week' },
		{ value: 30, symbol: capitalize ? 'Month' : 'month' },
		{ value: 356, symbol: capitalize ? 'Year' : 'year' },
	]
	const duration = durations.findLast((duration) => days >= duration.value)
	const period = Math.round(Number(days) / duration.value)
	const returningPeriod = `${period > 1 ? period : capitalize ? 'A' : 'a' } ${duration.symbol}${period > 1 ? 's' : ''}`
	return returningPeriod
}
