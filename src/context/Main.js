'use client'

import { MOBILE_QUERY, TABLET_QUERY } from '@/constants'
import { useResponsiveLayout } from '@/hooks'
import React, { useEffect, useMemo, useState, useNotifications } from 'react'

export const MainContext = React.createContext()

const APP_BREAKPOINTS = {
	isMobile: MOBILE_QUERY,
	isTablet: TABLET_QUERY,
	isDesktop: '(min-width: 834px)',
}

const MainContextProvider = ({ children }) => {
	const { dimensions, matches } = useResponsiveLayout(APP_BREAKPOINTS)

	const {
		modal,
		setModal,
		showModal,
		setShowModal,
		modalParent,
		setModalParent,
		showModalParent,
		setShowModalParent,
		canCloseModal,
		setCanCloseModal,
		canCloseModalParent,
		setCanCloseModalParent,
		stage1,
		setStage1,
		stage2,
		setStage2,
		stage3,
		setStage3,
		alertInfo,
		setAlertInfo,
		promiseOfConfirmation,
		setPromiseOfConfirmation,
		forCreation,
		setForCreation,
		complete,
		setComplete,
		displayAlert,
	} = useNotifications()

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
