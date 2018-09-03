// @flow

import User from "./User";

class UserBet {
    user: User;
    // 最后一次下注时间
    lastInvestedAt: Date;
    // 手动下注金额
    manualInvest: number = 0;
    // 自动下注金额
    autoInvest: number = 0;
    // 预期奖励
    reward: number = 0;

    getInvestment(): number {
        return this.manualInvest + this.autoInvest;
    }
}

export default UserBet;
