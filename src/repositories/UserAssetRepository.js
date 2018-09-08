// @flow
import User from "../domains/User";
import GameTable from "../models/GameTable";
import GameStatus from "../domains/GameStatus";
import {fromWei} from '../utils/eth-units';
import UserBetRepository from "./UserBetRepository";

class UserAssetRepository {
    userBetRepo: UserBetRepository;

    constructor(userBetRepo: UserBetRepository) {
        this.userBetRepo = userBetRepo;
    }

    async getUserAsset(user: User) {
        const balance = user.balance;

        let locked = 0;
        const currentGameData = await GameTable.find({
            where: {status: GameStatus.STARTED}
        });
        const gameIds = [];
        if (currentGameData) {
            gameIds.push(currentGameData.id);
            if (currentGameData.previousGameId) {
                gameIds.push(currentGameData.previousGameId);
            }
        }
        for (let i = 0; i < gameIds.length; i++) {
            const gameId = gameIds[i];
            const userBet = await this.userBetRepo.getUserBetByGameId(gameId, user.id);
            if (userBet) {
                locked += userBet.getInvestment();
            }
        }

        return {balance, locked};
    }
}

export default  UserAssetRepository;
