/**
 * Icon management utilities
 * 
 * This file provides utilities for managing icon versions and cache busting.
 */

// The current version of icons, updated whenever icons are changed
export const ICON_VERSION = '1.0.0';

// Generate cache-busting parameter based on icon version and timestamp
export function getIconCacheBustParam() {
  return `v=${ICON_VERSION}-${Date.now()}`;
}

// Add cache-busting parameter to an icon URL
export function addCacheBustToIconUrl(url: string): string {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${getIconCacheBustParam()}`;
}

// Generate the full URL for an icon with cache-busting
export function getIconUrl(iconName: string): string {
  return addCacheBustToIconUrl(`/${iconName}`);
}

// Check if an icon needs to be refreshed based on its version in localStorage
export function checkIconRefresh() {
  const storedVersion = localStorage.getItem('icon_version');
  if (storedVersion !== ICON_VERSION) {
    // Force refresh of icons by clearing relevant caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('icon')) {
            caches.delete(cacheName);
          }
        });
      });
    }
    
    // Update the stored version
    localStorage.setItem('icon_version', ICON_VERSION);
    return true;
  }
  return false;
}

// List of all application icons
export const appIcons = {
  favicon: 'favicon.svg',
  favicon32: 'favicon-32x32.svg',
  faviconIco: 'favicon.ico',
  appleTouch: 'apple-touch-icon.svg',
  icon192: 'icon-192.svg',
  icon512: 'icon.svg',
};
