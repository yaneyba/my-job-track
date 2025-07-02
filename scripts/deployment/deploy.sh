#!/bin/bash

# MyJobTrack - Universal Deployment Script
# Supports multiple deployment strategies with build number tracking

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

show_usage() {
    echo "🚀 MyJobTrack Deployment Script"
    echo "=============================="
    echo ""
    echo "Usage: $0 [DEPLOYMENT_TYPE] [OPTIONS]"
    echo ""
    echo "Deployment Types:"
    echo "  production    - Full production deployment with build numbers"
    echo "  fresh         - Clean deployment with cache busting"
    echo "  quick         - Quick build without cleaning"
    echo "  dev           - Development build"
    echo ""
    echo "Options:"
    echo "  --skip-tests     Skip linting and tests"
    echo "  --skip-version   Skip build version generation"
    echo "  --skip-icons     Skip icon cache busting"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 production                    # Full production deployment"
    echo "  $0 fresh --skip-tests           # Fresh deployment without tests"
    echo "  $0 quick --skip-version         # Quick build without versioning"
}

# Parse arguments
DEPLOYMENT_TYPE="${1:-production}"
SKIP_TESTS=false
SKIP_VERSION=false
SKIP_ICONS=false

for arg in "$@"; do
    case $arg in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-version)
            SKIP_VERSION=true
            shift
            ;;
        --skip-icons)
            SKIP_ICONS=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
    esac
done

# Validate deployment type
case $DEPLOYMENT_TYPE in
    production|fresh|quick|dev)
        ;;
    *)
        log_error "Invalid deployment type: $DEPLOYMENT_TYPE"
        show_usage
        exit 1
        ;;
esac

echo "🚀 MyJobTrack Deployment"
echo "========================"
log_info "Deployment Type: $DEPLOYMENT_TYPE"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Not in a git repository"
    exit 1
fi

# Get current branch and status
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Current branch: $CURRENT_BRANCH"

# Check for uncommitted changes (except for dev builds)
if [ "$DEPLOYMENT_TYPE" != "dev" ] && [ -n "$(git status --porcelain)" ]; then
    log_warning "You have uncommitted changes"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

# Deployment steps based on type
case $DEPLOYMENT_TYPE in
    production)
        log_info "🏭 Production Deployment"
        echo "🧹 Cleaning previous builds..."
        npm run clean
        
        echo "📦 Installing dependencies..."
        npm ci
        
        if [ "$SKIP_VERSION" = false ]; then
            echo "🔢 Generating build version..."
            npm run build:version
        fi
        
        if [ "$SKIP_ICONS" = false ]; then
            echo "🖼️  Updating icon cache busting..."
            npm run icons:cache-bust
        fi
        
        if [ "$SKIP_TESTS" = false ]; then
            echo "🔍 Running linter..."
            npm run lint
        fi
        
        echo "🏗️  Building for production..."
        npm run build:release
        ;;
        
    fresh)
        log_info "🌟 Fresh Cache-Busted Deployment"
        echo "🧹 Cleaning all caches..."
        npm run clean
        
        echo "📱 Updating browserslist..."
        npx update-browserslist-db@latest || true
        
        echo "📦 Fresh install dependencies..."
        npm ci
        
        if [ "$SKIP_VERSION" = false ]; then
            echo "🔢 Generating build version..."
            npm run build:version
        fi
        
        if [ "$SKIP_ICONS" = false ]; then
            echo "🖼️  Updating icon cache busting..."
            npm run icons:cache-bust
        fi
        
        if [ "$SKIP_TESTS" = false ]; then
            echo "🔍 Running linter..."
            npm run lint
        fi
        
        echo "🏗️  Building with fresh cache..."
        npm run build:fresh
        ;;
        
    quick)
        log_info "⚡ Quick Deployment"
        if [ "$SKIP_VERSION" = false ]; then
            echo "🔢 Generating build version..."
            npm run build:version
        fi
        
        if [ "$SKIP_TESTS" = false ]; then
            echo "🔍 Running linter..."
            npm run lint
        fi
        
        echo "🏗️  Quick build..."
        npm run build
        ;;
        
    dev)
        log_info "🛠️  Development Build"
        echo "🏗️  Building for development..."
        npm run build
        ;;
esac

# Show build results
echo ""
log_success "Build completed successfully!"
echo "================================"

# Show build information if available
if [ -f "src/build-info.json" ]; then
    echo "📋 Build Information:"
    if command -v jq > /dev/null; then
        cat src/build-info.json | jq .
    elif command -v python3 > /dev/null; then
        cat src/build-info.json | python3 -m json.tool
    else
        cat src/build-info.json
    fi
    echo ""
fi

# Show generated files
if [ -d "dist" ]; then
    echo "📂 Build artifacts in ./dist/"
    
    # Show asset sizes if available
    if [ -d "dist/assets" ]; then
        echo "📁 Asset files:"
        ls -lah dist/assets/ | grep -E "\.(js|css)$" || echo "   No JS/CSS files found"
    fi
    
    # Calculate total size
    TOTAL_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "Unknown")
    log_info "Total build size: $TOTAL_SIZE"
fi

echo ""
log_success "🚀 Ready for deployment!"

# Deployment tips based on type
case $DEPLOYMENT_TYPE in
    production|fresh)
        echo ""
        echo "💡 Production Deployment Tips:"
        echo "   • Upload the entire dist/ folder to your web server"
        echo "   • Clear CDN/proxy caches if using any"
        echo "   • Update service worker if needed"
        echo "   • Verify build version is displayed in app footer"
        if [ "$CURRENT_BRANCH" != "main" ]; then
            log_warning "Consider deploying from 'main' branch for production"
        fi
        ;;
    dev)
        echo ""
        echo "💡 Development Tips:"
        echo "   • Use 'npm run dev' for development server"
        echo "   • This build is for testing purposes only"
        ;;
esac

echo ""
log_success "✨ Deployment complete!"
