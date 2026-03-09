# Popups System

This folder contains modal popup UIs rendered through `src/components/Modal/Modal.jsx`, powered by `NotificationSystemContext`.

## Components

- `Alert.jsx`: confirmation/info popup used by `displayAlert(..., { useShowAlert: true })` and `showAlert(...)` flow.
- `Loading.jsx`: non-blocking/blocking linear process loader.
- `CreationProgress.jsx`: staged creation progress popup with 3-stage state.
- `Error.jsx`: dedicated error popup with optional retry action.
- `Popups.module.css`: shared popup shell styles.
- `Alert.module.css`, `Loading.module.css`, `Error.module.css`: type-specific styles.

## Architecture Flow

1. `useNotifications()` exposes modal state + popup control methods from `NotificationSystemContext`.
2. `Modal.jsx` maps `modal` key to popup component (`loading`, `error`, `alert`).
3. Popup methods set modal payload + modal visibility.
4. Popup components render payload and can close themselves through revoke methods.

## API (Invoke / Revoke)

Use this in any client component/context:

```jsx
import { useNotifications } from '@/hooks'

const {
  showLoading,
  hideLoading,
  showCreationProgress,
  hideCreationProgress,
  showError,
  hideError,
  showAlert,
  setShowModal,
} = useNotifications()
```

### Loading popup (linear)

Invoke:

```jsx
showLoading({
  title: 'Linking Wallet',
  message: 'Please wait while we connect your gamer profile.',
  canClose: false, // true lets user close manually
})
```

Revoke:

```jsx
hideLoading()
// or setShowModal(false)
```

### CreationProgress popup (staged)

Invoke:

```jsx
showCreationProgress({
  title: 'Completing Transaction',
  message: 'Submitting your request on-chain.',
  successMessage: 'Done. Finalizing...',
  canClose: false,
})
```

Revoke:

```jsx
hideCreationProgress()
// or setShowModal(false)
```

### Error popup

Invoke:

```jsx
showError({
  title: 'Link Failed',
  message: 'We could not link this wallet to your account.',
  details: 'Server returned 401 for address validation.',
  code: 'WALLET_LINK_401',
  actionTag: 'Retry',
  action: () => retryLink(),
  canClose: true,
})
```

Revoke:

```jsx
hideError()
// or setShowModal(false)
```

### Alert popup (info/confirm)

Info-only invoke:

```jsx
await showAlert({
  title: 'Notice',
  message: 'Your profile was updated successfully.',
  forConfirmation: false,
})
```

Confirm invoke:

```jsx
const result = await showAlert({
  title: 'Confirm Action',
  message: 'Do you want to continue?',
  forConfirmation: true,
  neg: { tag: 'Cancel', value: false },
  pos: { tag: 'Continue', value: true },
})

if (result) {
  proceed()
}
```

Revoke:

- User clicks `Okay`/`Cancel`/`Continue`/close icon in `Alert`.
- Internally `setShowModal(false)` is used.

## Using `displayAlert` vs popup methods

- `displayAlert(...)`:
  - uses toast when available (`useShowAlert: false`)
  - falls back to alert modal otherwise
- `showAlert(...)`: always modal alert.
- `showLoading(...)` and `showError(...)`: always modal.

Example forcing modal alert:

```jsx
displayAlert({
  title: 'Dear Gamer',
  message: 'Please connect a wallet first.',
  useShowAlert: true,
})
```

## Stage states for `CreationProgress`

`CreationProgress.jsx` reads these context states:

- `stage1`
- `stage2`
- `stage3`
- `complete`

Each stage accepts:

```js
{
  tag: 'Creation Request',
  description: 'Sending creation request',
  processing: true,
  complete: false,
  success: false,
}
```

Example update:

```jsx
setStage1({
  tag: 'Creation Request',
  description: 'Request accepted by backend',
  processing: false,
  complete: true,
  success: true,
})
```

## Recommended Integration Pattern

```jsx
showLoading({
  title: 'Completing Transaction',
  message: 'Submitting your request on-chain.',
})

try {
  await submitTx()
  hideLoading()
} catch (err) {
  hideLoading()
  showError({
    title: 'Transaction Failed',
    message: err?.message || 'Unknown error occurred.',
  })
}
```

## Notes

- All popup typography and chrome are styled for the project theme:
  - sharp corners (`2px` radii)
  - dark base surfaces
  - Space Grotesk font (`var(--font-space-g)`)
  - red accent (`#ec1b24`)
- Modal dismissal by backdrop is controlled by `canCloseModal`.
