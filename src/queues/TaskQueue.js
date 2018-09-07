import logger from '../logger';
import {getChannel} from "./Amqp";
import QueueName from "./QueueName";

class TaskQueue {
    constructor(name) {
        this.name = name;
    }

    static getBetQueue() {
        return new TaskQueue(QueueName.BET_QUEUE);
    }

    async addTask(task) {
        try {
            const channel = await getChannel();
            channel.assertQueue(this.name, {durable: true});
            await channel.sendToQueue(
                this.name,
                Buffer.from(task.toString(), 'utf8'),
                {persistent: true}
            );
            return true;
        } catch (e) {
            logger.error('[TaskQueue] ' + e.stack);
            return false;
        }
    }

    // async consume() {
    //     const channel = await getChannel();
    //     channel.assertQueue(this.name, { durable: true });
    //     return new Promise(resolve => {
    //         channel.consume(this.name, async msg => {
    //             if (msg === null) {
    //                 return resolve(null);
    //             }
    //             const taskData = JSON.parse(msg.content.toString());
    //             const bet = new UserBet();
    //             bet.user = await createUserRepository().findById(taskData.userId);
    //             bet.manualInvest = taskData.manualInvest;
    //             bet.lastInvestedAt = new Date(taskData.lastInvestedAt);
    //             const game = await createGameRepository().findById(taskData.gameId);
    //             channel.ack(msg);
    //             resolve({
    //                 bet,
    //                 game,
    //             });
    //         });
    //     });
    // }
}

export default TaskQueue;
