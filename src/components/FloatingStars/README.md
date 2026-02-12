# FloatingStars Component

An animated React component that renders floating, rotating stars with glowing effects. Perfect for reward screens, achievement unlocks, rare item displays, or decorative backgrounds.

## Features

✨ **Randomized Animation** - Stars spawn with random positions, sizes, rotations, and delays  
🎨 **5 Color Schemes** - Red, blue, gold, purple, and white  
📐 **Percentage-based Clip-path** - Stars scale perfectly at any size  
⚡ **Customizable** - Full control over styling and behavior  
🎯 **Layerable** - Stack multiple star layers for depth effects  

## Installation

```jsx
// Copy FloatingStars.jsx to your project
import FloatingStars from './FloatingStars';
```

## Basic Usage

The parent container **must** have `position: relative` or `position: absolute`:

```jsx
import FloatingStars from './FloatingStars';

function MyComponent() {
  return (
    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
      <FloatingStars count={8} colorScheme="red" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>Your Content</h1>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | `8` | Base number of stars (varies ±2 randomly) |
| `duration` | number | `3000` | Animation duration in milliseconds |
| `respawnDelay` | number | `500` | Delay between star cycles (ms) |
| `colorScheme` | string | `'red'` | Color scheme: `'red'`, `'blue'`, `'gold'`, `'purple'`, `'white'` |
| `containerStyle` | object | `{}` | Custom CSS styles for container div |
| `starBaseStyle` | object | `{}` | Custom CSS styles for each star |

## Complete Example

```jsx
<FloatingStars 
  // Number of stars (will vary ±2 randomly)
  count={8}
  
  // Animation duration in milliseconds
  duration={3000}
  
  // Delay between star cycles
  respawnDelay={500}
  
  // Color scheme: 'red', 'blue', 'gold', 'purple', 'white'
  colorScheme="red"
  
  // Custom styles for the container div
  containerStyle={{
    position: 'absolute',
    inset: '-100px', // Extends 100px beyond parent
    pointerEvents: 'none', // Stars don't block mouse events
    zIndex: 10
  }}
  
  // Custom styles applied to each star
  starBaseStyle={{
    opacity: 0.6,
    // You can override any CSS property here
  }}
/>
```

## Common Patterns

### 1. Stars Around a Card/Element

Extend stars beyond the element's boundaries:

```jsx
<div style={{ position: 'relative', width: '300px', height: '200px' }}>
  <YourCard />
  
  <FloatingStars 
    count={10}
    colorScheme="gold"
    containerStyle={{
      position: 'absolute',
      inset: '-50px', // Extends 50px beyond card edges
      pointerEvents: 'none' // Doesn't block clicks
    }}
  />
</div>
```

### 2. Full-Screen Background

```jsx
<div style={{ minHeight: '100vh', position: 'relative' }}>
  <FloatingStars 
    count={15}
    duration={5000}
    colorScheme="white"
    containerStyle={{
      position: 'fixed',
      inset: 0,
      zIndex: 0
    }}
    starBaseStyle={{
      opacity: 0.3 // Subtle background
    }}
  />
  
  <main style={{ position: 'relative', zIndex: 1 }}>
    {/* Your content */}
  </main>
</div>
```

### 3. Layered Stars (Depth Effect)

Stack multiple `<FloatingStars>` with different settings:

```jsx
<div style={{ position: 'relative', height: '100vh' }}>
  {/* Far background layer */}
  <FloatingStars 
    count={12}
    duration={6000}
    colorScheme="white"
    starBaseStyle={{ opacity: 0.2 }}
  />
  
  {/* Your content */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    <h1>Victory!</h1>
  </div>
  
  {/* Close foreground layer */}
  <FloatingStars 
    count={6}
    duration={2500}
    colorScheme="gold"
    containerStyle={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }}
  />
</div>
```

### 4. Reward/Achievement Screen

```jsx
function RewardScreen({ item }) {
  return (
    <div style={{ 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      {/* Ambient background stars */}
      <FloatingStars 
        count={10}
        duration={5000}
        colorScheme="white"
        starBaseStyle={{ opacity: 0.3 }}
      />
      
      {/* Item card */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="item-card">
          <img src={item.image} alt={item.name} />
          <h2>{item.name}</h2>
          
          {/* Stars around the item */}
          <FloatingStars 
            count={8}
            duration={3000}
            colorScheme={item.rarity === 'legendary' ? 'gold' : 'red'}
            containerStyle={{
              position: 'absolute',
              inset: '-60px',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## Understanding `inset`

The `inset` CSS property controls where stars spawn:

```jsx
// Fills entire parent
inset: 0

// Shrinks inward - 50px padding on all sides
inset: '50px'

// Extends outward - 50px beyond parent on all sides (COMMON!)
inset: '-50px'

// Different values per side: top, right, bottom, left
inset: '10px 20px 30px 40px'

// Vertical | Horizontal
inset: '20px 40px'  // 20px top/bottom, 40px left/right

// Only extend vertically
inset: '-50px 0'  // Extends 50px top/bottom, 0 left/right
```

**Visual Guide:**

```
┌─────────────────────────────────┐  ← inset: '-30px' 
│ ∗                             ∗ │    (extends 30px outside)
│   ┌─────────────────────────┐   │
│ ∗ │   Parent Container      │ ∗ │  ← inset: 0 (fills parent)
│   │                         │   │
│   │  ┌─────────────────┐   │   │
│   │∗ │   Inner Area    │ ∗ │   │  ← inset: '20px' (20px inward)
│   │  └─────────────────┘   │   │
│   └─────────────────────────┘   │
│ ∗                             ∗ │
└─────────────────────────────────┘
```

## Color Schemes

Available color schemes with their hex values:

| Scheme | Primary | Secondary | Use Case |
|--------|---------|-----------|----------|
| `'red'` | #ff3366 | #ff6b9d | Danger, power, mythic items |
| `'blue'` | #3366ff | #6b9dff | Cool, calm, rare items |
| `'gold'` | #ffd700 | #ffed4e | Legendary, achievement, victory |
| `'purple'` | #9d4edd | #c77dff | Epic, mystical, magical |
| `'white'` | #ffffff | #e0e0e0 | Subtle backgrounds, general use |

## Tips & Best Practices

✅ **DO:**

- Set parent to `position: relative`
- Use `pointerEvents: 'none'` if stars shouldn't block clicks
- Layer multiple stars for depth
- Use negative `inset` values to extend beyond elements
- Control stacking with `zIndex` in containerStyle

❌ **DON'T:**

- Forget to set parent positioning
- Use too many stars (impacts performance)
- Block important UI elements with stars

## Performance Notes

- Stars use CSS animations (hardware accelerated)
- Each star is a single `<div>` with clip-path
- Recommended max: ~20 stars per container for best performance
- Use lower `count` for mobile devices

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ⚠️ Requires CSS clip-path support (IE11 not supported)

## License

Free to use in your projects!

---

**Need help?** Check the JSDoc comments in the component file for additional examples and documentation.
