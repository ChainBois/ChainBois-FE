'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useMain } from '@/hooks'

export const QueryParamsContext = React.createContext()

const QueryParamsContextProvider = ({ children }) => {
	const mainContext = useMain()
	const [queryParams, setQueryParams] = useState({})
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const paramsObj = Object.fromEntries(searchParams.entries())
		setQueryParams(paramsObj)
		if (paramsObj.modal) {
			const canCloseModalConfigRef = {
				connectWallet: paramsObj?.relink === 'true' ? false : true,
			}
			mainContext[
				'show' +
					paramsObj.modal.charAt(0).toUpperCase() +
					paramsObj.modal.slice(1)
			](canCloseModalConfigRef[paramsObj.modal] ?? true)
			const { success = null, modal = null, ...res } = paramsObj
			router.push(`${pathname}?${new URLSearchParams(res).toString()}`)
		}
	}, [searchParams, pathname])

	const ContextValue = queryParams

	return (
		<QueryParamsContext.Provider value={ContextValue}>
			{children}
		</QueryParamsContext.Provider>
	)
}

export default QueryParamsContextProvider
