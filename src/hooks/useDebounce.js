'use client'

import { useEffect, useState, useRef } from 'react'

export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	const debounceTimer = useRef(null)

	useEffect(() => {
		debounceTimer.current = setTimeout(() => {
			setDebouncedValue((_) => value)
		}, delay)
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current)
				debounceTimer.current = null
			}
		}
	}, [value])

	return debouncedValue
}
