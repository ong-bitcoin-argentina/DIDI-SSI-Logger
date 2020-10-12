import { expect } from 'chai';
import sinon from 'sinon';
import { Logger, AzureLogger } from '../src/index';
import { AzureConfiguration } from '../src/AzureLogger';

describe('Azure Logger', function() {

  afterEach(function () {
    sinon.restore();
  });

  const config: AzureConfiguration = {
    aiCloudRole: 'aiCloudRole',
    aiCloudRoleInstance: 'aiCloudRoleInstance',
    disableAppInsights: true,
    environment: 'test',
    ikey: 'ikey',
  }
  it('should be created, but disabled', async () => {
    const logger: Logger = new AzureLogger(config);
    expect(logger.isDisabled());
  });

  it('should be created, and not be disabled', async () => {
    const logger: Logger = new AzureLogger({...config, disableAppInsights: false });
    expect(!logger.isDisabled());
  });

  it('Should track a custom event', async () => {
    const azureLogger: AzureLogger = new AzureLogger({...config, disableAppInsights: false });
    expect(!azureLogger.isDisabled());
    const fakeTrackEvent = sinon.fake();
    sinon.replace(azureLogger.logger, 'trackEvent', fakeTrackEvent);
    const params = {
      name: 'age',
      properties: { value: 28 }
    }
    azureLogger.track({...params, method: 'trackEvent',});
    expect(fakeTrackEvent.callCount).to.equal(1);
    // @ts-ignore firstArg isn't declared in types
    expect(fakeTrackEvent.firstArg).to.deep.equal(params)
  });
  
  it('Should not panic on track when disabled', async () => {
    const azureLogger: AzureLogger = new AzureLogger({...config});
    expect(azureLogger.isDisabled());
    const params = {
      name: 'age',
      properties: { value: 28 }
    }
    azureLogger.track({...params, method: 'trackEvent',});
  });

  it('Should not track a custom event if not params are passed', async () => {
    const azureLogger: AzureLogger = new AzureLogger({...config, disableAppInsights: false });
    expect(!azureLogger.isDisabled());
    const fakeTrackEvent = sinon.fake();
    sinon.replace(azureLogger.logger, 'trackEvent', fakeTrackEvent);
    const params = {
      name: 'age',
      properties: { value: 28 }
    }
    // @ts-ignore
    azureLogger.track();
    expect(fakeTrackEvent.callCount).to.equal(0);
  });
  
});
