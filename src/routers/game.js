import express from 'express';
import boom from 'boom';
import {createGameRepository} from "../repositories/RepositoryFactory";

const router = express.Router();
const gameRepo = createGameRepository();

router.get('/', async (req, res, next) => {
    const game = await gameRepo.getCurrentGame();
    if (!game) {
        return next(boom.badImplementation('No game is undertaking'))
    }

    return res.json({
        goal: game.goal,
        pool: game.getPool(),
        deadline: game.deadline,
    });
});

export default router;
