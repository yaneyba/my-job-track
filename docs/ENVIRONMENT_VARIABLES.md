# Environment Variables Documentation

This document outlines all environment variables used in MyJobTrack and their purposes.

## Environment Files

- **`.env`** - Main environment file for development/production
- **`.env.example`** - Template file for developers (safe to commit)
- **`.env.production`** - Production-specific overrides

## Environment Variables

### API Configuration

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_API_URL` | Base URL for the API backend | `http://localhost:8787` (dev)<br>`https://myjobtrack-api.yeb404974.workers.dev` (prod) |
| `VITE_API_KEY` | API key for authentication | `your-api-key-here` |
| `VITE_USE_API_PROVIDER` | Whether to use API provider vs demo data | `true` (use API)<br>`false` (use demo data) |
| `VITE_ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS | `http://localhost:5173,http://localhost:3000` |

### Application Mode

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_DEMO_MODE` | Enable demo mode features | `true` (enable)<br>`false` (disable) |

### Cache Management

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_ENABLE_AUTO_UPDATES` | Enable automatic cache updates | `true` (enable)<br>`false` (disable) |

### Demo User Credentials

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_DEMO_EMAIL` | Demo user email for testing | `demo@myjobtrack.app` |
| `VITE_DEMO_PASSWORD` | Demo user password for testing | `DemoUser2025!` |

### Admin Settings

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `VITE_ADMIN_PASSWORD` | Admin password for restricted features | `AdminPassword2025!` |

## Environment Setup

### Development

1. Copy `.env.example` to `.env`
2. Update values as needed for your local setup
3. Ensure API URL points to your local development server

### Production

1. Use `.env.production` for production builds
2. Ensure all sensitive values are properly secured
3. Update API URLs to production endpoints

## Security Notes

- Never commit actual `.env` files with sensitive data
- Use strong passwords for demo and admin accounts
- Keep API keys secure and rotate them regularly
- Ensure production URLs use HTTPS

## Data Provider Selection

The application uses `VITE_USE_API_PROVIDER` to determine which data provider to use:

- `true` - Use API provider (connects to backend)
- `false` - Use demo data provider (read-only, no backend required)

Demo mode is automatically enabled when `VITE_USE_API_PROVIDER` is `false`.
