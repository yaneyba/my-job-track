import { IDataProvider } from './IDataProvider';
import { ApiDataProvider } from './ApiDataProvider';
import { DemoDataProvider } from './DemoDataProvider';
import { LocalStorageDataProvider } from './LocalStorageDataProvider';
import { env } from '@/utils/env';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      // Check if we should use waitlist mode (local storage)
      if (this.isWaitlistMode()) {
        this.instance = new LocalStorageDataProvider();
      } else if (env.isDemoMode()) {
        // Check if we should use demo data provider
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
    this.instance = new DemoDataProvider();
  }

  static enableWaitlistMode(): void {
    this.instance = new LocalStorageDataProvider();
  }

  static disableDemoMode(): void {
    this.instance = new ApiDataProvider();
  }

  static isWaitlistMode(): boolean {
    // Check if current user is in waitlist mode
    try {
      const currentUser = localStorage.getItem('jobtrack_current_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        return user.isWaitlisted === true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static reset(): void {
    this.instance = null;
  }
}