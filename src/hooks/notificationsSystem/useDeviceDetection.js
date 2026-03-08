// hooks/useDeviceDetection.js
import { useState, useEffect, useMemo } from 'react'

/**
 * SSR-safe device detection hook with proper window access patterns
 */
export const useDeviceDetection = () => {
	const [deviceInfo, setDeviceInfo] = useState({
		isMobile: false,
		isTablet: false,
		isDesktop: false,
		isIOS: false,
		isAndroid: false,
		browser: 'unknown',
		supportsTouch: false,
		supportsNotifications: false,
		requiresServiceWorker: false,
	})

	// SSR-safe window check
	const isClient = typeof window !== 'undefined'

	useEffect(() => {
		if (!isClient) return

		const detectDevice = () => {
			// Safe navigator access
			const userAgent = navigator?.userAgent?.toLowerCase() || ''
			const maxTouchPoints = navigator?.maxTouchPoints || 0
			const hasTouch = maxTouchPoints > 0 || 'ontouchstart' in window

			// Safe screen access with fallbacks
			const screenWidth = window.screen?.width || 0
			const screenHeight = window.screen?.height || 0
			const devicePixelRatio = window.devicePixelRatio || 1
			const effectiveWidth = screenWidth * devicePixelRatio

			// User-Agent Client Hints (modern browsers)
			const navigatorUAData = navigator?.userAgentData

			// Platform detection with iPad Pro special handling
			const isIOS =
				/ipad|iphone|ipod/.test(userAgent) ||
				(navigator?.platform === 'MacIntel' && maxTouchPoints > 1)
			const isAndroid = /android/.test(userAgent)
			const isMobileUA = /mobi|android|iphone|ipad|phone/.test(userAgent)

			// Browser detection
			let browser = 'unknown'
			if (userAgent.includes('chrome') && !userAgent.includes('edg'))
				browser = 'chrome'
			else if (userAgent.includes('safari') && !userAgent.includes('chrome'))
				browser = 'safari'
			else if (userAgent.includes('firefox')) browser = 'firefox'
			else if (userAgent.includes('edg')) browser = 'edge'

			// Enhanced mobile detection
			const isMobile =
				isMobileUA ||
				(hasTouch && effectiveWidth < 1024) ||
				navigatorUAData?.mobile === true

			// Tablet detection
			const isTablet =
				(effectiveWidth >= 768 && effectiveWidth < 1024 && hasTouch) ||
				(isIOS && effectiveWidth >= 1024) ||
				(isAndroid && /tablet/.test(userAgent))

			// Notification support detection
			const supportsNotifications = 'Notification' in window
			const requiresServiceWorker =
				browser === 'chrome' && (isAndroid || isMobile)

			return {
				isMobile,
				isTablet,
				isDesktop: !isMobile && !isTablet,
				isIOS,
				isAndroid,
				browser,
				supportsTouch: hasTouch,
				supportsNotifications,
				requiresServiceWorker,
			}
		}

		setDeviceInfo(detectDevice())

		const handleOrientationChange = () => {
			setTimeout(() => setDeviceInfo(detectDevice()), 100)
		}

		window.addEventListener('orientationchange', handleOrientationChange)
		return () =>
			window.removeEventListener('orientationchange', handleOrientationChange)
	}, [isClient])

	// Memoized capabilities to prevent re-creation
	const capabilities = useMemo(() => {
		if (!isClient) {
			return {
				notifications: { direct: false, serviceWorker: false, push: false },
				features: { touch: false, webPush: false, pwa: false },
			}
		}

		const hasServiceWorker = 'serviceWorker' in navigator
		const hasPushManager = 'PushManager' in window

		return {
			notifications: {
				direct:
					deviceInfo.supportsNotifications && !deviceInfo.requiresServiceWorker,
				serviceWorker: deviceInfo.supportsNotifications && hasServiceWorker,
				push: hasPushManager && hasServiceWorker,
			},
			features: {
				touch: deviceInfo.supportsTouch,
				webPush: hasPushManager,
				pwa: hasServiceWorker && 'caches' in window,
			},
		}
	}, [deviceInfo, isClient])

	return useMemo(
		() => ({ ...deviceInfo, capabilities }),
		[deviceInfo, capabilities]
	)
}
