import redis from 'redis';
import bluebird from 'bluebird';
import logger from './logger';
import config from './config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    prefix: 'token-casino-',
});
client.on('error', err => {
    logger.error('[Redis] Connection error ' + err);
});

client.on('ready', () => {
    logger.info('[Redis] Connection is ready');
});


export default client;
