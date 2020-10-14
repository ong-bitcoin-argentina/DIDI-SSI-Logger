import { expect } from 'chai';
import sinon from 'sinon';
import { AzureLogger } from '../src/index';
import { AzureConfiguration } from '../src/AzureLogger';

describe('Azure Logger', async () => {
  let azureLogger: AzureLogger;
  const sandbox = sinon.createSandbox();

  describe('Disabled', async () => {
    const config: AzureConfiguration = {
      aiCloudRole: 'Test suite',
      aiCloudRoleInstance:  process.env.INSTANCE || 'aiCloudRoleInstance',
      disableAppInsights: true,
      environment: 'test',
      ikey: process.env.IKEY || 'ikey',
    }
    beforeEach(async () => {
      azureLogger = new AzureLogger(config);
      sandbox.spy(azureLogger, 'dispose' );
    });
    afterEach(async () => {
      sinon.restore();
      await azureLogger.dispose();
    });
    it('should be created, but disabled', async () => {
      expect(azureLogger.isDisabled());
    });

    it('Should not panic on track when disabled', async () => {
      expect(azureLogger.isDisabled());
      const params = {
        name: 'time',
        properties: { value: Date() }
      }
      await azureLogger.track({...params, method: 'trackEvent',});
    });

    it('Should dispose', async () => {
      azureLogger.dispose();
      // @ts-ignore
      expect(azureLogger.dispose.calledOnce);
    })
  });

  describe('Enabled (should warn about ikey if not provided)', async () => {
    const config: AzureConfiguration = {
      aiCloudRole: 'Test suite',
      aiCloudRoleInstance:  process.env.INSTANCE || 'aiCloudRoleInstance',
      disableAppInsights: false,
      environment: 'test',
      ikey: process.env.IKEY || 'ikey',
    }
    beforeEach(async () => {
      azureLogger = await new AzureLogger(config);
    });
    afterEach(async () => {
      sinon.restore();
      await azureLogger.dispose();
    });
    it('should be created, and not be disabled', async () => {
      expect(!azureLogger.isDisabled());
    });
    it('Should track a custom event', async () => {
      expect(!azureLogger.isDisabled());
      const fakeTrackEvent = sinon.fake();
      sinon.replace(azureLogger.logger.defaultClient, 'trackEvent', fakeTrackEvent);
      const params = {
        name: 'age',
        properties: { value: Date() }
      }
      await azureLogger.track({...params, method: 'trackEvent',});
      expect(fakeTrackEvent.callCount).to.equal(1);
      // @ts-ignore firstArg isn't declared in types
      expect(fakeTrackEvent.firstArg).to.deep.equal(params);
    });
    it('Should not track a custom event if not params are passed', async () => {
      expect(!azureLogger.isDisabled());
      const fakeTrackEvent = sinon.fake();
      sinon.replace(azureLogger.logger.defaultClient, 'trackEvent', fakeTrackEvent);
      const params = {
        name: 'time',
        properties: { value: Date() }
      }
      // @ts-ignore
      await azureLogger.track();
      expect(fakeTrackEvent.callCount).to.equal(0);
    });
    it('Should dispose', async () => {
      azureLogger.dispose();
      // @ts-ignore
      expect(azureLogger.dispose.calledOnce);
    })
  });
});
