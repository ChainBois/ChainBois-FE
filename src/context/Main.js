'use client'

import React, { useEffect, useMemo, useState } from 'react'

export const MainContext = React.createContext()

const MainContextProvider = ({ children }) => {
	const isClient = typeof window !== 'undefined'
	const [isSmall, setIsSmall] = useState(false)
	const [isTiny, setIsTiny] = useState(false)

	const ContextValue = useMemo(
		() => ({
			isSmall,
			isTiny,
			setIsSmall,
			setIsTiny,
		}),
		[isSmall, isTiny]
	)

	useEffect(() => {
		if (!isClient) return
		const checkScreenSize = () => {
			const width = window.innerWidth
			const height = window.innerHeight

			const smallCheck =
				width <= 834 || (width <= 950 && width >= 600 && height <= 440)
			const tinyCheck = width <= 481

			if (isSmall !== smallCheck) setIsSmall(smallCheck)
			if (isTiny !== tinyCheck) setIsTiny(tinyCheck)
		}

		checkScreenSize()

		let timeoutId
		const handleResize = () => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(checkScreenSize, 100)
		}

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
			clearTimeout(timeoutId)
		}
	}, [isSmall, isTiny, isClient])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
