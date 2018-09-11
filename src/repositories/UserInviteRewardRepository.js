// @flow
import UserBet from "../domains/UserBet";
import UserRepository from "./UserRepository";
import UserInviteRewardLogTable from "../models/UserInviteRewardLogTable";
import User from "../domains/User";
import InviteReward from "../domains/InviteReward";
import bluebird from 'bluebird';
import {fromWei, toWei} from '../utils/eth-units';

class UserInviteRewardRepository {
    userRepo: UserRepository;
    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async createInviteReward(bet: UserBet) {
        const rewards = await this._getInviterReward(bet);
        await bluebird.map(rewards, async (reward: InviteReward) => {
            await UserInviteRewardLogTable.create({
                inviterId: reward.inviter.id,
                inviteeId: reward.invitee.id,
                reward: fromWei(reward.value),
            });
        });
        return rewards;
    }

    async _getInviterReward(bet: UserBet): Promise<InviteReward[]> {
        // User has no inviter
        if (!bet.user.inviterId) {
            return [];
        }

        // Inviter has gotten the reward
        if (await this.hasInviteCodeBeenConsumed(bet.user)) {
            return [];
        }

        const inviteCodeOwner = await this.userRepo.findById(bet.user.inviterId);
        if (inviteCodeOwner) {
            const firstReward = InviteReward.createInviteReward(bet, inviteCodeOwner);
            const secondInviter = await this.userRepo.findById(inviteCodeOwner.inviterId);
            if (secondInviter) {
                const secondReward = InviteReward.createIndirectInviteReward(bet, inviteCodeOwner, secondInviter);
                return [firstReward, secondReward];
            }
            return [firstReward];
        }
        return [];
    }

    async hasInviteCodeBeenConsumed(user: User): Promise<boolean> {
        const count = await UserInviteRewardLogTable.count({
            where: {
                inviterId: user.inviterId,
                inviteeId: user.id,
            }
        });
        return (count > 0);
    }
}

export default UserInviteRewardRepository;
