'use client'

import { PolyButton } from '@/components/PolyButton'
import s from '@/styles'
import { cf } from '@/utils'
import { useEffect, useMemo, useState } from 'react'
import { IoWarningOutline } from 'react-icons/io5'
import c from './ConvertPointsPanel.module.css'

const QUICK_ACTIONS = [
	{ label: '+10', value: 10 },
	{ label: '+50', value: 50 },
]

const normalizeWholeNumber = (value) => {
	const numericValue = Number(value)

	if (!Number.isFinite(numericValue) || numericValue <= 0) return 0

	return Math.floor(numericValue)
}

const formatWholeNumber = (value) => normalizeWholeNumber(value).toLocaleString()

const formatBattleAmount = (value) => {
	const numericValue = Number(value)

	if (!Number.isFinite(numericValue) || numericValue <= 0) return '0'

	return numericValue.toLocaleString('en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: numericValue % 1 === 0 ? 0 : 1,
	})
}

export default function ConvertPointsPanel({
	pointsBalance = 0,
	battleBalance = 0,
	ratePoints = 100,
	rateBattle = 1,
	feePercent = 0,
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
	const [selectedPoints, setSelectedPoints] = useState(0)

	useEffect(() => {
		setSelectedPoints((currentValue) => Math.min(currentValue, availablePoints))
	}, [availablePoints])

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
			? 1 - normalizedFeePercent / 100
			: 1

		return Math.max(grossBattleAmount * feeMultiplier, 0)
	}, [feePercent, rateBattle, ratePoints, selectedPoints])

	const canConvert = selectedPoints > 0 && availablePoints > 0

	const handleQuickAdd = (increment) => {
		setSelectedPoints((currentValue) =>
			Math.min(currentValue + increment, availablePoints),
		)
	}

	const handleConvert = () => {
		if (!canConvert || typeof onConvert !== 'function') return

		onConvert({
			points: selectedPoints,
			projectedBattle,
			availablePoints,
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
			<header className={cf(s.wMax, s.flex, s.spaceXBetween, c.headerRow)}>
				<div className={cf(s.flex, s.flex_dColumn, c.titleBlock)}>
					<h3 className={cf(c.title)}>Convert points</h3>
					<p className={cf(c.balanceMeta)}>Available balances</p>
					<div className={cf(c.balanceMetrics)}>
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
				</div>
				<div className={cf(s.flex, s.flexRight, c.actions)}>
					{QUICK_ACTIONS.map((action) => (
						<button
							key={action.label}
							type='button'
							className={cf(c.actionButton)}
							disabled={!availablePoints}
							onClick={() => handleQuickAdd(action.value)}
						>
							{action.label}
						</button>
					))}
					<button
						type='button'
						className={cf(c.actionButton)}
						disabled={!availablePoints}
						onClick={() => setSelectedPoints(availablePoints)}
					>
						Max
					</button>
				</div>
			</header>
			<div className={cf(c.divider)} />
			<div className={cf(s.wMax, s.flex, s.flex_dColumn, c.details)}>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Selected Amount:</span>
					<span className={cf(c.detailValue, c.highlightValue)}>
						{formatWholeNumber(selectedPoints)} points
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Conversion Rate:</span>
					<span className={cf(c.detailValue)}>
						{rateBattle} $BATTLE per {ratePoints} points
					</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Fee:</span>
					<span className={cf(c.detailValue)}>{feePercent}%</span>
				</div>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, c.detailRow)}>
					<span className={cf(c.detailLabel)}>Projected Output:</span>
					<span className={cf(c.detailValue)}>
						{formatBattleAmount(projectedBattle)} $BATTLE
					</span>
				</div>
			</div>
			<div className={cf(s.wMax, s.flex, s.flexLeft, c.warningRow)}>
				<IoWarningOutline className={cf(c.warningIcon)} />
				<p className={cf(c.warningText)}>
					Converting points reduces your tournament score.
				</p>
			</div>
			<footer className={cf(s.wMax, s.flex, s.flexCenter, c.footer)}>
				<PolyButton
					tag={convertLabel}
					action={handleConvert}
					side='left'
					type='button'
					disabled={!canConvert}
					polyButton={cf(c.convertButton)}
					polyButtonText={cf(c.convertButtonText)}
				/>
			</footer>
		</section>
	)
}
