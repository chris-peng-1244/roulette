// @flow
import express from 'express';
import logger from '../logger';
import UserRepository from "../repositories/UserRepository";
import {sign} from '../utils/jwt';
import boom from 'boom';
import {createSmsVerifyCodeRepository, createUserWalletRepository} from "../repositories/RepositoryFactory";
import SmsVendor from "../vendors/SmsVendor";
const router = express.Router();
const userRepo = UserRepository.getInstance();
const userWalletRepo = createUserWalletRepository();
const verifyCodeRepo = createSmsVerifyCodeRepository();

router.post('/login', async (req, res, next) => {
    const { mobile, code, inviteCode } = req.body;
    if (!mobile) {
        return next(boom.badRequest('Mobile cannot be empty'));
    }
    if (!code) {
        return next(boom.badRequest('Verify code cannot be empty'));
    }
    if (!await verifyCodeRepo.verifyCode(mobile, code)) {
        return next(boom.badRequest('Verify code is wrong'));
    }

    let user = await userRepo.findByMobile(mobile);
    let address = '';
    if (!user) {
        user = await userRepo.createUser(mobile, inviteCode);
        address = await userWalletRepo.createWallet(user);
    } else {
        address = user.address;
    }

    const token = await sign({
        id: user.id,
    });
    return res.json({
        token,
        address,
    });
});

router.post('/verify-code', async (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile) {
        return next(boom.badRequest('Mobile cannot be empty'));
    }
    const {code, error} = await verifyCodeRepo.generateVerifyCode(mobile);
    if (error) {
        return next(boom.badRequest(error));
    }
    const smsVendor = SmsVendor.getInstance();
    try {
        if (await smsVendor.sendVerifyCode(mobile, code)) {
            return res.json({
                code
            });
        }
    } catch (e) {
        logger.error('[API] /verify-code ' + e.stack);
    }
    await verifyCodeRepo.deleteVerifyCode(mobile);
    return next(boom.badImplementation('Failed to send sms'));
});

export default router;
