import { setup, start, defaultClient, TelemetryClient } from 'applicationinsights';
import { Logger } from './Logger';

export interface AzureConfiguration {
  aiCloudRole: string,
  aiCloudRoleInstance: string,
  disableAppInsights: boolean,
  environment: string,
  ikey: string,
};

export interface AzureTrackProperties {
  name: string,
  method: string,
  properties: any,
}

export class AzureLogger extends Logger {
  options: AzureConfiguration;
  logger: any = null;

  constructor(config : AzureConfiguration) {
    super();
    this.options = config;
    if(!config.disableAppInsights) {
      this.config();
    }
  }

  protected config() {
    const { ikey, environment, disableAppInsights, aiCloudRole, aiCloudRoleInstance } = this.options;

    setup(ikey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)

    defaultClient!.commonProperties = {
      environment,
    };

    defaultClient!.config.disableAppInsights = disableAppInsights;

    defaultClient!.context.tags["ai.cloud.role"] =  aiCloudRole;
    defaultClient!.context.tags["ai.cloud.roleInstance"] = aiCloudRoleInstance;

    this.logger = defaultClient;
  }

  start() {
    if(!this.options.disableAppInsights) {
      start();
    }
  }

  public track(trackProperties: AzureTrackProperties): void {
    if ( this.logger
      && !this.options.disableAppInsights
      && trackProperties) {
        const { name, method, properties } = trackProperties;
        this.logger[method]({ name, properties });
    }
  }

  isDisabled() {
    return this.options.disableAppInsights;
  }
}
