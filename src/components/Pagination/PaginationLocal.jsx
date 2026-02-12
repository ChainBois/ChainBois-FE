'use client'

import s from '@/styles'
import { cf } from '@/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import p from './Pagination.module.css'

// Helper functions moved outside component for better performance
const findPos = (array, index, step) => {
	if (!array?.length) return 1
	const inferredPos =
		index > array.length - 1 ? -1 : Math.ceil((index + 1) / step)
	return inferredPos
}

const returnPortion = (array, pos, step) => {
	if (!array?.length) return []
	const remainder = array.length % step
	const steps = Math.ceil(array.length / step)
	const portion =
		pos < 1
			? []
			: pos === steps && remainder
				? array.slice(array.length - remainder)
				: array.slice((pos - 1) * step, (pos - 1) * step + step)
	return portion
}

/**
 * A component that handles pagination for an array of items
 * @param {Object} props - The component props
 * @param {Array} props.array - The current portion of the array being displayed
 * @param {Function} props.setArray - Function to update the displayed array portion
 * @param {Array} [props.refArray=[]] - The reference array containing all items to paginate
 * @param {number} props.step - Number of items to show per page
 * @param {boolean} [props.full=false] - Whether to use full width styling
 * @param {boolean} [props.isPremium=false] - Whether to apply premium styling to navigation buttons
 * @returns {JSX.Element} A pagination component with next/previous navigation
 */
export default function Pagination({
	setArray,
	refArray = [],
	step,
	full = false,
	isPremium = false,
}) {
	const [pos, setPos] = useState(1)

	// Memoize derived values
	const { totalSteps, currentPortion } = useMemo(() => {
		const safeArray = Array.isArray(refArray) ? refArray : []
		const totalSteps = Math.ceil(safeArray.length / step)
		const currentPortion = returnPortion(
			safeArray,
			Math.min(totalSteps, pos),
			step,
		)
		return { totalSteps, currentPortion }
	}, [refArray, pos, step])

	// Memoize handlers
	const moveLeft = useCallback(() => {
		setPos((x) => Math.max(1, Math.min(totalSteps, x - 1)))
	}, [totalSteps])

	const moveRight = useCallback(() => {
		setPos((x) => Math.min(totalSteps, x + 1))
	}, [totalSteps])

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === 'ArrowLeft') {
				moveLeft()
			} else if (e.key === 'ArrowRight') {
				moveRight()
			}
		},
		[moveLeft, moveRight],
	)

	// Update array when portion changes
	useEffect(() => {
		setArray(currentPortion)
	}, [currentPortion, setArray])

	return (
		<div
			className={cf(
				s.flex,
				s.spaceXBetween,
				s.spaceYCenter,
				p.parent,
				full ? p.full : '',
			)}
			role='navigation'
			aria-label='Pagination Navigation'
			onKeyDown={handleKeyDown}
		>
			{/* <div className={cf(s.flex, s.flexLeft, s.flexOne, p.stepsCon)}>
                <span className={cf(s.wMax, s.dInlineBlock, p.showingWrapper)}>
                    {currentPortion?.length > 0 && (
                        <span
                            className={cf(s.dInlineBlock, s.tCenter, p.showing)}
                            role="status"
                            aria-live="polite"
                        >
                            {`Showing - ${pos} of ${totalSteps}`}
                        </span>
                    )}
                </span>
            </div> */}
			<div
				className={cf(
					s.flex,
					s.spaceXBetween,
					s.spaceYCenter,
					s.flexOne,
					p.navigationBtns,
				)}
				role='group'
				aria-label='Page navigation'
			>
				<button
					className={cf(
						s.flex,
						s.flexCenter,
						p.navigationBtn,
						p.nav1,
						isPremium ? p.isPremium : '',
					)}
					onClick={moveLeft}
					disabled={currentPortion?.length === 0 || pos <= 1}
					type='button'
					aria-label='Previous page'
				>
					<div className={cf(s.flex, s.flexCenter, p.pageIconWrapper)}>
						<BsArrowLeft className={cf(p.pageIcon)} />
					</div>
					<span className={cf(p.hide)}>Previous</span>
				</button>
				<button
					className={cf(
						s.flex,
						s.flexCenter,
						p.navigationBtn,
						p.nav2,
						isPremium ? p.isPremium : '',
					)}
					onClick={moveRight}
					disabled={currentPortion?.length === 0 || pos >= totalSteps}
					type='button'
					aria-label='Next page'
				>
					<span className={cf(p.hide)}>Next</span>
					<div className={cf(s.flex, s.flexCenter, p.pageIconWrapper)}>
						<BsArrowRight className={cf(p.pageIcon)} />
					</div>
				</button>
			</div>
		</div>
	)
}
