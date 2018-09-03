import {verify} from '../utils/jwt';
import boom from 'boom';
import logger from '../logger';
import UserRepository from "../repositories/UserRepository";

const userRepo = UserRepository.getInstance();
async function auth(req, res, next) {
    const token = req.token;
    if (!token) {
        return next(boom.badRequest('Missing token'));
    }

    try {
        const userDataInToken = await verify(token);
        const user = await userRepo.findByMobile(userDataInToken.mobile);
        if (!user) {
            return next(boom.badRequest('Cant find user in token'));
        }
        req.app.set('user', userDataInToken);
        next();
    } catch (e) {
        logger.error('[Middleware auth] verify token ', e);
        next(boom.badRequest('Cant verify token'));
    }
}

export default  auth;
