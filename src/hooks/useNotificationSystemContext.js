'use client'

import { NotificationSystemContext } from '@/context'
import { useContext } from 'react'

export const useNotificationSystemContext = () =>
	useContext(NotificationSystemContext)
