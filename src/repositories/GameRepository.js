// @flow
import Game from "../domains/Game";
import GameTable from '../models/GameTable';
import GameStatus from "../domains/GameStatus";
import PrizePoolRepository from "./PrizePoolRepository";
import UserBetRepository from "./UserBetRepository";
import UserBet from "../domains/UserBet";
import {toWei} from '../utils/eth-units';

class GameRepository {
    prizePoolRepo: PrizePoolRepository;
    userBetRepo: UserBetRepository;

    constructor(prizePoolRepo: PrizePoolRepository, userBetRepo: UserBetRepository) {
        this.prizePoolRepo = prizePoolRepo;
        this.userBetRepo = userBetRepo;
    }

    async getCurrentGame(): Promise<Game | null> {
        const data = await GameTable.findOne({
            where: {
                status: GameStatus.STARTED
            }
        });
        if (!data) {
            return null;
        }

        const [bets, prizePool] = await Promise.all([
            this.userBetRepo.getUserBetListByGameId(data.id),
            this.prizePoolRepo.getPrizePool(),
        ]);
        const betMap = bets.reduce((prev: {[string]: UserBet}, current: UserBet) => {
            prev[current.user.id] = current;
            return prev;
        }, {});
        const game = new Game(prizePool, betMap);
        game.deadline = data.deadline;
        game.status = data.status;
        game.round = data.round;
        game.goal = toWei(data.goal, 'ether');
        game.beginAt = data.beginAt;
        return game;
    }
}

export default GameRepository;
