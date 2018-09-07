// @flow

import UserBetLog from "../domains/UserBetLog";
import UserBetLogTable from "../models/UserBetLogTable";
import {fromWei} from '../utils/eth-units';

class UserBetLogRepository {
    async addUserBetLog(log: UserBetLog) {
        await UserBetLogTable.create({
            userId: log.userId,
            gameId: log.game.id,
            manualInvest: fromWei(log.bet.manualInvest),
            lastInvestedAt: log.bet.lastInvestedAt,
            status: log.status,
            comment: log.comment,
        });
    }
}

export default UserBetLogRepository;
