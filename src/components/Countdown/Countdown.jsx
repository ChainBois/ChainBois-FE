'use client'

import { useDebouncedEffect } from '@/hooks'
import s from '@/styles'
import { cf } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import c from './Countdown.module.css'

const Waiter = ({
	days,
	hours,
	minutes,
	seconds,
	referenceVal,
	countdownClass,
	text,
	showOnlyDays,
	CustomComponent,
}) => {
	return !CustomComponent ? (
		<span className={cf(countdownClass, s.dInlineBlock, c.countdown)}>
			{text}
			{referenceVal
				? showOnlyDays && days > 0
					? `${days}day${days > 1 ? 's' : ''}${
							hours > 0 ? ` ${hours}hour${hours > 1 ? 's' : ''}` : ''
						}`
					: `${days ? `${zeroPad(days)}:` : ''}${zeroPad(hours)}:${zeroPad(
							minutes,
						)}${!days ? `:${zeroPad(seconds)}` : ''}`
				: '--:--:--'}
		</span>
	) : (
		<CustomComponent
			days={days}
			hours={hours}
			minutes={minutes}
			seconds={seconds}
		/>
	)
}

const RenderCountdown = ({
	days,
	hours,
	minutes,
	seconds,
	completed,
	children,
	referenceVal,
	hasChildren,
	setContinueChecking,
	text,
	showOnlyDays,
	onComplete,
	countdownClass,
	api: { pause, start, stop, isPaused, isStopped, isCompleted },
	CustomComponent,
}) => {
	useEffect(() => {
		if (referenceVal) start?.()
		else pause?.()
	}, [referenceVal])

	useEffect(() => {
		if (completed) {
			setContinueChecking(() => false)
			if (onComplete) onComplete?.()
		}
	}, [completed])

	if (completed && hasChildren) {
		return <>{children}</>
	} else {
		return (
			<Waiter
				days={days}
				hours={hours}
				minutes={minutes}
				seconds={seconds}
				referenceVal={referenceVal}
				countdownClass={countdownClass}
				showOnlyDays={showOnlyDays}
				text={ text }
				CustomComponent={CustomComponent}
			/>
		)
	}
}

export default function CountdownComponent({
	timeReference,
	hasChildren = false,
	countdownClass = '',
	text = '',
	showOnlyDays = false,
	onComplete,
	children,
	overrideContinueChecking = false,
	CustomComponent,
}) {
	const [date, setDate] = useState(Date.now() + 20000)
	const [key, setKey] = useState(0)
	const [refIsAvailable, setReftIsAvailable] = useState(false)
	const [continueChecking, setContinueChecking] = useState(true)

	const countdownRef = useRef()

	useEffect(() => {
		if (timeReference) {
			const getTimeRemaining = () => {
				const getSafeDate = (input) =>
					new Date(input ?? new Date().toISOString())

				const startTime = getSafeDate(timeReference)

				const currentDate = new Date()

				// Calculate the time difference between the end date and the current date (in milliseconds)
				const timeDifference = startTime - currentDate
				return timeDifference <= 0 ? 0 : timeDifference
			}
			const timeRemaining = getTimeRemaining()
			setDate(() => Date.now() + timeRemaining)
			if (overrideContinueChecking || continueChecking) setKey((x) => x + 1)
			setReftIsAvailable((x) => true)
		} else {
			setReftIsAvailable((x) => false)
		}
	}, [])

	useDebouncedEffect(
		(deps) => {
			const [timeReference, continueChecking] = deps
			if (Boolean(timeReference)) {
				const getTimeRemaining = () => {
					const getSafeDate = (input) =>
						new Date(input ?? new Date().toISOString())

					const startTime = getSafeDate(timeReference)

					const currentDate = new Date()

					// Calculate the time difference between the end date and the current date (in milliseconds)
					const timeDifference = startTime - currentDate
					return timeDifference <= 0 ? 0 : timeDifference
				}
				const timeRemaining = getTimeRemaining()
				setDate(() => Date.now() + timeRemaining)
				if (overrideContinueChecking || continueChecking) setKey((x) => x + 1)
				setReftIsAvailable((x) => true)
			} else {
				setReftIsAvailable((x) => false)
			}
		},
		[timeReference, continueChecking, overrideContinueChecking],
		500,
	)

	return (
		<Countdown
			date={date}
			renderer={(props) => (
				<RenderCountdown
					referenceVal={refIsAvailable}
					hasChildren={hasChildren}
					setContinueChecking={setContinueChecking}
					countdownClass={countdownClass}
					text={text}
					showOnlyDays={showOnlyDays}
					onComplete={onComplete}
					autoStart={ false }
					CustomComponent={CustomComponent}
					{...props}
				>
					{children}
				</RenderCountdown>
			)}
			key={key}
			ref={countdownRef}
		/>
	)
}
