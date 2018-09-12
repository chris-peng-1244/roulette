// @flow

import GameRepository from "./GameRepository";
import PrizePoolRepository from "./PrizePoolRepository";
import UserBetRepository from "./UserBetRepository";
import UserBetLogRepository from "./UserBetLogRepository";
import UserRepository from "./UserRepository";
import UserAssetRepository from "./UserAssetRepository";
import TransactionRepository from "./TransactionRepository";
import UserWalletRepository from "./UserWalletRepository";
import UserInviteRewardRepository from "./UserInviteRewardRepository";
import SmsVerifyCodeRepository from "./SmsVerifyCodeRepository";

let gameRepo, prizePoolRepo, userBetRepo, userBetLogRepo, userAssetRepo, txRepo, userWalletRepo, userInviteRewardRepo;
let smsVerifyCodeRepo;

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

function createTransactionRepository(): TransactionRepository {
    if (!txRepo) {
        txRepo = new TransactionRepository();
    }
    return txRepo;
}

function createUserWalletRepository(): UserWalletRepository {
    if (!userWalletRepo) {
        userWalletRepo = new UserWalletRepository(createUserRepository());
    }
    return userWalletRepo;
}

function createUserInviteRewardRepository(): UserInviteRewardRepository {
    if (!userInviteRewardRepo) {
        userInviteRewardRepo = new UserInviteRewardRepository(createUserRepository());
    }
    return userInviteRewardRepo;
}

function createSmsVerifyCodeRepository(): SmsVerifyCodeRepository {
    if (!smsVerifyCodeRepo) {
        smsVerifyCodeRepo = new SmsVerifyCodeRepository();
    }
    return smsVerifyCodeRepo;
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
    createTransactionRepository,
    createUserWalletRepository,
    createUserInviteRewardRepository,
    createSmsVerifyCodeRepository,
};
