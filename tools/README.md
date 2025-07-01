# Calendar Icon Generation

This directory contains tools for generating Calendar-based icons for the MyJobTrack application.

## Overview

The icons are generated from the Calendar SVG from Lucide React, which is used throughout the application. This ensures consistency between the app's branding and its favicons/icons.

## Available Tools

1. `generate-calendar-icons.js` - Generates SVG icons for various purposes:
   - favicon.svg - Basic favicon
   - favicon-32x32.svg - 32x32 icon for browser tabs
   - apple-touch-icon.svg - 180x180 icon for iOS devices
   - icon-192.svg - 192x192 icon for PWA
   - icon.svg - 512x512 base icon

2. `generate-favicon-ico.js` - Converts the SVG to ICO format (requires additional dependencies)

## Usage

### Generate SVG Icons

```bash
npm run icons:generate
```

### Generate All Icons (including ICO)

This command installs the required dependencies and generates all icons, including the favicon.ico:

```bash
npm run icons:generate:all
```

## Dependencies

- svg2img - For converting SVG to PNG
- ico-converter - For converting PNG to ICO

## Icon Design

The icons use a blue-to-purple gradient background with the Calendar icon in white, matching the application's branding. The Calendar icon is consistent with the Logo component used throughout the application.
