/**
 * Cache busting utilities to ensure fresh content delivery
 */

// Generate a cache-busting query parameter
export const getCacheBustParam = (): string => {
  return `_cb=${Date.now()}`;
};

// Add cache busting to URL
export const addCacheBust = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${getCacheBustParam()}`;
};

// Force reload of a specific resource
export const forceReloadResource = (url: string): Promise<Response> => {
  return fetch(addCacheBust(url), {
    cache: 'no-cache',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

// Clear all caches and reload the page
export const forceClearCacheAndReload = async (): Promise<void> => {
  try {
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Force reload with cache bypass
    window.location.reload();
  } catch (error) {
    console.error('Error clearing cache:', error);
    // Fallback: just reload
    window.location.reload();
  }
};

// Version checking utility
export const checkForUpdates = async (): Promise<boolean> => {
  try {
    const response = await forceReloadResource('/package.json');
    const packageInfo = await response.json();
    const currentVersion = localStorage.getItem('app-version');
    
    if (currentVersion !== packageInfo.version) {
      localStorage.setItem('app-version', packageInfo.version);
      return true; // Update available
    }
    return false; // No update
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

// Initialize cache busting on app start
export const initCacheBusting = (): void => {
  // Check for updates every 5 minutes
  setInterval(async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate) {
      console.log('New version detected, clearing cache...');
      // Optionally show a notification to user about update
      if (confirm('A new version is available. Reload to update?')) {
        await forceClearCacheAndReload();
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Listen for visibility change to check for updates when user returns
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      const hasUpdate = await checkForUpdates();
      if (hasUpdate) {
        console.log('Update detected on page focus');
      }
    }
  });
};
