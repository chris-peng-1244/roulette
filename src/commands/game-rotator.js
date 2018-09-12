// @flow
import util from 'util';
import logger from '../logger';
import {
    createGameRepository,
    createPrizePoolRepository, createTransactionRepository,
    createUserBetLogRepository, createUserRepository
} from "../repositories/RepositoryFactory";
import GameRotator from "../domains/GameRotator";
import GameFactory from "../domains/GameFactory";
import bluebird from 'bluebird';
import Transaction from "../domains/Transaction";
const setTimeoutPromise = util.promisify(setTimeout);

const gameRepo = createGameRepository();
const prizePoolRepo = createPrizePoolRepository();
const userRepo = createUserRepository();
const txRepo = createTransactionRepository();
async function rotate() {
    logger.info('Rotating...');
    const prizePool = await prizePoolRepo.getPrizePool();
    // Get current and previous game
    const currentGame = await gameRepo.getCurrentGame();

    if (!currentGame) {
        logger.info('Genesis...');
        return await createGenesisGame(prizePool);
    }

    if (!currentGame.hasReachedDeadline() && !currentGame.isGoalMet()) {
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
    const {newRound, transactions} = rotator.rotate();
    // Save the changes
    try {
        if (transactions.length) {
            await setUserBalance(transactions);
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

async function setUserBalance(transactions: Transaction[]) {
    await bluebird.map(transactions, async transaction => {
        await txRepo.createTransaction(transaction);
        return await userRepo.updateUserBalance(transaction.user, transaction.value);
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
