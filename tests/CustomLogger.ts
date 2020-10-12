import { Logger } from '../src/Logger';

export class CustomLogger extends Logger {
  options: any;
  logger: any = null;

  constructor(config : any) {
    super();
    this.options = config;
    if(!config.disableAppInsights) {
      this.config();
    }
  }

  config() {
    this.logger = (message: any) => console.log(`${this.options.pre} ${message} ${this.options.post}`)
  }

  start() {}

  public track(trackProperties: any): void {
    if(this.logger && trackProperties) {
      const { message } = trackProperties;
      this.logger(message);
    }
  }
  
  isDisabled() {
    return false;
  }
}