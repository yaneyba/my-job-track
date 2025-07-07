/**
 * Environment variable helper utilities
 * Centralizes all environment variable access and provides clean boolean helpers
 */

export const env = {
  // Demo Mode
  isDemoMode: () => import.meta.env.VITE_DEMO_MODE === 'true',
  
  // API Configuration
  apiUrl: () => import.meta.env.VITE_API_URL || '',
  apiKey: () => import.meta.env.VITE_API_KEY || '',
  allowedOrigins: () => import.meta.env.VITE_ALLOWED_ORIGINS || '',
  
  // Demo User Credentials
  demoEmail: () => import.meta.env.VITE_DEMO_EMAIL || 'demo@myjobtrack.app',
  demoPassword: () => import.meta.env.VITE_DEMO_PASSWORD || 'DemoUser2025!',
  
  // Admin Settings
  adminPassword: () => import.meta.env.VITE_ADMIN_PASSWORD || '',
  
  // Cache Management
  enableAutoUpdates: () => import.meta.env.VITE_ENABLE_AUTO_UPDATES === 'true',
} as const;

// Legacy compatibility - can be removed later
export const isDemoMode = env.isDemoMode;
export const getDemoCredentials = () => ({
  email: env.demoEmail(),
  password: env.demoPassword()
});
