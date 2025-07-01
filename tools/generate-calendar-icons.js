/**
 * Script to generate Calendar icons for the application
 * Replaces all existing icon files with the Calendar icon
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calendar icon SVG path from Lucide
const CALENDAR_PATH = "M21 8v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8m18 0V7a1 1 0 0 0-1-1h-2M3 8V7a1 1 0 0 1 1-1h2m0 0V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3m0 0h-2M6 6h2";

// Generate SVG with Calendar icon
function generateCalendarSvg(size = 24, strokeColor = 'currentColor', bgColor = 'none', strokeWidth = 2) {
  const viewBoxSize = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" fill="${bgColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  <path d="${CALENDAR_PATH}" />
</svg>`;
}

// Generate favicon with different sizes and colors
function generateIcons() {
  const publicDir = path.resolve(__dirname, '../public');
  
  // Basic icon for favicon.svg
  fs.writeFileSync(
    path.join(publicDir, 'favicon.svg'), 
    generateCalendarSvg(24, 'currentColor', 'none', 2)
  );
  console.log('Generated favicon.svg');
  
  // Smaller 32x32 icon with blue stroke
  fs.writeFileSync(
    path.join(publicDir, 'favicon-32x32.svg'), 
    generateCalendarSvg(32, '#3b82f6', 'none', 1.5)
  );
  console.log('Generated favicon-32x32.svg');
  
  // Apple touch icon with gradient background
  const appleTouchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#gradient)" />
  <g transform="translate(40, 40) scale(4.2)">
    <path d="${CALENDAR_PATH}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleTouchIcon);
  console.log('Generated apple-touch-icon.svg');
  
  // Icon-192 for PWA
  const icon192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#gradient)" />
  <g transform="translate(44, 44) scale(4.3)">
    <path d="${CALENDAR_PATH}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);
  console.log('Generated icon-192.svg');
  
  // Base icon
  const baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#gradient)" />
  <g transform="translate(112, 112) scale(12)">
    <path d="${CALENDAR_PATH}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), baseIcon);
  console.log('Generated icon.svg');
  
  console.log('All Calendar icons generated successfully!');
}

// Run the icon generation
generateIcons();

// Export the functions for use in other modules
export { generateCalendarSvg, generateIcons };
