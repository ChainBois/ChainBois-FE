'use client'

import React, { useEffect, useMemo, useState } from 'react'

export const MainContext = React.createContext()

const MainContextProvider = ({ children }) => {
	const ContextValue = useMemo(() => ({}), [])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
