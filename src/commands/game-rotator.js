// @flow
import util from 'util';
import logger from '../logger';
import {
    createGameRepository,
    createPrizePoolRepository,
    createUserBetLogRepository, createUserRepository
} from "../repositories/RepositoryFactory";
import GameRotator from "../domains/GameRotator";
import GameStatus from "../domains/GameStatus";
import GameFactory from "../domains/GameFactory";
import Game from "../domains/Game";
import bluebird from 'bluebird';
import UserBet from "../domains/UserBet";
import _ from 'lodash';
const setTimeoutPromise = util.promisify(setTimeout);

const gameRepo = createGameRepository();
const prizePoolRepo = createPrizePoolRepository();
const userRepo = createUserRepository();
async function rotate() {
    logger.info('Rotating...');
    const prizePool = await prizePoolRepo.getPrizePool();
    // Get current and previous game
    const currentGame = await gameRepo.getCurrentGame();

    if (!currentGame) {
        logger.info('Genesis...');
        return await createGenesisGame(prizePool);
    }

    if (!currentGame.hasReachedDeadline()) {
        logger.info('Game is undertaking...');
        return;
    }

    // Check if the queue is empty
    const count = await createUserBetLogRepository().countPendingLogs(currentGame);
    if (count) {
        logger.info(`Game reaches deadline, but there are still ${count} user bets queueing...`);
        return;
    }

    const previousGame = await gameRepo.getPreviousGame(currentGame);
    // Rotate a new round
    const  rotator = new GameRotator(
        prizePool,
        previousGame,
        currentGame);
    const newRound = rotator.rotate();
    // Save the changes
    try {
        if (currentGame.status !== GameStatus.PENDING_FOR_NEXT_ROUND) {
            await setUserBalance(previousGame, currentGame);
        }
        if (previousGame) {
            await gameRepo.updateGame(previousGame);
        }
        await Promise.all([
            gameRepo.updateGame(currentGame),
            gameRepo.createGame(newRound),
            prizePoolRepo.savePrizePool(prizePool),
        ]);
    } catch (e) {
        logger.error('[Game rotator] ' + e.stack);
    }
}

async function createGenesisGame(prizePool) {
    const genesis = GameFactory.createNewRound(prizePool);
    await gameRepo.createGame(genesis);
}

async function setUserBalance(previousGame: Game, currentGame: Game) {
    let users = {};
    if (previousGame) {
        _.forEach(previousGame.userBetList, (bet: UserBet, userId) => {
            if (!users[userId]) {
                users[userId] = bet.user;
            }
        });
    }
    _.forEach(currentGame.userBetList, (bet: UserBet, userId) => {
        if (!users[userId]) {
            users[userId] = bet.user;
        }
    });
    await bluebird.map(Object.values(users), async user => {
        return await userRepo.setUserBalance(user);
    });
}

function loop() {
    return rotate()
        .then(() => {
            return setTimeoutPromise(1000);
        })
        .then(() => {
            return loop();
        });
}

loop();
