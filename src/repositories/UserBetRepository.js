// @flow
import UserBet from "../domains/UserBet";
import UserBetView from "../models/UserBetView";
import User from "../domains/User";
import {toWei} from '../utils/eth-units';

class UserBetRepository {
    async getUserBetListByGameId(gameId: string): Promise<UserBet[]> {
        const data = await UserBetView.findAll({
            where: {gameId}
        });
        return data.map(value => {
            const bet = new UserBet();
            bet.id = value.id;
            bet.manualInvest = toWei(value.manualInvest, 'ether');
            bet.autoInvest = toWei(value.autoInvest, 'ether');
            bet.reward = toWei(value.reward, 'ether');
            bet.lastInvestedAt = value.lastInvestedAt;
            bet.user = new User(
                value.userId,
                toWei(value.userBalance, 'ether'),
                value.userInviteCode);
            return bet;
        });
    }
}

export default UserBetRepository;
