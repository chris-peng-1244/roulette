// @flow

import UserBetLog from "../domains/UserBetLog";
import UserBetLogTable from "../models/UserBetLogTable";
import {fromWei} from '../utils/eth-units';

class UserBetLogRepository {
    async addUserBetLog(log: UserBetLog) {
        const data = await UserBetLogTable.create({
            userId: log.userId,
            gameId: log.gameId,
            manualInvest: fromWei(log.manualInvest),
            lastInvestedAt: log.lastInvestedAt,
            status: log.status,
            comment: log.comment,
        });
        log.id = data.id;
        return log;
    }

    async findById(id: number): Promise<UserBetLog | null> {
        const data = await UserBetLogTable.find({
            where: {id}
        });
        if (!data) {
            return null;
        }
        const log = new UserBetLog();
        log.id = data.id;
        log.gameId = data.gameId;
        log.userId = data.userId;
        log.lastInvestedAt = data.lastInvestedAt;
        log.manualInvest = data.manualInvest;
        log.status = data.status;
        log.comment = data.comment;
        return log;
    }

    async updateUserBetLog(log: UserBetLog) {
        await UserBetLogTable.update(
            {status: log.status, comment: log.comment},
            {where: {id: log.id}}
        );
    }
}

export default UserBetLogRepository;
