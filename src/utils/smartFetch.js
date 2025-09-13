/**
 * Performs a GET request with HEAD request validation
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (optional)
 * @param {boolean} skipHeadCheck - Skip HEAD request and go directly to GET (optional)
 * @returns {Promise<Object>} Response object with success flag
 */
export async function smartFetch(url, options = {}, skipHeadCheck = false) {
	try {
		// Step 1: HEAD request to check existence (unless skipped)
		if (!skipHeadCheck) {
			const headResponse = await fetch(url, {
				...options,
				method: 'HEAD',
			})

			if (!headResponse.ok) {
				// Resource doesn't exist or other error - return error format directly
				return {
					message: `HEAD request failed: ${headResponse.status} ${headResponse.statusText}`,
					status: headResponse.status,
					statusText: headResponse.statusText,
					url: url,
					name: 'HTTPError',
					success: false,
				}
			}
		}

		// Step 2: GET request (only if HEAD was successful or skipped)
		const getResponse = await fetch(url, {
			...options,
			method: 'GET',
		})

		if (!getResponse.ok) {
			// GET request failed - return error format directly
			return {
				message: `GET request failed: ${getResponse.status} ${getResponse.statusText}`,
				status: getResponse.status,
				statusText: getResponse.statusText,
				url: url,
				name: 'HTTPError',
				success: false,
			}
		}

		// Step 3: Parse response data
		const contentType = getResponse.headers.get('content-type')
		let data

		if (contentType && contentType.includes('application/json')) {
			data = await getResponse.json()
		} else if (contentType && contentType.includes('text/')) {
			data = await getResponse.text()
		} else {
			// For other content types, return as blob or handle as needed
			data = await getResponse.blob()
		}

		// Step 4: Return formatted response
		return {
			...data,
			success: Boolean(
				data && typeof data === 'object' && Object.keys(data).length > 0
			),
		}
	} catch (error) {
		// Step 5: Handle errors
		return {
			message: error.message,
			status: error.status || null,
			statusText: error.statusText || null,
			url: error.url || url,
			name: error.name,
			success: false,
		}
	}
}