'use client'

import { MainContext } from '@/context'
import { useContext } from 'react'

export const useMain = () => useContext(MainContext)
