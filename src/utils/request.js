// import { PUBLIC_ENV } from '@/constants'
import axios from 'axios'
import { auth } from '@/config/firebase'

const serverURI = process.env.NEXT_PUBLIC_BACKEND_BASE_URI
const clientID = process.env.NEXT_PUBLIC_CLIENT_ID

const axiosCall = axios.create({
	baseURL: `${serverURI}/`,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	timeout: 180000,
})

axiosCall.interceptors.request.use(async (config) => {
	const user = auth.currentUser

	if (user) {
		const token = await user.getIdToken()
		const existingAuthHeader =
			config?.headers?.Authorization ?? config?.headers?.authorization
		if (!existingAuthHeader) {
			config.headers.Authorization = `Bearer ${token}`
		}
	}
	return config
})

axiosCall.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status
		const message =
			error.response?.data?.message ||
			error.response?.data?.error ||
			'Something went wrong'
		switch (status) {
			case 401:
				try {
					const user = auth.currentUser
					if (user) {
						await user.getIdToken(true) // force refresh
						const config = error.config
						config.headers.Authorization = `Bearer ${await user.getIdToken()}`
						return api(config) // retry original request
					}
				} catch {
					await auth.signOut()
					window.location.href = '/request-access'
				}
				break
			case 503:
				console.warn('Service unavailable:', message)
				break
		}
		return Promise.reject(error)
	},
)

/**
 * Makes an HTTP request using axios with configurable options
 * @param {Object} options - The request configuration options
 * @param {string} [options.path=''] - The URL path for the request
 * @param {string} [options.method='get'] - The HTTP method to use (get, post, put, delete, etc)
 * @param {string} [options.accessToken=''] - Bearer token for authorization
 * @param {Object} [options.body={}] - Request body payload
 * @param {string} [options.prop='data'] - Property name to store response data
 * @param {boolean} [options.includeClientID=false] - Whether to include client ID in headers
 * @param {Object} [options.cancelToken] - Axios cancel token for request cancellation
 * @returns {Promise<Object>} Response object containing:
 * - The response data under the specified property name
 * - success: boolean indicating if request was successful
 * - For errors: status code, headers and error message
 * - For cancellations: cancelled flag and message
 * @throws {Error} Forwards any unhandled errors from axios
 */
export const request = async ({
	path = '',
	method = 'get',
	accessToken = '',
	body = {},
	prop = 'data',
	includeClientID = false,
	cancelToken,
} = {}) => {
	// const accessToken = null
	const flags = {
		headers: {},
		cancelToken,
	}
	if (accessToken) flags.headers['Authorization'] = `Bearer ${accessToken}`
	if (includeClientID) flags.headers['x-client-id'] = clientID
	try {
		if (method === 'get' && !Object.keys(body).length) {
			const res = await axiosCall.get(path, flags)
			return { [prop]: res.data, success: res.data?.success ?? true }
		}
		if (method === 'delete') {
			const res = await axiosCall.delete(path, {
				data: body,
				headers: { ...flags.headers },
				cancelToken,
			})
			return { [prop]: res.data, success: res.data?.success ?? true }
		}
		const res = await axiosCall?.[method](path, body, { ...flags, cancelToken })
		return { [prop]: res.data, success: res.data?.success ?? true }
	} catch (err) {
		if (axios.isCancel(err)) {
			return {
				success: false,
				cancelled: true,
				message: 'Request was cancelled',
			}
		}

		if (err.response)
			return {
				...err.response.data,
				status: err.response.status,
				headers: { ...err.response.headers },
				success: false,
			}
		else {
			return { ...err, success: false }
		}
	}
}

