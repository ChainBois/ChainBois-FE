import React, { useState, useEffect, useRef } from 'react';

/**
 * FloatingStars - An animated component that renders floating, rotating stars with glowing effects
 * 
 * @component
 * @description
 * Creates randomly positioned 4-point stars that animate with rotation, scale, and pulsing glow effects.
 * Stars spawn in cycles with randomized positions, sizes, and delays for a dynamic cosmic effect.
 * Perfect for reward screens, achievement unlocks, rare item displays, or decorative backgrounds.
 * 
 * ⚡ PERFORMANCE OPTIMIZED:
 * - Uses Intersection Observer to pause animations when off-screen
 * - Reduces lag during scroll with viewport detection
 * - Efficient CSS-only animations
 * 
 * @param {Object} props - Component props
 * @param {number} [props.count=8] - Base number of stars per cycle (actual count varies ±2 randomly)
 * @param {number} [props.duration=3000] - Animation duration in milliseconds for each star cycle
 * @param {number} [props.respawnDelay=500] - Delay in milliseconds between star cycles
 * @param {('red'|'blue'|'gold'|'purple'|'white')} [props.colorScheme='red'] - Predefined color scheme for stars
 * @param {('spin'|'blink'|'pulse')} [props.animationType='blink'] - Animation style: 'spin' (rotate), 'blink' (opacity flicker), 'pulse' (gentle glow)
 * @param {boolean} [props.static=false] - If true, stars are displayed statically without animation
 * @param {('small'|'medium'|'large'|'auto')} [props.size='auto'] - Star size preset: 'small' (mobile-friendly), 'medium', 'large', 'auto' (responsive)
 * @param {Object} [props.containerStyle={}] - Custom CSS styles for the container div
 * @param {Object} [props.starBaseStyle={}] - Custom CSS styles applied to each individual star
 * 
 * @example
 * // Basic usage - Stars fill parent container
 * <div style={{ position: 'relative', width: '400px', height: '400px' }}>
 *   <FloatingStars count={8} colorScheme="red" animationType="blink" />
 * </div>
 * 
 * @example
 * // Stars extending around an element (common for cards/rewards)
 * <div style={{ position: 'relative', width: '300px', height: '200px' }}>
 *   <YourCard />
 *   <FloatingStars 
 *     count={10}
 *     colorScheme="gold"
 *     animationType="blink"
 *     containerStyle={{
 *       position: 'absolute',
 *       inset: '-50px', // Extends 50px beyond card edges
 *       pointerEvents: 'none' // Doesn't block clicks on card
 *     }}
 *   />
 * </div>
 * 
 * @example
 * // Grid of cards - performance optimized
 * {cards.map(card => (
 *   <div key={card.id} style={{ position: 'relative' }}>
 *     <Card {...card} />
 *     <FloatingStars 
 *       count={6}
 *       animationType="blink" // Better performance than spin
 *       containerStyle={{
 *         position: 'absolute',
 *         inset: '-30px',
 *         pointerEvents: 'none'
 *       }}
 *     />
 *   </div>
 * ))}
 * 
 * @example
 * // Responsive sizes for different use cases
 * <FloatingStars size="small" />  // Mobile-friendly, smaller stars
 * <FloatingStars size="medium" /> // Balanced size
 * <FloatingStars size="large" />  // Prominent stars
 * <FloatingStars size="auto" />   // Default, adapts to viewport (recommended)
 * 
 * @notes
 * - Parent container must have `position: relative` or `position: absolute`
 * - Use `pointerEvents: 'none'` in containerStyle if stars shouldn't block interactions
 * - `animationType="blink"` is recommended for grids/lists for better scroll performance
 * - Component automatically pauses when scrolled out of view
 * - Stars use CSS clip-path with percentage coordinates, so they scale perfectly
 * - Star sizes are now responsive using vw units - they scale with viewport width
 * - Use size="small" for mobile-optimized displays
 * 
 * @colorSchemes
 * Available color schemes:
 * - 'red': Vibrant red/lighter red (#d91821, #d8242d)
 * - 'blue': Bright blue (#3366ff, #6b9dff)
 * - 'gold': Golden yellow (#ffd700, #ffed4e)
 * - 'purple': Deep purple (#9d4edd, #c77dff)
 * - 'white': White/silver (#ffffff, #e0e0e0)
 * 
 * @animationTypes
 * Available animation types:
 * - 'spin': Stars rotate while appearing/disappearing (most dynamic, higher GPU usage)
 * - 'blink': Stars blink/flicker like real stars (best performance, recommended for grids)
 * - 'pulse': Gentle glow without rotation (balanced performance and visual appeal)
 */
