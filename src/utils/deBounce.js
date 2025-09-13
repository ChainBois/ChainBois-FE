export function deBounce(func, delay) {
	let timeoutID
	return function (...args) {
		if (timeoutID) {
			clearTimeout(timeoutID)
		}
		timeoutID = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}
