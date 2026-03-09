'use client'

import { QueryParamsContext } from '@/context'
import { useContext } from 'react'

export const useQueryParams = () => useContext(QueryParamsContext)
