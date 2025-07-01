/**
 * Script to convert SVG to ICO favicon
 * Requires the 'svg2img' and 'ico-converter' packages
 */
import svg2img from 'svg2img';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import icoConverter from 'ico-converter';
import { generateCalendarSvg } from './generate-calendar-icons.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the SVG and ICO files
const svgPath = path.join(__dirname, '../public/favicon.svg');
const icoPath = path.join(__dirname, '../public/favicon.ico');

// Generate the Calendar SVG if it doesn't exist
if (!fs.existsSync(svgPath)) {
  const svgContent = generateCalendarSvg(24, 'currentColor', 'none', 2);
  fs.writeFileSync(svgPath, svgContent);
}

// Read the SVG file
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Convert SVG to PNG buffer
svg2img(svgContent, { width: 64, height: 64 }, (error, buffer) => {
  if (error) {
    console.error('Error converting SVG to PNG:', error);
    return;
  }

  // Convert PNG buffer to ICO
  icoConverter.fromPNG(buffer, [[16, 16], [32, 32], [48, 48], [64, 64]]).then(icoBuffer => {
    // Write ICO file
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('Generated favicon.ico successfully');
  }).catch(error => {
    console.error('Error converting PNG to ICO:', error);
  });
});
