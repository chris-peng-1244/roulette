import express from 'express';
import {createGameRepository} from "../repositories/RepositoryFactory";
import boom from 'boom';

const router = express.Router();
const gameRepo = createGameRepository();
// Add a new bet to current game
router.post('/', async(req, res, next) => {
    const game = await gameRepo.getCurrentGame();
    if (!game) {
        return next(boom.badImplementation('No game is undertaking'));
    }

    // const task = new BetTask(
    //
    // );
});

export default router;
