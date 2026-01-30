// hooks/useMediaQuery.js
'use client'
import { useSyncExternalStore } from 'react';

/**
 * A custom React hook that tracks the state of a CSS media query using useSyncExternalStore.
 *
 * @param {string} query - The CSS media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - True if the media query matches, false otherwise
 */
export function useMediaQuery(query) {
  // Helper function to get the current snapshot of the match state
  const getSnapshot = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  // Helper function to subscribe to changes
  const subscribe = (callback) => {
    if (typeof window === 'undefined') return () => {};

    const mediaQueryList = window.matchMedia(query);
    // Use the modern addEventListener 'change' event
    mediaQueryList.addEventListener('change', callback);
    
    // Return the unsubscribe function
    return () => {
      mediaQueryList.removeEventListener('change', callback);
    };
  };

  // The third argument is the optional getServerSnapshot for SSR compatibility
  // We provide a function that just returns false on the server to prevent errors
  const matches = useSyncExternalStore(
    subscribe, 
    getSnapshot, 
    () => false // getServerSnapshot returns false if no window is available during SSR
  );

  return matches;
}
