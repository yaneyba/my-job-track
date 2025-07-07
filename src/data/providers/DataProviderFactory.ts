import { IDataProvider } from './IDataProvider';
import { ApiDataProvider } from './ApiDataProvider';
import { DemoDataProvider } from './DemoDataProvider';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;
  private static isDemoMode = false;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      // Check if we should use demo data provider
      if (this.isDemoMode || import.meta.env.VITE_USE_DEMO_DATA === 'true') {
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

  static enableDemoMode(): void {
    this.isDemoMode = true;
    this.instance = new DemoDataProvider();
  }

  static disableDemoMode(): void {
    this.isDemoMode = false;
    this.instance = new ApiDataProvider();
  }

  static reset(): void {
    this.instance = null;
    this.isDemoMode = false;
  }
}