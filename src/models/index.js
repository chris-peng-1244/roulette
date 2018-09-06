// @flow
import Sequelize from 'sequelize';
import config from '../config';
import logger from '../logger';

const connection = new Sequelize(
    config.MYSQL_DATABASE,
    config.MYSQL_USERNAME,
    config.MYSQL_PASSWORD,
    {
        dialect: 'mysql',
        host: config.MYSQL_HOST,
        pool: {
            max: 5,
            min: 0,
        },
        logging: config.SEQUELIZE_LOGGING
    }
);

connection.authenticate()
    .then(() => {
        logger.info('Connection to mysql has been established');
    })
    .catch(e => {
        logger.error('[Mysql] unable to connect to the database', e);
    });

export {
    connection,
    Sequelize,
};
