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
const setTimeoutPromise = util.promisify(setTimeout);

const gameRepo = createGameRepository();
const prizePoolRepo = createPrizePoolRepository();
const userRepo = createUserRepository();
async function rotate() {
    logger.info('Rotating...');
    // Get current and previous game
    const currentGame = await gameRepo.getCurrentGame();

    if (!currentGame) {
        logger.info('Genesis...');
        return await createGenesisGame();
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
        prizePoolRepo.getPrizePool(),
        previousGame,
        currentGame);
    const newRound = rotator.rotate();
    // Save the changes
    try {
        if (previousGame && previousGame.status === GameStatus.SUCCEED) {
            await sendReward();
        }
        if (previousGame) {
            await gameRepo.updateGame(previousGame);
        }
        await Promise.all([
            gameRepo.updateGame(currentGame),
            gameRepo.createGame(newRound),
        ]);
    } catch (e) {
        logger.error('[Game rotator] ' + e.stack);
    }
}

async function createGenesisGame() {
    const genesis = GameFactory.createNewRound(prizePoolRepo.getPrizePool());
    await gameRepo.createGame(genesis);
}

async function sendReward(game: Game) {
    await bluebird.map(game.userBetList, async(bet: UserBet) => {
        await userRepo.setUserBalance(bet.user);
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
