// @flow
import Game from "./Game";
import _ from 'lodash';
import UserBet from "./UserBet";
import User from "./User";
import PrizePool from "./PrizePool";

const AUTO_INVEST_RATIO = 0.05;

class AssetStrategy {
    static createRefundStrategy() {
        return new RefundStrategy();
    }

    static createNextRoundStrategy() {
        return new NextRoundStrategy();
    }

    static createSucceedRoundStrategy() {
        return new SucceedStrategy();
    }
}

class RefundStrategy {
    evaluate(previous: Game | null, current: Game, next: Game, pool: PrizePool) {
        const {totalFund, userFunds, users} = _getFundsInfo(previous, current);
        let ratio = totalFund / pool.total;
        ratio = ratio > 1 ? 1 : ratio;

        _.forEach(userFunds, (fund, userId) => {
            users[userId].balance += userFunds[userId] * ratio;
        });
    }

}

class NextRoundStrategy {
    evaluate(previous: Game | null, current: Game, next: Game, pool: PrizePool) {
        _.forEach(current.userBetList, (bet: UserBet) => {
            if (bet.manualInvest) {
                const nextBet = UserBet.makeAutoBet(next, bet.user, bet.manualInvest*AUTO_INVEST_RATIO);
                next.addUserBet(nextBet);
                bet.manualInvest *= (1 - AUTO_INVEST_RATIO);
            }
        });
    }
}

class SucceedStrategy {
    evaluate(previous: Game, current: Game, next: Game, pool: PrizePool) {
        _.forEach(previous.userBetList, (bet: UserBet) => {
            const totalReward = bet.reward + bet.getInvestment();
            bet.user.balance += totalReward;
            // total should be reduced
        });
        const lastBet: UserBet = _getLastBet(current);
        _.forEach(current.userBetList, (bet: UserBet) => {
            if (bet.manualInvest) {
                if (bet.user.id !== lastBet.user.id) {
                    const nextBet = UserBet.makeAutoBet(next, bet.user, bet.manualInvest * AUTO_INVEST_RATIO);
                    next.addUserBet(nextBet);
                    bet.manualInvest *= (1 - AUTO_INVEST_RATIO);
                } else {
                    const exceedInvest = current.getExceedInvest();
                    bet.manualInvest -= exceedInvest;
                    const nextBet = UserBet.makeAutoBet(next, bet.user, bet.manualInvest * AUTO_INVEST_RATIO);
                    nextBet.manualInvest = exceedInvest;
                    next.addUserBet(nextBet);
                    bet.manualInvest *= (1 - AUTO_INVEST_RATIO);
                }
            }
        });
    }
}

function _getLastBet(game: Game): UserBet {
    const betList = Object.values(game.userBetList);
    return _.sortBy(betList, ['lastInvestedAt'])[betList.length-1];
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
