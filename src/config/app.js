const config = {
    EXPRESS_PORT: process.env.EXPRESS_PORT || 3000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',

    // Game ini
    NEXT_ROUND_GOAL_INCR_RATIO: 1.58,
    NEXT_ROUND_INTERVAL: parseInt(process.env.NEXT_ROUND_INTERVAL) || 24*3600*1000,
    GAME_INITIAL_GOAL: parseInt(process.env.GAME_INITIAL_GOAL) || 50000000000000000000,
};

export default config;
