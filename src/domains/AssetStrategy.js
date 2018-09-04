// @flow
import Game from "./Game";
import _ from 'lodash';
import UserBet from "./UserBet";
import User from "./User";

const AUTO_INVEST_RATIO = 0.05;

class AssetStrategy {
    static createRefundStrategy() {
        return new RefundStrategy();
    }

    static createNextRoundStrategy() {
        return new NextRoundStrategy();
    }

    static createSucceedRoundStrategy() {
        return undefined;
    }
}

class RefundStrategy {
    evaluate(previous: Game | null, current: Game, next: Game, pool: number) {
        const {totalFund, userFunds, users} = _getFundsInfo(previous, current);
        let ratio = totalFund / pool;
        ratio = ratio > 1 ? 1 : ratio;

        _.forEach(userFunds, (fund, userId) => {
            users[userId].balance += userFunds[userId] * ratio;
        });
    }

}

class NextRoundStrategy {
    evaluate(previous: Game | null, current: Game, next: Game, pool: number) {
        _.forEach(current.userBetList, (bet: UserBet) => {
            if (bet.manualInvest) {
                const nextBet = UserBet.makeAutoBet(next, bet.user, bet.manualInvest*AUTO_INVEST_RATIO);
                next.addUserBet(nextBet);
                bet.manualInvest *= (1 - AUTO_INVEST_RATIO);
            }
        });
    }
}

function _getFundsInfo(previous: Game, current: Game) {
    let totalFund = 0;
    let userFunds = {};
    let users = {};
    if (previous) {
        totalFund += previous.getPool();
        _getUserFunds(previous, userFunds, users);
    }
    totalFund += current.getPool();
    _getUserFunds(current, userFunds, users);

    return {
        totalFund,
        userFunds,
        users,
    };
}

function _getUserFunds(game: Game, userFunds: {[string]: number}, users: {[string]: User}) {
    _.forEach(game.userBetList, (bet: UserBet, userId) => {
        if (userFunds[userId]) {
            userFunds[userId] += bet.getInvestment();
        } else {
            userFunds[userId] = bet.getInvestment();
            users[userId] = bet.user;
        }
    });
}

export default AssetStrategy;
