// @flow
import Game from "./Game";
import UserBet from "./UserBet";
import UserBetLogStatus from "./UserBetLogStatus";

class UserBetLog {
    game: Game;
    bet: UserBet;
    status: string;
    comment: string;

    constructor(game: Game, bet: UserBet) {
        this.game = game;
        this.bet = bet;
    }

    static create(game: Game, bet: UserBet) {
        const log = new UserBetLog(game, bet);
        log.status = UserBetLogStatus.PENDING;
        log.comment = 'BET IS STILL PENDING IN QUEUE';
        return log;
    }

    get userId() {
        return this.bet.user.id;
    }
}

export default UserBetLog;
