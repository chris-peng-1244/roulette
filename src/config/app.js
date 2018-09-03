const config = {
    EXPRESS_PORT: process.env.EXPRESS_PORT || 3000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
};

export default config;
