// @flow
import UserBet from "../domains/UserBet";
import UserBetTable from "../models/UserBetTable";
import User from "../domains/User";

class UserBetRepository {
    async getUserBetListByGameId(gameId: string): Promise<UserBet[]> {
        const data = await UserBetTable.findAll({
            where: {gameId}
        });
        return data.map(value => {
            const bet = new UserBet();
            bet.id = value.id;
            bet.manualInvest = value.manualInvest;
            bet.autoInvest = value.autoInvest;
            bet.lastInvestedAt = value.lastInvestedAt;
            bet.reward = value.reward;
            bet.user = new User(data.userId, data.userBalance, data.userInviteCode);
            return bet;
        });
    }
}

export default UserBetRepository;
