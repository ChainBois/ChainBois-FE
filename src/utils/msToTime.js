/**
 * Converts milliseconds to 3 different human readable values
 * @param {{duration: number, includeSeconds: boolean, includeDays: boolean}} params
 * @returns {[string, string, string, {days: (number | string), hours: (number | string), minutes: (number | string), seconds: (number | string), milliseconds: number}]} An array with 4 values, the first 3 being human
 * readable values, and the last being the value of each time duration.
 */
export function msToTime({
	duration,
	includeSeconds = true,
	includeDays = false,
}) {
	let milliseconds = Math.floor((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
		days = Math.floor(duration / (1000 * 60 * 60 * 24))

	days = days < 10 ? '0' + days : days
	hours = hours < 10 ? '0' + hours : hours
	minutes = minutes < 10 ? '0' + minutes : minutes
	seconds = seconds < 10 ? '0' + seconds : seconds

	return [
		`${includeDays ? `${days}:` : ''}${hours}:${minutes}${
			includeSeconds ? `:${seconds}.${milliseconds}` : ''
		}`,
		`${includeDays ? `${Number(days)}:` : ''}${Number(hours)}:${Number(
			minutes
		)}${includeSeconds ? `:${Number(seconds)}` : ''}`,
		`${
			includeDays && Number(days)
				? `${Number(days) === 1 ? 'a' : Number(days)} day${
						Number(days) > 1 || Number(days) === 0 ? 's' : ''
				  }${Number(hours) ? ', ' : ''}`
				: ''
		}${
			Number(hours)
				? `${Number(hours) === 1 ? 'an' : Number(hours)} hour${
						Number(hours) > 1 || Number(hours) === 0 ? 's' : ''
				  }${Number(minutes) ? ', ' : ''}`
				: ''
		}${
			Number(minutes)
				? `${Number(minutes) === 1 ? 'a' : Number(minutes)} minute${
						Number(minutes) > 1 || Number(minutes) === 0 ? 's' : ''
				  }${includeSeconds && Number(seconds) ? ', ' : ''}`
				: ''
		}${
			includeSeconds && Number(seconds)
				? `${Number(seconds) === 1 ? 'a' : Number(seconds)} second${
						Number(seconds) > 1 || Number(seconds) === 0 ? 's' : ''
				  }`
				: ''
		}` || 'a moment',
		{ days, hours, minutes, seconds, milliseconds },
	]
}
