// @flow

import PrizePool from "./PrizePool";
import Game from "./Game";
import GameStatus from "./GameStatus";
import config from '../config';

class GameFactory {

    static createNextRound(pool: PrizePool, currentGame: Game, createdAt: Date = new Date()): Game {
        let newGame = new Game(pool);
        newGame._previousGameId = currentGame.id;
        newGame.round = currentGame.round + 1;
        newGame.goal = currentGame.goal * config.NEXT_ROUND_GOAL_INCR_RATIO;
        newGame.userBetList = {};
        newGame.beginAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + config.NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }

    static createNewRound(pool: PrizePool, createdAt: Date = new Date()): Game {
        let newGame = new Game(pool);
        newGame.round = 1;
        newGame.userBetList = [];
        newGame.goal = config.GAME_INITIAL_GOAL;
        newGame.beginAt = createdAt;
        newGame.deadline = new Date(createdAt.getTime() + config.NEXT_ROUND_INTERVAL);
        newGame.status = GameStatus.STARTED;
        return newGame;
    }
}

export default GameFactory;
