'use client'

import { PolyButton } from '@/components/PolyButton'
import s from '@/styles'
import { cf } from '@/utils'
import { useEffect, useId, useMemo, useState } from 'react'
import { IoWarningOutline } from 'react-icons/io5'
import c from './ConvertPointsPanel.module.css'

const QUICK_ACTIONS = [
	{ label: '-1000', type: 'decrement', value: 1000 },
	{ label: '-100', type: 'decrement', value: 100 },
	{ label: '+100', type: 'increment', value: 100 },
	{ label: '+1000', type: 'increment', value: 1000 },
	{ label: '25%', type: 'percentage', value: 0.25 },
	{ label: '50%', type: 'percentage', value: 0.5 },
	{ label: 'Max', type: 'max' },
	{ label: 'Clear', type: 'clear' },
]

const normalizeWholeNumber = (value) => {
	const numericValue = Number(value)

	if (!Number.isFinite(numericValue) || numericValue <= 0) return 0

	return Math.floor(numericValue)
}

const clampWholeNumber = (value, min = 0, max = Number.MAX_SAFE_INTEGER) =>
	Math.min(Math.max(normalizeWholeNumber(value), min), max)

const formatWholeNumber = (value) => normalizeWholeNumber(value).toLocaleString()

const formatBattleAmount = (value) => {
	const numericValue = Number(value)

	if (!Number.isFinite(numericValue) || numericValue <= 0) return '0'

	return numericValue.toLocaleString('en-US', {
		maximumFractionDigits: 4,
		minimumFractionDigits: numericValue % 1 === 0 ? 0 : 1,
	})
}

const formatHistoryDate = (value) => {
	if (!value) return 'Pending'

	const parsedDate = new Date(value)
	if (Number.isNaN(parsedDate.getTime())) return 'Pending'

	return parsedDate.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
}

