/**
 * Converts between local time and UTC while retaining semantic time.
 *
 * @param {string|Date} datetime - The datetime to convert.
 * Should be a local datetime string or a Date object.
 * @param {string} direction - "localToUTC" or "UTCToLocal".
 *
 * @returns {string} An ISO timestamp.
 */
function convertTime(datetime, direction = 'localToUTC') {
	// Normalize to Date object
	const date = datetime instanceof Date ? datetime : new Date(datetime)

	if (direction === 'localToUTC') {
		// Adjust by removing the local offset
		return new Date(
			date.getTime() - date.getTimezoneOffset() * 60 * 1000
		).toISOString()
	} else if (direction === 'UTCToLocal') {
		// Adjust by adding the local offset
		return new Date(
			date.getTime() + date.getTimezoneOffset() * 60 * 1000
		).toISOString()
	} else {
		throw new Error("Unknown direction. Use 'localToUTC' or 'UTCToLocal'.")
	}
}

export { convertTime }
