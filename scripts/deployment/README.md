# 🚀 MyJobTrack Deployment Scripts

This directory contains various deployment scripts for MyJobTrack, each optimized for different deployment scenarios.

## 📁 Available Scripts

### `deploy.sh` - Universal Deployment Script
The main deployment script that supports multiple deployment types:

```bash
# Full production deployment (recommended for releases)
./scripts/deployment/deploy.sh production

# Fresh deployment with cache busting
./scripts/deployment/deploy.sh fresh

# Quick deployment without cleaning
./scripts/deployment/deploy.sh quick

# Development build
./scripts/deployment/deploy.sh dev
```

**Options:**
- `--skip-tests` - Skip linting and tests
- `--skip-version` - Skip build version generation  
- `--skip-icons` - Skip icon cache busting
- `--help` - Show help message

### `deploy-production.sh` - Legacy Production Script
Original production deployment script with build numbers and versioning.

### `deploy-fresh-cache.sh` - Legacy Cache-Busting Script
Original cache-busting deployment script.

## 🎯 Deployment Types Explained

### Production (`production`)
- ✅ **Best for:** Production releases, staging deployments
- ✅ **Includes:** Build versioning, icon cache-busting, linting, clean build
- ✅ **Features:** Full build validation, version tracking, optimized assets
- ⏱️ **Speed:** Slowest (most thorough)

### Fresh (`fresh`)
- ✅ **Best for:** After dependency updates, cache issues, major changes
- ✅ **Includes:** Cache cleaning, browserslist updates, fresh installs
- ✅ **Features:** Eliminates all cache issues, ensures latest dependencies
- ⏱️ **Speed:** Slow (very thorough)

### Quick (`quick`)
- ✅ **Best for:** Minor changes, testing, rapid iterations
- ✅ **Includes:** Basic build with minimal cleaning
- ✅ **Features:** Fast builds, version tracking (optional)
- ⏱️ **Speed:** Fast

### Dev (`dev`)
- ✅ **Best for:** Development testing, local builds
- ✅ **Includes:** Basic build only
- ✅ **Features:** Minimal processing, no versioning
- ⏱️ **Speed:** Fastest

## 🔧 Build Scripts (package.json)

The deployment scripts use these npm scripts:

```json
{
  "build": "npm run build:version && vite build",
  "build:fresh": "npm run clean && npm run build:version && vite build", 
  "build:release": "npm run build:version && npm run icons:cache-bust && vite build",
  "build:version": "node tools/build-version.js",
  "clean": "rm -rf dist .vite node_modules/.vite",
  "icons:cache-bust": "node tools/add-icon-cache-busting.js"
}
```

## 🎯 Recommended Workflows

### Production Release
```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run full production deployment
./scripts/deployment/deploy.sh production

# 3. Deploy dist/ folder to your server
```

### Staging/Testing
```bash
# Quick deployment for testing
./scripts/deployment/deploy.sh quick
```

### After Dependencies Update
```bash
# Fresh deployment to clear all caches
./scripts/deployment/deploy.sh fresh
```

### CI/CD Pipeline
```bash
# Production deployment without prompts
./scripts/deployment/deploy.sh production --skip-tests
```

## 🔍 Build Verification

All deployment scripts show:
- ✅ Build completion status
- 📋 Build information (version, hash, date)
- 📁 Generated file sizes
- 💡 Deployment tips

## 🌐 Language Support

All builds include:
- ✅ English/Spanish translations
- ✅ Language toggle functionality
- ✅ Browser language detection
- ✅ localStorage persistence

## 🚀 Post-Deployment

After successful deployment:
1. 📂 Upload `dist/` folder to your web server
2. 🔄 Clear CDN/proxy caches if applicable
3. 🔍 Verify build version in app footer
4. 🌐 Test language toggle functionality
5. 📱 Test on multiple devices/browsers

## 🛠️ Troubleshooting

### Build Failures
- Run `npm run clean` and try again
- Check for uncommitted git changes
- Verify Node.js version compatibility

### Cache Issues
- Use `fresh` deployment type
- Clear browser cache
- Check service worker updates

### Version Issues
- Verify build-info.json is generated
- Check vite.config.ts build injection
- Ensure git repository is valid
