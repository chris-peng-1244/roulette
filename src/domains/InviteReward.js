// @flow
import User from "./User";
import UserBet from "./UserBet";

const INVITE_REWARD_RATIO = 0.1;
const INDIRECT_INVITE_REWARD_RATIO = 0.05;
class InviteReward {
    inviter: User;
    invitee: User;
    value: number;

    static createInviteReward(bet: UserBet, inviter: User) {
        const reward = new InviteReward();
        reward.invitee = bet.user;
        reward.inviter = inviter;
        reward.value = bet.manualInvest * INVITE_REWARD_RATIO;
        return reward;
    }

    static createIndirectInviteReward(bet: UserBet, inviter: User, inviterOfInviter: User) {
        const reward = new InviteReward();
        reward.invitee = inviter;
        reward.inviter = inviterOfInviter;
        reward.value = bet.manualInvest * INDIRECT_INVITE_REWARD_RATIO;
        return reward;
    }
}

export default InviteReward;
