export const shuffle = (array, returnAmount) => {
	// Handle edge cases
	if (!array || array.length === 0) return []

	// Create a copy to avoid mutating the original array
	const shuffled = [...array]

	// Fisher-Yates shuffle algorithm
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}

	// Determine the return size
	const size =
		returnAmount && returnAmount <= shuffled.length
			? returnAmount
			: shuffled.length

	// Return the specified amount
	return shuffled.slice(0, size)
}

// Test cases
// const runTests = () => {
// 	console.log('Running shuffle tests...\n')

// 	// Test 1: Basic shuffle
// 	const test1 = [1, 2, 3, 4, 5]
// 	console.log('Test 1 - Basic shuffle:')
// 	console.log('Original:', test1)
// 	console.log('Shuffled:', shuffle(test1))
// 	console.log('Original unchanged:', test1)

// 	// Test 2: Return specific amount
// 	console.log('\nTest 2 - Return 3 elements from 5:')
// 	const test2 = ['a', 'b', 'c', 'd', 'e']
// 	const result2 = shuffle(test2, 3)
// 	console.log('Original:', test2)
// 	console.log('Shuffled (3 elements):', result2)
// 	console.log('Length check:', result2.length === 3)

// 	// Test 3: Return amount greater than array length
// 	console.log('\nTest 3 - Return amount > array length:')
// 	const test3 = [10, 20, 30]
// 	const result3 = shuffle(test3, 10)
// 	console.log('Original:', test3)
// 	console.log('Shuffled (requested 10):', result3)
// 	console.log('Length check (should be 3):', result3.length === 3)

// 	// Test 4: Empty array
// 	console.log('\nTest 4 - Empty array:')
// 	console.log('Result:', shuffle([]))

// 	// Test 5: Single element
// 	console.log('\nTest 5 - Single element:')
// 	console.log('Result:', shuffle([42]))

// 	// Test 6: No return amount specified
// 	console.log('\nTest 6 - No return amount:')
// 	const test6 = ['x', 'y', 'z']
// 	const result6 = shuffle(test6)
// 	console.log('Original:', test6)
// 	console.log('Shuffled (full array):', result6)
// 	console.log('Length check:', result6.length === test6.length)

// 	// Test 7: Distribution test (verify randomness)
// 	console.log('\nTest 7 - Distribution test (1000 iterations):')
// 	const positions = { A: [0, 0, 0], B: [0, 0, 0], C: [0, 0, 0] }
// 	for (let i = 0; i < 1000; i++) {
// 		const result = shuffle(['A', 'B', 'C'])
// 		result.forEach((val, idx) => positions[val][idx]++)
// 	}
// 	console.log('Position frequencies (should be ~333 each):')
// 	Object.entries(positions).forEach(([key, counts]) => {
// 		console.log(`  ${key}: [${counts.join(', ')}]`)
// 	})

// 	// Test 8: Large array performance
// 	console.log('\nTest 8 - Performance with large array:')
// 	const largeArray = Array.from({ length: 10000 }, (_, i) => i)
// 	const start = performance.now()
// 	const largeResult = shuffle(largeArray, 100)
// 	const end = performance.now()
// 	console.log(
// 		`Shuffled 10000 elements, returned 100 in ${(end - start).toFixed(2)}ms`
// 	)
// 	console.log('First 10 elements:', largeResult.slice(0, 10))

// 	// Test 9: All elements are included (no duplicates, no missing)
// 	console.log('\nTest 9 - Integrity check:')
// 	const test9 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// 	const result9 = shuffle(test9)
// 	const sorted9 = [...result9].sort((a, b) => a - b)
// 	console.log('Original:', test9)
// 	console.log('Shuffled:', result9)
// 	console.log('Sorted shuffled:', sorted9)
// 	console.log(
// 		'Integrity check:',
// 		JSON.stringify(sorted9) === JSON.stringify(test9)
// 	)
// }

// // Run the tests
// runTests()
