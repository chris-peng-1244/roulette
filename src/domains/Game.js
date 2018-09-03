// @flow

import UserBet from "./UserBet";
import GameStatus from './GameStatus';
import _ from 'lodash';

/**
 * A game ends when it hits the deadline.
 * A game is lost when:
 * 1. It didn't reach it's goal
 * 2. The next round didn't reach it's goal
 */

class Game {
    beginAt: Date;
    deadline: Date;
    // Which round this game is. GameTable starts at round 1.
    // Every time a deadline passes with the goal reached,
    // the round plus 1.
    round: number;
    goal: number;
    status: string;
    userBetList: {[number]: UserBet} = {};


    // How many eth this game has gathered.
    // This number is virtual
    getPool(): number {
        let total = 0;
        _.forEach(this.userBetList, (bet: UserBet) => {
            total += bet.getInvestment();
        });
        return total;
    }

    hasReachedDeadline(): boolean {
        return this.deadline.getTime() <= new Date().getTime();
    }

    addUserBet(bet: UserBet) {
        if (this.userBetList[bet.user.id]) {
            return;
        }
        this.userBetList[bet.user.id] = bet;
    }
}

export default Game;
