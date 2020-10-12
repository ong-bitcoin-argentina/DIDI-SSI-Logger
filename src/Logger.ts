export abstract class Logger {
  protected abstract config(config: any): void;
  abstract track(trackProperties: any): void;
  abstract start(params: any): void;
  abstract isDisabled(): boolean;
}