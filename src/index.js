import config from './config';
import express from 'express';
import logger from './logger';
import bodyParser from 'body-parser';
import bearerToken from 'express-bearer-token';
import login from './routers/login';
import game from './routers/game';
import bet from './routers/bet';
import user from './routers/user';
import auth from './middlewares/auth';
import boom from 'boom';

const app = express();
app.use(bodyParser.json());
app.use(bearerToken());

// Routers
app.use(login);
app.use('/game', game);
app.use(auth);
app.use('/bet', bet);
app.use('/user', user);

// Error handling
app.use((err, req, res, next) => {
    logger.error('[App] ' + err.stack);
    if (boom.isBoom(err)) {
        if (err.isServer) {
            return res.status(500).json({
                error: { message: err.message },
            });
        } else {
            return res.status(400).json({
                error: { message: err.message },
            });
        }
    }

    const errMsg = typeof err === 'string' ? err : err.getMessage();
    return res.status(500).json({
        error: { message: errMsg },
    });
});


app.listen(config.EXPRESS_PORT, () => {
    logger.info(`App starts at ${config.EXPRESS_PORT}`);
});

export default app;
