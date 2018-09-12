import './loadenv';
import appConfig from './app';
import databaseConfig from './database';
import smsConfig from './sms';

export default Object.assign({},
    appConfig,
    databaseConfig,
    smsConfig
);

