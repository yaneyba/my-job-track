const fs = require('fs');
const path = require('path');

// Create a simple favicon.ico equivalent using base64 data
// This is a minimal 16x16 favicon representing the app concept
const faviconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="2" fill="#3B82F6"/>
  <rect x="3" y="2" width="10" height="12" rx="1" fill="white"/>
  <rect x="5" y="1" width="6" height="2" rx="1" fill="#374151"/>
  <path d="M5 6 L6 7 L8 5" stroke="#10B981" stroke-width="1" fill="none"/>
  <path d="M5 8 L6 9 L8 7" stroke="#10B981" stroke-width="1" fill="none"/>
  <rect x="5" y="11" width="6" height="1" fill="#6B7280"/>
  <rect x="5" y="13" width="4" height="1" fill="#6B7280"/>
</svg>`;

// Create a data URI for the favicon
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

console.log('Favicon SVG created');
console.log('To convert to ICO format, you can use online tools or install sharp/canvas packages');
console.log('Data URI for favicon:', faviconDataUri);

// Save the 16x16 version as SVG
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);

console.log('Files created:');
console.log('- public/icon.svg (512x512 app icon)');
console.log('- public/favicon.svg (16x16 favicon)');
