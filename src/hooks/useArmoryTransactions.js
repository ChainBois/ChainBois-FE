'use client'

import {
	convertPointsToBattle,
	fetchArmoryBalance,
	fetchArmoryNft,
	fetchArmoryWeapon,
	fetchPointsBalance,
	fetchPointsHistory,
	normalizeArmoryBalance,
	normalizePointsBalancePayload,
	normalizePointsHistoryPayload,
	normalizeWeaponAsset,
	purchaseArmoryNft,
	purchaseArmoryWeapon,
} from '@/utils'
import {
	ACTIVE_CHAIN,
	ACTIVE_CHAIN_NAME,
	BATTLE_TOKEN_ADDRESS,
	thirdwebClient,
} from '@/lib'
import { getContract, prepareTransaction, sendAndConfirmTransaction, toWei } from 'thirdweb'
import { transfer as transferErc20 } from 'thirdweb/extensions/erc20'
import { useCallback, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useAuth } from './useAuth'
import { useMain } from './useMain'
import { useNotificationSystemContext } from './useNotificationSystemContext'

const asTokenId = (value) => {
	const tokenId = Number(value)
	return Number.isInteger(tokenId) && tokenId >= 0 ? tokenId : null
}

const normalizeText = (value) => String(value ?? '').trim()

const extractTransactionHash = (receipt) =>
	normalizeText(receipt?.transactionHash ?? receipt?.hash)

const buildPurchaseFailureMessage = (res, fallbackMessage) => {
	const baseMessage =
		res?.message || res?.error || fallbackMessage || 'Unable to complete the purchase.'

	if (res?.status === 404 || res?.status === 409) {
		return `${baseMessage} If payment was already confirmed on-chain, the backend may automatically retry or refund it.`
	}

	if (res?.status === 500 || res?.status === 503) {
		return `${baseMessage} If your payment already confirmed, please give the platform a moment to retry settlement.`
	}

	return baseMessage
}

