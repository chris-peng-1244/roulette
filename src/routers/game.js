import express from 'express';
import boom from 'boom';
import {createGameRepository} from "../repositories/RepositoryFactory";
import {fromWei} from '../utils/eth-units';
import {format} from '../utils/ch-datetime';

const router = express.Router();
const gameRepo = createGameRepository();

router.get('/', async (req, res, next) => {
    const game = await gameRepo.getCurrentGame();
    if (!game) {
        return next(boom.badImplementation('No game is undertaking'))
    }

    return res.json({
        goal: fromWei(game.goal),
        pool: fromWei(game.getPool()),
        deadline: format(game.deadline),
    });
});

export default router;
