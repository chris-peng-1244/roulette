import rabbit from 'amqplib';

let channel;
async function getChannel() {
    if (!channel) {
        const conn = await rabbit.connect('amqp://localhost');
        channel = await conn.createChannel();
    }
    return channel;
}

export {
    getChannel,
};
