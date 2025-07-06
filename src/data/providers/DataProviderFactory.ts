import { IDataProvider } from './IDataProvider';
import { LocalStorageDataProvider } from './LocalStorageDataProvider';
import { ApiDataProvider } from './ApiDataProvider';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      // Check environment variable to determine which provider to use
      const useApiProvider = import.meta.env.VITE_USE_API_PROVIDER === 'true';
      
      if (useApiProvider) {
        // Use API provider for production or when explicitly enabled
        this.instance = new ApiDataProvider();
      } else {
        // Use localStorage provider for development/demo mode
        this.instance = new LocalStorageDataProvider();
      }
    }
    return this.instance;
  }

  static setInstance(provider: IDataProvider): void {
    this.instance = provider;
  }

  static reset(): void {
    this.instance = null;
  }
}