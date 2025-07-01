/**
 * Script to add cache-busting to icons
 * 
 * This script updates the index.html file to include version parameters for icons
 * to ensure browsers don't serve cached versions when icons are updated.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate timestamp-based version string
const generateVersion = () => {
  return `v=${Date.now()}`;
};

// Get the current version
const version = generateVersion();
const projectRoot = path.resolve(__dirname, '..');
const indexHtmlPath = path.join(projectRoot, 'index.html');
const manifestJsonPath = path.join(projectRoot, 'public', 'manifest.json');

console.log('Adding cache-busting for icons...');

// Function to update HTML file with cache-busting parameters
function updateIndexHtml() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('index.html not found');
    return;
  }

  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // Update icon links with cache-busting parameters
  htmlContent = htmlContent.replace(
    /<link rel="icon"(.*?)href="([^"?]+)"/g,
    `<link rel="icon"$1href="$2?${version}"`
  );
  
  htmlContent = htmlContent.replace(
    /<link rel="apple-touch-icon"(.*?)href="([^"?]+)"/g,
    `<link rel="apple-touch-icon"$1href="$2?${version}"`
  );
  
  fs.writeFileSync(indexHtmlPath, htmlContent);
  console.log('Updated index.html with cache-busting parameters');
}

// Function to update manifest.json with cache-busting parameters
function updateManifestJson() {
  if (!fs.existsSync(manifestJsonPath)) {
    console.error('manifest.json not found');
    return;
  }

  let manifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));

  // Add version parameter to icon URLs
  if (manifest.icons && Array.isArray(manifest.icons)) {
    manifest.icons = manifest.icons.map(icon => {
      return {
        ...icon,
        src: icon.src.includes('?') ? icon.src : `${icon.src}?${version}`
      };
    });
  }

  fs.writeFileSync(manifestJsonPath, JSON.stringify(manifest, null, 2));
  console.log('Updated manifest.json with cache-busting parameters');
}

// Update service worker to handle cache-busting
function updateServiceWorker() {
  const swPath = path.join(projectRoot, 'public', 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.error('Service worker (sw.js) not found');
    return;
  }

  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Check if version is already defined in the service worker
  if (swContent.includes('const CACHE_VERSION')) {
    // Update existing version
    swContent = swContent.replace(
      /const CACHE_VERSION = ['"].*?['"];/,
      `const CACHE_VERSION = "icon-${version}";`
    );
  } else {
    // Add version definition if it doesn't exist
    swContent = `const CACHE_VERSION = "icon-${version}";\n${swContent}`;
  }
  
  fs.writeFileSync(swPath, swContent);
  console.log('Updated service worker with new cache version');
}

// Run the updates
updateIndexHtml();
updateManifestJson();
updateServiceWorker();

console.log('Icon cache-busting completed successfully!');
