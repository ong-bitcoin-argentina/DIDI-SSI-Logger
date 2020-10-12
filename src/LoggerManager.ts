
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

  async track(loggerProperties: any) {
    for (let loggerKey in this.loggers) {
      const params =  loggerProperties[loggerKey];
      const loggerInstance = this.loggers[loggerKey];
      setImmediate(() => loggerInstance.track(params));
    }
  }

  async start(loggerProperties: any = {}) {
    for (let loggerKey in this.loggers) {
      const params =  loggerProperties[loggerKey];
      const loggerInstance = this.loggers[loggerKey];
      setImmediate(() => loggerInstance.start(params));
    }
  }
}