import { IDataProvider } from './IDataProvider';
import { LocalStorageDataProvider } from './LocalStorageDataProvider';

export class DataProviderFactory {
  private static instance: IDataProvider | null = null;

  static getInstance(): IDataProvider {
    if (!this.instance) {
      this.instance = new LocalStorageDataProvider();
    }
    return this.instance;
  }

  static setInstance(provider: IDataProvider): void {
    this.instance = provider;
  }
}