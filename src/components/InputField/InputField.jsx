'use client'

import { Shared as s } from '@/styles';
import { cf } from '@/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Select from 'react-select';
import styles from './InputField.module.css';
import { getFieldValue, resolveMinimumDatetime, resolveTagName } from './utils';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Required field indicator asterisk
 */
const RequiredMark = () => <span className={styles.requiredMark}>*</span>

/**
 * Floating text badge displayed on inputs
 * @param {Object} props
 * @param {string} props.text - Text to display
 * @param {boolean} props.resolved - Whether to show resolved styling
 */
const FloatingBadge = ({ text, resolved = true }) => {
	if (text === null) return null

	return (
		<span
			className={cf(
				s.flex,
				s.flexCenter,
				s.p_absolute,
				styles.floatingText,
				resolved && styles.floatingTextResolved
			)}
		>
			{text}
		</span>
	)
}

/**
 * Password visibility toggle button
 * @param {Object} props
 * @param {boolean} props.visible - Current visibility state
 * @param {Function} props.onToggle - Toggle handler
 */
const VisibilityToggle = ({ visible, onToggle }) => {
	const Icon = visible ? FaRegEyeSlash : FaRegEye

	return (
		<Icon
			onClick={onToggle}
			className={cf(s.flex, s.pointer, styles.setVisible)}
			aria-label={visible ? 'Hide password' : 'Show password'}
		/>
	)
}

/**
 * Input label with optional required indicator
 * @param {Object} props
 * @param {string} props.htmlFor - Associated input ID
 * @param {string} props.text - Label text
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.className - Additional classes
 */
const InputLabel = ({ htmlFor, text, required = true, className = '' }) => (
	<label
		htmlFor={htmlFor}
		className={cf(s.wMax, s.tLeft, s.m0, s.p0, styles.innerLabel, className)}
	>
		{text} {required && <RequiredMark />}
	</label>
)

// ============================================================================
// EXPORTED SUB-COMPONENTS
// ============================================================================

/**
 * Custom select option button for visual selection interfaces
 * @param {Object} props
 * @param {Object} props.selection - Currently selected value
 * @param {Function} props.setValue - State setter function
 * @param {string|React.ReactNode} props.label - Option label
 * @param {*} props.value - Option value
 * @param {string} props.name - Field name
 * @param {boolean} props.optionLabelIsJSX - Whether label is JSX content
 */
export const SelectOption = ({
	selection,
	setValue,
	label,
	value,
	name,
	optionLabelIsJSX = false,
}) => {
	const isSelected = selection?.value === value
	const className = cf(
		s.flex,
		s.flexCenter,
		styles.selectionOptionCus,
		isSelected && styles.selectedCus
	)

	const handleClick = () => {
		setValue((prev) => ({
			...prev,
			[name]: { label, value },
		}))
	}

	// Use div for JSX content (accessibility with role), button for text
	const Element = optionLabelIsJSX ? 'div' : 'button'
	const extraProps = optionLabelIsJSX
		? { role: 'button', tabIndex: 0 }
		: { type: 'button' }

	return (
		<Element className={className} onClick={handleClick} {...extraProps}>
			{label}
		</Element>
	)
}

/**
 * Container for side-by-side input fields
 * @param {Object} props
 * @param {string} props.className - Additional classes
 * @param {React.ReactNode} props.children - Child input fields
 */
export const InputFieldCon = ({ className = '', children }) => (
	<div
		className={cf(
			s.wMax,
			s.flex,
			s.spaceXBetween,
			s.spaceYEnd,
			styles.inputFieldCon,
			className
		)}
	>
		{children}
	</div>
)

/**
 * Wrapper with validation notice indicator
 * @param {Object} props
 * @param {string} props.notice - Notice text to display
 * @param {boolean|null} props.indicator - null=neutral, true=positive, false=negative
 * @param {React.ReactNode} props.children - Child content
 */
