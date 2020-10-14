export abstract class Logger {
  protected abstract config(config: any): void;
  abstract track(trackProperties: any): Promise<void>;
  abstract isDisabled(): boolean;
  abstract dispose(): void;
}