'use client'

import BorderedButton from '@/components/BorderedButton'
import { Hero } from '@/components/Homepage'
import Container from '@/components/Homepage/Container'
import InventoryCard from '@/components/InventoryCard'
import MaxWidth from '@/components/MaxWidth'
import { PaginationLocal } from '@/components/Pagination'
import ScrollMenu from '@/components/ScrollMenu'
import { useAuth, useNotifications } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import h from '../../components/Homepage/Homepage.module.css'
import p from './page.module.css'
import { useEffect, useMemo, useState } from 'react'
import NothingYet from '@/components/NothingYet'

export default function Page() {
	const { user, verifyAssets } = useAuth()
	const { showLoading, hideLoading, showError, displayAlert } =
		useNotifications()
	const weapons = useMemo(
		() => (Array.isArray(user?.weapons) ? user.weapons : []),
		[user?.weapons],
	)
	const [visibleWeapons, setVisibleWeapons] = useState([])

	useEffect(() => {
		setVisibleWeapons(weapons.slice(0, 9))
	}, [weapons])

	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			<Hero
				welcomeText={
					<>
						Welcome to the
						<br />
						Inventory
					</>
				}
				subText={
					<>
						Your complete collection of weapons,{' '}
						<br className={cf(h.xlHidden, h.lgHidden)} />
						armor, and rewards. <br className={cf(h.mdHidden, h.smHidden)} />
						Sell your weapons
					</>
				}
				links={
					<>
						<BorderedButton
							tag={'Refresh Assets'}
							action={() =>
								verifyAssets({
									showLoading,
									hideLoading,
									showError,
									displayAlert,
								})
							}
							borderButtonText={h.heroActionText}
						/>
					</>
				}
			/>
			<Container
				tag={'Your Weapons'}
				cusClass={cf(p.container)}
			>
				{visibleWeapons?.length > 0 ? (
					<>
						<ScrollMenu />
						<MaxWidth
							maxWidth={{ max: '1370px', tablet: '710px', mobile: '330px' }}
						>
							<div className={cf(s.wMax, s.flex, s.flexTop, p.content)}>
								<div className={cf(s.wMax, s.flex, s.flexCenter, p.cards)}>
									{visibleWeapons.map((weapon, i) => (
										<InventoryCard
											key={`weapon-${weapon?.tokenId ?? i}`}
											pseudoIndex={i}
											weapon={weapon}
										/>
									))}
									<PaginationLocal
										array={visibleWeapons}
										refArray={weapons}
										step={9}
										setArray={setVisibleWeapons}
										full
									/>
								</div>
							</div>
						</MaxWidth>
					</>
				) : (
					<NothingYet
						message={`You don’t have any NFT yet`}
						cta={
							<BorderedButton
								tag={'Purchase'}
								action={() => {}}
								borderButtonText={h.heroActionText}
							/>
						}
					/>
				)}
			</Container>
		</div>
	)
}
