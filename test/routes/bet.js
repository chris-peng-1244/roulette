const {agent, login} = require('./index');
const {spawnGameData, clearGameData} = require('./test-data');
const UserTable = require('../../lib/models/UserTable').default;
const TaskQueue = require("../../lib/queues/TaskQueue").default;

let token;
describe("API /bet", () => {
    beforeEach(async() => {
        await clearGameData();
        await spawnGameData();
        token = await login(agent);
        const user = await UserTable.find({where:{id: 3}});
        user.balance = 20;
        await user.save();
    });

    it("It should create a new bet task in amqp", async() => {
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.taskId.should.not.be.null;
        const user = await UserTable.find({where:{id: 3}});
        user.balance.should.equal(19);

        // const queue = TaskQueue.getBetQueue();
        // const {game, bet} = await queue.consume();
        // bet.manualInvest.should.equal(1000000000000000000);
        // bet.user.id.should.equal(3);
        // game.round.should.equal(1);
    });

    it("It should NOT create a new bet when pool is full", async() => {
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.error.should.equal('');
        const user = await UserTable.find({where:{id: 3}});
        user.balance.should.equal(20);
    });

    it("It should NOT create a new bet when round reaches the deadline", async() => {
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.error.should.equal('');
        const user = await UserTable.find({where:{id: 3}});
        user.balance.should.equal(20);
    });
});
