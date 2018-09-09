import config from './config';
import winston from 'winston';
const {createLogger, transports, format } = winston;

const logger = createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.File({
            filename: 'logs/app.log',
            level: config.LOG_LEVEL,
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new transports.Console({
            level: 'debug',
            colorize: true,
        })
    ]
});

export default logger;
