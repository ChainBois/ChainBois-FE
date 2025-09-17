'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { deBounce } from '@/utils'
import axios from 'axios'

/**
 * Dynamic hook for managing paginated data with infinite scrolling and real-time updates
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchFunction - The fetch function to use (should return {data, hasMore, cancelled})
 * @param {Object} [config.queryParams={}] - Dynamic query parameters for the fetch function
 * @param {string} [config.dataKey='data'] - Key name for the data array in response (e.g., 'results', 'listings')
 * @param {number} [config.currentPage=1] - Current page number
 * @param {boolean} [config.roleIsAdmin=false] - Whether user has admin role
 * @param {number} [config.checkInterval=10000] - Interval for checking new data (ms)
 * @param {number} [config.intersectionThreshold=1.0] - Threshold for intersection observer
 * @param {number} [config.debounceMs=500] - Debounce delay for fetch calls
 * @returns {Object} Hook state and methods
 */
export const usePaginatedDataManager = ({
    fetchFunction,
    queryParams = {},
    dataKey = 'data',
    currentPage = 1,
    roleIsAdmin = false,
    checkInterval = 10000,
    intersectionThreshold = 1.0,
    debounceMs = 500,
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isCheckingForNewData, setIsCheckingForNewData] = useState(false)

    const stateRef = useRef({
        isLoading,
        hasMore,
        isCheckingForNewData,
        currentPage,
        queryParams,
        roleIsAdmin,
    })
    const loadMoreTriggerRef = useRef(null)
    const checkTimerRef = useRef(null)
    const cancelTokenSourceRef = useRef(null)

    // Update state ref whenever dependencies change
    useEffect(() => {
        stateRef.current = {
            isLoading,
            hasMore,
            isCheckingForNewData,
            currentPage,
            queryParams,
            roleIsAdmin,
        }
    }, [isLoading, hasMore, isCheckingForNewData, currentPage, queryParams, roleIsAdmin])

    /**
     * Fetch data with configurable parameters
     * @param {Object} options - Fetch options
     * @param {Object} [options.queryParams] - Query parameters to pass to fetch function
     * @param {number} [options.pageNum] - Page number to fetch
     * @param {boolean} [options.update=true] - Whether to update loading state
     * @param {boolean} [options.check=false] - Whether this is a check operation
     * @param {boolean} [options.roleIsAdmin] - Admin role override
     * @returns {Promise<Object>} Fetch result
     */
    const fetchData = useCallback(
        async ({ 
            queryParams: fetchQueryParams, 
            pageNum, 
            update = true, 
            check = false,
            roleIsAdmin: fetchRoleIsAdmin
        }) => {
            if (stateRef.current.isLoading && !check) return

            if (cancelTokenSourceRef.current) {
                cancelTokenSourceRef.current.cancel('New request initiated')
            }
            cancelTokenSourceRef.current = axios.CancelToken.source()

            try {
                if (update) setIsLoading(true)

                const res = await fetchFunction({
                    ...fetchQueryParams,
                    page: pageNum,
                    isCheck: check,
                    cancelToken: cancelTokenSourceRef.current.token,
                    roleIsAdmin: fetchRoleIsAdmin ?? stateRef.current.roleIsAdmin,
                })

                if (!res.cancelled) {
                    if (update) {
                        setHasMore(res?.hasMore ?? false)
                    }
                }

                return res
            } catch (error) {
                console.error('Error fetching data:', error)
                return { hasMore: false, [dataKey]: [] }
            } finally {
                if (update) setIsLoading(false)
            }
        },
        [fetchFunction, dataKey]
    )

    const debouncedFetch = useCallback(
        deBounce((props) => fetchData(props), debounceMs),
        [fetchData, debounceMs]
    )

    // Intersection Observer for infinite scrolling
    useEffect(() => {
        const currentTrigger = loadMoreTriggerRef.current
        if (!currentTrigger) return

        const observerCallback = async ([entry]) => {
            if (
                entry.isIntersecting &&
                stateRef.current.hasMore &&
                !stateRef.current.isLoading
            ) {
                debouncedFetch({
                    queryParams: stateRef.current.queryParams,
                    pageNum: stateRef.current.currentPage + 1,
                    roleIsAdmin: stateRef.current.roleIsAdmin,
                })
            }
        }

        const observer = new IntersectionObserver(observerCallback, {
            threshold: intersectionThreshold,
        })

        observer.observe(currentTrigger)
        return () => observer.disconnect()
    }, [debouncedFetch, intersectionThreshold])

    // Periodic check for new data
    useEffect(() => {
        const setupNewDataCheck = async () => {
            if (stateRef.current.hasMore || stateRef.current.isCheckingForNewData) {
                return
            }

            
            const checkForNewData = async () => {
                setIsCheckingForNewData(true)
                const result = await fetchData({
                    queryParams: stateRef.current.queryParams,
                    pageNum: stateRef.current.currentPage + 1,
                    update: false,
                    check: true,
                    roleIsAdmin: stateRef.current.roleIsAdmin,
                })

                if (result?.[dataKey]?.length > 0) {
                    setHasMore(true)
                    setIsCheckingForNewData(false)
                    clearInterval(checkTimerRef.current)
                }
            }

            await checkForNewData()

            checkTimerRef.current = setInterval(checkForNewData, checkInterval)
        }

        setupNewDataCheck()

        return () => {
            if (checkTimerRef.current) {
                clearInterval(checkTimerRef.current)
            }
        }
    }, [hasMore, checkInterval, fetchData, dataKey])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (checkTimerRef.current) {
                clearInterval(checkTimerRef.current)
            }
            if (cancelTokenSourceRef.current) {
                cancelTokenSourceRef.current.cancel('Component unmounted')
            }
        }
    }, [])

    return {
        loadMoreTriggerRef,
        isLoading,
        hasMore,
        isCheckingForNewData,
        currentPage,
        fetchData,
    }
}