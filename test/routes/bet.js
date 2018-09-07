const {agent, login} = require('./index');
const {spawnGameData, clearGameData} = require('./test-data');
const UserTable = require('../../lib/models/UserTable').default;
const UserBetTable = require('../../lib/models/UserBetTable').default;
const UserBetLogTable = require('../../lib/models/UserBetLogTable').default;
const GameTable = require('../../lib/models/GameTable').default;
// const TaskQueue = require("../../lib/queues/TaskQueue").default;

let token, gUser, gGame;
describe("API /bet", () => {
    beforeEach(async() => {
        await clearGameData();
        const data = await spawnGameData();
        gGame = data.game;
        token = await login(agent);
        gUser = await UserTable.find({where:{mobile: '11122223333'}});
        gUser.balance = 200;
        await gUser.save();
    });

    it("It should create a new bet task in amqp", async() => {
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.taskId.should.not.be.null;
        const user = await UserTable.find({where:{id: gUser.id}});
        user.balance.should.equal('199.000000000000000000');

        const log = await UserBetLogTable.find({where: {userId: gUser.id}});
        log.manualInvest.should.equal('1.000000000000000000');
        log.status.should.equal('USER_BET_PENDING');
        // const queue = TaskQueue.getBetQueue();
        // const {game, bet} = await queue.consume();
        // bet.manualInvest.should.equal(1000000000000000000);
        // bet.user.id.should.equal(3);
        // game.round.should.equal(1);
    });

    it("It should NOT create a new bet when pool is full", async() => {
        await UserBetTable.create({
            gameId: gGame.id,
            userId: gUser.id,
            autoInvest: 0,
            manualInvest: 50,
            reward: 10,
            lastInvestedAt: new Date(),
        });
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.error.message.should.equal('Goal of this round has been met');
        const user = await UserTable.find({where:{id: gUser.id}});
        user.balance.should.equal('200.000000000000000000');
    });

    it("It should NOT create a new bet when round reaches the deadline", async() => {
        await GameTable.update(
            { deadline: new Date().getTime() - 10 },
            { where: {id: gGame.id} }
        );
        const res = await agent.post('/bet')
            .type('application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1.0
            });
        res.body.error.message.should.equal('No game is undertaking');
        const user = await UserTable.find({where:{id: gUser.id}});
        user.balance.should.equal('200.000000000000000000');
    });
});
