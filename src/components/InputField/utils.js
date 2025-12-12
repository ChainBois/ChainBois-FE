/**
 * InputField Utility Functions
 * @module InputField/utils
 */

// ============================================================================
// DATETIME UTILITIES
// ============================================================================

/**
 * Formats a Date object to datetime-local input format (YYYY-MM-DDTHH:MM)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted datetime string
 * @example
 * formatDatetimeLocal(new Date()) // "2024-01-15T14:30"
 */
export const formatDatetimeLocal = (date) => {
	const pad = (n) => String(n).padStart(2, '0')

	return [
		date.getFullYear(),
		'-',
		pad(date.getMonth() + 1),
		'-',
		pad(date.getDate()),
		'T',
		pad(date.getHours()),
		':',
		pad(date.getMinutes()),
	].join('')
}

/**
 * Calculates a future datetime based on offset configuration
 * @param {Object} config - Offset configuration
 * @param {number} [config.days=0] - Days to add
 * @param {number} [config.hours=0] - Hours to add
 * @param {number} [config.minutes=35] - Minutes to add (default 35 for business rules)
 * @returns {string} Formatted datetime-local string
 * @example
 * calculateDynamicMinimum({ hours: 2 }) // Current time + 2 hours
 * calculateDynamicMinimum({ days: 1, minutes: 0 }) // Tomorrow at current time
 */
export const calculateDynamicMinimum = (config = {}) => {
	const { days = 0, hours = 0, minutes = 35 } = config

	const offset =
		days * 86400000 + // days in ms
		hours * 3600000 + // hours in ms
		minutes * 60000 // minutes in ms

	return formatDatetimeLocal(new Date(Date.now() + offset))
}

/**
 * Resolves the minimum datetime value for datetime-local inputs
 * Supports both static strings and dynamic offset configurations
 * @param {string|Object|null} minProp - Static string or dynamic offset config
 * @returns {string|null} Calculated minimum datetime or null
 * @example
 * resolveMinimumDatetime("2024-01-15T10:00") // "2024-01-15T10:00"
 * resolveMinimumDatetime({ hours: 1 }) // Current time + 1 hour
 * resolveMinimumDatetime(null) // null
 */
export const resolveMinimumDatetime = (minProp) => {
	if (!minProp) return null

	if (typeof minProp === 'string') return minProp

	if (typeof minProp === 'object') {
		try {
			return calculateDynamicMinimum(minProp)
		} catch (error) {
			console.warn('Error calculating dynamic datetime minimum:', error)
			return calculateDynamicMinimum({ minutes: 35 })
		}
	}

	return null
}

// ============================================================================
// VALUE EXTRACTION UTILITIES
// ============================================================================

/**
 * Extracts a single input value from a request body object
 * Handles both plain values and objects with a 'value' property
 * @param {string} prop - Property name to extract
 * @param {Object} requestBody - Object containing form values
 * @returns {*} The extracted value
 * @example
 * getInputValue('name', { name: 'John' }) // "John"
 * getInputValue('country', { country: { label: 'USA', value: 'us' } }) // "us"
 */
export const getInputValue = (prop, requestBody) => {
	const element = requestBody[prop]

	return element?.hasOwnProperty?.('value') ? element.value : element
}

/**
 * Extracts all actual values from a request body object
 * Handles plain values, objects with 'value' property, and arrays of such objects
 * @param {Object} requestBody - Object containing form values
 * @returns {Object} Object with extracted values
 * @example
 * getActualInputValues({
 *   name: 'John',
 *   country: { label: 'USA', value: 'us' },
 *   tags: [{ label: 'Tag1', value: 't1' }, { label: 'Tag2', value: 't2' }]
 * })
 * // { name: 'John', country: 'us', tags: ['t1', 't2'] }
 */
export const getActualInputValues = (requestBody) => {
	const result = {}

	for (const [key, value] of Object.entries(requestBody)) {
		// Handle object with 'value' property
		if (value?.hasOwnProperty?.('value')) {
			result[key] = value.value
			continue
		}

		// Handle array of objects with 'value' property
		if (Array.isArray(value) && value[0]?.hasOwnProperty?.('value')) {
			result[key] = value.map((item) => item.value)
			continue
		}

		// Pass through plain values and regular arrays
		result[key] = value
	}

	return result
}

// ============================================================================
// FORM STATE UTILITIES
// ============================================================================

/**
 * Resolves the tag name, handling doppelganger fields
 * @param {string} tag - Original tag name
 * @param {boolean} doppel - Whether this is a doppelganger field
 * @returns {string} Resolved tag name
 */
export const resolveTagName = (tag, doppel) => {
	return doppel ? tag.split('-')?.[0] : tag
}

/**
 * Gets the current value from state, handling doppelganger fields
 * @param {Object} state - Current form state
 * @param {string} tag - Field tag name
 * @param {boolean} doppel - Whether this is a doppelganger field
 * @returns {*} Current field value
 */
export const getFieldValue = (state, tag, doppel) => {
	const resolvedTag = resolveTagName(tag, doppel)
	return state[resolvedTag]
}
