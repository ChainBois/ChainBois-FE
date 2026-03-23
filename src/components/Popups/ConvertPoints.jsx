'use client'

import ConvertPointsPanel from '@/components/ConvertPointsPanel'
import { useAuth, useNotifications } from '@/hooks'
import s from '@/styles'
import { cf, getInventoryBalances } from '@/utils'
import p from './ConvertPoints.module.css'

export default function ConvertPoints() {
	const { user } = useAuth()
	const { displayAlert, setShowModal } = useNotifications()
	const inventoryBalances = getInventoryBalances(user)

	return (
		<section className={cf(s.wMax, s.flex, s.flexCenter, p.popup)}>
			<ConvertPointsPanel
				pointsBalance={inventoryBalances?.points}
				battleBalance={
					inventoryBalances?.battle ?? inventoryBalances?.battleRaw
				}
				variant='popup'
				onConvert={() => {
					setShowModal(false)
					displayAlert({
						title: 'Coming Soon',
						message:
							'Points conversion is not live yet. Your balance stays unchanged for now.',
						type: 'info',
					})
				}}
			/>
		</section>
	)
}
