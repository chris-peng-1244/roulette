// @flow
import Game from "./Game";
import GameStatus from './GameStatus';
import AssetStrategy from "./AssetStrategy";
import PrizePool from "./PrizePool";

const NEXT_ROUND_GOAL_INCR_RATIO = 1.58;
const NEXT_ROUND_INTERVAL = 24*3600*1000;
const GAME_INITIAL_GOAL = 50000000000000000000;

class GameRotator {
    previousGame: Game | null;
    currentGame: Game;
    pool: PrizePool;

    constructor(pool: PrizePool, previousGame: Game | null, currentGame: Game) {
        this.pool = pool;
        this.previousGame = previousGame;
        this.currentGame = currentGame;
    }

    rotate(): Game {
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

        strategy.evaluate(this.previousGame, this.currentGame, newRound, this.pool);
        return newRound;
    }

    _createNextRound(createdAt: Date = new Date()): Game {
        let newGame = new Game(this.pool);
        newGame.round = this.currentGame.round + 1;
        newGame.goal = this.currentGame.goal * NEXT_ROUND_GOAL_INCR_RATIO;
        newGame.userBetList = {};
        newGame.beginAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }

    _createNewRound(createdAt: Date = new Date()): Game {
        let newGame = new Game(this.pool);
        newGame.round = 1;
        newGame.userBetList = [];
        newGame.goal = GAME_INITIAL_GOAL;
        newGame.beginAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }
}

export default GameRotator;
