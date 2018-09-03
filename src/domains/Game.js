// @flow

import UserBet from "./UserBet";
import GameStatus from './GameStatus';

/**
 * A game ends when it hits the deadline.
 * A game is lost when:
 * 1. It didn't reach it's goal
 * 2. The next round didn't reach it's goal
 */

class Game {
    createdAt: Date;
    deadline: Date;
    // Which round this game is. Game starts at round 1.
    // Every time a deadline passes with the goal reached,
    // the round plus 1.
    round: number;
    goal: number;
    status: string;
    userBetList: UserBet[];

    // How many eth this game has gathered.
    // This number is virtual
    getPool(): number {
        return this.userBetList.reduce((prev, current) => {
            return prev + current.amount;
        }, 0);
    }

    hasReachedDeadline(): boolean {
        return this.deadline.getTime() <= new Date().getTime();
    }
}

export default Game;
