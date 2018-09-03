// @flow
import User from '../models/User';
import logger from '../logger';
import _ from 'lodash';

let repo;
class UserRepository {

    static getInstance(): UserRepository {
        if (!repo) {
            repo = new UserRepository();
        }
        return repo;
    }

    async findByMobile(mobile): Promise<User> {
        return await User.findOne({
            where: {mobile}
        });
    }

    async createUser(mobile): Promise<User> {
        try {
            return await User.create({
                mobile,
                inviteCode: await this._randomInviteCode(),
            });
        } catch (e) {
            logger.error('[UserRepository] createUser', e);
            throw e;
        }
    }

    async _randomInviteCode(): string {
        let foundUniqueCode = false;
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let inviteCode;
        while (!foundUniqueCode) {
            inviteCode = '';
            for (let i = 0; i < 4; i++) {
                inviteCode += chars[_.random(0, chars.length-1)];
            }
            foundUniqueCode = await User.count({where: {inviteCode}}) === 0;
        }
        return inviteCode;
    }
}

export default UserRepository;
