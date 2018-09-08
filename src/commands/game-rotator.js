// @flow
import util from 'util';
import logger from '../logger';
import {createGameRepository, createPrizePoolRepository} from "../repositories/RepositoryFactory";
import GameRotator from "../domains/GameRotator";
import GameStatus from "../domains/GameStatus";
import GameFactory from "../domains/GameFactory";
const setTimeoutPromise = util.promisify(setTimeout);

const gameRepo = createGameRepository();
const prizePoolRepo = createPrizePoolRepository();
async function rotate() {
    logger.info('Rotating...');
    // Get current and previous game
    const currentGame = await gameRepo.getCurrentGame();
    if (!currentGame.hasReachedDeadline()) {
        return;
    }

    if (!currentGame) {
        return await createGenesisGame();
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
