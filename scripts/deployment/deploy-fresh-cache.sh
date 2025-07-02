#!/bin/bash

# Cache Busting Deployment Script
# This script helps ensure fresh deployments without cache issues

echo "🚀 Starting Cache-Busted Deployment..."

# 1. Clean all caches
echo "🧹 Cleaning caches..."
npm run clean

# 2. Update browserslist database
echo "📱 Updating browserslist..."
npx update-browserslist-db@latest

# 3. Fresh install dependencies
echo "📦 Installing dependencies..."
npm ci

# 4. Build with cache busting
echo "🔨 Building with cache busting..."
npm run build

# 5. Update package.json version (optional timestamp-based versioning)
CURRENT_VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +%Y%m%d%H%M%S)
NEW_VERSION="${CURRENT_VERSION}-${TIMESTAMP}"

echo "📝 Updating version from ${CURRENT_VERSION} to ${NEW_VERSION}"
npm version --no-git-tag-version "${NEW_VERSION}"

echo "✅ Cache-busted build complete!"
echo "🔍 Check dist/ folder for hashed assets"
echo "📋 Version: ${NEW_VERSION}"

# List generated files with hashes
echo "📁 Generated files:"
ls -la dist/assets/ | grep -E "\.(js|css)$"

echo ""
echo "💡 Tips for deployment:"
echo "   - Upload the entire dist/ folder"
echo "   - Clear CDN/proxy caches if using any"
echo "   - Update service worker version if needed"
