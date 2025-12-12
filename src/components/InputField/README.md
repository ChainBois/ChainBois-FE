# InputField Component

A versatile, highly customizable input field component for React applications. Supports multiple input types including text, password, select dropdowns, custom visual selects, textareas, dates, and datetime-local inputs with dynamic minimum calculation.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [InputField](#inputfield)
  - [InputFieldCon](#inputfieldcon)
  - [InputWrapper](#inputwrapper)
  - [Label](#label)
  - [SelectOption](#selectoption)
- [Utility Functions](#utility-functions)
- [Props Reference](#props-reference)
- [Examples](#examples)
- [Styling](#styling)
- [Architecture](#architecture)

---

## Installation

Ensure you have the required dependencies:

```bash
npm install react-select react-icons
```

Import the component:

```javascript
import { InputField, InputFieldCon, InputWrapper, Label } from '@/components/InputField'
```

---

## Quick Start

```jsx
import { useState } from 'react'
import { InputField } from '@/components/InputField'

function MyForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form>
      <InputField
        tag="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        state={formData}
        handler={handleChange}
      />
      
      <InputField
        tag="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        state={formData}
        handler={handleChange}
      />
    </form>
  )
}
```

---

## Components

### InputField

The main input component supporting multiple input types.

#### Basic Usage

```jsx
<InputField
  tag="username"
  type="text"
  label="Username"
  placeholder="Enter username"
  state={formState}
  handler={handleChange}
/>
```

#### Supported Types

| Type | Description |
|------|-------------|
| `text` | Standard text input |
| `password` | Password input with visibility toggle |
| `email` | Email input |
| `number` | Numeric input (scroll disabled) |
| `tel` | Telephone input |
| `date` | Date picker |
| `datetime-local` | DateTime picker with dynamic minimum support |
| `range` | Range slider |
| `select` | Dropdown select (react-select or custom) |

---

### InputFieldCon

Container for arranging input fields side-by-side.

```jsx
import { InputFieldCon, InputField } from '@/components/InputField'

<InputFieldCon>
  <InputField
    tag="firstName"
    type="text"
    label="First Name"
    mini={true}
    state={formState}
    handler={handleChange}
  />
  <InputField
    tag="lastName"
    type="text"
    label="Last Name"
    mini={true}
    state={formState}
    handler={handleChange}
  />
</InputFieldCon>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `ReactNode` | - | Child input fields |

---

### InputWrapper

Wrapper component that adds validation notice indicators below inputs.

```jsx
import { InputWrapper, InputField } from '@/components/InputField'

<InputWrapper
  notice="Email is valid"
  indicator={true}  // true = green, false = red, null = neutral
>
  <InputField
    tag="email"
    type="email"
    state={formState}
    handler={handleChange}
  />
</InputWrapper>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `notice` | `string` | - | Notice text to display |
| `indicator` | `boolean \| null` | - | `null` = neutral (gray), `true` = positive (green), `false` = negative (red) |
| `children` | `ReactNode` | - | Child content |

---

### Label

Standalone label component for custom layouts.

```jsx
import { Label } from '@/components/InputField'

<Label
  tag="customField"
  label="Custom Field"
  required={true}
  mini={false}
>
  <CustomInput id="customField" />
</Label>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `string` | - | Associated input ID |
| `label` | `string` | - | Label text |
| `mini` | `boolean` | `false` | Use compact sizing |
| `required` | `boolean` | `true` | Show required indicator |
| `children` | `ReactNode` | - | Additional content |

---

### SelectOption

Custom visual select option button.

```jsx
import { SelectOption } from '@/components/InputField'

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
]

{options.map((opt, i) => (
  <SelectOption
    key={i}
    name="mySelect"
    label={opt.label}
    value={opt.value}
    selection={formState.mySelect}
    setValue={setFormState}
  />
))}
```

---

## Utility Functions

### Value Extraction

#### `getInputValue(prop, requestBody)`

Extracts a single value from a form state object.

```javascript
import { getInputValue } from '@/components/InputField'

const state = {
  name: 'John',
  country: { label: 'USA', value: 'us' }
}

getInputValue('name', state)    // 'John'
getInputValue('country', state) // 'us'
```

#### `getActualInputValues(requestBody)`

Extracts all values from a form state object, unwrapping react-select values.

```javascript
import { getActualInputValues } from '@/components/InputField'

const state = {
  name: 'John',
  country: { label: 'USA', value: 'us' },
  tags: [
    { label: 'Tag1', value: 't1' },
    { label: 'Tag2', value: 't2' }
  ]
}

getActualInputValues(state)
// { name: 'John', country: 'us', tags: ['t1', 't2'] }
```

### DateTime Utilities

#### `formatDatetimeLocal(date)`

Formats a Date object to datetime-local input format.

```javascript
import { formatDatetimeLocal } from '@/components/InputField'

formatDatetimeLocal(new Date()) // '2024-01-15T14:30'
```

#### `calculateDynamicMinimum(config)`

Calculates a future datetime based on offset configuration.

```javascript
import { calculateDynamicMinimum } from '@/components/InputField'

// Current time + 2 hours
calculateDynamicMinimum({ hours: 2 })

// Tomorrow at current time
calculateDynamicMinimum({ days: 1, minutes: 0 })

// Default: current time + 35 minutes
calculateDynamicMinimum()
```

#### `resolveMinimumDatetime(minProp)`

Resolves minimum datetime value (string or dynamic config).

```javascript
import { resolveMinimumDatetime } from '@/components/InputField'

// Static string
resolveMinimumDatetime('2024-01-15T10:00')  // '2024-01-15T10:00'

// Dynamic config
resolveMinimumDatetime({ hours: 1 })  // Current time + 1 hour
```

---

## Props Reference

### InputField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `string` | **required** | Unique identifier and name attribute |
| `state` | `object` | **required** | Form state object |
| `setState` | `function` | - | State setter (required for custom select) |
| `handler` | `function` | **required** | onChange handler |
| `type` | `string` | **required** | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `label` | `string` | `''` | Field label text |
| `required` | `boolean` | `true` | Whether field is required |
| `mini` | `boolean` | `false` | Use compact width (48%) |
| `showLabel` | `boolean` | `true` | Whether to show label |
| `useTextarea` | `boolean` | `false` | Render as textarea |
| `rows` | `number` | `4` | Textarea rows |
| `doppel` | `boolean` | `false` | Use tag prefix before hyphen as name |
| `selectOptions` | `array` | `null` | Options for select inputs |
| `isMulti` | `boolean` | `false` | Enable multi-select |
| `useCustomSelect` | `boolean` | `false` | Use visual custom select |
| `optionLabelIsJSX` | `boolean` | `false` | Whether select option labels are JSX |
| `min` | `string \| object` | - | Minimum value (see below) |
| `floatingText` | `string \| null` | `null` | Floating badge text |
| `floatingTextResolved` | `boolean` | `true` | Floating badge resolved state |
| `cusClass` | `string` | - | Custom input class |
| `cusLabel` | `string` | `''` | Custom label container class |
| `cusClasses` | `object` | - | Custom class overrides for react-select |

### Dynamic Minimum Configuration (datetime-local)

The `min` prop for datetime-local inputs accepts either:

**Static string:**
```jsx
<InputField type="datetime-local" min="2024-01-15T10:00" ... />
```

**Dynamic config object:**
```jsx
// Minimum 35 minutes from now (default)
<InputField type="datetime-local" min={{ minutes: 35 }} ... />

// Minimum 2 hours from now
<InputField type="datetime-local" min={{ hours: 2 }} ... />

// Minimum tomorrow
<InputField type="datetime-local" min={{ days: 1, hours: 0, minutes: 0 }} ... />
```

---

## Examples

### Text Input

```jsx
<InputField
  tag="username"
  type="text"
  label="Username"
  placeholder="Enter your username"
  state={formState}
  handler={handleChange}
  required={true}
/>
```

### Password Input

Password inputs automatically include a visibility toggle.

```jsx
<InputField
  tag="password"
  type="password"
  label="Password"
  placeholder="Enter your password"
  state={formState}
  handler={handleChange}
/>
```

### Select Dropdown (react-select)

```jsx
const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
]

<InputField
  tag="country"
  type="select"
  label="Country"
  placeholder="Select a country"
  selectOptions={countryOptions}
  state={formState}
  handler={(selectedOption) => {
    setFormState(prev => ({ ...prev, country: selectedOption }))
  }}
/>
```

### Multi-Select

```jsx
<InputField
  tag="skills"
  type="select"
  label="Skills"
  placeholder="Select skills"
  selectOptions={skillOptions}
  isMulti={true}
  state={formState}
  handler={(selectedOptions) => {
    setFormState(prev => ({ ...prev, skills: selectedOptions }))
  }}
/>
```

### Custom Visual Select

```jsx
const sizeOptions = [
  { label: 'Small', value: 's' },
  { label: 'Medium', value: 'm' },
  { label: 'Large', value: 'l' },
]

<InputField
  tag="size"
  type="select"
  label="Size"
  selectOptions={sizeOptions}
  useCustomSelect={true}
  state={formState}
  setState={setFormState}
/>
```

### Textarea

```jsx
<InputField
  tag="bio"
  type="text"
  label="Biography"
  placeholder="Tell us about yourself"
  useTextarea={true}
  rows={6}
  state={formState}
  handler={handleChange}
/>
```

### DateTime with Dynamic Minimum

```jsx
// Event must be at least 2 hours from now
<InputField
  tag="eventTime"
  type="datetime-local"
  label="Event Time"
  min={{ hours: 2 }}
  state={formState}
  handler={handleChange}
/>
```

### Side-by-Side Inputs

```jsx
<InputFieldCon>
  <InputField
    tag="firstName"
    type="text"
    label="First Name"
    mini={true}
    state={formState}
    handler={handleChange}
  />
  <InputField
    tag="lastName"
    type="text"
    label="Last Name"
    mini={true}
    state={formState}
    handler={handleChange}
  />
</InputFieldCon>
```

### With Validation Notice

```jsx
<InputWrapper
  notice={emailError || "Email looks good!"}
  indicator={emailError ? false : true}
>
  <InputField
    tag="email"
    type="email"
    label="Email"
    state={formState}
    handler={handleChange}
  />
</InputWrapper>
```

### With Floating Badge

```jsx
<InputField
  tag="wallet"
  type="text"
  label="Wallet Address"
  placeholder="Enter wallet address"
  floatingText="Verified"
  floatingTextResolved={true}
  state={formState}
  handler={handleChange}
/>
```

### Doppelganger Fields

Use `doppel` for fields that share the same state key but need unique DOM IDs:

```jsx
<>
  <InputField
    tag="email-primary"
    type="email"
    label="Primary Email"
    doppel={true}  // Uses "email" as state key
    state={formState}
    handler={handleChange}
  />
  <InputField
    tag="email-confirm"
    type="email"
    label="Confirm Email"
    doppel={true}  // Also uses "email" as state key
    state={formState}
    handler={handleChange}
  />
</>
```

---

## Styling

### CSS Variables Used

The component relies on these CSS variables:

```css
:root {
  --font-inter: 'Inter', sans-serif;
  --yellow: #ffd700;
  --red: #e41d1d;
  --success: #70c16c;
  --not-black: #1a1a1a;
}
```

### Custom Class Overrides (react-select)

Use `cusClasses` to override react-select styles:

```jsx
<InputField
  tag="customSelect"
  type="select"
  selectOptions={options}
  cusClasses={{
    control: 'my-control-class',
    option: 'my-option-class',
    menu: 'my-menu-class',
    placeholder: 'my-placeholder-class',
    singleValue: 'my-single-value-class',
    multiValue: 'my-multi-value-class',
    multiValueLabel: 'my-multi-value-label-class',
    multiValueRemove: 'my-multi-value-remove-class',
    valueContainer: 'my-value-container-class',
    indicatorsContainer: 'my-indicators-class',
  }}
  state={formState}
  handler={handleChange}
/>
```

---

## Architecture

```
InputField/
├── index.js              # Public exports
├── InputField.jsx        # Main component & sub-components
├── InputField.module.css # Component styles
├── utils.js              # Utility functions
└── README.md             # Documentation
```

### File Responsibilities

| File | Purpose |
|------|---------|
| `index.js` | Barrel exports for clean imports |
| `InputField.jsx` | Main component, sub-components, and rendering logic |
| `utils.js` | Pure utility functions for datetime and value extraction |
| `InputField.module.css` | All component styles with CSS Modules |

### Design Decisions

1. **Composition over Configuration**: Sub-components (`InputWrapper`, `Label`, `SelectOption`) allow flexible composition while the main `InputField` provides convenience.

2. **Dynamic DateTime Minimum**: The `min` prop accepts both static strings (backward compatible) and dynamic config objects for business logic requirements.

3. **Doppelganger Pattern**: The `doppel` prop allows multiple inputs to share state while maintaining unique DOM IDs.

4. **CSS Modules**: Scoped styles prevent conflicts while allowing CSS variable customization.

5. **Utility Separation**: Pure functions extracted to `utils.js` for testability and reuse.

---

## Migration from Previous Version

The refactored version is fully backward compatible. Key improvements:

1. **Cleaner Code Organization**: Utilities moved to separate file
2. **Better Documentation**: JSDoc comments throughout
3. **Improved Readability**: Extracted sub-components for rendering logic
4. **Enhanced CSS Organization**: Styles organized by concern with comments
5. **Additional Exports**: New utility functions available for external use

No breaking changes to the public API.
