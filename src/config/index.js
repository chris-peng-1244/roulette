import './loadenv';
import appConfig from './app';
import databaseConfig from './database';

export default Object.assign({}, appConfig, databaseConfig);

