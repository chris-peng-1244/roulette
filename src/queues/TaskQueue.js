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

}

export default TaskQueue;