export const InputWrapper = ({ notice, indicator, children }) => {
	const noticeClass =
		indicator === null
			? styles.neutralNotice
			: indicator
				? styles.positiveNotice
				: styles.negativeNotice

	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, styles.inputWrapper)}>
			{children}
			<span className={cf(s.wMax, styles.inputLittleNotice, noticeClass)}>
				{notice}
			</span>
		</div>
	)
}

/**
 * Standalone label component
 * @param {Object} props
 * @param {string} props.tag - Associated input ID
 * @param {string} props.label - Label text
 * @param {boolean} props.mini - Use compact sizing
 * @param {boolean} props.required - Show required indicator
 * @param {React.ReactNode} props.children - Additional content
 */
export const Label = ({
	tag,
	label,
	mini = false,
	required = true,
	children,
}) => (
	<label
		htmlFor={tag}
		className={cf(
			s.wMax,
			s.flex,
			s.flexLeft,
			s.tLeft,
			styles.label_,
			mini && styles.mini
		)}
	>
		<InputLabel htmlFor={tag} text={label} required={required} />
		{children}
	</label>
)

// ============================================================================
// REACT-SELECT CONFIGURATION
// ============================================================================

/**
 * Generates react-select class names with custom overrides
 * @param {Object} customClasses - Custom class overrides
 * @param {boolean} isMulti - Whether multi-select mode
 * @returns {Object} Class names configuration object
 */
const createSelectClassNames = (customClasses = {}, isMulti = false) => ({
	control: () =>
		cf(
			s.wMax,
			s.flex,
			s.m0,
			s.bNone,
			styles.input,
			styles.selectControl_,
			customClasses.control ?? ''
		),
	option: () => cf(s.flex, s.flexLeft, styles.selectOption, customClasses.option ?? ''),
	valueContainer: () =>
		cf(s.p0, styles.valueContainer, customClasses.valueContainer ?? ''),
	selectControl: () => cf(styles.selectControl_, customClasses.selectControl ?? ''),
	indicatorsContainer: () =>
		cf(s.p0, s.m0, styles.indicatorsContainer, customClasses.indicatorsContainer ?? ''),
	placeholder: () => cf(styles.placeholder, customClasses.placeholder ?? ''),
	menu: () => cf(styles.menu, customClasses.menu ?? ''),
	singleValue: () => cf(styles.singleValue, customClasses.singleValue ?? ''),
	multiValue: () => cf(styles.multiValue, customClasses.multiValue ?? ''),
	multiValueLabel: () =>
		cf(styles.multiValueLabel, customClasses.multiValueLabel ?? ''),
	multiValueRemove: () =>
		cf(styles.multiValueRemove, customClasses.multiValueRemove ?? ''),
})

// ============================================================================
// INPUT TYPE RENDERERS
// ============================================================================

/**
 * Renders a react-select dropdown
 */
const SelectInput = ({
	tag,
	state,
	handler,
	placeholder,
	selectOptions,
	isMulti,
	doppel,
	customClasses,
	...props
}) => {
	const name = resolveTagName(tag, doppel)
	const value = getFieldValue(state, tag, doppel)

	return (
		<Select
			placeholder={placeholder}
			name={name}
			onChange={handler}
			options={selectOptions}
			value={value}
			isMulti={isMulti}
			isSearchable={false}
			classNamePrefix="react-select"
			className={cf(
				s.wMax,
				s.flex,
				s.spaceXBetween,
				s.spaceYCenter,
				s.p0,
				styles.select,
				isMulti && styles.ignoreHeight,
				customClasses?.select ?? ''
			)}
			classNames={createSelectClassNames(customClasses, isMulti)}
			{...props}
		/>
	)
}

/**
 * Renders custom visual select options
 */
