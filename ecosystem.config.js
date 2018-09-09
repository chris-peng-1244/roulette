module.exports = {
    apps : [
        {
            name      : 'OnePlay',
            script    : 'lib/index.js',
            env: {
                NODE_ENV: 'development'
            },
            env_production : {
                NODE_ENV: 'production'
            },
            watch: ['lib'],
        },
        {
            name : 'GameRotator',
            script: 'lib/commands/game-rotator.js',
            output: 'logs/bet-consumer-out.log',
            error: 'logs/game-rotator-error.log',
            watch: ['lib'],
        },
        {
            name: 'BetConsumer',
            script: 'lib/commands/bet-consumer.js',
            output: 'logs/bet-consumer-out.log',
            error: 'logs/bet-consumer-error.log',
            watch: ['lib'],
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
