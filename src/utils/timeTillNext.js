/**
 * Returns an ISO timestamp for the next occurrence of the given day.
 *
 * @param {string} day - The day of the week to find the next occurrence of.
 * Must be one of "sun", "mon", "tue", "wed", "thu", "fri", or "sat".
 * @returns {string} An ISO timestamp string for the next requested day at 00:00 UTC.
 * @throws {Error} If the given day is invalid.
 */
export function timeTillNext(day) {
	const nextDay = (() => {
		switch (day.toLowerCase()) {
			case 'sun':
				return 0
			case 'mon':
				return 1
			case 'tue':
				return 2
			case 'wed':
				return 3
			case 'thu':
				return 4
			case 'fri':
				return 5
			case 'sat':
				return 6
			default:
				throw new Error('Invalid day: ' + day)
		}
	})()
	const now = new Date()

	// getUTCDay(): 0=Sunday, 1=Monday, …, 6=Saturday
	const utcDay = now.getUTCDay()

	// days until next requested day:
	// (nextDay - utcDay + 7) % 7 gives 0–6; if 0, that means "today",
	// but we want the *next* occurrence, so use 7.
	let daysUntil = (nextDay - utcDay + 7) % 7
	if (daysUntil === 0) daysUntil = 7

	// Build the UTC Date for next requested day at 00:00
	const year = now.getUTCFullYear()
	const month = now.getUTCMonth() // zero-based
	const date = now.getUTCDate() + daysUntil
	const nextDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0))

	// toISOString() yields "YYYY-MM-DDTHH:mm:ss.sssZ"
	return nextDate.toISOString()
}

// Example:
// console.log(timeTillNext('mon'))
// e.g. "2026-03-09T00:00:00.000Z"
