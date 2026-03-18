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
}) => {
	const stateRef = useRef({
		user,
		activeAddress,
		platformDataIsLoading,
	})

	const activityRef = useRef({
		isActive: true,
		intervalID: null,
		retryCount: 0,
		platformTimerID: null,
	})

	const retrievePlatformData = useCallback(
		async () => {
			if (!activityRef.current.isActive) return
			const {
				// roleIsAdmin,
				user,
				activeAddress,
			} = stateRef.current

			try {
				// if (roleIsAdmin) {
				// 	await Promise.all([ // Admin specific data retrievals
				// 		// getListingFees(roleIsAdmin),
				// 		// getUnclaimedShuffleFees(roleIsAdmin),
				// 	])
				// }

				if (
					user?.userID &&
					user?.address === activeAddress &&
					user?.accessToken
				) {
					// User specific data retrievals
					await Promise.all([
						// getRoyalties(activeAddress),
						// getUserAuctions(activeAddress),
						// getUserShuffles(activeAddress),
						// getUserUnclaimedCreatorFees(activeAddress),
					])
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
			// Data retrieval callbacks
			getPlatformSettings,
			setPlatformDataIsLoading,
			updateTriggerCounter,
		],
	)

	useEffect(() => {
		stateRef.current = {
			// roleIsAdmin,
			user,
			activeAddress,
			platformDataIsLoading,
		}
	}, [
		// roleIsAdmin,
		user,
		activeAddress,
		platformDataIsLoading,
	])

	useEffect(() => {
		activityRef.current.platformTimerID = setTimeout(() => {
			if (activityRef.current.isActive) {
				retrievePlatformData()
			}
		}, 500)

		return () => {
			clearTimeout(activityRef.current.platformTimerID)
		}
	}, [
		// roleIsAdmin,
		user,
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

	return { retrievePlatformData }
}
