// @flow
import BetTask from "./BetTask";
import {getChannel} from './Amqp';
import QueueName from "./QueueName";
import logger from '../logger';
import UserBet from "../domains/UserBet";
import {
    createGameRepository, createPrizePoolRepository,
    createUserBetLogRepository,
    createUserBetRepository,
    createUserRepository
} from "../repositories/RepositoryFactory";
import UserBetLog from "../domains/UserBetLog";

class BetTaskConsumer {
    async consume() {
        const ch = await getChannel();
        ch.assertQueue(QueueName.BET_QUEUE, { durable: true });
        ch.consume(QueueName.BET_QUEUE, async msg => {
            if (msg === null) {
                return;
            }
            logger.debug(`[BetTaskConsumer] New task received: ${msg.content.toString()}`);
            const {userId, gameId, userBetLogId, manualInvest, lastInvestedAt} = JSON.parse(msg.content.toString());
            const [user, game, log] = await Promise.all([
                createUserRepository().findById(userId),
                createGameRepository().findById(gameId),
                createUserBetLogRepository().findById(userBetLogId),
            ]);

            if (!user || !game || !log) {
                logger.warn('[BetTaskConsumer] Bad Task');
                return ch.ack(msg);
            }

            const bet = UserBet.makeManualBet(game, user, manualInvest);
            bet.lastInvestedAt = new Date(lastInvestedAt);
            const task = new BetTask(game, bet);
            if (this.resolve(task, log)) {
                ch.ack(msg);
            }
        });
    }

    async resolve(task: BetTask, log: UserBetLog) {
        try {
            if (task.game.deadline.getTime() < task.userBet.lastInvestedAt) {
                logger.debug('[BetTaskConsumer] Game is finished');
                await this.refund(task.userBet);
                log.failWhenGameFinished();
                return await createUserBetLogRepository().updateUserBetLog(log);
            }
            if (task.game.isGoalMet()) {
                logger.debug('[BetTaskConsumer] Game reaches its goal');
                await this.refund(task.userBet);
                log.failWhenGameFulfilled();
                return await createUserBetLogRepository().updateUserBetLog(log);
            }

            logger.debug('[BetTaskConsumer] Successfully add bet');
            log.suceed();
            await createUserBetLogRepository().updateUserBetLog(log);
            const addedBet = task.game.addUserBet(task.userBet);
            await createUserBetRepository().createUserBet(task.game, addedBet);
            await createPrizePoolRepository().incrPrizePool(task.userBet.manualInvest);
        } catch (e) {
            logger.error('[BetTaskConsumer] Resolve error ' + e.stack);
            return false;
        }

        return true;
    }

    async refund(bet: UserBet) {
        await createUserRepository().updateUserBalance(bet.user, bet.manualInvest);
    }
}

export default BetTaskConsumer;
