import { expect } from 'chai'; 
import { Logger } from '../src/index';
import { CustomLogger } from './CustomLogger';

describe('Custom Logger', function() {  
  const config: any = {
    pre: 'pre',
    post: 'post'
  };

  it('should be created', async () => {
    const logger: Logger = new CustomLogger(config);
  });

  it('should track a mesage', async () => {
    const logger: Logger = new CustomLogger(config);
    logger.track({ message: 'message' });
  });
});