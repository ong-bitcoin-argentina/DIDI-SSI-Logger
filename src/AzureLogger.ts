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
  options: AzureConfiguration | null = null;
  logger: any = null;

  constructor(config : AzureConfiguration) {
    super();
    if(config.disableAppInsights) return;
    
    this.options = config;
    this.config();
  }

  protected async config() {
    const { ikey, environment, disableAppInsights, aiCloudRole, aiCloudRoleInstance } = this.options!;
    // @ts-ignore 
    const applicationinsights = require('applicationinsights');
    applicationinsights.setup(ikey)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectConsole(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .start();      

    applicationinsights.defaultClient!.commonProperties = {
      environment,
    };

    applicationinsights.defaultClient!.config.disableAppInsights = disableAppInsights;

    applicationinsights.defaultClient!.context.tags["ai.cloud.role"] =  aiCloudRole;
    applicationinsights.defaultClient!.context.tags["ai.cloud.roleInstance"] = aiCloudRoleInstance;

    this.logger = applicationinsights;
  }

  public async track(trackProperties: AzureTrackProperties): Promise<void> {
    if ( !this.logger || !this.options ||this.options.disableAppInsights || !trackProperties) return;

    const { name, method, properties } = trackProperties;
    this.logger.defaultClient[method]({ name, properties });
    
  }

  isDisabled() {
    if (!this.options) return false;
    return this.options.disableAppInsights;
  }

  dispose() {
    if (!this.logger) return;
    if (this.logger.defaultClient) this.logger.defaultClient.flush();
      
    this.logger.dispose();
  }
}
