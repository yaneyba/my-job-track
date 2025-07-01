# Calendar Icon Generation

This directory contains tools for generating Calendar-based icons for the MyJobTrack application.

## Overview

The icons are generated from the Calendar SVG from Lucide React, which is used throughout the application. This ensures consistency between the app's branding and its favicons/icons.

## Available Tools

`create-calendar-icons.js` - Generates SVG icons for various purposes:
- favicon.svg - Basic favicon
- favicon-32x32.svg - 32x32 icon for browser tabs
- apple-touch-icon.svg - 180x180 icon for iOS devices
- icon-192.svg - 192x192 icon for PWA
- icon.svg - 512x512 base icon

## Usage

### Generate SVG Icons

```bash
npm run icons:generate
```

## Note About favicon.ico

For the favicon.ico file, you can use online converters or tools like:
1. [RealFaviconGenerator](https://realfavicongenerator.net/)
2. [Favicon.io](https://favicon.io/favicon-converter/)

Upload the generated favicon.svg to create the .ico file.

## Icon Design

The icons use a blue-to-purple gradient background with the Calendar icon in white, matching the application's branding. The Calendar icon is consistent with the Logo component used throughout the application.
