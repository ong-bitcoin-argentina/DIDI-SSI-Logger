import { Logger } from "./Logger";

export class LoggerManager {
	loggers: { 
    [key: string]: Logger
  } = {};
  
  addLogger(key: string,logger: Logger) {
    this.loggers[key] = logger;
  }

	removeLogger(key: string) {
		delete this.loggers[key];
  }
  
  getLogger(key: string) {
    return this.loggers[key];
  }

  async track(loggerProperties: any): Promise<void> {
    for (let loggerKey in this.loggers) {
      const params =  loggerProperties[loggerKey];
      const loggerInstance = this.loggers[loggerKey];
      // @ts-ignore 
      setImmediate(async () => await loggerInstance.track(params));
    }
  }

  dispose() {
    for (let loggerKey in this.loggers) {
      const loggerInstance = this.loggers[loggerKey];
      // @ts-ignore 
      setImmediate(() => loggerInstance.dispose());
    }
  }
}