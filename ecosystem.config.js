module.exports = {
    apps : [
        {
            name      : 'OnePlay',
            script    : 'lib/index.js',
            output: 'logs/oneplay-out.log',
            error: 'logs/oneplay-error.log',
            env: {
                watch: ['lib'],
                NODE_ENV: 'development'
            },
            env_production : {
                watch: false,
                NODE_ENV: 'production'
            },
        },
        {
            name : 'GameRotator',
            script: 'lib/commands/game-rotator.js',
            output: 'logs/game-rotator-out.log',
            error: 'logs/game-rotator-error.log',
            env: {
                watch: ['lib'],
            },
            env_production: {
                watch: false,
            }
        },
        {
            name: 'BetConsumer',
            script: 'lib/commands/bet-consumer.js',
            output: 'logs/bet-consumer-out.log',
            error: 'logs/bet-consumer-error.log',
            env: {
                watch: ['lib'],
            },
            env_production: {
                watch: false,
            }
        }
    ],

    deploy : {
        production : {
            user : 'node',
            host : '212.83.163.1',
            ref  : 'origin/master',
            repo : 'git@github.com:repo.git',
            path : '/var/www/production',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
