# Icon Cache Management

This document describes the strategy used for managing browser caching of icons in the MyJobTrack application.

## Overview

Browsers have a tendency to aggressively cache favicon and icon files, which can lead to outdated icons being shown to users after icons have been updated. To solve this issue, we've implemented a multi-layered cache-busting strategy.

## Cache-Busting Strategy

Our cache-busting implementation uses several techniques to ensure icons are properly updated:

1. **Query Parameter Cache-Busting**: All icon URLs include version query parameters that change whenever icons are updated.

2. **Service Worker Cache Management**: Icons are stored in a separate cache that's versioned independently from other assets.

3. **Icon Version Tracking**: The application tracks icon versions in localStorage and clears caches when versions change.

4. **Build-time Icon Processing**: During the build process, the script adds cache-busting parameters to all icon references.

## How It Works

### 1. Build-time Icon Processing

When you run `npm run icons:update`, the following happens:

- New Calendar icons are generated using `create-calendar-icons.js`
- Cache-busting parameters are added to icon URLs in:
  - index.html
  - manifest.json
  - service worker configuration

### 2. Runtime Cache Management

At runtime, the application:

- Checks the current icon version against the stored version in localStorage
- Clears icon caches if the version has changed
- Updates service worker caches with new icon versions
- Forces a refresh of icons when necessary

### 3. Service Worker Handling

The service worker:

- Maintains a separate cache for icon resources
- Uses a network-first strategy for icon requests
- Falls back to cached icons if network is unavailable
- Purges old icon caches when new versions are detected

## Usage

### Updating Icons

When icons are updated:

```bash
# Generate new icons and update cache-busting parameters
npm run icons:update
```

### Manual Cache-Busting

To force icon cache-busting:

```bash
# Just update cache-busting parameters without regenerating icons
npm run icons:cache-bust
```

### Implementation Details

- Icon URLs in HTML: Include version parameters
- Icon URLs in manifest.json: Include version parameters
- Icons in service worker: Use separate caching strategy
- Runtime icon management: `iconManager.ts` utility

## Testing

To verify that icon cache-busting is working properly:

1. Load the application
2. Update an icon
3. Run `npm run icons:update`
4. Reload the application
5. Verify that the new icon is displayed

## Important Files

- `/tools/create-calendar-icons.js` - Icon generation
- `/tools/add-icon-cache-busting.js` - Cache-busting implementation
- `/src/utils/iconManager.ts` - Runtime icon management
- `/public/sw.js` - Service worker with icon cache handling
