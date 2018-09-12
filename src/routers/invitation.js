// @flow
import express from 'express';
import {createUserInviteRewardRepository} from "../repositories/RepositoryFactory";
import InviteReward from "../domains/InviteReward";
import {fromWei} from '../utils/eth-units';
import {format} from "../utils/ch-datetime";

const router = express.Router();
const inviteRepo = createUserInviteRewardRepository();
router.get('/', async (req, res) => {
    const inviteList = await inviteRepo.findAllByUser(req.app.get('user'));
    return res.json(inviteList.map((invite: InviteReward) => {
        return {
            reward: fromWei(invite.value),
            createdAt: format(invite.createdAt),
        }
    }));
});

export default  router;
