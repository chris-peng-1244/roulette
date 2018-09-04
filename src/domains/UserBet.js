// @flow

import User from "./User";
import Game from "./Game";

const REWARD_RATIO = 0.1;
const SUPECIAL_REWARD_RATIO = 0.1;

class UserBet {
    user: User;
    // 最后一次下注时间
    lastInvestedAt: Date;
    // 手动下注金额
    manualInvest: number;
    // 自动下注金额
    autoInvest: number;
    // 预期奖励
    reward: number;

    constructor() {
        this.manualInvest = 0;
        this.autoInvest = 0;
        this.reward = 0;
    }

    getInvestment(): number {
        return this.manualInvest + this.autoInvest;
    }

    static makeManualBet(game: Game, user: User, invest: number): UserBet {
        if (user.balance < invest) {
            throw new Error("User doesn't have enough balance");
        }
        user.balance -= invest;
        let bet: UserBet = new UserBet();
        bet.manualInvest = invest;
        bet.reward = invest * REWARD_RATIO;
        bet.lastInvestedAt = new Date();
        bet.user = user;
        return bet;
    }

    static makeAutoBet(game: Game, user: User, invest: number): UserBet {
        let bet: UserBet = new UserBet();
        bet.manualInvest = 0;
        bet.autoInvest = invest;
        bet.reward = invest * REWARD_RATIO;
        bet.lastInvestedAt = new Date();
        bet.user = user;
        return bet;
    }
}

export default UserBet;
