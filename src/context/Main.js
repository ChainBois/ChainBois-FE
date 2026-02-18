'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import { useResponsiveLayout } from '@/hooks'
import React, { useEffect, useMemo, useState } from 'react'

export const MainContext = React.createContext()

const APP_BREAKPOINTS = {
	isMobile: MOBILE_QUERY,
	isTablet: TABLET_QUERY,
	isDesktop: '(min-width: 834px)',
}

const MainContextProvider = ({ children }) => {
	const { dimensions, matches } = useResponsiveLayout(APP_BREAKPOINTS)
	const ContextValue = useMemo(
		() => ({
			dimensions,
			query: matches,
		}),
		[dimensions, matches],
	)

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