const FloatingStars = ({ 
  count = 8,
  containerStyle = {},
  starBaseStyle = {},
  duration = 3000,
  respawnDelay = 500,
  colorScheme = 'red',
  animationType = 'blink', // Default to blink for better performance
  static: isStatic = false, // New prop for static stars
  size = 'auto' // New prop for responsive sizing
}) => {
  const [stars, setStars] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Color schemes for the stars
  const colorSchemes = {
    red: {
      primary: '#d91821',
      secondary: '#d8242d',
      glow: 'rgba(255, 51, 102, 0.8)'
    },
    blue: {
      primary: '#3366ff',
      secondary: '#6b9dff',
      glow: 'rgba(51, 102, 255, 0.8)'
    },
    gold: {
      primary: '#ffd700',
      secondary: '#ffed4e',
      glow: 'rgba(255, 215, 0, 0.8)'
    },
    purple: {
      primary: '#9d4edd',
      secondary: '#c77dff',
      glow: 'rgba(157, 78, 221, 0.8)'
    },
    white: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      glow: 'rgba(255, 255, 255, 0.8)'
    }
  };

  const currentScheme = colorSchemes[colorScheme] || colorSchemes.red;

  // Get responsive size range based on preset
  const getSizeRange = () => {
    switch (size) {
      case 'small':
        return { min: 0.6, max: 1.2 }; // vw units: 0.6vw to 1.2vw
      case 'medium':
        return { min: 0.8, max: 1.6 }; // vw units: 0.8vw to 1.6vw
      case 'large':
        return { min: 1.2, max: 2.4 }; // vw units: 1.2vw to 2.4vw
      case 'auto':
      default:
        // Auto scales based on viewport with reasonable bounds
        return { min: 0.8, max: 1.8 }; // vw units: 0.8vw to 1.8vw
    }
  };

  const sizeRange = getSizeRange();

  // Generate a random star configuration
  const generateStar = (id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    // Responsive size using vw units with min/max bounds
    size: sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min),
    rotation: Math.random() * 360,
    endRotation: Math.random() * 360 + 360,
    opacity: 0.7 + Math.random() * 0.3,
    delay: Math.random() * 500,
    colorIndex: Math.random() > 0.5 ? 0 : 1,
    key: `star-${id}-${Date.now()}-${Math.random()}`
  });

  // Intersection Observer to pause animations when off-screen (PERFORMANCE OPTIMIZATION)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '100px' // Start animating before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Initialize and refresh stars (only when visible)
  useEffect(() => {
    // For static stars, generate once and return
    if (isStatic) {
      const starCount = Math.floor(Math.random() * 5) + count - 2;
      const newStars = Array.from({ length: starCount }, (_, i) => generateStar(i));
      setStars(newStars);
      return; // No cleanup needed for static stars
    }

    // Animated stars logic (existing behavior)
    if (!isVisible) {
      // Clear interval and stars when not visible (PERFORMANCE)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setStars([]); // Remove stars to reduce DOM elements
      return;
    }

    const generateStars = () => {
      const starCount = Math.floor(Math.random() * 5) + count - 2;
      const newStars = Array.from({ length: starCount }, (_, i) => generateStar(i));
      setStars(newStars);
    };

    generateStars();

    intervalRef.current = setInterval(() => {
      generateStars();
    }, duration + respawnDelay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [count, duration, respawnDelay, isVisible, isStatic]);

  // Generate animation keyframes based on type
  const getAnimationKeyframes = () => {
    switch (animationType) {
      case 'spin':
        return `
          @keyframes floatSpin {
            0% {
              opacity: 0;
              transform: rotate(var(--start-rotation)) scale(0);
            }
            10% {
              opacity: var(--opacity);
              transform: rotate(var(--start-rotation)) scale(1);
            }
            90% {
              opacity: var(--opacity);
              transform: rotate(var(--end-rotation)) scale(1);
            }
            100% {
              opacity: 0;
              transform: rotate(var(--end-rotation)) scale(0.5);
            }
          }
        `;
      
      case 'blink':
        return `
          @keyframes floatBlink {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: var(--opacity);
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0);
            }
          }
        `;
      
      case 'pulse':
        return `
          @keyframes floatPulse {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            10% {
              opacity: var(--opacity);
              transform: scale(1);
            }
            90% {
              opacity: var(--opacity);
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.5);
            }
          }
        `;
      
      default:
        return getAnimationKeyframes('blink'); // Fallback to blink
    }
  };

  const getSecondaryAnimation = () => {
    switch (animationType) {
      case 'spin':
        return `
          @keyframes glow {
            0%, 100% {
              filter: brightness(1) drop-shadow(0 0 8px var(--glow-color));
            }
            50% {
              filter: brightness(1.3) drop-shadow(0 0 16px var(--glow-color));
            }
          }
        `;
      case 'blink':
        return `
          @keyframes glow {
            0%, 100% {
              filter: brightness(1) drop-shadow(0 0 6px var(--glow-color));
            }
          }
        `;
      case 'pulse':
        return `
          @keyframes glow {
            0%, 100% {
              filter: brightness(1) drop-shadow(0 0 8px var(--glow-color));
            }
            50% {
              filter: brightness(1.5) drop-shadow(0 0 20px var(--glow-color));
            }
          }
        `;
      default:
        return '';
    }
  };

  const getAnimationName = () => {
    switch (animationType) {
      case 'spin':
        return 'floatSpin';
      case 'blink':
        return 'floatBlink';
      case 'pulse':
        return 'floatPulse';
      default:
        return 'floatBlink';
    }
  };

  const getSecondaryAnimationDuration = () => {
    switch (animationType) {
      case 'spin':
        return '1.5s';
      case 'blink':
        return '0.1s'; // Quick blinks
      case 'pulse':
        return '2s';
      default:
        return '1.5s';
    }
  };

  return (
    <>
      <style>
        {`
          ${!isStatic ? getAnimationKeyframes() : ''}
          ${!isStatic ? getSecondaryAnimation() : ''}

          .floating-star {
            position: absolute;
            left: var(--start-x);
            top: var(--start-y);
            width: var(--size);
            height: var(--size);
            background: linear-gradient(135deg, var(--color-1) 0%, var(--color-2) 100%);
            clip-path: polygon(
              0% 50%, 
              48% 48%, 
              50% 0%, 
              52% 48%, 
              100% 50%, 
              52% 52%, 
              50% 100%, 
              48% 52%
            );
            ${!isStatic ? `
            animation: 
              ${getAnimationName()} var(--duration) ease-in-out forwards,
              glow ${getSecondaryAnimationDuration()} ease-in-out infinite;
            animation-delay: var(--delay);
            will-change: transform, opacity;
            ` : `
            opacity: var(--opacity);
            filter: brightness(1) drop-shadow(0 0 6px var(--glow-color));
            `}
            pointer-events: none;
            contain: layout style paint;
          }

          .floating-stars-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            contain: layout style paint;
          }
        `}
      </style>
      
      <div 
        ref={containerRef}
        className="floating-stars-container"
        style={{
          ...containerStyle
        }}
      >
        {stars.map((star) => (
          <div
            key={star.key}
            className="floating-star"
            style={{
              '--start-x': `${star.x}%`,
              '--start-y': `${star.y}%`,
              '--size': `${star.size}vw`, // Changed from px to vw for responsiveness
              '--start-rotation': `${star.rotation}deg`,
              '--end-rotation': `${star.endRotation}deg`,
              '--opacity': star.opacity,
              '--duration': `${duration}ms`,
              '--delay': `${star.delay}ms`,
              '--color-1': star.colorIndex === 0 ? currentScheme.primary : currentScheme.secondary,
              '--color-2': star.colorIndex === 0 ? currentScheme.secondary : currentScheme.primary,
              '--glow-color': currentScheme.glow,
              marginLeft: `calc(var(--size) / -2)`, // Responsive centering
              marginTop: `calc(var(--size) / -2)`, // Responsive centering
              ...starBaseStyle
            }}
          />
        ))}
      </div>
    </>
  );
};

/**
 * Demo component showing various usage patterns
 * @example
 * import FloatingStars, { FloatingStarsDemo } from './FloatingStars';
 */
const FloatingStarsDemo = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Background stars layer */}
      <FloatingStars 
        count={6}
        duration={4000}
        colorScheme="white"
        animationType="blink"
        starBaseStyle={{
          opacity: 0.3
        }}
      />
      
      {/* Main content with weapon card */}
      <div style={{
        width: '400px',
        height: '280px',
        background: 'linear-gradient(135deg, rgba(40, 10, 10, 0.9), rgba(20, 5, 5, 0.9))',
        borderRadius: '20px',
        border: '2px solid rgba(255, 51, 102, 0.5)',
        padding: '30px',
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Stars around the card */}
        <FloatingStars 
          count={8}
          duration={3000}
          respawnDelay={500}
          colorScheme="red"
          animationType="blink"
          containerStyle={{
            position: 'absolute',
            inset: '-50px',
            pointerEvents: 'none'
          }}
        />
        
        <div style={{
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ff3366, #ff6b9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Legendary Weapon
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.6'
          }}>
            A rare drop from the cosmic vault. The stars blink around this prized possession, 
            signaling its extraordinary power and magnificence.
          </p>
          
          <div style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: 'rgba(255, 51, 102, 0.2)',
            border: '1px solid rgba(255, 51, 102, 0.4)',
            borderRadius: '8px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '12px', color: '#ff6b9d' }}>
              ★ MYTHIC TIER ★
            </span>
          </div>
        </div>
      </div>

      {/* Additional ambient stars */}
      <FloatingStars 
        count={10}
        duration={5000}
        colorScheme="gold"
        animationType="pulse"
        starBaseStyle={{
          opacity: 0.2
        }}
        containerStyle={{
          position: 'absolute',
          inset: 0
        }}
      />
    </div>
  );
};

// Export FloatingStars as default for easy importing
export default FloatingStars;

// Also export the demo as a named export
export { FloatingStarsDemo };