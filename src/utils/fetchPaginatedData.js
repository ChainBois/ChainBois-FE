import { DEFAULT_SIZE } from '@/constants'
import { request } from './request'
import { validateAndMergeWithOld } from './arrayUtils'

function buildQueryString(params) {
	const searchParams = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			value.forEach((item) => searchParams.append(key, item))
		} else {
			searchParams.append(key, value)
		}
	})

	return searchParams.toString()
}

/**
 * A dynamic function that fetches paginated data with configurable endpoints and parameters
 * @async
 * @function fetchPaginatedData
 * @param {Object} config - Configuration object
 * @param {string} config.endpoint - The API endpoint to use
 * @param {Object} [config.queryParams={}] - Dynamic query parameters
 * @param {string|string[]} config.dataPath - Path(s) to extract data from response (e.g., 'results', ['secondarySales', 'data'])
 * @param {Function} [config.stateSetter] - Function to set the data in state
 * @param {Function} [config.pageStateSetter] - Function to set the page in state
 * @param {string} [config.mergeKey='_id'] - Key to use for merging data
 * @param {number|null} [config.page=null] - Page number for pagination
 * @param {boolean} [config.isCheck=false] - Whether this is a check operation that shouldn't update state
 * @param {boolean} [config.revalidate=false] - Whether to force data revalidation
 * @param {Object} [config.cancelToken] - Cancellation token for the request
 * @param {Object} [config.sizeOverride] - Size value to override DEFAULT_SIZE with
 * @returns {Promise<{data: Array, hasMore: boolean}>} An object containing:
 *   - data: Array of fetched data sorted by creation date in descending order
 *   - hasMore: Boolean indicating if there are more items to load
 */
export async function fetchPaginatedData({
	endpoint,
	queryParams = {},
	dataPath,
	stateSetter,
	pageStateSetter,
	mergeKey = '_id',
	page = null,
	isCheck = false,
	revalidate = false,
	cancelToken,
	sizeOverride = null
}) {
	// Build query string from dynamic parameters
	const queryString = buildQueryString({...queryParams, limit: sizeOverride ?? DEFAULT_SIZE})
	const baseUrl = `${endpoint}?${queryString}${queryString ? '&' : ''}`

	/**
	 * Helper function to extract data from response using the specified path
	 * @param {Object} responseData - The response data object
	 * @param {string|string[]} path - The path or array of possible paths to extract data
	 * @returns {Array} The extracted data array
	 */
	function extractData(responseData, path) {
		if (Array.isArray(path)) {
			// Try each path until one returns data
			for (const p of path) {
				const data = responseData?.[p]
				if (data?.length) return data
			}
			return responseData?.[path[0]] || []
		}
		return responseData?.[path] || []
	}

	/**
	 * Generator function that asynchronously fetches all data page by page
	 * @param {boolean} [revalidate=false] - Flag to determine if existing pages should be revalidated
	 * @yields {Object} Response data object containing information
	 * @returns {AsyncGenerator<Object>} Returns an async generator that yields response data
	 */
	async function* getAllData(revalidate = false) {
		let initPage = 1
		let lastValidPage = 1
		let foundData = false

		while (revalidate ? initPage <= page : true) {
			const res = await request({
				path: `${baseUrl}page=${initPage}`,
				cancelToken,
			})

			if (!res?.success || !extractData(res?.data, dataPath)?.length) {
				break // Stop when no more data
			}

			lastValidPage = initPage
			foundData = true
			yield res?.data
			initPage++
		}
	}

	/**
	 * Retrieves all data with pagination support
	 * @param {number|null} page - The page number for pagination (null for all pages)
	 * @param {boolean} revalidate - Whether to revalidate the data cache
	 * @returns {Promise<{data: Array, hasMore: boolean}>} Object containing data and hasMore flag
	 */
	async function getAll(page = null, revalidate = false) {
		const data = []
		let hasMore = false

		for await (const responseData of getAllData(revalidate)) {
			const { total = 0 } = responseData ?? {}
			const itemData = extractData(responseData, dataPath)

			data.push(...(itemData ?? []))
			const currentPage = data?.length
				? Math.ceil(data?.length / DEFAULT_SIZE)
				: 1
			hasMore = (currentPage - 1) * DEFAULT_SIZE + itemData?.length < total
		}

		return { data, hasMore }
	}

	/**
	 * Processes a request to fetch and handle data.
	 * @async
	 * @function processRequest
	 * @returns {Promise<{hasMore: boolean, data: Array}>} An object containing hasMore flag and data array
	 */
	async function processRequest() {
		let data = []

		if (revalidate) {
			const { data: tempData, hasMore } = await getAll(page, revalidate)
			data = tempData.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			)

			if (pageStateSetter) {
				pageStateSetter(() =>
					data?.length ? Math.ceil(data?.length / DEFAULT_SIZE) : 1
				)
			}
			if (stateSetter) {
				stateSetter(() => data)
			}

			return { hasMore, data }
		}

		const res = await request({
			path: `${baseUrl}page=${page}`,
			cancelToken,
		})

		if (res.success) {
			const responseData = res?.data ?? {}
			const itemData = extractData(responseData, dataPath)
			const { total = 0 } = responseData

			if (!itemData?.length && total > 0) {
				if (!isCheck) {
					const { data: tempData, hasMore } = await getAll(page, true)
					data = tempData.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					)

					if (pageStateSetter) {
						pageStateSetter(() =>
							data?.length ? Math.ceil(data?.length / DEFAULT_SIZE) : 1
						)
					}
					if (stateSetter) {
						stateSetter(() => data)
					}

					return { hasMore, data }
				} else {
					const hasMore = (page - 1) * DEFAULT_SIZE + itemData?.length < total
					return {
						hasMore,
						data: itemData.sort(
							(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
						),
					}
				}
			} else {
				const hasMore = (page - 1) * DEFAULT_SIZE + itemData?.length < total
				data = itemData.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				)

				if (!isCheck) {
					if (pageStateSetter) {
						pageStateSetter(() => page)
					}
					if (stateSetter) {
						stateSetter((prev) =>
							validateAndMergeWithOld(prev, data, mergeKey).sort(
								(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
							)
						)
					}
				}

				return { hasMore, data }
			}
		} else {
			data = []
			return { hasMore: false, data, cancelled: res.cancelled }
		}
	}

	return await processRequest()
}
