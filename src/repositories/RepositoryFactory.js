// @flow

import GameRepository from "./GameRepository";
import PrizePoolRepository from "./PrizePoolRepository";
import UserBetRepository from "./UserBetRepository";
import UserBetLogRepository from "./UserBetLogRepository";
import UserRepository from "./UserRepository";
import UserAssetRepository from "./UserAssetRepository";

let gameRepo, prizePoolRepo, userBetRepo, userBetLogRepo, userAssetRepo;

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

function createUserBetLogRepository(): UserBetLogRepository {
    if (!userBetLogRepo) {
        userBetLogRepo = new UserBetLogRepository();
    }
    return userBetLogRepo;
}

function createUserAssetRepository(): UserAssetRepository {
    if (!userAssetRepo) {
        userAssetRepo = new UserAssetRepository(createUserBetRepository());
    }
    return userAssetRepo;
}

function createUserRepository(): UserRepository {
    return UserRepository.getInstance();
}

export {
    createUserBetRepository,
    createPrizePoolRepository,
    createGameRepository,
    createUserRepository,
    createUserBetLogRepository,
    createUserAssetRepository,
};
