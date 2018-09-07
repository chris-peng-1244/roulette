// @flow
import UserTable from '../models/UserTable';
import logger from '../logger';
import _ from 'lodash';
import User from "../domains/User";
import {toWei, fromWei} from '../utils/eth-units';

let repo;
class UserRepository {

    static getInstance(): UserRepository {
        if (!repo) {
            repo = new UserRepository();
        }
        return repo;
    }

    async findByMobile(mobile): Promise<User | null> {
        const data = await UserTable.findOne({
            where: {mobile}
        });
        if (!data) {
            return null;
        }
        return _db2Domain(data);
    }

    async findById(id: number): Promise<User | null> {
        const data = await UserTable.findOne({
            where: {id}
        });
        if (!data) {
            return null;
        }
        return _db2Domain(data);
    }

    async createUser(mobile): Promise<UserTable> {
        try {
            const data = await UserTable.create({
                mobile,
                balance: 0,
                inviteCode: await this._randomInviteCode(),
            });
            return _db2Domain(data);
        } catch (e) {
            logger.error('[UserRepository] createUser', e);
            throw e;
        }
    }

    async updateUser(user: User) {
        try {
            const userData = await UserTable.find({
                where: {id: user.id},
            });
            if (userData) {
                userData.balance = fromWei(user.balance);
                await userData.save();
            }
        } catch (e) {
            logger.error('[UserRepository] updateUser ' + e.stack);
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

function _db2Domain(data: Object): User {
    return new User(data.id, toWei(data.balance, 'ether'), data.inviteCode);
}

export default UserRepository;
