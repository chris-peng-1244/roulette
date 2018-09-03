import config from './config';
import express from 'express';
import logger from './logger';
import bodyParser from 'body-parser';
import login from './routers/login';
// import auth from './middlewares/auth';

const app = express();
app.use(bodyParser.json());
app.use(login);
// app.use(auth);

app.listen(config.EXPRESS_PORT, () => {
    logger.info(`App starts at ${config.EXPRESS_PORT}`);
});

export default app;