export const requestUpload = async ({
	path = '',
	method = 'post',
	accessToken = '',
	file = {},
	prop = 'data',
	signal,
	onProgress,
	fieldName = 'image',
	debug = false, // Enable comprehensive logging
	maxSizeInMB = 10, // Maximum file size in MB
} = {}) => {
	// 🔍 MOBILE DEBUGGING: Log file object structure
	if (debug && process.env.NODE_ENV !== 'production') {
		console.group('🔍 MOBILE UPLOAD DEBUG')
		console.log('📱 User Agent:', navigator.userAgent)
		console.log('📄 File Object Details:', {
			name: file?.name,
			size: file?.size,
			type: file?.type,
			lastModified: file?.lastModified,
			constructor: file?.constructor?.name,
			instanceOfFile: file instanceof File,
			instanceOfBlob: file instanceof Blob,
		})

		// Check for mobile-specific properties
		console.log('🔧 Mobile-Specific Checks:', {
			hasArrayBuffer: typeof file?.arrayBuffer === 'function',
			hasStream: typeof file?.stream === 'function',
			hasText: typeof file?.text === 'function',
		})
		console.groupEnd()
	}

	const axiosConfig = {
		headers: {},
		signal,
	}

	if (accessToken) {
		axiosConfig.headers['Authorization'] = `Bearer ${accessToken}`
	}

	// 🚨 CRITICAL: Mobile browsers need explicit content handling
	axiosConfig.headers['Content-Type'] = 'multipart/form-data'

	if (onProgress && typeof onProgress === 'function') {
		axiosConfig.onUploadProgress = (progressEvent) => {
			const progress =
				progressEvent.total > 0
					? Math.round((progressEvent.loaded * 100) / progressEvent.total)
					: 0

			onProgress(
				progress,
				// {
				// 	loaded: progressEvent.loaded,
				// 	total: progressEvent.total,
				// 	progress,
				// 	lengthComputable: progressEvent.lengthComputable,
				// }
			)
		}
	}

	try {
		const formData = new FormData()

		// 🔧 MOBILE FIX: Enhanced file validation and normalization
		if (!file) {
			throw new Error('No file provided')
		}
		// Validate file is actually a File/Blob object
		if (!(file instanceof File) && !(file instanceof Blob)) {
			throw new Error(
				`Invalid file type: expected File or Blob, got ${typeof file}`,
			)
		}

		// Validate file size
		if (file.size > maxSizeInMB * 1024 * 1024) {
			throw new Error(`File size exceeds ${maxSizeInMB}MB limit`)
		}

		// Validate file type is an image
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'image/heic',
			'image/heif',
		]
		if (file.type && !allowedTypes.includes(file.type)) {
			throw new Error('File type not supported. Please upload an image file.')
		}

		// 🚨 MOBILE CRITICAL: Ensure MIME type is present
		let fileToUpload = file

		// Mobile Safari sometimes strips MIME types - restore them
		if (!file.type && file.name) {
			const extension = file.name.split('.').pop()?.toLowerCase()
			const mimeMap = {
				jpg: 'image/jpeg',
				jpeg: 'image/jpeg',
				png: 'image/png',
				gif: 'image/gif',
				webp: 'image/webp',
				heic: 'image/heic',
				heif: 'image/heif',
			}

			if (mimeMap[extension]) {
				// Create new File with proper MIME type
				fileToUpload = new File([file], file.name, {
					type: mimeMap[extension],
					lastModified: file.lastModified,
				})

				if (debug) {
					console.warn('📱 Mobile MIME Fix:', {
						original: file.type,
						corrected: fileToUpload.type,
						extension,
					})
				}
			}
		}

		// 🔧 MOBILE FIX: Ensure filename is present and valid
		let fileName = fileToUpload.name
		if (!fileName || fileName === 'blob') {
			// Mobile cameras sometimes don't provide names
			const timestamp = Date.now()
			const extension = fileToUpload.type.split('/')[1] || 'jpg'
			fileName = `mobile_upload_${timestamp}.${extension}`

			// Recreate File with proper name
			fileToUpload = new File([fileToUpload], fileName, {
				type: fileToUpload.type,
				lastModified: fileToUpload.lastModified,
			})

			if (debug) {
				console.warn('📱 Mobile Filename Fix:', {
					original: file.name,
					generated: fileName,
				})
			}
		}

		// 📤 Append to FormData with validated file
		formData.append(fieldName, fileToUpload)

		if (debug && process.env.NODE_ENV !== 'production') {
			console.log('📤 FormData Contents:', {
				fieldName,
				fileName: fileToUpload.name,
				fileSize: fileToUpload.size,
				fileType: fileToUpload.type,
			})

			// Log FormData entries (for debugging)
			for (let [key, value] of formData.entries()) {
				console.log(`FormData[${key}]:`, value)
			}
		}

		// 🌐 Execute upload with enhanced error context
		const response = await axiosCall?.[method](path, formData, axiosConfig)

		if (debug && process.env.NODE_ENV !== 'production') {
			console.log('✅ Upload Success:', {
				status: response.status,
				dataKeys: Object.keys(response.data || {}),
				hasImageUrl: !!response.data?.imageUrl,
			})
		}

		return {
			[prop]: response.data,
			success: true,
			status: response.status,
			headers: response.headers,
		}
	} catch (error) {
		// 📱 MOBILE-SPECIFIC ERROR HANDLING
		if (debug && process.env.NODE_ENV !== 'production') {
			console.group('❌ MOBILE UPLOAD ERROR')
			console.error('Error Details:', error)
			console.log('Request Config:', axiosConfig)
			console.log('File State:', {
				exists: !!file,
				type: typeof file,
				constructor: file?.constructor?.name,
			})
			console.groupEnd()
		}

		if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
			return {
				success: false,
				error: 'Upload cancelled',
				type: 'CANCELLATION',
			}
		}

		if (error.response) {
			// 🚨 Server responded - this is likely where "missing imageUrl" comes from
			const errorResponse = {
				...error.response.data,
				success: false,
				status: error.response.status,
				headers: { ...error.response.headers },
				type: 'SERVER_ERROR',
			}

			if (debug) {
				console.error('🚨 Server Error Response:', errorResponse)
			}

			return errorResponse
		}

		if (error.request) {
			return {
				success: false,
				error: 'Network error - no response received',
				type: 'NETWORK_ERROR',
			}
		}

		return {
			success: false,
			error: error.message || 'Upload failed',
			type: 'CLIENT_ERROR',
			originalError: debug ? error : undefined,
		}
	}
}

export const refreshRequest = async (accessToken, address) => {
	try {
		const flags = {
			headers: {},
		}
		flags.headers['Authorization'] = `Bearer ${accessToken}`
		flags.headers['x-client-id'] = clientID
		const res = await axiosCall.post(
			'marketplace-refresh',
			{
				address: address,
			},
			flags,
		)
		return { ...res.data, success: true }
	} catch (err) {
		if (axios.isCancel(err)) {
			return {
				success: false,
				cancelled: true,
				message: 'Request was cancelled',
			}
		}
		if (err.response)
			return {
				...err.response.data,
				status: err.response.status,
				headers: { ...err.response.headers },
				success: false,
			}
		else {
			return { ...err, success: false }
		}
	}
}
