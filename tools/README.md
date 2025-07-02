# MyJobTrack Development Tools

This directory contains various tools and utilities for the MyJobTrack application development and testing.

## Available Tools

### Icon Generation
`create-calendar-icons.js` - Generates SVG icons for various purposes:
- favicon.svg - Basic favicon
- favicon-32x32.svg - 32x32 icon for browser tabs
- apple-touch-icon.svg - 180x180 icon for iOS devices
- icon-192.svg - 192x192 icon for PWA
- icon.svg - 512x512 base icon

### Build Management
`build-version.js` - Generates build numbers and version information:
- Creates build-info.json and build-info.ts
- Updates package.json with build numbers
- Injects git information (branch, hash)
- Supports clean command for development

### Cache Management
`add-icon-cache-busting.js` - Adds cache-busting to icons:
- Updates icon URLs in index.html and manifest.json
- Appends version query parameters
- Ensures fresh icon loading after updates

### Testing & QA
`test-language.sh` - Tests language/internationalization features:
- Validates English/Spanish toggle functionality
- Opens browser for manual testing
- Provides testing checklist and debugging tips

### Code Management
`update-imports.sh` - Updates import statements to use aliases:
- Converts relative imports to use the @ alias (e.g., `../../components/` to `@/components/`)
- Works on all TypeScript and TSX files
- Makes codebase more maintainable by standardizing import paths

## Usage

### Generate Icons
```bash
npm run icons:generate
npm run icons:cache-bust
```

### Build Management
```bash
npm run build:version        # Generate build info
npm run build:clean         # Clean build numbers
npm run build:release       # Full production build
```

### Language Testing
```bash
./tools/test-language.sh    # Test i18n functionality
```

### Code Management
```bash
./tools/update-imports.sh   # Update imports to use @ alias
```

## Icon Design

The icons use a blue-to-purple gradient background with the Calendar icon in white, matching the application's branding. The Calendar icon is consistent with the Logo component used throughout the application.

## Note About favicon.ico

For the favicon.ico file, you can use online converters or tools like:
1. [RealFaviconGenerator](https://realfavicongenerator.net/)
2. [Favicon.io](https://favicon.io/favicon-converter/)

Upload the generated favicon.svg to create the .ico file.
