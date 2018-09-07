// @flow
import UserBet from "../domains/UserBet";
import crc from 'node-crc';
import Game from "../domains/Game";
import UserBetLog from "../domains/UserBetLog";

class BetTask {
    userBet: UserBet;
    game: Game;
    userBetLog: UserBetLog;
    id: string;

    constructor(game: Game, userBet: UserBet, userBetLog: UserBetLog) {
        this.game = game;
        this.userBet = userBet;
        this.userBetLog = userBetLog;
    }

    toString(): string {
        return JSON.stringify({
            id: this.getId(),
            userId: this.userBet.user.id,
            gameId: this.game.id,
            userBetLogId: this.userBetLog.id,
            manualInvest: this.userBet.manualInvest,
            lastInvestedAt: this.userBet.lastInvestedAt.getTime(),
        });
    }

    getId(): string {
        if (!this.id) {
            this.id = crc.crc32(Buffer.from(
                JSON.stringify({
                    userId: this.userBet.user.id,
                    gameId: this.game.id,
                    userBetLogId: this.userBetLog.id,
                    manualInvest: this.userBet.manualInvest,
                    lastInvestedAt: this.userBet.lastInvestedAt.getTime(),
                }) , 'utf8'))
                .toString('hex');
        }
        return this.id;
    }
}

export default BetTask;
