// @flow
import User from "../domains/User";
import request from 'request-promise';
import config from '../config';
import logger from '../logger';

class UserWalletRepository {
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
}

export default UserWalletRepository;
