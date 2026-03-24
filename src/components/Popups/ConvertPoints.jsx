'use client'

import { useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { IoClose } from 'react-icons/io5'
import ConvertPointsPanel from '@/components/ConvertPointsPanel'
import { useArmoryTransactions, useAuth, useNotifications } from '@/hooks'
import s from '@/styles'
import { cf, getInventoryBalances } from '@/utils'
import p from './ConvertPoints.module.css'

export default function ConvertPoints() {
	const activeAccount = useActiveAccount()
	const { user } = useAuth()
	const { setCanCloseModal, setShowModal } = useNotifications()
	const { convertPoints, isPending, refreshWalletSnapshot } =
		useArmoryTransactions()
	const inventoryBalances = getInventoryBalances(user)
	const pointsInfo = user?.pointsInfo ?? {}

	useEffect(() => {
		setCanCloseModal(true)
	}, [setCanCloseModal])

	useEffect(() => {
		if (!activeAccount?.address) return
		refreshWalletSnapshot({
			address: activeAccount.address,
			includeHistory: true,
		})
	}, [activeAccount?.address, refreshWalletSnapshot])

	return (
		<section className={cf(s.wMax, s.flex, s.flex_dColumn, s.flexCenter, p.popup)}>
			<div className={cf(s.wMax, s.flex, s.flexRight, p.popupHeader)}>
				<button
					type='button'
					className={cf(s.flex, s.flexCenter, p.closeButton)}
					aria-label='Close points conversion'
					onClick={() => setShowModal(false)}
				>
					<IoClose className={cf(p.closeIcon)} />
				</button>
			</div>
			<ConvertPointsPanel
				pointsBalance={inventoryBalances?.points}
				battleBalance={inventoryBalances?.battle ?? inventoryBalances?.battleRaw}
				ratePoints={1}
				rateBattle={pointsInfo?.conversionRate ?? 1}
				maxConvertible={pointsInfo?.maxConvertible}
				history={user?.pointsHistory}
				isConverting={isPending('points')}
				variant='popup'
				onConvert={({ points }) => convertPoints({ amount: points })}
			/>
		</section>
	)
}
