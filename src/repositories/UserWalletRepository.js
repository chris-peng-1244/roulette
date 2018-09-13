// @flow
import User from "../domains/User";
import request from 'request-promise';
import config from '../config';
import logger from '../logger';
import UserRepository from "./UserRepository";
import {fromWei} from "../utils/eth-units";

class UserWalletRepository {
    userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async createWallet(user: User): Promise<string> {
        try {
            const res = await request({
                method: 'POST',
                uri: config.ETH_API + '/accounts',
                json: true,
                body: {
                    userId: user.id,
                }
            });
            return res.address;
        } catch (e) {
            logger.error('[UserWalletRepository] createWallet ' + e.stack);
            return '';
        }
    }

    async withdraw(from: string, to: string, amount: number) {
        try {
            await request({
                method: 'POST',
                uri: config.ETH_API + '/accounts/withdraw',
                json: true,
                body: {
                    from,
                    to,
                    amount: fromWei(amount),
                }
            });
        }  catch (e) {
            logger.error('[UserWalletRepository] withdraw ' + e.stack);
        }
    }
}

export default UserWalletRepository;
