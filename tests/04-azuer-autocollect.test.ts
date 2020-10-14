import { expect } from 'chai';
import sinon from 'sinon';
import { AzureLogger, LoggerManager } from '../src/index';
import { AzureConfiguration } from '../src/AzureLogger';
const axios = require('axios');

describe('Azure auto collect in express server', async () => {
  const port = 3123;
  const azureLoggerKey = 'azure';
  let azureLogger: AzureLogger;
  let loggerManager: LoggerManager;
  let server;
  const handler = (req, res) => {
    loggerManager.track({
      [azureLoggerKey]: {
        method: 'trackEvent',
        name: "request", 
        properties: {
          method: req.method,
          url: req.originalUrl,
          time: Date(),
        },
      },
    });
    res.status(200).json({ok: true})
  };

  describe('Enabled (should warn about ikey if not provided)', async () => {
    before(async () => {
      const config: AzureConfiguration = {
        aiCloudRole: 'Test suite',
        aiCloudRoleInstance:  process.env.INSTANCE || 'Express server',
        disableAppInsights: false,
        environment: 'test',
        ikey: process.env.IKEY || 'ikey',
      };
      loggerManager = new LoggerManager();
      azureLogger = new AzureLogger(config);
      
      loggerManager.addLogger(azureLoggerKey, azureLogger);
      const express = require('express');
      const app = express();
      app.get('/', handler);

      server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);

      })
    });

    after(async () => {
      sinon.restore();
      await azureLogger.dispose();
      server.close();
    });

    it('should be created, but disabled', async () => {
      const response = await axios.get(`http://localhost:${port}`);
    });
  });
  describe('Disabled', async () => {
    before(async () => {
      const config: AzureConfiguration = {
        aiCloudRole: 'Test suite',
        aiCloudRoleInstance:  process.env.INSTANCE || 'Express server',
        disableAppInsights: true,
        environment: 'test',
        ikey: process.env.IKEY || 'ikey',
      };
      loggerManager = new LoggerManager();
      azureLogger = new AzureLogger(config);
      const azureLoggerKey = 'azure';
      loggerManager.addLogger(azureLoggerKey, azureLogger);
      const express = require('express');
      const app = express();
      app.get('/', handler);

      server = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);

      })
    });

    after(async () => {
      sinon.restore();
      await azureLogger.dispose();
      server.close();
    });

    it('should be created, but disabled', async () => {
      const response = await axios.get(`http://localhost:${port}`);
    });
  });
});
