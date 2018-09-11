// @flow
import express from 'express';
import _ from 'lodash';
import UserRepository from "../repositories/UserRepository";
import {sign} from '../utils/jwt';
import boom from 'boom';
import {createUserWalletRepository} from "../repositories/RepositoryFactory";
const router = express.Router();
const userRepo = UserRepository.getInstance();
const userWalletRepo = createUserWalletRepository();

router.post('/login', async (req, res, next) => {
    const { mobile, code, inviteCode } = req.body;
    if (!mobile) {
        return next(boom.badRequest('Mobile cannot be empty'));
    }
    let user = await userRepo.findByMobile(mobile);
    let address = '';
    if (!user) {
        user = await userRepo.createUser(mobile, inviteCode);
        address = await userWalletRepo.createWallet(user);
    }
    const token = await sign({
        id: user.id,
    });
    return res.json({
        token,
        address,
    });
});

router.post('/verify-code', (req, res) => {
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += String(_.random(0, 9));
    }
    return res.json({
        code: result,
    });
});

export default router;
