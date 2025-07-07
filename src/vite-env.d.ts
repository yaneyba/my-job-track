/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MVP_MODE: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_API_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_ALLOWED_ORIGINS: string
  readonly VITE_USE_API_PROVIDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global variables injected by Vite
declare const __BUILD_TIME__: string;
declare const __PACKAGE_VERSION__: string;