export default function ConvertPointsPanel({
	pointsBalance = 0,
	battleBalance = 0,
	ratePoints = 1,
	rateBattle = 1,
	feePercent = 0,
	maxConvertible = null,
	history = null,
	isConverting = false,
	onConvert = null,
	variant = 'section',
	className = '',
	convertLabel = 'Convert',
}) {
	const availablePoints = useMemo(
		() => normalizeWholeNumber(pointsBalance),
		[pointsBalance],
	)
	const availableBattle = useMemo(() => {
		const numericValue = Number(battleBalance)

		if (!Number.isFinite(numericValue) || numericValue <= 0) return 0

		return numericValue
	}, [battleBalance])
	const maximumConvertible = useMemo(() => {
		const hasExplicitMax =
			maxConvertible !== null &&
			maxConvertible !== undefined &&
			String(maxConvertible).trim() !== ''
		const normalizedMax = hasExplicitMax
			? normalizeWholeNumber(maxConvertible)
			: availablePoints
		return Math.min(availablePoints, normalizedMax)
	}, [availablePoints, maxConvertible])
	const inputId = useId()
	const [selectedPointsInput, setSelectedPointsInput] = useState('')
	const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

	useEffect(() => {
		setSelectedPointsInput((currentValue) => {
			const currentPoints = clampWholeNumber(currentValue, 0, maximumConvertible)
			return currentPoints > 0 ? String(currentPoints) : ''
		})
	}, [maximumConvertible])

	const selectedPoints = useMemo(
		() => clampWholeNumber(selectedPointsInput, 0, maximumConvertible),
		[selectedPointsInput, maximumConvertible],
	)

	const projectedBattle = useMemo(() => {
		if (!selectedPoints) return 0

		const normalizedRatePoints = Number(ratePoints)
		const normalizedRateBattle = Number(rateBattle)
		const normalizedFeePercent = Number(feePercent)

		if (
			!Number.isFinite(normalizedRatePoints) ||
			normalizedRatePoints <= 0 ||
			!Number.isFinite(normalizedRateBattle)
		) {
			return 0
		}

		const grossBattleAmount =
			selectedPoints * (normalizedRateBattle / normalizedRatePoints)
		const feeMultiplier = Number.isFinite(normalizedFeePercent)
			? Math.max(0, 1 - normalizedFeePercent / 100)
			: 1

		return Math.max(grossBattleAmount * feeMultiplier, 0)
	}, [feePercent, rateBattle, ratePoints, selectedPoints])

	const remainingPoints = useMemo(
		() => Math.max(availablePoints - selectedPoints, 0),
		[availablePoints, selectedPoints],
	)
	const historyEntries = useMemo(() => {
		if (Array.isArray(history)) return history.filter(Boolean)
		if (Array.isArray(history?.history)) return history.history.filter(Boolean)
		return []
	}, [history])
	const canExpandHistory = historyEntries.length > 3
	const visibleHistoryEntries = useMemo(
		() =>
			isHistoryExpanded ? historyEntries : historyEntries.slice(0, 3),
		[historyEntries, isHistoryExpanded],
	)

	useEffect(() => {
		setIsHistoryExpanded(false)
	}, [historyEntries.length])

	const canConvert =
		selectedPoints > 0 && maximumConvertible > 0 && !isConverting

	const applyQuickAction = (action) => {
		switch (action?.type) {
			case 'decrement': {
				const nextValue = clampWholeNumber(
					selectedPoints - Number(action?.value || 0),
					0,
					maximumConvertible,
				)
				setSelectedPointsInput(nextValue > 0 ? String(nextValue) : '')
				return
			}
			case 'increment': {
				const nextValue = clampWholeNumber(
					selectedPoints + Number(action?.value || 0),
					0,
					maximumConvertible,
				)
				setSelectedPointsInput(nextValue > 0 ? String(nextValue) : '')
				return
			}
			case 'percentage': {
				const nextValue = clampWholeNumber(
					maximumConvertible * Number(action?.value || 0),
					0,
					maximumConvertible,
				)
				setSelectedPointsInput(nextValue > 0 ? String(nextValue) : '')
				return
			}
			case 'max':
				setSelectedPointsInput(
					maximumConvertible > 0 ? String(maximumConvertible) : '',
				)
				return
			case 'clear':
			default:
				setSelectedPointsInput('')
		}
	}

	const handleConvert = () => {
		if (!canConvert || typeof onConvert !== 'function') return

		onConvert({
			points: selectedPoints,
			projectedBattle,
			availablePoints,
			maxConvertible: maximumConvertible,
		})
	}

	return (
		<section
			className={cf(
				s.wMax,
				s.flex,
				s.flex_dColumn,
				c.panel,
				variant === 'popup' ? c.popupPanel : c.sectionPanel,
				className,
			)}
		>
			<header className={cf(s.wMax, s.flex, s.flex_dColumn, c.headerRow)}>
				<div className={cf(s.flex, s.flex_dColumn, c.titleBlock)}>
					<h3 className={cf(c.title)}>Convert points</h3>
					<p className={cf(c.balanceMeta)}>Available balances</p>
				</div>
			</header>
			<div className={cf(s.wMax, s.flex, s.flex_dColumn, c.controlsSection)}>
				<div className={cf(s.wMax, s.flex, c.balanceMetrics)}>
					<div className={cf(c.balanceCard, c.pointsBalanceCard)}>
						<span className={cf(c.balanceCardLabel)}>Points balance</span>
						<div className={cf(c.balanceCardValueRow)}>
							<span className={cf(c.balanceCardValue)}>
								{formatWholeNumber(availablePoints)}
							</span>
							<span className={cf(c.balanceCardUnit)}>PTS</span>
						</div>
					</div>
					<div className={cf(c.balanceCard, c.battleBalanceCard)}>
						<span className={cf(c.balanceCardLabel)}>$BATTLE balance</span>
						<div className={cf(c.balanceCardValueRow)}>
							<span className={cf(c.balanceCardValue)}>
								{formatBattleAmount(availableBattle)}
							</span>
							<span className={cf(c.balanceCardUnit)}>TOKEN</span>
						</div>
					</div>
				</div>
				<div className={cf(s.wMax, s.flex, s.flex_dColumn, c.converterSection)}>
					<label
						className={cf(s.flex, s.flex_dColumn, c.inputCard)}
						htmlFor={inputId}
					>
						<span className={cf(c.inputLabel)}>Points to convert</span>
						<input
							id={inputId}
							type='number'
							min='0'
							step='1'
							inputMode='numeric'
							pattern='[0-9]*'
							value={selectedPointsInput}
							onChange={(event) =>
								setSelectedPointsInput(
									event?.target?.value
										?.replace(/[^\d]/g, '')
										?.replace(/^0+(?=\d)/, '') ?? '',
								)
							}
							placeholder='0'
							className={cf(c.amountInput)}
						/>
					</label>
					<div className={cf(s.flex, c.actions)}>
						{QUICK_ACTIONS.map((action) => (
							<button
								key={action.label}
								type='button'
								className={cf(c.actionButton)}
								disabled={!maximumConvertible || isConverting}
								onClick={() => applyQuickAction(action)}
							>
								{action.label}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className={cf(c.divider)} />
			<div className={cf(s.wMax, s.flex, s.flex_dColumn, c.details)}>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Selected amount</span>
					<span className={cf(c.detailValue, c.highlightValue)}>
						{formatWholeNumber(selectedPoints)} points
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Available to convert</span>
					<span className={cf(c.detailValue)}>
						{formatWholeNumber(maximumConvertible)} points
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Conversion rate</span>
					<span className={cf(c.detailValue)}>
						{formatBattleAmount(rateBattle)} $BATTLE per{' '}
						{formatWholeNumber(ratePoints)} point
						{normalizeWholeNumber(ratePoints) === 1 ? '' : 's'}
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Fee</span>
					<span className={cf(c.detailValue)}>{feePercent}%</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Projected output</span>
					<span className={cf(c.detailValue)}>
						{formatBattleAmount(projectedBattle)} $BATTLE
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Remaining points</span>
					<span className={cf(c.detailValue)}>
						{formatWholeNumber(remainingPoints)} points
					</span>
				</div>
			</div>
			<div className={cf(s.wMax, s.flex, s.flexLeft, c.warningRow)}>
				<IoWarningOutline className={cf(c.warningIcon)} />
				<p className={cf(c.warningText)}>
					Conversion spends from your available points balance and cannot be
					undone once processed.
				</p>
			</div>
			<footer className={cf(s.wMax, s.flex, s.flexCenter, c.footer)}>
				<PolyButton
					tag={isConverting ? 'Converting...' : convertLabel}
					action={handleConvert}
					side='left'
					type='button'
					disabled={!canConvert}
					polyButton={cf(c.convertButton)}
					polyButtonText={cf(c.convertButtonText)}
				/>
			</footer>
			<section className={cf(s.wMax, s.flex, s.flex_dColumn, c.historySection)}>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.historyHeader)}>
					<h4 className={cf(c.historyTitle)}>Recent transactions</h4>
					<span className={cf(c.historyMeta)}>
						{historyEntries.length
							? `${visibleHistoryEntries.length} shown`
							: 'No recent activity'}
					</span>
				</div>
				{historyEntries.length ? (
					<div className={cf(s.wMax, s.flex, s.flex_dColumn, c.historyList)}>
						{visibleHistoryEntries.map((entry, index) => (
							<div
								key={`${entry?.txHash || entry?.createdAt || 'history'}-${index}`}
								className={cf(s.wMax, s.flex, s.spaceXBetween, c.historyItem)}
							>
								<div className={cf(s.flex, s.flex_dColumn, c.historyItemMain)}>
									<span className={cf(c.historyAmount)}>
										{formatBattleAmount(entry?.amount)}{' '}
										{entry?.currency || '$BATTLE'}
									</span>
									<span className={cf(c.historyDate)}>
										{formatHistoryDate(entry?.createdAt)}
									</span>
								</div>
								<span className={cf(c.historyStatus)}>
									{String(entry?.status || 'confirmed')
										.trim()
										.replace(/_/g, ' ')}
								</span>
							</div>
						))}
						{canExpandHistory ? (
							<button
								type='button'
								className={cf(c.historyToggle)}
								onClick={() =>
									setIsHistoryExpanded((currentValue) => !currentValue)
								}
							>
								{isHistoryExpanded ? 'Show less' : 'Show more'}
							</button>
						) : null}
					</div>
				) : (
					<p className={cf(c.historyEmpty)}>
						Your recent spending activity will appear here after your first
						purchase or conversion.
					</p>
				)}
			</section>
		</section>
	)
}
