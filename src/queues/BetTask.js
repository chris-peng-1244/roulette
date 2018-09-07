// @flow
import UserBet from "../domains/UserBet";
import crc from 'node-crc';
import Game from "../domains/Game";

class BetTask {
    userBet: UserBet;
    game: Game;
    id: string;

    constructor(game: Game, userBet: UserBet) {
        this.game = game;
        this.userBet = userBet;
    }

    toString(): string {
        return JSON.stringify({
            id: this.getId(),
            userId: this.userBet.user.id,
            gameId: this.game.id,
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
                    manualInvest: this.userBet.manualInvest,
                    lastInvestedAt: this.userBet.lastInvestedAt.getTime(),
                }) , 'utf8'))
                .toString('hex');
        }
        return this.id;
    }
}

export default BetTask;
