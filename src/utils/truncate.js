export function truncate(text, displayLength) {
	if (!text) return text
	const minLength = displayLength * 2 + 3
	if (text.length <= minLength) {
		return text
	}

	if (text.length === minLength + 1) {
		const start = text.slice(0, displayLength)
		const end = text.slice(-displayLength + 1)
		return `${start}...${end}`
	}

	const start = text.slice(0, displayLength)
	const end = text.slice(-displayLength)
	return `${start}...${end}`
}
