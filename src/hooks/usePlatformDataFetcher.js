'use client'

import { useCallback, useEffect, useRef } from 'react'

export const usePlatformDataFetcher = ({
	// roleIsAdmin,
	user,
	activeAddress,
	platformDataIsLoading,
	setPlatformDataIsLoading,
	updateTriggerCounter,
	getPlatformSettings,
	getUserInventoryData,
}) => {
	const stateRef = useRef({
		user,
		activeAddress,
		platformDataIsLoading,
		getPlatformSettings,
		getUserInventoryData,
		updateTriggerCounter,
	})

	const activityRef = useRef({
		isActive: true,
		intervalID: null,
		retryCount: 0,
		platformTimerID: null,
	})
	const pageRequestsRef = useRef(new Map())

	const retrievePlatformData = useCallback(
		async () => {
			if (!activityRef.current.isActive) return
			const {
				// roleIsAdmin,
				user,
				activeAddress,
				getPlatformSettings,
				getUserInventoryData,
				updateTriggerCounter,
			} = stateRef.current

			try {
				// if (roleIsAdmin) {
				// 	await Promise.all([ // Admin specific data retrievals
				// 		// getListingFees(roleIsAdmin),
				// 		// getUnclaimedShuffleFees(roleIsAdmin),
				// 	])
				// }

				if (activeAddress && typeof getUserInventoryData === 'function') {
					await getUserInventoryData({ address: activeAddress, user })
				}

				await Promise.all([
					getPlatformSettings(),
					// getPrimaryCollections(),
					// getListings({
					// 	traits: stateRef.current.globalTraits,
					// 	revalidate: true,
					// 	page: stateRef.current.sLPage,
					// 	roleIsAdmin: stateRef.current.roleIsAdmin,
					// }),
				])
				if (stateRef.current.platformDataIsLoading) {
					setPlatformDataIsLoading(() => false)
				}
				updateTriggerCounter()
				activityRef.current.retryCount = 0
			} catch (error) {
				console.error('Error fetching platform data:', error)
				if (activityRef.current.retryCount < 5) {
					activityRef.current.retryCount++
					const MAX_BACKOFF_TIME = 30000
					const backoffTime = Math.min(
						1000 * Math.pow(2, activityRef.current.retryCount),
						MAX_BACKOFF_TIME,
					)
					setTimeout(() => {
						if (activityRef.current.isActive) {
							retrievePlatformData()
						}
					}, backoffTime)
				}
			}
		},
		[
			setPlatformDataIsLoading,
		],
	)

	useEffect(() => {
		stateRef.current = {
			// roleIsAdmin,
			user,
			activeAddress,
			platformDataIsLoading,
			getPlatformSettings,
			getUserInventoryData,
			updateTriggerCounter,
		}
	}, [
		user,
		activeAddress,
		platformDataIsLoading,
		getPlatformSettings,
		getUserInventoryData,
		updateTriggerCounter,
	])

	useEffect(() => {
		const activityRefCurrent = activityRef.current

		activityRefCurrent.platformTimerID = setTimeout(() => {
			if (activityRefCurrent.isActive) {
				retrievePlatformData()
			}
		}, 500)

		return () => {
			clearTimeout(activityRefCurrent.platformTimerID)
		}
	}, [
		activeAddress,
		retrievePlatformData,
	])

	// useEffect(() => {
	// 	activityRef.current.listingsID = setTimeout(() => {
	// 		if (activityRef.current.isActive) {
	// 			getListings({
	// 				traits: stateRef.current.globalTraits,
	// 				revalidate: true,
	// 				page: stateRef.current.sLPage,
	// 				roleIsAdmin: stateRef.current.roleIsAdmin,
	// 			})
	// 		}
	// 	}, 500)

	// 	return () => {
	// 		clearTimeout(activityRef.current.listingsID)
	// 	}
	// }, [sLPage, globalTraits, roleIsAdmin])

	useEffect(() => {
		const activityRefCurrent = activityRef.current
		activityRefCurrent.isActive = true

		activityRefCurrent.intervalID = setInterval(() => {
			if (activityRefCurrent.isActive) {
				retrievePlatformData()
			}
		}, 30000)

		return () => {
			activityRefCurrent.isActive = false
			clearTimeout(activityRefCurrent.platformTimerID)
			clearInterval(activityRefCurrent.intervalID)
		}
	}, [retrievePlatformData])

	const retrievePageContent = useCallback(
		async ({
			key,
			fetcher,
			onSuccess,
			onError,
			onLoadingChange,
			retries = 1,
		} = {}) => {
			if (!key || typeof fetcher !== 'function') {
				return {
					success: false,
					message: 'key and fetcher are required',
				}
			}

			if (pageRequestsRef.current.has(key)) {
				return pageRequestsRef.current.get(key)
			}

			onLoadingChange?.(true)

			const executeRequest = async (attempt = 0) => {
				try {
					const res = await fetcher()

					if (res?.success) {
						onSuccess?.(res)
						return res
					}

					if (attempt < retries) {
						return executeRequest(attempt + 1)
					}

					onError?.(res)
					return res
				} catch (error) {
					if (attempt < retries) {
						return executeRequest(attempt + 1)
					}

					const failure = {
						success: false,
						error,
						message:
							error?.message || 'Unable to retrieve page content right now.',
					}
					onError?.(failure)
					return failure
				}
			}

			const requestPromise = executeRequest().finally(() => {
				pageRequestsRef.current.delete(key)
				onLoadingChange?.(false)
			})

			pageRequestsRef.current.set(key, requestPromise)
			return requestPromise
		},
		[],
	)

	return { retrievePlatformData, retrievePageContent }
}
