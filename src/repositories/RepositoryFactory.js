// @flow

import GameRepository from "./GameRepository";
import PrizePoolRepository from "./PrizePoolRepository";
import UserBetRepository from "./UserBetRepository";

let gameRepo, prizePoolRepo, userBetRepo;

function createGameRepository(): GameRepository {
    if (!gameRepo) {
        gameRepo = new GameRepository(createPrizePoolRepository(), createUserBetRepository());
    }
    return gameRepo;
}

function createPrizePoolRepository(): PrizePoolRepository {
    if (!prizePoolRepo) {
        prizePoolRepo = new PrizePoolRepository;
    }
    return prizePoolRepo;
}

function createUserBetRepository(): UserBetRepository {
    if (!userBetRepo) {
        userBetRepo = new UserBetRepository();
    }
    return userBetRepo;
}

export {
    createUserBetRepository,
    createPrizePoolRepository,
    createGameRepository,
};
