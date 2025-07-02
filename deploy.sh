#!/bin/bash

# MyJobTrack - Production Deployment Script
# This script ensures that build numbers are always included in releases

set -e  # Exit on any error

echo "🚀 MyJobTrack Production Deployment"
echo "=================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current branch and status
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate build version and info
echo "🔢 Generating build version..."
npm run build:version

# Update icon cache busting
echo "🖼️  Updating icon cache busting..."
npm run icons:cache-bust

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build for production
echo "🏗️  Building for production..."
npm run build:release

# Show build info
echo ""
echo "✅ Build completed successfully!"
echo "================================"
echo "Build Information:"
if [ -f "src/build-info.json" ]; then
    cat src/build-info.json | python3 -m json.tool
else
    echo "❌ Build info not found!"
    exit 1
fi

echo ""
echo "📂 Build artifacts are in ./dist/"
echo "🚀 Ready for deployment!"

# Optional: Upload to server (uncomment and configure as needed)
# echo "🌐 Uploading to server..."
# rsync -avz --delete dist/ user@server:/var/www/html/

echo "✨ Deployment complete!"
