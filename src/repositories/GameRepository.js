// @flow
import Game from "../domains/Game";
import GameTable from '../models/GameTable';
import GameStatus from "../domains/GameStatus";
import PrizePoolRepository from "./PrizePoolRepository";
import UserBetRepository from "./UserBetRepository";
import UserBet from "../domains/UserBet";
import bluebird from 'bluebird';
import {toWei, fromWei} from '../utils/eth-units';

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

        return await this._createGameModel(data);
    }

    async findById(id: number): Promise<Game | null> {
        const data = await GameTable.findOne({
            where: { id }
        });
        if (!data) {
            return null;
        }
        return await this._createGameModel(data);
    }

    async _createGameModel(data: Object): Promise<Game> {
        const [bets, prizePool] = await Promise.all([
            this.userBetRepo.getUserBetListByGameId(data.id),
            this.prizePoolRepo.getPrizePool(),
        ]);
        const betMap = bets.reduce((prev: {[string]: UserBet}, current: UserBet) => {
            prev[current.user.id] = current;
            return prev;
        }, {});
        const game = new Game(prizePool, betMap);
        game.id = data.id;
        game.deadline = new Date(data.deadline);
        game.status = data.status;
        game.round = data.round;
        game.goal = toWei(data.goal, 'ether');
        game.beginAt = data.beginAt;
        return game;
    }

    async createGame(game: Game) {
        const gameData = await GameTable.create({
            round: game.round,
            beginAt: game.beginAt,
            deadline: game.deadline,
            status: game.status,
            goal: fromWei(game.goal),
        });

        game.id = gameData.id;
        await bluebird.map(game.userBetList, async(bet: UserBet) => {
            await this.userBetRepo.createUserBet(game, bet);
        });
    }
}

export default GameRepository;
