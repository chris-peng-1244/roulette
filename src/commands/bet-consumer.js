import BetTaskConsumer from '../queues/BetTaskConsumer';
import logger from '../logger';

const consumer = new BetTaskConsumer;
consumer.consume().then(() => logger.info('[Consumer] Starting...'));
