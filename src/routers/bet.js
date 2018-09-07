import express from 'express';
import {
    createGameRepository,
    createUserBetLogRepository,
    createUserRepository
} from "../repositories/RepositoryFactory";
import boom from 'boom';
import UserBet from "../domains/UserBet";
import {toWei} from '../utils/eth-units';
import logger from '../logger';
import BetTask from "../queues/BetTask";
import TaskQueue from "../queues/TaskQueue";
import UserBetLog from "../domains/UserBetLog";

const router = express.Router();
const gameRepo = createGameRepository();
const userRepo = createUserRepository();
const userBetLogRepo = createUserBetLogRepository();
// Add a new bet to current game
router.post('/', async(req, res, next) => {
    const game = await gameRepo.getCurrentGame();
    if (!game || game.hasReachedDeadline()) {
        return next(boom.badRequest('No game is undertaking'));
    }

    if (game.isGoalMet()) {
        return next(boom.badRequest('Goal of this round has been met'));
    }

    const amount = toWei(req.body.amount);
    const user = await userRepo.findById(req.app.get('user').id);
    if (user.balance < amount) {
        return next(boom.badRequest('Not enough balance'));
    }

    const bet = UserBet.makeManualBet(game, user, amount);
    const log = UserBetLog.create(bet, game.id);
    await userBetLogRepo.addUserBetLog(log);
    const task = new BetTask(game, bet, log);
    try {
        const queue = TaskQueue.getBetQueue();
        if (await queue.addTask(task)) {
            await userRepo.updateUserBalance(user, -1 * bet.manualInvest);
            return res.json({
                taskId: task.getId(),
            });
        }
        return next(boom.badImplementation('Bet failed'));
    } catch (e) {
        logger.error('POST /bet ' + e.stack);
        return next(boom.badImplementation('Bet failed'));
    }
});

export default router;
