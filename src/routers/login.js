// @flow
import express from 'express';
import _ from 'lodash';
import UserRepository from "../repositories/UserRepository";
import {sign} from '../utils/jwt';
const router = express.Router();
const userRepo = UserRepository.getInstance();

router.post('/login', async (req, res, next) => {
    const { mobile, code } = req.body;
    let user = await userRepo.findByMobile(mobile);
    if (!user) {
        user = await userRepo.createUser(mobile);
    }
    const token = await sign({
        id: user.id,
    });
    return res.json({
        token,
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
