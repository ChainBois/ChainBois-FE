export async function asyncFilter(arr, predicate) {
	const results = await Promise.all(
		arr.map(async (item) => ({
			item,
			result: await predicate(item),
		}))
	)

	return results.filter(({ result }) => result).map(({ item }) => item)
}

// const array = [1, 2, 3, 4, 5]

// async function isEven(num) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => resolve(num % 2 === 0), 100)
// 	})
// }

// asyncFilter(array, isEven).then((filteredArray) => {
// })
