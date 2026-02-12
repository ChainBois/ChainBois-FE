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
 * @param {Object} props - Component props
 * @param {number} [props.count=8] - Base number of stars per cycle (actual count varies ±2 randomly)
 * @param {number} [props.duration=3000] - Animation duration in milliseconds for each star cycle
 * @param {number} [props.respawnDelay=500] - Delay in milliseconds between star cycles
 * @param {('red'|'blue'|'gold'|'purple'|'white')} [props.colorScheme='red'] - Predefined color scheme for stars
 * @param {Object} [props.containerStyle={}] - Custom CSS styles for the container div
 * @param {Object} [props.starBaseStyle={}] - Custom CSS styles applied to each individual star
 * 
 * @example
 * // Basic usage - Stars fill parent container
 * <div style={{ position: 'relative', width: '400px', height: '400px' }}>
 *   <FloatingStars count={8} colorScheme="red" />
 * </div>
 * 
 * @example
 * // Stars extending around an element (common for cards/rewards)
 * <div style={{ position: 'relative', width: '300px', height: '200px' }}>
 *   <YourCard />
 *   <FloatingStars 
 *     count={10}
 *     colorScheme="gold"
 *     containerStyle={{
 *       position: 'absolute',
 *       inset: '-50px', // Extends 50px beyond card edges
 *       pointerEvents: 'none' // Doesn't block clicks on card
 *     }}
 *   />
 * </div>
 * 
 * @example
 * // Full-screen background stars
 * <FloatingStars 
 *   count={15}
 *   duration={5000}
 *   colorScheme="white"
 *   containerStyle={{
 *     position: 'fixed',
 *     inset: 0,
 *     zIndex: 0
 *   }}
 *   starBaseStyle={{
 *     opacity: 0.3 // Subtle background effect
 *   }}
 * />
 * 
 * @example
 * // Layered stars with different settings
 * <div style={{ position: 'relative' }}>
 *   // Background layer
 *   <FloatingStars 
 *     count={12}
 *     duration={6000}
 *     colorScheme="white"
 *     starBaseStyle={{ opacity: 0.2 }}
 *   />
 *   
 *   // Your content
 *   <div style={{ position: 'relative', zIndex: 1 }}>
 *     <h1>Content Here</h1>
 *   </div>
 *   
 *   // Foreground layer
 *   <FloatingStars 
 *     count={6}
 *     duration={2500}
 *     colorScheme="gold"
 *     containerStyle={{
 *       position: 'absolute',
 *       inset: 0,
 *       pointerEvents: 'none'
 *     }}
 *   />
 * </div>
 * 
 * @example
 * // All props with descriptions
 * <FloatingStars 
 *   // Number of stars (will vary ±2 randomly)
 *   count={8}
 *   
 *   // Animation duration in milliseconds
 *   duration={3000}
 *   
 *   // Delay between star cycles
 *   respawnDelay={500}
 *   
 *   // Color scheme: 'red', 'blue', 'gold', 'purple', 'white'
 *   colorScheme="red"
 *   
 *   // Custom styles for the container div
 *   containerStyle={{
 *     position: 'absolute',
 *     inset: '-100px', // Extends 100px beyond parent
 *     pointerEvents: 'none', // Stars don't block mouse events
 *     zIndex: 10
 *   }}
 *   
 *   // Custom styles applied to each star
 *   starBaseStyle={{
 *     opacity: 0.6,
 *     // You can override any CSS property here
 *   }}
 * />
 * 
 * @notes
 * - Parent container must have `position: relative` or `position: absolute`
 * - Use `pointerEvents: 'none'` in containerStyle if stars shouldn't block interactions
 * - Negative `inset` values extend stars beyond parent boundaries
 * - Positive `inset` values shrink the star spawn area inward
 * - Use `zIndex` in containerStyle to control layering
 * - Stars use CSS clip-path with percentage coordinates, so they scale perfectly
 * 
 * @colorSchemes
 * Available color schemes:
 * - 'red': Vibrant red/pink (#ff3366, #ff6b9d)
 * - 'blue': Bright blue (#3366ff, #6b9dff)
 * - 'gold': Golden yellow (#ffd700, #ffed4e)
 * - 'purple': Deep purple (#9d4edd, #c77dff)
 * - 'white': White/silver (#ffffff, #e0e0e0)
 */
const FloatingStars = ({ 
  count = 8,
  containerStyle = {},
  starBaseStyle = {},
  duration = 3000,
  respawnDelay = 500,
  colorScheme = 'red'
}) => {
  const [stars, setStars] = useState([]);
  const timersRef = useRef([]);

  // Color schemes for the stars
  const colorSchemes = {
    red: {
      primary: '#ff3366',
      secondary: '#ff6b9d',
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

  // Generate a random star configuration
  const generateStar = (id) => ({
    id,
    // Random position within container (evenly distributed)
    x: Math.random() * 100,
    y: Math.random() * 100,
    // Random size between 12px and 28px
    size: 12 + Math.random() * 16,
    // Random rotation
    rotation: Math.random() * 360,
    endRotation: Math.random() * 360 + 360, // Always rotate at least 360deg
    // Random opacity for variation
    opacity: 0.7 + Math.random() * 0.3,
    // Random delay for staggered effect
    delay: 0,
    // Color variation
    colorIndex: Math.random() > 0.5 ? 0 : 1,
    // Unique key for forcing re-render
    key: Date.now() + Math.random()
  });

  // Initialize and manage continuous star flow
  useEffect(() => {
    // Clear any existing timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];

    // Initialize stars with staggered delays
    const initialStars = Array.from({ length: count }, (_, i) => ({
      ...generateStar(i),
      delay: (i / count) * duration * 0.6 // Stagger initial appearance
    }));
    setStars(initialStars);

    // Set up individual respawn cycle for each star
    initialStars.forEach((star, index) => {
      const scheduleRespawn = (initialDelay) => {
        const timer = setTimeout(() => {
          setStars(prev => {
            const newStars = [...prev];
            newStars[index] = generateStar(index);
            return newStars;
          });
          // Schedule next respawn
          scheduleRespawn(duration + respawnDelay);
        }, initialDelay);
        
        timersRef.current.push(timer);
      };

      // Start the respawn cycle after initial animation completes
      scheduleRespawn(star.delay + duration + respawnDelay);
    });

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [count, duration, respawnDelay]);

  return (
    <>
      <style>
        {`
          @keyframes float {
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

          @keyframes pulse {
            0%, 100% {
              filter: brightness(1) drop-shadow(0 0 8px var(--glow-color));
            }
            50% {
              filter: brightness(1.3) drop-shadow(0 0 16px var(--glow-color));
            }
          }

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
            animation: 
              float var(--duration) ease-in-out forwards,
              pulse 1.5s ease-in-out infinite;
            animation-delay: var(--delay);
            pointer-events: none;
            will-change: transform, opacity;
          }

          .floating-stars-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}
      </style>
      
      <div 
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
              '--size': `${star.size}px`,
              '--start-rotation': `${star.rotation}deg`,
              '--end-rotation': `${star.endRotation}deg`,
              '--opacity': star.opacity,
              '--duration': `${duration}ms`,
              '--delay': `${star.delay}ms`,
              '--color-1': star.colorIndex === 0 ? currentScheme.primary : currentScheme.secondary,
              '--color-2': star.colorIndex === 0 ? currentScheme.secondary : currentScheme.primary,
              '--glow-color': currentScheme.glow,
              marginLeft: `-${star.size / 2}px`,
              marginTop: `-${star.size / 2}px`,
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
 * import FloatingStarsDemo from './FloatingStars';
 * // Or import { FloatingStarsDemo } from './FloatingStars';
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
            A rare drop from the cosmic vault. The stars dance around this prized possession, 
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