// @flow
import UserBet from "./UserBet";
import UserBetLogStatus from "./UserBetLogStatus";

class UserBetLog {
    id: number;
    userId: number;
    gameId: number;
    manualInvest: number;
    lastInvestedAt: Date;
    status: string;
    comment: string;

    static create(bet: UserBet, gameId: number) {
        const log = new UserBetLog();
        log.userId = bet.user.id;
        log.gameId = gameId;
        log.manualInvest = bet.manualInvest;
        log.lastInvestedAt = bet.lastInvestedAt;
        log.status = UserBetLogStatus.PENDING;
        log.comment = 'BET IS STILL PENDING IN QUEUE';
        return log;
    }

    failWhenGameFinished() {
        this.status = UserBetLogStatus.FAIL;
        this.comment = 'GAME FINISHED';
    }

    failWhenGameFulfilled() {
        this.status = UserBetLogStatus.FAIL;
        this.comment = 'GAME GOAL REACHED BEFORE BET';
    }

    suceed() {
        this.status = UserBetLogStatus.SUCCEED;
        this.comment = 'SUCCEED';
    }
}

export default UserBetLog;
