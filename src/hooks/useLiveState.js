'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

/**
 * Performs a deep equality check between two values.
 *
 * @param {*} obj1 - The first value to compare.
 * @param {*} obj2 - The second value to compare.
 * @returns {boolean} Returns true if the values are deeply equal, otherwise false.
 */
export const isEqual = (obj1, obj2) => {
	if (obj1 === obj2) return true
	if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
	if (obj1 === null || obj2 === null) return false
	if (Array.isArray(obj1) !== Array.isArray(obj2)) return false

	const keys1 = Object.keys(obj1)
	const keys2 = Object.keys(obj2)

	if (keys1.length !== keys2.length) return false

	return keys1.every((key) => {
		if (!obj2.hasOwnProperty(key)) return false
		return isEqual(obj1[key], obj2[key])
	})
}

/**
 * A custom React hook that provides state management with live updates and reference tracking.
 *
 * @param {string} tag - The base name used to generate state accessor and mutator names.
 * @param {*} initialValue - The initial value of the state.
 *
 * @returns {Object} An object containing:
 * - [tag]: The current state value
 * - set[Tag]: setState function to directly update the state
 * - [tag]Ref: A proxy ref that can be used to track and update the state
 * - update[Tag]: An enhanced update function that handles object merging and equality checks
 *
 * @example
 * const { count, setCount, countRef, updateCount } = useLiveState('count', 0);
 * // For objects:
 * const { user, setUser, userRef, updateUser } = useLiveState('user', { name: 'John' });
 *
 * @description
 * This hook provides enhanced state management with:
 * - Deep equality checking to prevent unnecessary updates
 * - Automatic object merging for partial updates
 * - Reference tracking through a proxy ref
 * - Consistent state synchronization across updates
 */
export function useLiveState(tag, initialValue) {
	const [state, setState] = useState(initialValue)
	const stateRef = useRef(initialValue)
	const lastKnownRef = useRef(initialValue)

	/**
	 * A memoized proxy object that wraps a ref to provide controlled state updates.
	 *
	 * @type {Object}
	 * @property {Function} get current - Getter that returns the current state value from stateRef
	 * @property {Function} set current - Setter that updates the state only if the new value is different from the last known value
	 * @returns {Object} A proxy object with get/set handlers for the 'current' property
	 */
	const proxiedRef = useMemo(
		() => ({
			get current() {
				return stateRef.current
			},
			set current(value) {
				stateRef.current = value
				// Only trigger state update if the value actually changed
				if (!isEqual(value, lastKnownRef.current)) {
					lastKnownRef.current = value
					setState(value)
				}
			},
		}),
		[]
	)

	/**
	 * Memoized boolean value that determines if the initialValue is a non-null object.
	 * @type {boolean}
	 * @returns {boolean} True if initialValue is an object and not null, false otherwise.
	 */
	const isObject = useMemo(() => {
		return typeof initialValue === 'object' && initialValue !== null
	}, [initialValue])

	/**
	 * Memoized boolean indicating whether the initialValue is an array
	 * @type {boolean}
	 */
	const isArray = useMemo(() => {
		return Array.isArray(initialValue)
	}, [initialValue])

	/**
	 * Updates the state while maintaining referential integrity and performing deep equality checks.
	 * @param {*|Function} newState - The new state value or a function that receives the current state and returns the new state.
	 * @returns {void}
	 *
	 * @example
	 * // Update with a value
	 * updateState(newValue);
	 *
	 * @example
	 * // Update with a function
	 * updateState(prevState => ({ ...prevState, newProperty: value }));
	 */
	const updateState = useCallback(
		(newState) => {
			const nextState =
				typeof newState === 'function' ? newState(stateRef.current) : newState

			// If the new state is exactly the same reference, do nothing
			if (nextState === stateRef.current) return

			// For deep equality checking
			if (isObject && isEqual(nextState, stateRef.current)) return

			const resolvedState =
				isObject && !isArray ? { ...stateRef.current, ...nextState } : nextState

			setState(resolvedState)
			stateRef.current = resolvedState
		},
		[isObject, isArray]
	)

	useEffect(() => {
		stateRef.current = state
	}, [state])

	// Memoize the return object to maintain reference stability
	return useMemo(
		() => ({
			[tag]: state,
			[`set${tag.charAt(0).toUpperCase() + tag.slice(1)}`]: setState,
			[`${tag}Ref`]: proxiedRef,
			[`update${tag.charAt(0).toUpperCase() + tag.slice(1)}`]: updateState,
		}),
		[tag, state, setState, updateState, proxiedRef]
	)
}
