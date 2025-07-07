/**
 * Build number generator and version management
 * 
 * This script generates build numbers and injects them into the application
 * for tracking releases and deployments.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate build number based on timestamp and git commit
function generateBuildNumber() {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
  const gitHash = getGitCommitHash();
  const gitPrefix = gitHash.charAt(0); // First character of commit hash for easy identification
  return `${timestamp}${gitPrefix}-${gitHash}`;
}

// Get current git commit hash (short)
function getGitCommitHash() {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('Could not get git hash, using fallback');
    return Math.random().toString(36).substr(2, 7);
  }
}

// Get current git branch
function getGitBranch() {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

// Generate build info object
function generateBuildInfo() {
  const buildNumber = generateBuildNumber();
  const buildDate = new Date().toISOString();
  const gitBranch = getGitBranch();
  const gitHash = getGitCommitHash();
  
  return {
    buildNumber,
    buildDate,
    gitBranch,
    gitHash,
    version: getPackageVersion(),
    environment: process.env.NODE_ENV || 'development'
  };
}

// Get version from package.json
function getPackageVersion() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

// Update package.json with build number
function updatePackageJsonBuildNumber(buildInfo) {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add build number to version if not already present
  const versionParts = packageJson.version.split('-');
  const baseVersion = versionParts[0];
  packageJson.version = `${baseVersion}-build.${buildInfo.buildNumber}`;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Updated package.json version to: ${packageJson.version}`);
}

// Create build info file for the application
function createBuildInfoFile(buildInfo) {
  const buildInfoPath = path.resolve(__dirname, '../src/build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`Created build info file: ${buildInfoPath}`);
}

// Create TypeScript build info file
function createBuildInfoTs(buildInfo) {
  const buildInfoContent = `// Auto-generated build information
// This file is created automatically during the build process

export interface BuildInfo {
  buildNumber: string;
  buildDate: string;
  gitBranch: string;
  gitHash: string;
  version: string;
  environment: string;
}

export const BUILD_INFO: BuildInfo = ${JSON.stringify(buildInfo, null, 2)};

export const getBuildVersion = (): string => {
  return \`\${BUILD_INFO.version}\`;
};

export const getFullBuildInfo = (): string => {
  return \`v\${BUILD_INFO.version} (build \${BUILD_INFO.buildNumber})\`;
};

export const getBuildDate = (): Date => {
  return new Date(BUILD_INFO.buildDate);
};
`;

  const buildInfoTsPath = path.resolve(__dirname, '../src/build-info.ts');
  fs.writeFileSync(buildInfoTsPath, buildInfoContent);
  console.log(`Created TypeScript build info: ${buildInfoTsPath}`);
}

// Update service worker version numbers
function updateServiceWorkerVersion(buildInfo) {
  const swPath = path.resolve(__dirname, '../public/sw.js');
  
  if (!fs.existsSync(swPath)) {
    console.warn('⚠️ Service worker file not found, skipping SW version update');
    return;
  }
  
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Extract current version numbers and increment them
  const cacheVersionMatch = swContent.match(/const CACHE_NAME = 'myjobtrack-v(\d+)'/);
  const staticCacheVersionMatch = swContent.match(/const STATIC_CACHE_NAME = 'myjobtrack-static-v(\d+)'/);
  const iconCacheVersionMatch = swContent.match(/const ICON_CACHE_NAME = 'myjobtrack-icons-v(\d+)'/);
  
  // Get git commit count for consistent versioning
  const commitCount = getGitCommitCount();
  const newVersion = commitCount || (Date.now() / 1000 | 0); // Fallback to timestamp
  
  // Update cache version with build info
  swContent = swContent.replace(
    /const CACHE_VERSION = "[^"]*";/,
    `const CACHE_VERSION = "v${newVersion}-${buildInfo.gitHash}";`
  );
  
  // Update main cache version
  const currentCacheVersion = cacheVersionMatch ? parseInt(cacheVersionMatch[1]) : 1;
  swContent = swContent.replace(
    /const CACHE_NAME = 'myjobtrack-v\d+'/,
    `const CACHE_NAME = 'myjobtrack-v${currentCacheVersion + 1}'`
  );
  
  // Update static cache version
  const currentStaticVersion = staticCacheVersionMatch ? parseInt(staticCacheVersionMatch[1]) : 1;
  swContent = swContent.replace(
    /const STATIC_CACHE_NAME = 'myjobtrack-static-v\d+'/,
    `const STATIC_CACHE_NAME = 'myjobtrack-static-v${currentStaticVersion + 1}'`
  );
  
  // Update icon cache version  
  const currentIconVersion = iconCacheVersionMatch ? parseInt(iconCacheVersionMatch[1]) : 1;
  swContent = swContent.replace(
    /const ICON_CACHE_NAME = 'myjobtrack-icons-v\d+'/,
    `const ICON_CACHE_NAME = 'myjobtrack-icons-v${currentIconVersion + 1}'`
  );
  
  fs.writeFileSync(swPath, swContent);
  console.log(`🔄 Updated service worker versions:`);
  console.log(`   Cache: v${currentCacheVersion + 1}`);
  console.log(`   Static: v${currentStaticVersion + 1}`);
  console.log(`   Icons: v${currentIconVersion + 1}`);
  console.log(`   Version: v${newVersion}-${buildInfo.gitHash}`);
}

// Get git commit count for consistent versioning
function getGitCommitCount() {
  try {
    const count = execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim();
    return parseInt(count);
  } catch (error) {
    console.warn('Could not get git commit count, using fallback');
    return null;
  }
}

// Main function to generate build
function generateBuild() {
  console.log('🔨 Generating build number and version info...');
  
  const buildInfo = generateBuildInfo();
  
  console.log('📦 Build Information:');
  console.log(`   Build Number: ${buildInfo.buildNumber}`);
  console.log(`   Version: ${buildInfo.version}`);
  console.log(`   Git Branch: ${buildInfo.gitBranch}`);
  console.log(`   Git Hash: ${buildInfo.gitHash}`);
  console.log(`   Build Date: ${buildInfo.buildDate}`);
  console.log(`   Environment: ${buildInfo.environment}`);
  
  // Update package.json
  updatePackageJsonBuildNumber(buildInfo);
  
  // Create build info files
  createBuildInfoFile(buildInfo);
  createBuildInfoTs(buildInfo);
  
  // Update service worker versions
  updateServiceWorkerVersion(buildInfo);
  
  console.log('✅ Build number generation completed!');
  
  return buildInfo;
}

// Clean build number from package.json (for development)
function cleanBuildNumber() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove build number from version
  const versionParts = packageJson.version.split('-');
  packageJson.version = versionParts[0];
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Cleaned package.json version to: ${packageJson.version}`);
}

// Export functions
export { generateBuild, cleanBuildNumber, generateBuildInfo };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'clean') {
    cleanBuildNumber();
  } else {
    generateBuild();
  }
}
