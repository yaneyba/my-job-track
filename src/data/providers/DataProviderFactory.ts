import { IDataProvider } from './IDataProvider';
import { ApiDataProvider } from './ApiDataProvider';
import { DemoDataProvider } from './DemoDataProvider';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      // Check if we should use demo data provider
      if (import.meta.env.VITE_USE_DEMO_DATA === 'true') {
        this.instance = new DemoDataProvider();
      } else {
        // Use API provider by default
        this.instance = new ApiDataProvider();
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