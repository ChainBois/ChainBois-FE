export function formatAttributes(obj) {
	return Object.entries(obj)
		.map(([key, value]) => {
			const capitalizedKey = key
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')

			const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)

			return `${capitalizedKey} (${capitalizedValue})`
		})
		.join(', ')
}

// console.log(formatAttributes({}))