import express from 'express';
import boom from 'boom';
import {createGameRepository} from "../repositories/RepositoryFactory";
import {fromWei} from 'web3-utils';

const router = express.Router();
const gameRepo = createGameRepository();

router.get('/', async (req, res, next) => {
    const game = await gameRepo.getCurrentGame();
    if (!game) {
        return next(boom.badImplementation('No game is undertaking'))
    }

    return res.json({
        goal: fromWei(game.goal.toString(), 'ether'),
        pool: fromWei(game.getPool().toString(), 'ether'),
        deadline: game.deadline,
    });
});

export default router;