const CustomSelectInput = ({
	tag,
	state,
	setState,
	selectOptions,
	optionLabelIsJSX,
}) => (
	<div className={cf(s.wMax, s.flex, s.flexLeft, styles.selectionOptionWrapper)}>
		{selectOptions?.map((option, index) => (
			<SelectOption
				key={index}
				name={tag}
				setValue={setState}
				label={option.label}
				value={option.value}
				selection={state[tag]}
				optionLabelIsJSX={optionLabelIsJSX}
			/>
		))}
	</div>
)

/**
 * Renders a textarea input
 */
const TextareaInput = ({
	tag,
	state,
	handler,
	placeholder,
	rows,
	doppel,
	isPassword,
	visible,
	required,
	inputRef,
	className,
	...props
}) => {
	const name = resolveTagName(tag, doppel)
	const value = getFieldValue(state, tag, doppel) || ''
	const type = isPassword ? (visible ? 'text' : 'password') : 'text'

	return (
		<textarea
			id={tag}
			name={name}
			type={type}
			placeholder={placeholder}
			ref={inputRef}
			rows={rows}
			className={cf(
				s.wMax,
				s.flex,
				styles.input_,
				isPassword && styles.password,
				className
			)}
			onChange={handler}
			value={value}
			required={required}
			{...props}
		/>
	)
}

/**
 * Renders a standard input element
 */
