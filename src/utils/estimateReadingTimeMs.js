
/**
 * Estimate the reading time of a block of HTML text.
 *
 * @param {string} input The HTML string to analyze
 * @param {object} [opts={}] Options
 * @param {number} [opts.wordsPerMinute=200] The number of words a user can read per minute
 * @param {boolean} [opts.includeImages=true] Whether to estimate time for images
 * @param {number[]} [opts.imagePenalties=[12, 11, 10, 9, 8, 7, 6, 5, 4, 3]] An array of seconds to add for each image (starting at 1st, 2nd, ...). If array is too short, the last element is used for the rest.
 * @param {boolean} [opts.includeHeadings=false] Whether to estimate time for headings
 * @param {number} [opts.headingPenaltySec=1] The number of seconds to add for each heading
 * @returns {object} An object with the following properties:
 *   - `wordCount`: The number of words in the text
 *   - `imageCount`: The number of images in the text
 *   - `headingCount`: The number of headings in the text
 *   - `baseMs`: The estimated reading time without images or headings (in milliseconds)
 *   - `imageMs`: The estimated time for images (in milliseconds)
 *   - `headingMs`: The estimated time for headings (in milliseconds)
 *   - `totalMs`: The estimated total reading time (in milliseconds)
 */
export function estimateReadingTimeMs(input, opts = {}) {
	const {
		wordsPerMinute = 200,
		includeImages = true,
		imagePenalties = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3],
		includeHeadings = false,
		headingPenaltySec = 1,
	} = opts

	// 1) Strip HTML and count words
	let textOnly
	try {
		// If browser or DOMParser available:
		const doc = new DOMParser().parseFromString(input, 'text/html')
		// Remove scripts/styles
		doc.querySelectorAll('script,style').forEach((el) => el.remove())
		textOnly = doc.body.textContent || ''
	} catch {
		// Fallback: naive tag stripper
		textOnly = input.replace(/<\/?[^>]+(>|$)/g, ' ')
	}
	const words = textOnly
		.trim()
		.split(/\s+/)
		.filter((w) => w.length)
	const wordCount = words.length

	// 2) Base reading time
	const msPerWord = 60000 / wordsPerMinute
	const baseMs = Math.round(wordCount * msPerWord)

	// 3) Image penalties
	let imageMs = 0,
		imageCount = 0
	if (includeImages) {
		// count <img> tags via DOM if possible
		let imgs = 0
		try {
			const doc = new DOMParser().parseFromString(input, 'text/html')
			imgs = doc.querySelectorAll('img').length
		} catch {
			// simple regex fallback
			imgs = (input.match(/<img\b[^>]*>/gi) || []).length
		}
		imageCount = imgs
		for (let i = 0; i < imgs; i++) {
			// penalty in seconds: either from array or last element
			const sec = imagePenalties[i] ?? imagePenalties[imagePenalties.length - 1]
			imageMs += sec * 1000
		}
	}

	// 4) Heading penalties
	let headingMs = 0,
		headingCount = 0
	if (includeHeadings) {
		let heads = 0
		try {
			const doc = new DOMParser().parseFromString(input, 'text/html')
			heads = doc.querySelectorAll('h1,h2,h3,h4,h5,h6').length
		} catch {
			// regex fallback: counts opening tags h1–h6
			heads = (input.match(/<h[1-6]\b/gi) || []).length
		}
		headingCount = heads
		headingMs = heads * headingPenaltySec * 1000
	}

	const totalMs = baseMs + imageMs + headingMs

	return {
		wordCount,
		imageCount,
		headingCount,
		baseMs,
		imageMs,
		headingMs,
		totalMs,
	}
}
