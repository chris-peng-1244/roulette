// @flow
import UserTable from '../models/UserTable';
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

    async findByMobile(mobile): Promise<UserTable> {
        return await UserTable.findOne({
            where: {mobile}
        });
    }

    async createUser(mobile): Promise<UserTable> {
        try {
            return await UserTable.create({
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
            foundUniqueCode = await UserTable.count({where: {inviteCode}}) === 0;
        }
        return inviteCode;
    }
}

export default UserRepository;