const StandardInput = ({
	tag,
	state,
	handler,
	type,
	placeholder,
	doppel,
	isPassword,
	visible,
	required,
	inputRef,
	className,
	calculatedMin,
	...props
}) => {
	const name = resolveTagName(tag, doppel)
	const value = getFieldValue(state, tag, doppel) || ''
	const inputType = isPassword ? (visible ? 'text' : 'password') : type

	// Prevent scroll changing number inputs
	const handleWheel = type === 'number' ? (e) => e.target.blur() : undefined

	// Date-filled state for styling
	const isDateFilled = type === 'date' && state[tag]

	return (
		<input
			id={tag}
			name={name}
			type={inputType}
			placeholder={placeholder}
			ref={inputRef}
			className={cf(
				s.flex,
				s.wMax,
				styles.input_,
				isPassword && styles.password,
				isDateFilled && styles.filled,
				className
			)}
			onChange={handler}
			value={value}
			required={required}
			onWheel={handleWheel}
			{...(type === 'datetime-local' && calculatedMin && { min: calculatedMin })}
			{...props}
		/>
	)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Versatile input field component supporting multiple input types
 *
 * @param {Object} props - Component props
 * @param {string} props.tag - Unique identifier and name attribute
 * @param {Object} props.state - Form state object
 * @param {Function} props.setState - State setter (for custom select)
 * @param {Function} props.handler - onChange handler
 * @param {string} props.type - Input type (text, password, select, date, datetime-local, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} [props.mini=false] - Use compact width (48%)
 * @param {boolean} [props.required=true] - Whether field is required
 * @param {Array} [props.selectOptions] - Options for select inputs
 * @param {boolean} [props.isMulti=false] - Enable multi-select
 * @param {string} [props.label=''] - Field label text
 * @param {boolean} [props.useTextarea=false] - Render as textarea
 * @param {number} [props.rows=4] - Textarea rows
 * @param {boolean} [props.doppel=false] - Use tag prefix before hyphen as name
 * @param {boolean} [props.useCustomSelect=false] - Use visual custom select
 * @param {string} [props.cusClass] - Custom input class
 * @param {boolean} [props.showLabel=true] - Whether to show label
 * @param {string} [props.cusLabel=''] - Custom label container class
 * @param {boolean} [props.optionLabelIsJSX=false] - Whether select option labels are JSX
 * @param {string|null} [props.floatingText=null] - Floating badge text
 * @param {boolean} [props.floatingTextResolved=true] - Floating badge resolved state
 * @param {string|Object} [props.min] - Minimum value (string or dynamic config for datetime)
 * @param {Object} [props.cusClasses] - Custom class overrides for react-select
 */
const InputField = ({
	tag,
	state,
	setState,
	handler,
	type,
	placeholder,
	mini = false,
	required = true,
	selectOptions = null,
	isMulti = false,
	label = '',
	useTextarea = false,
	rows = 4,
	doppel = false,
	useCustomSelect = false,
	cusClass,
	showLabel = true,
	cusLabel = '',
	optionLabelIsJSX = false,
	floatingText = null,
	floatingTextResolved = true,
	min,
	cusClasses,
	...props
}) => {
	// ========================================
	// STATE & REFS
	// ========================================

	const [visible, setVisible] = useState(false)
	const inputRef = useRef(null)
	const isPassword = type === 'password'

	// ========================================
	// DATETIME MINIMUM CALCULATION
	// ========================================

	// Memoized minimum value - updates every minute for dynamic configs
	const calculatedMin = useMemo(() => {
		if (type !== 'datetime-local') return min
		return resolveMinimumDatetime(min)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type, min, Math.floor(Date.now() / 60000)])

	// Setup interval for dynamic minimum updates
	useEffect(() => {
		if (type !== 'datetime-local' || typeof min !== 'object' || !min) {
			return
		}

		const interval = setInterval(() => {
			// Trigger recalculation via memoization dependency
		}, 60000)

		return () => clearInterval(interval)
	}, [type, min])

	// ========================================
	// COMPUTED VALUES
	// ========================================

	const isSelectType = type === 'select'
	const isSpecialHeight = type === 'range' || type === 'date'

	const labelContainerClass = cf(
		s.wMax,
		s.flex,
		s.flexLeft,
		s.p_relative,
		mini && styles.mini,
		cusLabel,
		!isSelectType && s.tLeft,
		!isSelectType && styles.label_,
		!isSelectType && isSpecialHeight && styles.ignoreHeight
	)

	// ========================================
	// RENDER: SELECT TYPE
	// ========================================

	if (isSelectType) {
		return (
			<label htmlFor={tag} className={labelContainerClass}>
				{showLabel && (
					<InputLabel
						htmlFor={tag}
						text={label}
						required={required}
						className={isMulti ? styles.noMargin : ''}
					/>
				)}

				{useCustomSelect ? (
					<CustomSelectInput
						tag={tag}
						state={state}
						setState={setState}
						selectOptions={selectOptions}
						optionLabelIsJSX={optionLabelIsJSX}
					/>
				) : (
					<SelectInput
						tag={tag}
						state={state}
						handler={handler}
						placeholder={placeholder}
						selectOptions={selectOptions}
						isMulti={isMulti}
						doppel={doppel}
						customClasses={cusClasses}
						{...props}
					/>
				)}

				<FloatingBadge text={floatingText} resolved={floatingTextResolved} />
			</label>
		)
	}

	// ========================================
	// RENDER: TEXT/INPUT TYPES
	// ========================================

	return (
		<label htmlFor={tag} className={labelContainerClass}>
			{showLabel && (
				<InputLabel htmlFor={tag} text={label} required={required} />
			)}

			{useTextarea ? (
				<TextareaInput
					tag={tag}
					state={state}
					handler={handler}
					placeholder={placeholder}
					rows={rows}
					doppel={doppel}
					isPassword={isPassword}
					visible={visible}
					required={required}
					inputRef={inputRef}
					className={cusClass}
					{...props}
				/>
			) : (
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.p_relative,
						s.spaceYCenter
					)}
				>
					<StandardInput
						tag={tag}
						state={state}
						handler={handler}
						type={type}
						placeholder={placeholder}
						doppel={doppel}
						isPassword={isPassword}
						visible={visible}
						required={required}
						inputRef={inputRef}
						className={cusClass}
						calculatedMin={calculatedMin}
						{...props}
					/>

					{isPassword && (
						<VisibilityToggle
							visible={visible}
							onToggle={() => setVisible((v) => !v)}
						/>
					)}
				</div>
			)}

			<FloatingBadge text={floatingText} resolved={floatingTextResolved} />
		</label>
	)
}

export default InputField
