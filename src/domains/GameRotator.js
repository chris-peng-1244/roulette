// @flow
import Game from "./Game";
import GameStatus from './GameStatus';
import AssetStrategy from "./AssetStrategy";
import PrizePool from "./PrizePool";
import GameFactory from "./GameFactory";
import Transaction from "./Transaction";

class GameRotator {
    previousGame: Game | null;
    currentGame: Game;
    pool: PrizePool;

    constructor(pool: PrizePool, previousGame: Game | null, currentGame: Game) {
        this.pool = pool;
        this.previousGame = previousGame;
        this.currentGame = currentGame;
    }

    rotate(): {newRound: Game, transactions: Transaction[]} {
        const now = new Date();
        let newRound;
        let strategy;
        // Current game is the first round
        if (this.previousGame === null) {
            // Current game reaches its goal
            if (this.currentGame.getPool() >= this.currentGame.goal) {
                this.currentGame.status = GameStatus.PENDING_FOR_NEXT_ROUND;
                newRound = this._createNextRound(now);
                strategy = AssetStrategy.createNextRoundStrategy();
            } else {
                this.currentGame.status = GameStatus.FAIL_AT_ITS_OWN_ROUND;
                newRound = this._createNewRound(now);
                strategy = AssetStrategy.createRefundStrategy();
            }
        } else {
            // The previous round wins
            // There is rewards in this scenario
            if (this.currentGame.getPool() >= this.currentGame.goal) {
                this.previousGame.status = GameStatus.SUCCEED;
                this.currentGame.status = GameStatus.PENDING_FOR_NEXT_ROUND;
                newRound = this._createNextRound(now);
                strategy = AssetStrategy.createSucceedRoundStrategy();
            } else {
                // The previous round fails
                this.previousGame.status = GameStatus.FAIL_AT_NEXT_ROUND;
                this.currentGame.status = GameStatus.FAIL_AT_ITS_OWN_ROUND;
                newRound = this._createNewRound(now);
                strategy = AssetStrategy.createRefundStrategy();
            }
        }

        const transactions = strategy.evaluate(this.previousGame, this.currentGame, newRound, this.pool);
        return {newRound, transactions};
    }

    _createNextRound(createdAt: Date = new Date()): Game {
        return GameFactory.createNextRound(this.pool, this.currentGame, createdAt);
    }

    _createNewRound(createdAt: Date = new Date()): Game {
        return GameFactory.createNewRound(this.pool, createdAt);
    }
}

export default GameRotator;