export const useArmoryTransactions = () => {
	const activeAccount = useActiveAccount()
	const { user, setUser } = useAuth()
	const { getUserInventoryData } = useMain()
	const { displayAlert, hideLoading, showError, showLoading } =
		useNotificationSystemContext()
	const [pendingAction, setPendingAction] = useState(null)

	const applyWalletSnapshot = useCallback(
		({ armoryBalance, pointsInfo, pointsHistory, chainbois, address } = {}) => {
			setUser((current) => {
				const nextUser = { ...current }
				const walletAddress = normalizeText(address)

				if (walletAddress) {
					nextUser.address = current?.address ?? walletAddress
				}

				if (armoryBalance && typeof armoryBalance === 'object') {
					nextUser.armoryBalance = armoryBalance
				}

				if (pointsInfo && typeof pointsInfo === 'object') {
					nextUser.pointsInfo = pointsInfo
				}

				if (pointsHistory && typeof pointsHistory === 'object') {
					nextUser.pointsHistory = pointsHistory
				}

				const nextInventoryBalances = {
					...(current?.inventoryBalances ?? {}),
				}

				if (pointsInfo && typeof pointsInfo === 'object') {
					nextInventoryBalances.points = pointsInfo?.pointsBalance ?? 0
				}

				if (armoryBalance && typeof armoryBalance === 'object') {
					nextInventoryBalances.points =
						armoryBalance?.pointsBalance ??
						nextInventoryBalances.points ??
						pointsInfo?.pointsBalance ??
						0
					nextInventoryBalances.battle = armoryBalance?.battleBalance ?? 0
					nextInventoryBalances.battleRaw =
						armoryBalance?.battleBalanceRaw ??
						String(armoryBalance?.battleBalance ?? 0)
				}

				if (Object.keys(nextInventoryBalances).length) {
					nextUser.inventoryBalances = nextInventoryBalances
				}

				if (Array.isArray(chainbois)) {
					const firstTokenId = asTokenId(
						chainbois?.[0]?.tokenId ?? chainbois?.[0]?.nftTokenId,
					)

					nextUser.chainbois = chainbois
					nextUser.hasNft = chainbois.length > 0
					if (firstTokenId !== null) {
						nextUser.nftTokenId = firstTokenId
					}
				}

				return nextUser
			})
		},
		[setUser],
	)

	const refreshWalletSnapshot = useCallback(
		async ({ address, includeHistory = false } = {}) => {
			const walletAddress =
				normalizeText(address) ||
				normalizeText(activeAccount?.address) ||
				normalizeText(user?.address)

			if (!walletAddress) {
				return { success: false, message: 'Wallet address required' }
			}

			const requests = [
				fetchArmoryBalance({ address: walletAddress }),
				fetchPointsBalance({ address: walletAddress }),
			]

			if (includeHistory) {
				requests.push(
					fetchPointsHistory({
						address: walletAddress,
						page: 1,
						limit: 10,
					}),
				)
			}

			const [balanceRes, pointsRes, historyRes] = await Promise.all(requests)

			const armoryBalance = balanceRes?.success
				? normalizeArmoryBalance(balanceRes?.data?.data ?? {})
				: null
			const pointsInfo = pointsRes?.success
				? normalizePointsBalancePayload(pointsRes?.data?.data ?? {})
				: null
			const pointsHistory =
				includeHistory && historyRes?.success
					? normalizePointsHistoryPayload(historyRes?.data?.data ?? {})
					: null

			applyWalletSnapshot({
				armoryBalance,
				pointsInfo,
				pointsHistory,
				address: walletAddress,
			})

			return {
				success:
					!!balanceRes?.success || !!pointsRes?.success || !!historyRes?.success,
				armoryBalance,
				pointsInfo,
				pointsHistory,
				responses: {
					balanceRes,
					pointsRes,
					historyRes,
				},
			}
		},
		[activeAccount?.address, applyWalletSnapshot, user?.address],
	)

	const refreshInventorySnapshot = useCallback(
		async ({ address } = {}) => {
			const walletAddress =
				normalizeText(address) ||
				normalizeText(activeAccount?.address) ||
				normalizeText(user?.address)

			if (!walletAddress || typeof getUserInventoryData !== 'function') {
				return { success: false, message: 'Wallet address required' }
			}

			const inventoryRes = await getUserInventoryData({ address: walletAddress })
			const chainbois = Array.isArray(inventoryRes?.data?.data?.chainbois)
				? inventoryRes.data.data.chainbois
				: null

			if (chainbois) {
				applyWalletSnapshot({
					chainbois,
					address: walletAddress,
				})
			}

			return inventoryRes
		},
		[
			activeAccount?.address,
			applyWalletSnapshot,
			getUserInventoryData,
			user?.address,
		],
	)

	const syncAfterSuccess = useCallback(
		async ({ address, includeHistory = false } = {}) => {
			const [inventoryRes, walletSnapshotRes] = await Promise.all([
				refreshInventorySnapshot({ address }),
				refreshWalletSnapshot({ address, includeHistory }),
			])

			return {
				success: !!inventoryRes?.success || !!walletSnapshotRes?.success,
				inventoryRes,
				walletSnapshotRes,
			}
		},
		[refreshInventorySnapshot, refreshWalletSnapshot],
	)

	const requireConnectedWallet = useCallback(
		({ actionLabel }) => {
			if (activeAccount?.address) return true

			showError?.({
				title: 'Wallet Required',
				message: `Connect your wallet before trying to ${actionLabel}.`,
			})

			return false
		},
		[activeAccount?.address, showError],
	)

	const sendBattlePayment = useCallback(
		async ({ to, amount }) => {
			if (!activeAccount) {
				throw new Error('Connect your wallet before sending a BATTLE payment.')
			}

			if (!BATTLE_TOKEN_ADDRESS) {
				throw new Error(
					`$BATTLE payments are not configured for ${ACTIVE_CHAIN_NAME} yet.`,
				)
			}

			const battleContract = getContract({
				client: thirdwebClient,
				chain: ACTIVE_CHAIN,
				address: BATTLE_TOKEN_ADDRESS,
			})

			const transaction = transferErc20({
				contract: battleContract,
				to: normalizeText(to),
				amount: String(amount),
			})
			const receipt = await sendAndConfirmTransaction({
				account: activeAccount,
				transaction,
			})

			return extractTransactionHash(receipt)
		},
		[activeAccount],
	)

	const sendAvaxPayment = useCallback(
		async ({ to, amount }) => {
			if (!activeAccount) {
				throw new Error('Connect your wallet before sending an AVAX payment.')
			}

			const transaction = prepareTransaction({
				client: thirdwebClient,
				chain: ACTIVE_CHAIN,
				to: normalizeText(to),
				value: toWei(String(amount)),
			})
			const receipt = await sendAndConfirmTransaction({
				account: activeAccount,
				transaction,
			})

			return extractTransactionHash(receipt)
		},
		[activeAccount],
	)

	const purchaseWeapon = useCallback(
		async ({ weapon } = {}) => {
			if (!requireConnectedWallet({ actionLabel: 'purchase a weapon' })) {
				return { success: false, message: 'Wallet connection required' }
			}

			const tokenId = asTokenId(weapon?.tokenId)
			const weaponKey = tokenId !== null ? `weapon-${tokenId}` : 'weapon'
			setPendingAction({
				type: 'weapon',
				key: weaponKey,
			})

			try {
				showLoading?.({
					title: 'Preparing Purchase',
					message: 'Fetching the latest weapon price and availability.',
				})

				const detailRes =
					tokenId !== null
						? await fetchArmoryWeapon({ weaponId: tokenId })
						: { success: true, data: { data: weapon } }

				if (!detailRes?.success) {
					hideLoading?.()
					showError?.({
						title: 'Weapon Unavailable',
						message:
							detailRes?.message ||
							detailRes?.error ||
							'We could not load this weapon right now.',
					})
					return detailRes
				}

				const weaponDetail = normalizeWeaponAsset(detailRes?.data?.data ?? weapon)
				const weaponName = normalizeText(
					weaponDetail?.weaponName ?? weaponDetail?.name,
				)
				const paymentAddress = normalizeText(weaponDetail?.paymentAddress)
				const price = weaponDetail?.price

				if (!weaponName || !paymentAddress || price === null || price === undefined) {
					hideLoading?.()
					showError?.({
						title: 'Weapon Unavailable',
						message:
							'This weapon is missing payment details. Please refresh the Armory and try again.',
					})
					return {
						success: false,
						message: 'Weapon payment details are incomplete',
					}
				}

				showLoading?.({
					title: 'Confirm Purchase',
					message: `Approve the ${weaponName} payment in your wallet.`,
				})

				let paymentTxHash = ''
				try {
					paymentTxHash = await sendBattlePayment({
						to: paymentAddress,
						amount: price,
					})
				} catch (error) {
					hideLoading?.()
					showError?.({
						title: 'Payment Failed',
						message:
							error?.message ||
							'The BATTLE payment was not completed. Please confirm the transaction and try again.',
					})
					return { success: false, message: error?.message || 'Payment failed' }
				}

				if (!paymentTxHash) {
					hideLoading?.()
					showError?.({
						title: 'Payment Failed',
						message:
							'We could not read the payment transaction hash. Please try again.',
					})
					return { success: false, message: 'Payment transaction hash missing' }
				}

				showLoading?.({
					title: 'Finalizing Purchase',
					message:
						'Waiting for confirmation and transferring the weapon to your wallet.',
				})

				const purchaseRes = await purchaseArmoryWeapon({
					address: activeAccount?.address,
					weaponName,
					txHash: paymentTxHash,
				})

				if (!purchaseRes?.success) {
					hideLoading?.()
					showError?.({
						title: 'Purchase Failed',
						message: buildPurchaseFailureMessage(
							purchaseRes,
							'Unable to complete your weapon purchase.',
						),
					})
					return purchaseRes
				}

				await syncAfterSuccess({
					address: activeAccount?.address,
				})

				hideLoading?.()
				displayAlert?.({
					title: 'Weapon Purchased',
					message: `${weaponName} was added to your inventory.`,
					type: 'success',
				})

				return purchaseRes
			} finally {
				setPendingAction(null)
			}
		},
		[
			activeAccount?.address,
			displayAlert,
			hideLoading,
			requireConnectedWallet,
			sendBattlePayment,
			showError,
			showLoading,
			syncAfterSuccess,
		],
	)

	const purchaseChainBoi = useCallback(
		async ({ listing } = {}) => {
			if (!requireConnectedWallet({ actionLabel: 'purchase a ChainBoi' })) {
				return { success: false, message: 'Wallet connection required' }
			}

			const tokenId = asTokenId(listing?.tokenId ?? listing?.nftTokenId)
			const listingKey = tokenId !== null ? `nft-${tokenId}` : 'nft'
			setPendingAction({
				type: 'nft',
				key: listingKey,
			})

			try {
				showLoading?.({
					title: 'Preparing Purchase',
					message: 'Fetching the latest ChainBoi listing details.',
				})

				const detailRes =
					tokenId !== null
						? await fetchArmoryNft({ tokenId })
						: { success: true, data: { data: listing } }

				if (!detailRes?.success) {
					hideLoading?.()
					showError?.({
						title: 'Listing Unavailable',
						message:
							detailRes?.message ||
							detailRes?.error ||
							'We could not load that ChainBoi listing right now.',
					})
					return detailRes
				}

				const detail = detailRes?.data?.data ?? listing
				const paymentAddress = normalizeText(
					detail?.paymentAddress ?? listing?.paymentAddress,
				)
				const price = detail?.price ?? listing?.price

				if (!paymentAddress || price === null || price === undefined) {
					hideLoading?.()
					showError?.({
						title: 'Listing Unavailable',
						message:
							'This ChainBoi listing is missing payment details. Please refresh and try again.',
					})
					return {
						success: false,
						message: 'ChainBoi listing payment details are incomplete',
					}
				}

				showLoading?.({
					title: 'Confirm Purchase',
					message: 'Approve the AVAX payment in your wallet.',
				})

				let paymentTxHash = ''
				try {
					paymentTxHash = await sendAvaxPayment({
						to: paymentAddress,
						amount: price,
					})
				} catch (error) {
					hideLoading?.()
					showError?.({
						title: 'Payment Failed',
						message:
							error?.message ||
							'The AVAX payment was not completed. Please confirm the transaction and try again.',
					})
					return { success: false, message: error?.message || 'Payment failed' }
				}

				if (!paymentTxHash) {
					hideLoading?.()
					showError?.({
						title: 'Payment Failed',
						message:
							'We could not read the payment transaction hash. Please try again.',
					})
					return { success: false, message: 'Payment transaction hash missing' }
				}

				showLoading?.({
					title: 'Finalizing Purchase',
					message:
						'Waiting for confirmation and assigning your ChainBoi from the Primary Market.',
				})

				const purchaseRes = await purchaseArmoryNft({
					address: activeAccount?.address,
					txHash: paymentTxHash,
					tokenId,
				})

				if (!purchaseRes?.success) {
					hideLoading?.()
					showError?.({
						title: 'Purchase Failed',
						message: buildPurchaseFailureMessage(
							purchaseRes,
							'Unable to complete your ChainBoi purchase.',
						),
					})
					return purchaseRes
				}

				await syncAfterSuccess({
					address: activeAccount?.address,
				})

				hideLoading?.()
				const deliveredTokenId =
					purchaseRes?.data?.data?.tokenId ?? tokenId ?? null
				displayAlert?.({
					title: 'ChainBoi Purchased',
					message:
						deliveredTokenId !== null
							? `ChainBoi #${deliveredTokenId} was delivered to your wallet.`
							: 'Your ChainBoi was delivered to your wallet.',
					type: 'success',
				})

				return purchaseRes
			} finally {
				setPendingAction(null)
			}
		},
		[
			activeAccount?.address,
			displayAlert,
			hideLoading,
			requireConnectedWallet,
			sendAvaxPayment,
			showError,
			showLoading,
			syncAfterSuccess,
		],
	)

	const convertPoints = useCallback(
		async ({ amount } = {}) => {
			if (!requireConnectedWallet({ actionLabel: 'convert points' })) {
				return { success: false, message: 'Wallet connection required' }
			}

			const normalizedAmount = Math.floor(Number(amount) || 0)
			if (normalizedAmount <= 0) {
				showError?.({
					title: 'Invalid Amount',
					message: 'Enter a whole number of points greater than zero.',
				})
				return { success: false, message: 'Amount must be positive' }
			}

			setPendingAction({
				type: 'points',
				key: 'points',
			})

			try {
				showLoading?.({
					title: 'Converting Points',
					message: 'Submitting your conversion and waiting for $BATTLE payout.',
				})

				const conversionRes = await convertPointsToBattle({
					address: activeAccount?.address,
					amount: normalizedAmount,
				})

				if (!conversionRes?.success) {
					hideLoading?.()
					showError?.({
						title: 'Conversion Failed',
						message:
							conversionRes?.message ||
							conversionRes?.error ||
							'Unable to convert your points right now.',
					})
					return conversionRes
				}

				await refreshWalletSnapshot({
					address: activeAccount?.address,
					includeHistory: true,
				})
				await refreshInventorySnapshot({
					address: activeAccount?.address,
				})

				hideLoading?.()
				displayAlert?.({
					title: 'Conversion Complete',
					message:
						conversionRes?.data?.data?.message ||
						`${normalizedAmount} points were converted to $BATTLE.`,
					type: 'success',
				})

				return conversionRes
			} finally {
				setPendingAction(null)
			}
		},
		[
			activeAccount?.address,
			displayAlert,
			hideLoading,
			refreshInventorySnapshot,
			refreshWalletSnapshot,
			requireConnectedWallet,
			showError,
			showLoading,
		],
	)

	const isPending = useCallback(
		(type, key = null) => {
			if (!pendingAction || pendingAction?.type !== type) return false
			return key ? pendingAction?.key === key : true
		},
		[pendingAction],
	)

	return useMemo(
		() => ({
			convertPoints,
			isPending,
			pendingAction,
			purchaseChainBoi,
			purchaseWeapon,
			refreshInventorySnapshot,
			refreshWalletSnapshot,
			syncAfterSuccess,
		}),
		[
			convertPoints,
			isPending,
			pendingAction,
			purchaseChainBoi,
			purchaseWeapon,
			refreshInventorySnapshot,
			refreshWalletSnapshot,
			syncAfterSuccess,
		],
	)
}

export default useArmoryTransactions
