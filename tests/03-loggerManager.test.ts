import { expect } from 'chai';
import sinon from 'sinon';
import { Logger, AzureLogger, LoggerManager } from '../src/index';
import { CustomLogger } from './CustomLogger';

import { AzureConfiguration } from '../src/AzureLogger';
import { defaultClient } from 'applicationinsights';

describe('Logger manger', async () => {
  afterEach(function () {
    sinon.restore();
  });
  const configCustom: any = {
    pre: 'customLogger:',
    post: '.'
  };
  const configAzure: AzureConfiguration = {
    aiCloudRole: 'aiCloudRole',
    aiCloudRoleInstance: 'aiCloudRoleInstance',
    disableAppInsights: false,
    environment: 'test',
    ikey: process.env.IKEY || 'ikey',
  }

  it('Should be created', async () => {
    const loggerManager: LoggerManager = new LoggerManager();
    expect(loggerManager).to.not.be.null;
  });

  it('Should be add a Logger', async () => {
    const loggerManager: LoggerManager = new LoggerManager();
    expect(loggerManager).to.not.be.null;

    const logger = new CustomLogger(configCustom);
    const loggerKey = 'customLogger'

    expect(logger).to.not.be.null;
    loggerManager.addLogger(loggerKey, logger);
    expect(logger).to.deep.equal( loggerManager.getLogger(loggerKey))
  });

  it('Should start every logger', async () => {
    const loggerManager: LoggerManager = new LoggerManager();
    expect(loggerManager).to.not.be.null;

    const customLogger: CustomLogger  = new CustomLogger(configCustom);
    const customLoggerKey = 'custom';
    loggerManager.addLogger(customLoggerKey, customLogger);
    expect(customLogger).to.deep.equal( loggerManager.getLogger(customLoggerKey));

    const azureLogger: AzureLogger = new AzureLogger(configAzure);
    const azureLoggerKey = 'azure';
    loggerManager.addLogger(azureLoggerKey, azureLogger);
    expect(azureLogger).to.deep.equal(loggerManager.getLogger(azureLoggerKey));

    loggerManager.start();

  });

  it('Should be track in every logger', async () => {
    const azureTrack = {
      name: 'age',
      properties: { value: 28 }
    }
    const customTrack = {
      message: 'Message',
    }
    const loggerManager: LoggerManager = new LoggerManager();
    expect(loggerManager).to.not.be.null;

    const customLogger: CustomLogger  = new CustomLogger(configCustom);
    const customLoggerKey = 'custom';
    loggerManager.addLogger(customLoggerKey, customLogger);
    expect(customLogger).to.deep.equal( loggerManager.getLogger(customLoggerKey));

    const azureLogger: AzureLogger = new AzureLogger(configAzure);
    const fakeAzureTrackEvent = sinon.fake();
    sinon.replace(azureLogger.logger, 'trackEvent', fakeAzureTrackEvent);
    const azureLoggerKey = 'azure';
    loggerManager.addLogger(azureLoggerKey, azureLogger);
    expect(azureLogger).to.deep.equal(loggerManager.getLogger(azureLoggerKey));

    loggerManager.track({
      [azureLoggerKey]: {
        ...azureTrack,
        method: 'trackEvent'
      },
      [customLoggerKey]: customTrack,
    });

  });
});