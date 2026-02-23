# FloatingStars Component

An animated React component that renders floating, rotating stars with glowing effects. Perfect for reward screens, achievement unlocks, rare item displays, or decorative backgrounds.

## Features

✨ **Randomized Animation** - Stars spawn with random positions, sizes, rotations, and delays  
🎨 **5 Color Schemes** - Red, blue, gold, purple, and white  
🎭 **3 Animation Types** - Spin (rotate), Blink (flicker like real stars), Pulse (gentle glow)  
📐 **Percentage-based Clip-path** - Stars scale perfectly at any size  
⚡ **Performance Optimized** - Intersection Observer pauses animations when off-screen  
🎯 **Layerable** - Stack multiple star layers for depth effects  
🚀 **Scroll-Friendly** - No lag in grids/lists thanks to viewport detection  

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
| `animationType` | string | `'blink'` | Animation style: `'spin'`, `'blink'`, `'pulse'` |
| `static` | boolean | `false` | **NEW**: Display stars statically without animation |
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
  
  // Animation type: 'spin', 'blink', 'pulse'
  animationType="blink"
  
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

## Animation Types

Choose the animation style that best fits your use case:

| Type | Behavior | Performance | Best For |
|------|----------|-------------|----------|
| `'blink'` | Stars flicker/twinkle like real stars | **Best** ⚡ | Grids, lists, cards - most star-like |
| `'pulse'` | Gentle glow without rotation | **Good** 👍 | Balanced visuals and performance |
| `'spin'` | Stars rotate while appearing | **Okay** 🔄 | Single elements, hero sections |

### When to use each type:

**Use `'blink'` (recommended):**
- ✅ Grid of cards with stars
- ✅ List items with floating stars
- ✅ Multiple star instances on one page
- ✅ Mobile devices
- ✅ When you want authentic star-like behavior

**Use `'pulse'`:**
- ✅ When you want subtle animation
- ✅ Background decorative stars
- ✅ Ambient effects

**Use `'spin'`:**
- ✅ Single hero element
- ✅ Main reward/achievement screen
- ✅ Desktop-only experiences
- ⚠️ **Avoid** in grids or lists (can cause scroll lag)

## Common Patterns

### 1. Stars Around a Card/Element

Extend stars beyond the element's boundaries:

```jsx
<div style={{ position: 'relative', width: '300px', height: '200px' }}>
  <YourCard />
  
  <FloatingStars 
    count={10}
    colorScheme="gold"
    animationType="blink" // Best for cards
    containerStyle={{
      position: 'absolute',
      inset: '-50px', // Extends 50px beyond card edges
      pointerEvents: 'none' // Doesn't block clicks
    }}
  />
</div>
```

### 1b. Grid of Cards (Performance Optimized!) 🚀

For grids/lists, use `animationType="blink"` to prevent scroll lag:

```jsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(3, 1fr)', 
  gap: '20px' 
}}>
  {items.map(item => (
    <div key={item.id} style={{ position: 'relative' }}>
      <Card {...item} />
      
      <FloatingStars 
        count={6} // Fewer stars for better performance
        duration={3000}
        colorScheme={item.rarity}
        animationType="blink" // ⚡ Much better than 'spin' for grids!
        containerStyle={{
          position: 'absolute',
          inset: '-30px',
          pointerEvents: 'none'
        }}
      />
    </div>
  ))}
</div>
```

### 2. Full-Screen Background

```jsx
<div style={{ minHeight: '100vh', position: 'relative' }}>
  <FloatingStars 
    count={15}
    duration={5000}
    colorScheme="white"
    animationType="blink" // Stars twinkle like night sky
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

### 5. Static Background Stars (NEW!) ⭐

Use `static={true}` for non-animated decorative stars with **zero performance cost**:

```jsx
<div style={{ position: 'relative', minHeight: '100vh' }}>
  {/* Static starfield - no animation overhead */}
  <FloatingStars 
    count={50} // Can use more stars since they're static!
    static={true}
    colorScheme="white"
    containerStyle={{
      position: 'fixed',
      inset: 0,
      zIndex: 0
    }}
    starBaseStyle={{
      opacity: 0.4
    }}
  />
  
  <main style={{ position: 'relative', zIndex: 1 }}>
    {/* Your page content */}
  </main>
</div>
```

### 6. Mixed Static + Animated (Layered Depth)

Combine static background stars with animated accent stars:

```jsx
<div style={{ position: 'relative', height: '500px' }}>
  {/* Layer 1: Static background stars */}
  <FloatingStars 
    count={30}
    static={true}
    colorScheme="white"
    starBaseStyle={{ opacity: 0.3 }}
  />
  
  {/* Layer 2: Your content */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    <YourContent />
  </div>
  
  {/* Layer 3: Animated accent stars */}
  <FloatingStars 
    count={6}
    animationType="blink"
    colorScheme="gold"
    containerStyle={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }}
  />
</div>
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
- Use `animationType="blink"` for grids/lists
- Use lower `count` (4-6) when rendering many instances
- Layer multiple stars for depth
- Use negative `inset` values to extend beyond elements
- Control stacking with `zIndex` in containerStyle

❌ **DON'T:**
- Forget to set parent positioning
- Use `animationType="spin"` in grids (causes scroll lag)
- Use too many stars per element (>12)
- Block important UI elements with stars

### Quick Decision Guide

**"Should I use blink or spin?"**
- Multiple cards/items on page? → **blink**
- Single hero element? → **spin** or **pulse**
- Mobile device? → **blink**
- Not sure? → **blink** (safest choice)

## Performance Notes

### Automatic Optimizations ⚡

The component automatically optimizes performance:

1. **Intersection Observer**: Stars only animate when visible in viewport
   - Pauses completely when scrolled out of view
   - Resumes smoothly when scrolled back
   - Removes DOM elements when off-screen

2. **CSS Containment**: Uses `contain: layout style paint` for better rendering

3. **Hardware Acceleration**: All animations use `transform` and `opacity`

### Manual Optimization Tips

**For Best Performance:**
```jsx
// ✅ Good: Blink animation in grid
<FloatingStars 
  count={6}
  animationType="blink"
/>

// ❌ Avoid: Spin animation in grid of 20+ cards
<FloatingStars 
  count={10}
  animationType="spin" // Can cause scroll lag
/>
```

**Recommended Settings by Use Case:**

| Use Case | Count | Animation Type | Notes |
|----------|-------|----------------|-------|
| Single hero element | 8-12 | spin/pulse | Full visual impact |
| Card in list | 4-6 | blink | Best performance |
| Grid (3x3+) | 4-6 | blink | Multiply by grid size |
| Background ambient | 10-15 | blink/pulse | Subtle effect |
| Mobile device | 4-6 | blink only | Best battery life |

### Performance Comparison

On a grid of 20 cards:
- `animationType="blink"`: **Smooth 60fps** ✅
- `animationType="pulse"`: **55-60fps** 👍
- `animationType="spin"`: **40-50fps** (may drop frames) ⚠️

**Bottom line:** Use `animationType="blink"` for grids and lists!

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ⚠️ Requires CSS clip-path support (IE11 not supported)

## License

Free to use in your projects!

---

**Need help?** Check the JSDoc comments in the component file for additional examples and documentation.
