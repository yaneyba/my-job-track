import { IDataProvider } from './IDataProvider';
import { LocalStorageDataProvider } from './LocalStorageDataProvider';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      // Use localStorage provider for development/demo mode
      // In production, components should use React Query with the API directly
      this.instance = new LocalStorageDataProvider();
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