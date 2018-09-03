// @flow
import Game from "./Game";
import UserBet from "./UserBet";
import GameStatus from './GameStatus';

const NEXT_ROUND_AUTO_BET_RATIO = 0.05;
const NEXT_ROUND_GOAL_INCR_RATIO = 1.58;
const NEXT_ROUND_INTERVAL = 24*3600*1000;
const GAME_INITIAL_GOAL = 50;

class GameRotator {
    previousGame: Game | null;
    currentGame: Game;

    rotate(): Game {
        if (!this.currentGame.hasReachedDeadline()) {
            throw new Error("Current game hasn't ended");
        }

        const now = new Date();
        // Current game is the first round
        if (this.previousGame === null) {
            // Current game reaches its goal
            if (this.currentGame.getPool() >= this.currentGame.goal) {
                this.currentGame.status = GameStatus.PENDING_FOR_NEXT_ROUND;
                return this._createNextRound(now);
            }

            this.currentGame.status = GameStatus.FAIL_AT_ITS_OWN_ROUND;
            return this._createNewRound(now);
        }

        // The previous round wins
        // There is rewards in this scenario
        if (this.currentGame.getPool() >= this.currentGame.goal) {
            this.previousGame.status = GameStatus.SUCCEED;
            this.currentGame.status = GameStatus.PENDING_FOR_NEXT_ROUND;
            return this._createNextRound(now);
        }

        // The previous round fails
        this.previousGame.status = GameStatus.FAIL_AT_NEXT_ROUND;
        this.currentGame.status = GameStatus.FAIL_AT_ITS_OWN_ROUND;
        return this._createNewRound(now);
    }

    getNewUserBets() {
        return this.currentGame.userBetList.map(bet => {
            const newBet = new UserBet();
            newBet.amount = bet * NEXT_ROUND_AUTO_BET_RATIO;
            newBet.user = bet.user;
            newBet.createdAt = new Date();
            return newBet;
        });
    }

    _createNextRound(createdAt: Date = new Date()): Game {
        let newGame = new Game();
        newGame.round = this.currentGame.round + 1;
        newGame.goal = this.currentGame.goal * NEXT_ROUND_GOAL_INCR_RATIO;
        newGame.userBetList = this.getNewUserBets();
        newGame.createdAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }

    _createNewRound(createdAt: Date = new Date()): Game {
        let newGame = new Game();
        newGame.round = 1;
        newGame.userBetList = [];
        newGame.goal = GAME_INITIAL_GOAL;
        newGame.createdAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }
}

export default GameRotator;
